export * from "./goals";
export * from "./listings";
export * from "./neighborhoods";
export * from "./user";

import type { WealthSnapshot } from "@/types";

import { demoGoals, demoMilestones } from "./goals";
import { demoAssumptions, demoHousehold, demoProfile, demoUser } from "./user";

/** A complete, self-consistent snapshot for tests and stories. */
export const demoSnapshot: WealthSnapshot = {
  user: demoUser,
  household: demoHousehold,
  profile: demoProfile,
  assumptions: demoAssumptions,
  properties: [],
  goals: demoGoals,
  milestones: demoMilestones,
};
