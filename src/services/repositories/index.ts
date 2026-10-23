import "server-only";

import { isDemoMode } from "@/config/env";

import type { DataRepository } from "./types";

/**
 * Resolve the active adapter. Prisma is imported lazily so demo deployments
 * never load the database client.
 */
export async function getRepository(): Promise<DataRepository> {
  if (isDemoMode) return (await import("./demo.repository")).demoRepository;
  return (await import("./prisma.repository")).prismaRepository;
}

export type { DataRepository } from "./types";
