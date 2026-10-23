import type { Listing, Neighborhood, UserSummary, WealthSnapshot } from "@/types";

/**
 * Data access port. Services depend on this interface only; adapters decide
 * where the data lives (PostgreSQL, bundled demo workspace…).
 */
export interface DataRepository {
  /** Reports whether the backing store answers. */
  health(): Promise<{ source: "database" | "demo"; up: boolean }>;
  getUserSummary(userId: string): Promise<UserSummary>;
  getWealthSnapshot(userId: string): Promise<WealthSnapshot>;
  listNeighborhoods(city: string): Promise<Neighborhood[]>;
  listListings(userId: string): Promise<Listing[]>;
}
