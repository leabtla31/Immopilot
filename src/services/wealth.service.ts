import "server-only";

import { cache } from "react";

import { db } from "@/lib/db";
import { NotFoundError } from "@/services/errors";
import {
  toAssumptions,
  toFinancialProfile,
  toGoal,
  toHouseholdMember,
  toMilestone,
  toProperty,
  toUserSummary,
} from "@/services/mappers";
import type { UserSummary, WealthSnapshot } from "@/types";

/** Everything needed to project a user's wealth, in a single round-trip. */
export const getWealthSnapshot = cache(async (userId: string): Promise<WealthSnapshot> => {
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
});

export const getUserSummary = cache(async (userId: string): Promise<UserSummary> => {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("Utilisateur");
  return toUserSummary(user);
});
