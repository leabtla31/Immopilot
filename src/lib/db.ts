import "server-only";

import { PrismaClient } from "@prisma/client";

import { env } from "@/config/env";

/**
 * Prisma singleton. In development, Next's HMR re-evaluates modules; caching
 * the client on `globalThis` prevents exhausting the connection pool.
 * Only imported by the Prisma repository, so demo builds never load it.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
