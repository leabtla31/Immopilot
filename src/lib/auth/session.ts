import "server-only";

import { connection } from "next/server";
import { cache } from "react";

import { env } from "@/config/env";
import { demoUser } from "@/fixtures/user";

export interface Session {
  userId: string;
}

/**
 * Resolve the current session.
 *
 * Authentication is intentionally behind this single seam: today it returns the
 * demo workspace; plugging Auth.js / Clerk later only changes this file.
 * A session belongs to a request, so pages using it render per request (and
 * never query the database at build time) — except in the static export,
 * where there is no request and the demo workspace is baked in.
 * Memoised per request with `React.cache`.
 */
export const getSession = cache(async (): Promise<Session> => {
  if (!env.STATIC_EXPORT) await connection();
  return { userId: demoUser.id };
});
