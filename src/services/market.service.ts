import "server-only";

import { cache } from "react";

import { db } from "@/lib/db";
import { toListing, toNeighborhood } from "@/services/mappers";
import type { Listing, Neighborhood } from "@/types";

export const listNeighborhoods = cache(async (city = "Toulouse"): Promise<Neighborhood[]> => {
  const rows = await db.neighborhood.findMany({
    where: { city },
    orderBy: { globalScore: "desc" },
  });
  return rows.map(toNeighborhood);
});

export const listListings = cache(async (userId: string): Promise<Listing[]> => {
  const rows = await db.listing.findMany({
    where: { userId, status: { not: "ARCHIVED" } },
    orderBy: [{ aiScore: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });
  return rows.map(toListing);
});
