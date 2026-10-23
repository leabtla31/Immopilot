import "server-only";

import { cache } from "react";

import type { UserSummary, WealthSnapshot } from "@/types";

import { getRepository } from "./repositories";

/** Everything needed to project a user's wealth. Memoised per request. */
export const getWealthSnapshot = cache(
  async (userId: string): Promise<WealthSnapshot> =>
    (await getRepository()).getWealthSnapshot(userId),
);

export const getUserSummary = cache(
  async (userId: string): Promise<UserSummary> => (await getRepository()).getUserSummary(userId),
);
