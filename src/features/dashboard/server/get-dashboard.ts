import "server-only";

import { getSession } from "@/lib/auth/session";
import { listListings } from "@/services/market.service";
import { getWealthSnapshot } from "@/services/wealth.service";

import { buildDashboard, type DashboardModel } from "../lib/build-dashboard";

/** Server entry point: fetch in parallel, then compose. */
export async function getDashboard(): Promise<DashboardModel> {
  const { userId } = await getSession();
  const [snapshot, listings] = await Promise.all([getWealthSnapshot(userId), listListings(userId)]);
  return buildDashboard(snapshot, listings);
}
