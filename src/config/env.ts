import "server-only";

import { z } from "zod";

/**
 * Server environment, validated once at boot. Importing this module from a
 * Client Component is a build error thanks to `server-only`.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variables d'environnement invalides :", z.treeifyError(parsed.error));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
