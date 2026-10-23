import { describe, expect, it } from "vitest";

import { demoUser } from "@/fixtures";
import { NotFoundError } from "@/services/errors";

import { demoRepository } from "./demo.repository";

describe("demoRepository", () => {
  it("serves the demo workspace for the demo user", async () => {
    const snapshot = await demoRepository.getWealthSnapshot(demoUser.id);
    expect(snapshot.household.map((m) => m.firstName)).toEqual(["Léa", "Arno"]);
    expect(snapshot.profile.netMonthlyIncome).toBe(5_400);
    expect(snapshot.milestones.map((m) => m.year)).toEqual([2027, 2029, 2032, 2035, 2040]);
  });

  it("refuses unknown users like the database adapter", async () => {
    await expect(demoRepository.getUserSummary("someone-else")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(await demoRepository.listListings("someone-else")).toEqual([]);
  });

  it("orders neighbourhoods and listings by score", async () => {
    const neighborhoods = await demoRepository.listNeighborhoods("Toulouse");
    expect(neighborhoods).toHaveLength(10);
    expect(neighborhoods[0]!.globalScore).toBeGreaterThanOrEqual(neighborhoods.at(-1)!.globalScore);
    const listings = await demoRepository.listListings(demoUser.id);
    expect(listings[0]!.aiScore).toBe(87);
  });

  it("reports itself as healthy", async () => {
    expect(await demoRepository.health()).toEqual({ source: "demo", up: true });
  });
});
