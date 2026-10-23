import { NextResponse } from "next/server";

import { getRepository } from "@/services/repositories";

export const dynamic = "force-dynamic";

/**
 * Liveness + data-source readiness probe.
 * Named `route.api.ts`: server-only routes are excluded from the static
 * export through `pageExtensions` (see next.config.ts).
 */
export async function GET() {
  const { source, up } = await (await getRepository()).health();
  return NextResponse.json(
    {
      status: up ? "ok" : "degraded",
      source,
      database: source === "demo" ? "none" : up ? "up" : "down",
    },
    { status: up ? 200 : 503 },
  );
}
