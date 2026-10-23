import "server-only";

import { cache } from "react";

import type { Listing, Neighborhood } from "@/types";

import { getRepository } from "./repositories";

export const listNeighborhoods = cache(
  async (city = "Toulouse"): Promise<Neighborhood[]> =>
    (await getRepository()).listNeighborhoods(city),
);

export const listListings = cache(
  async (userId: string): Promise<Listing[]> => (await getRepository()).listListings(userId),
);
