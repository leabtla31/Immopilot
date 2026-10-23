import "server-only";

import { z } from "zod";

/**
 * Server environment, validated once at boot. Importing this module from a
 * Client Component is a build error thanks to `server-only`.
 *
 * DATA_SOURCE
 * - `database` (default): PostgreSQL through Prisma — production.
 * - `demo`: the bundled demo workspace, no database — public demo and
 *   static export (`STATIC_EXPORT=true`, see next.config.ts).
 */
const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    STATIC_EXPORT: z.stringbool().default(false),
    DATA_SOURCE: z.enum(["database", "demo"]).default("database"),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }).optional(),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  })
  // A static export has no server, hence no database.
  .transform((value) => (value.STATIC_EXPORT ? { ...value, DATA_SOURCE: "demo" as const } : value))
  .refine((value) => value.DATA_SOURCE === "demo" || value.DATABASE_URL, {
    message: "DATABASE_URL est requis quand DATA_SOURCE=database",
    path: ["DATABASE_URL"],
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variables d'environnement invalides :", z.treeifyError(parsed.error));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export const isDemoMode = env.DATA_SOURCE === "demo";
