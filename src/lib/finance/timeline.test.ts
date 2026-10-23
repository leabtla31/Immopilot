import { describe, expect, it } from "vitest";

import { demoAssumptions, demoGoals, demoMilestones, demoProfile } from "@/fixtures";

import { calculateFreedom, calculateGoalsProgress } from "./freedom";
import { acquisitionsFromMilestones } from "./plan";
import {
  calculateTimeline,
  defaultContribution,
  type PlannedAcquisition,
  type TimelineInput,
} from "./timeline";

const baseInput: TimelineInput = {
  startYear: 2026,
  endYear: 2045,
  profile: demoProfile,
  assumptions: demoAssumptions,
  acquisitions: [],
};

const rental: PlannedAcquisition = {
  id: "r1",
  label: "Studio",
  year: 2027,
  usage: "RENTAL",
  price: 140_000,
  monthlyRent: 720,
  monthlyCharges: 70,
  annualPropertyTax: 800,
  regime: "LMNP_REEL",
};

describe("calculateTimeline — invariants", () => {
  it("opens with today's balance sheet", () => {
    const { years } = calculateTimeline(baseInput);
    expect(years).toHaveLength(20);
    expect(years[0]).toMatchObject({
      year: 2026,
      age: 32,
      financialAssets: 102_000,
      realEstateValue: 0,
      debt: 0,
      netWorth: 102_000,
    });
  });

  it("keeps net worth = gross assets − debt on every row", () => {
    const { years } = calculateTimeline({
      ...baseInput,
      acquisitions: acquisitionsFromMilestones(demoMilestones),
    });
    for (const row of years) {
      expect(row.netWorth).toBeCloseTo(row.grossAssets - row.debt, 6);
      expect(row.realEstateEquity).toBeCloseTo(row.realEstateValue - row.debt, 6);
    }
  });

  it("grows savings without any purchase", () => {
    const { years } = calculateTimeline(baseInput);
    const { netMonthlyIncome: income, monthlyExpenses: expenses, currentRent: rent } = demoProfile;
    const savings = (income - expenses - rent) * 12;
    expect(years[1]!.annualSavings).toBeCloseTo(
      income * 12 * 1.025 - expenses * 12 * 1.02 - rent * 12 * 1.02,
      6,
    );
    expect(years[1]!.annualSavings).toBeGreaterThan(savings);
    for (let i = 1; i < years.length; i++)
      expect(years[i]!.netWorth).toBeGreaterThan(years[i - 1]!.netWorth);
  });

  it("finances a purchase with the contribution and a loan", () => {
    const { years, acquisitions } = calculateTimeline({ ...baseInput, acquisitions: [rental] });
    const outcome = acquisitions[0]!;
    expect(outcome.notaryFees).toBeCloseTo(10_500, 6);
    expect(outcome.contribution).toBeCloseTo(defaultContribution(rental, 0.075), 6);
    expect(outcome.loanAmount).toBeCloseTo(140_000, 6);
    expect(outcome.feasible).toBe(true);
    expect(outcome.warnings).toEqual([]);

    const y2027 = years.find((y) => y.year === 2027)!;
    expect(y2027.acquisitionIds).toEqual(["r1"]);
    expect(y2027.propertiesCount).toBe(1);
    expect(y2027.debt).toBeLessThan(140_000);
    expect(y2027.realEstateValue).toBeCloseTo(140_000 * 1.02, 6);
    expect(y2027.annualRentalIncome).toBeCloseTo(720 * 12 * 0.95, 6);
  });

  it("amortises debt down to zero at term", () => {
    const { years } = calculateTimeline({
      ...baseInput,
      endYear: 2055,
      acquisitions: [{ ...rental, loanDurationYears: 20 }],
    });
    const debts = years.filter((y) => y.year >= 2027).map((y) => y.debt);
    for (let i = 1; i < debts.length; i++) expect(debts[i]!).toBeLessThanOrEqual(debts[i - 1]!);
    expect(years.find((y) => y.year === 2047)!.debt).toBe(0);
    const last = years.at(-1)!;
    expect(last.cumulativePrincipalRepaid).toBeCloseTo(140_000, 0);
    expect(last.interestPaid).toBe(0);
  });

  it("stops paying rent once the primary residence is bought", () => {
    const home: PlannedAcquisition = {
      id: "rp",
      label: "RP",
      year: 2028,
      usage: "PRIMARY_RESIDENCE",
      price: 300_000,
      monthlyCharges: 120,
      annualPropertyTax: 1_200,
    };
    const { years, acquisitions } = calculateTimeline({ ...baseInput, acquisitions: [home] });
    expect(acquisitions[0]!.contribution).toBeCloseTo(300_000 * 0.175, 6);
    const before = years.find((y) => y.year === 2027)!;
    const after = years.find((y) => y.year === 2028)!;
    expect(after.monthlyLivingCosts).not.toBeCloseTo(before.monthlyLivingCosts, 0);
    expect(after.annualRentalIncome).toBe(0);
  });

  it("flags purchases above the debt-ratio cap and reports the affordable price", () => {
    const tooBig: PlannedAcquisition = { ...rental, id: "big", price: 900_000, monthlyRent: 2_000 };
    const { acquisitions } = calculateTimeline({ ...baseInput, acquisitions: [tooBig] });
    const outcome = acquisitions[0]!;
    expect(outcome.feasible).toBe(false);
    expect(outcome.debtRatio).toBeGreaterThan(0.35);
    expect(outcome.warnings.join(" ")).toMatch(/endettement/);
    expect(outcome.maxAffordablePrice).toBeLessThan(900_000);

    // Buying exactly the affordable price lands on the cap.
    const fitted = calculateTimeline({
      ...baseInput,
      acquisitions: [
        { ...tooBig, price: outcome.maxAffordablePrice, contribution: outcome.contribution },
      ],
    }).acquisitions[0]!;
    expect(fitted.debtRatio).toBeLessThanOrEqual(0.3501);
  });

  it("never uses the emergency fund as a down payment", () => {
    const poorProfile = { ...demoProfile, cashSavings: 10_000, financialAssets: 0 };
    const { acquisitions } = calculateTimeline({
      ...baseInput,
      profile: poorProfile,
      acquisitions: [rental],
    });
    expect(acquisitions[0]!.contribution).toBeLessThan(defaultContribution(rental, 0.075));
    expect(acquisitions[0]!.warnings.length).toBeGreaterThan(0);
  });

  it("applies purchases dated today to the opening balance", () => {
    const { years } = calculateTimeline({
      ...baseInput,
      acquisitions: [{ ...rental, year: 2026 }],
    });
    expect(years[0]!.propertiesCount).toBe(1);
    expect(years[0]!.debt).toBeCloseTo(140_000, 6);
  });

  it("rejects an inverted horizon", () => {
    expect(() => calculateTimeline({ ...baseInput, endYear: 2020 })).toThrow(RangeError);
  });
});

