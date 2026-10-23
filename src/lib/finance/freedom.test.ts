import { describe, expect, it } from "vitest";

import type { Goal } from "@/types";

import { calculateFreedom, calculateGoalsProgress } from "./freedom";
import type { TimelineYear } from "./timeline";

function row(year: number, overrides: Partial<TimelineYear>): TimelineYear {
  return {
    year,
    age: year - 1994,
    monthlyIncome: 5000,
    monthlyLivingCosts: 3000,
    financialAssets: 0,
    realEstateValue: 0,
    debt: 0,
    grossAssets: 0,
    netWorth: 0,
    realEstateEquity: 0,
    principalRepaid: 0,
    cumulativePrincipalRepaid: 0,
    interestPaid: 0,
    cumulativeInterestPaid: 0,
    annualRentalIncome: 0,
    monthlyNetRentalIncome: 0,
    monthlyRentalCashflow: 0,
    monthlyPassiveIncome: 0,
    monthlyFreedomIncome: 0,
    annualSavings: 0,
    debtRatio: 0,
    freedomRatio: 0,
    propertiesCount: 0,
    acquisitionIds: [],
    ...overrides,
  };
}

const years = [
  row(2026, {
    netWorth: 100_000,
    monthlyPassiveIncome: 200,
    monthlyFreedomIncome: 200,
    freedomRatio: 0.2 / 3,
  }),
  row(2030, {
    netWorth: 600_000,
    monthlyPassiveIncome: 3_200,
    monthlyFreedomIncome: 1_500,
    freedomRatio: 0.5,
  }),
  row(2035, {
    netWorth: 1_200_000,
    monthlyPassiveIncome: 4_000,
    monthlyFreedomIncome: 3_100,
    freedomRatio: 1.03,
  }),
];

const goal = (overrides: Partial<Goal>): Goal => ({
  id: "g",
  kind: "NET_WORTH",
  label: "Goal",
  targetAmount: 1_000_000,
  targetYear: 2040,
  position: 0,
  ...overrides,
});

describe("calculateFreedom", () => {
  it("finds the first year where freedom income covers living costs", () => {
    expect(calculateFreedom(years)).toMatchObject({
      year: 2035,
      yearsToFreedom: 9,
      currentFreedomIncome: 200,
    });
  });

  it("returns null when never reached", () => {
    expect(calculateFreedom(years.slice(0, 2)).year).toBeNull();
  });

  it("handles an empty projection", () => {
    expect(calculateFreedom([]).year).toBeNull();
  });
});

describe("calculateGoalsProgress", () => {
  it("tracks net worth, passive income and freedom goals", () => {
    const [million, passive, freedom] = calculateGoalsProgress(
      [
        goal({ id: "m" }),
        goal({ id: "p", kind: "PASSIVE_INCOME", targetAmount: 3_000, targetYear: 2028 }),
        goal({ id: "f", kind: "FINANCIAL_FREEDOM", targetAmount: 0, targetYear: 2040 }),
      ],
      years,
    );
    expect(million).toMatchObject({
      current: 100_000,
      ratio: 0.1,
      reachedYear: 2035,
      onTrack: true,
    });
    expect(passive).toMatchObject({ reachedYear: 2030, onTrack: false });
    expect(freedom!.ratio).toBeCloseTo(200 / 3000, 6);
    expect(freedom).toMatchObject({ reachedYear: 2035, onTrack: true });
  });

  it("evaluates progress at a given year (Vision mode)", () => {
    const [million] = calculateGoalsProgress([goal({})], years, 2030);
    expect(million!.ratio).toBe(0.6);
  });

  it("returns nothing for an empty projection", () => {
    expect(calculateGoalsProgress([goal({})], [])).toEqual([]);
  });
});
