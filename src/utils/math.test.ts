import { describe, expect, it } from "vitest";

import { clamp, progressRatio, round, sumBy } from "./math";

describe("math utils", () => {
  it("clamps", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it("rounds without floating point artefacts", () => {
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(2.345, 1)).toBe(2.3);
  });

  it("computes bounded progress ratios", () => {
    expect(progressRatio(250, 1000)).toBe(0.25);
    expect(progressRatio(2000, 1000)).toBe(1);
    expect(progressRatio(10, 0)).toBe(0);
  });

  it("sums by projection", () => {
    expect(sumBy([{ v: 1 }, { v: 2 }, { v: 3 }], (x) => x.v)).toBe(6);
  });
});
