import { describe, expect, it } from "vitest";

import { calculateEquity, calculateNetWorth } from "./wealth";

describe("calculateEquity", () => {
  it("is market value minus remaining capital", () => {
    expect(calculateEquity(250_000, 180_000)).toBe(70_000);
    expect(calculateEquity(150_000, 170_000)).toBe(-20_000);
  });
});

describe("calculateNetWorth", () => {
  it("aggregates liquid assets, real estate and debt", () => {
    const result = calculateNetWorth({
      cash: 20_000,
      financialAssets: 30_000,
      properties: [
        { marketValue: 200_000, remainingCapital: 150_000 },
        { marketValue: 120_000, remainingCapital: 0 },
      ],
    });
    expect(result).toEqual({
      realEstateValue: 320_000,
      liquidAssets: 50_000,
      grossAssets: 370_000,
      debt: 150_000,
      realEstateEquity: 170_000,
      netWorth: 220_000,
    });
  });

  it("works without properties", () => {
    expect(
      calculateNetWorth({ cash: 64_000, financialAssets: 38_000, properties: [] }).netWorth,
    ).toBe(102_000);
  });
});
