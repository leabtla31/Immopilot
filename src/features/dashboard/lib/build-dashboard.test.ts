import { describe, expect, it } from "vitest";

import { demoListings, demoSnapshot } from "@/fixtures";

import { buildDashboard } from "./build-dashboard";

describe("buildDashboard", () => {
  const model = buildDashboard(demoSnapshot, demoListings);

  it("greets the user and exposes today's balance sheet", () => {
    expect(model.firstName).toBe("Léa");
    expect(model.today).toMatchObject({ netWorth: 102_000, cash: 64_000, downPayment: 45_000 });
  });

  it("exposes the co-borrowers backing the capacity", () => {
    expect(model.household.map((m) => [m.firstName, m.netMonthlyIncome])).toEqual([
      ["Léa", 2_800],
      ["Arno", 2_600],
    ]);
  });

  it("projects 2026 → 2045 for the charts and the Vision mode", () => {
    expect(model.projection[0]!.year).toBe(2026);
    expect(model.projection.at(-1)!.year).toBe(2045);
  });

  it("computes the borrowing capacity under the 35 % rule", () => {
    expect(model.capacity.maxMonthlyPayment).toBeCloseTo(5_400 * 0.35, 6);
    expect(model.capacity.maxLoan).toBeCloseTo(365_136, 0);
  });

  it("tracks the net-worth target", () => {
    expect(model.target).toMatchObject({
      amount: 1_000_000,
      year: 2040,
      reachedYear: 2042,
      onTrack: false,
    });
    expect(model.target.ratio).toBeCloseTo(0.102, 6);
  });

  it("searches financial freedom beyond the visible horizon", () => {
    expect(model.freedom.year).toBeGreaterThan(2045);
    expect(model.freedom.targetYear).toBe(2040);
  });

  it("attaches financing outcomes to purchase milestones only", () => {
    expect(model.roadmap.map((m) => m.outcome !== null)).toEqual([true, true, true, true, false]);
  });

  it("builds the next step from the first unfinished milestone", () => {
    const step = model.nextStep!;
    expect(step.milestone.id).toBe("ms-2027");
    expect(step.checklist.map((c) => c.done)).toEqual([true, true, false, false]);
    expect(step.action.href).toBe("/annonces");
  });

  it("returns no next step once every milestone is done", () => {
    const done = {
      ...demoSnapshot,
      milestones: demoSnapshot.milestones.map((m) => ({ ...m, status: "DONE" as const })),
    };
    expect(buildDashboard(done, demoListings).nextStep).toBeNull();
  });

  it("is serialisable (safe to pass to Client Components)", () => {
    expect(JSON.parse(JSON.stringify(model))).toEqual(model);
  });
});
