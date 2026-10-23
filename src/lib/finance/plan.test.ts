import { describe, expect, it } from "vitest";

import { demoMilestones } from "@/fixtures";

import { acquisitionsFromMilestones, PLAN_DEFAULTS } from "./plan";

describe("acquisitionsFromMilestones", () => {
  const plan = acquisitionsFromMilestones(demoMilestones);

  it("keeps only priced purchase milestones", () => {
    expect(plan.map((a) => [a.year, a.usage])).toEqual([
      [2027, "RENTAL"],
      [2029, "RENTAL"],
      [2032, "PRIMARY_RESIDENCE"],
      [2035, "RENTAL"],
    ]);
  });

  it("derives rental economics from the default yield", () => {
    const first = plan[0]!;
    const rent = (140_000 * PLAN_DEFAULTS.rental.grossYield) / 12;
    expect(first.monthlyRent).toBeCloseTo(rent, 6);
    expect(first.monthlyCharges).toBeCloseTo(rent * 0.1, 6);
    expect(first.regime).toBe("LMNP_REEL");
  });

  it("prices the primary residence running costs", () => {
    const home = plan[2]!;
    expect(home.monthlyRent).toBeUndefined();
    expect(home.annualPropertyTax).toBeCloseTo(360_000 * 0.004, 6);
  });
});