describe("demo plan projection", () => {
  const { years, acquisitions } = calculateTimeline({
    ...baseInput,
    endYear: 2065,
    acquisitions: acquisitionsFromMilestones(demoMilestones),
  });

  it("buys the four planned properties", () => {
    expect(acquisitions.map((a) => a.year)).toEqual([2027, 2029, 2032, 2035]);
  });

  it("reaches the first million in 2042, two years after the 2040 target", () => {
    const million = calculateGoalsProgress(demoGoals, years).find(
      (p) => p.goal.id === "goal-million",
    );
    expect(million).toMatchObject({ reachedYear: 2042, onTrack: false });
  });

  it("cannot finance the primary residence after two rentals on 5 400 €/month", () => {
    const home = acquisitions.find((a) => a.usage === "PRIMARY_RESIDENCE")!;
    expect(home.feasible).toBe(false);
    expect(home.debtRatio).toBeGreaterThan(0.4);
    expect(home.maxAffordablePrice).toBeLessThan(home.price);
  });

  it("detects financial freedom once rental loans are repaid", () => {
    const freedom = calculateFreedom(years);
    expect(freedom.year).not.toBeNull();
    expect(freedom.currentRatio).toBeGreaterThan(0);
    expect(freedom.currentRatio).toBeLessThan(1);
  });
});
