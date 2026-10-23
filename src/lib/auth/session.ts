import "server-only";

import { cache } from "react";

import { demoUser } from "@/fixtures/user";

export interface Session {
  userId: string;
}

/**
 * Resolve the current session.
 *
 * Authentication is intentionally behind this single seam: today it returns the
 * seeded demo workspace; plugging Auth.js / Clerk later only changes this file.
 * Memoised per request with `React.cache`.
 */
export const getSession = cache(async (): Promise<Session> => {
  return { userId: demoUser.id };
});
