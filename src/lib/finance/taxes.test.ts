import { describe, expect, it } from "vitest";

import { calculateLmnpDepreciation, calculateTaxes, type RentalTaxInput } from "./taxes";

const input: RentalTaxInput = {
  regime: "MICRO_FONCIER",
  annualRent: 10_000,
  annualCharges: 1_000,
  annualPropertyTax: 800,
  annualLoanInterest: 3_000,
  annualLoanInsurance: 300,
  marginalTaxRate: 0.3,
};

describe("calculateTaxes", () => {
  it("micro-foncier: 30 % allowance", () => {
    const result = calculateTaxes(input);
    expect(result.taxableIncome).toBe(7_000);
    expect(result.incomeTax).toBeCloseTo(2_100, 6);
    expect(result.socialContributions).toBeCloseTo(1_204, 6);
    expect(result.total).toBeCloseTo(3_304, 6);
  });

  it("réel: deducts actual charges and interest", () => {
    const result = calculateTaxes({ ...input, regime: "NU_REEL" });
    expect(result.taxableIncome).toBe(4_900);
  });

  it("micro-BIC: 50 % allowance", () => {
    expect(calculateTaxes({ ...input, regime: "MICRO_BIC" }).taxableIncome).toBe(5_000);
  });

  it("LMNP réel: depreciation can wipe out the tax but never go negative", () => {
    expect(
      calculateTaxes({ ...input, regime: "LMNP_REEL", annualDepreciation: 2_000 }).taxableIncome,
    ).toBe(2_900);
    expect(calculateTaxes({ ...input, regime: "LMNP_REEL", annualDepreciation: 9_000 }).total).toBe(
      0,
    );
  });

  it("no regime: no tax", () => {
    expect(calculateTaxes({ ...input, regime: "NONE" }).total).toBe(0);
  });

  it("accepts a custom social contributions rate", () => {
    expect(
      calculateTaxes({ ...input, socialContributionsRate: 0.186 }).socialContributions,
    ).toBeCloseTo(1_302, 6);
  });
});

describe("calculateLmnpDepreciation", () => {
  it("depreciates building, works and furniture over their lives", () => {
    expect(calculateLmnpDepreciation(150_000, 15_000, 7_000)).toBeCloseTo(4_250 + 1_000 + 1_000, 6);
  });

  it("stops each component once fully depreciated", () => {
    expect(calculateLmnpDepreciation(150_000, 15_000, 7_000, 10)).toBeCloseTo(4_250 + 1_000, 6);
    expect(calculateLmnpDepreciation(150_000, 15_000, 7_000, 20)).toBeCloseTo(4_250, 6);
    expect(calculateLmnpDepreciation(150_000, 15_000, 7_000, 30)).toBe(0);
  });
});
