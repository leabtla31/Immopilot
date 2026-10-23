import { demoListings, demoNeighborhoods, demoSnapshot } from "@/fixtures";
import { NotFoundError } from "@/services/errors";

import type { DataRepository } from "./types";

/**
 * Demo adapter: the bundled "Léa & Arno" workspace, read-only, no database.
 * Applies the same filters and ordering as the Prisma adapter so both are
 * interchangeable.
 */
export const demoRepository: DataRepository = {
  async health() {
    return { source: "demo", up: true };
  },

  async getUserSummary(userId) {
    if (userId !== demoSnapshot.user.id) throw new NotFoundError("Utilisateur");
    return demoSnapshot.user;
  },

  async getWealthSnapshot(userId) {
    if (userId !== demoSnapshot.user.id) throw new NotFoundError("Profil financier");
    return {
      ...demoSnapshot,
      goals: [...demoSnapshot.goals].sort((a, b) => a.position - b.position),
      milestones: [...demoSnapshot.milestones].sort((a, b) => a.year - b.year),
    };
  },

  async listNeighborhoods(city) {
    return demoNeighborhoods
      .filter((n) => n.city === city)
      .sort((a, b) => b.globalScore - a.globalScore);
  },

  async listListings(userId) {
    if (userId !== demoSnapshot.user.id) return [];
    return demoListings
      .filter((l) => l.status !== "ARCHIVED")
      .sort((a, b) => (b.aiScore ?? -1) - (a.aiScore ?? -1));
  },
};
