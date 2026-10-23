import "server-only";

import { db } from "@/lib/db";
import { NotFoundError } from "@/services/errors";
import {
  toAssumptions,
  toFinancialProfile,
  toGoal,
  toHouseholdMember,
  toListing,
  toMilestone,
  toNeighborhood,
  toProperty,
  toUserSummary,
} from "@/services/mappers";

import type { DataRepository } from "./types";

/** PostgreSQL adapter. */
export const prismaRepository: DataRepository = {
  async health() {
    try {
      await db.$queryRaw`SELECT 1`;
      return { source: "database", up: true };
    } catch {
      return { source: "database", up: false };
    }
  },

  async getUserSummary(userId) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("Utilisateur");
    return toUserSummary(user);
  },

  /** Everything needed to project a user's wealth, in a single round-trip. */
  async getWealthSnapshot(userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        household: { orderBy: { position: "asc" } },
        profile: true,
        assumptions: true,
        properties: { include: { loan: true }, orderBy: { purchaseDate: "asc" } },
        goals: { orderBy: { position: "asc" } },
        milestones: { orderBy: { year: "asc" } },
      },
    });

    if (!user?.profile || !user.assumptions) throw new NotFoundError("Profil financier");

    const household = user.household.map(toHouseholdMember);

    return {
      user: toUserSummary(user),
      household,
      profile: toFinancialProfile(user.profile, household),
      assumptions: toAssumptions(user.assumptions),
      properties: user.properties.map(toProperty),
      goals: user.goals.map(toGoal),
      milestones: user.milestones.map(toMilestone),
    };
  },

  async listNeighborhoods(city) {
    const rows = await db.neighborhood.findMany({
      where: { city },
      orderBy: { globalScore: "desc" },
    });
    return rows.map(toNeighborhood);
  },

  async listListings(userId) {
    const rows = await db.listing.findMany({
      where: { userId, status: { not: "ARCHIVED" } },
      orderBy: [{ aiScore: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    });
    return rows.map(toListing);
  },
};
