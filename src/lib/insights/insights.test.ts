import { describe, expect, it } from "vitest";

import { demoAssumptions, demoGoals, demoListings, demoMilestones, demoProfile } from "@/fixtures";
import { acquisitionsFromMilestones, calculateTimeline, type TimelineInput } from "@/lib/finance";

import { generateInsights } from "./index";

const input: TimelineInput = {
  startYear: 2026,
  endYear: 2065,
  profile: demoProfile,
  assumptions: demoAssumptions,
  acquisitions: acquisitionsFromMilestones(demoMilestones),
};

describe("generateInsights", () => {
  const insights = generateInsights({
    input,
    result: calculateTimeline(input),
    goals: demoGoals,
    listings: demoListings,
    horizonYear: 2045,
  });

  it("ranks critical insights first", () => {
    const ranks = insights.map((i) => ["critical", "opportunity", "info"].indexOf(i.severity));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(insights[0]!.severity).toBe("critical");
  });

  it("flags the first purchase above the debt-ratio cap with an affordable budget", () => {
    const breach = insights.find((i) => i.id === "debt-ratio-ms-2032")!;
    expect(breach.title).toMatch(/Résidence principale 2032/);
    expect(breach.metric?.value).toMatch(/€/);
  });

  it("suggests the best matching listing within budget", () => {
    const listing = insights.find((i) => i.id.startsWith("listing-"));
    expect(listing?.id).toBe("listing-lst-rangueil-studio");
  });

  it("explains the gap to the financial freedom goal", () => {
    expect(insights.some((i) => i.id === "freedom-gap")).toBe(true);
  });

  it("stays quiet when the plan is empty and goals are met", () => {
    const empty = { ...input, acquisitions: [] };
    const quiet = generateInsights({
      input: empty,
      result: calculateTimeline(empty),
      goals: [],
      listings: [],
      horizonYear: 2045,
    });
    expect(quiet).toEqual([]);
  });

  it("only links to existing routes", () => {
    for (const insight of insights) {
      expect(["/simulation", "/roadmap", "/annonces", "/comparateur"]).toContain(
        insight.action.href,
      );
    }
  });
});
