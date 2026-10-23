import { describe, expect, it } from "vitest";

import { calculateCashflow, calculateRentability } from "./rental";

describe("calculateRentability", () => {
  const input = {
    price: 100_000,
    notaryFees: 7_500,
    monthlyRent: 600,
    vacancyRate: 0.05,
    monthlyCharges: 50,
    annualPropertyTax: 700,
  };

  it("computes gross, net and net-net yields", () => {
    const result = calculateRentability({ ...input, annualTaxes: 540 });
    expect(result.grossYield).toBeCloseTo(0.072, 6);
    expect(result.netYield).toBeCloseTo(5_540 / 107_500, 6);
    expect(result.netNetYield).toBeCloseTo(5_000 / 107_500, 6);
    expect(result.totalCost).toBe(107_500);
  });

  it("includes works in the total cost", () => {
    expect(calculateRentability({ ...input, works: 12_500 }).totalCost).toBe(120_000);
  });

  it("returns zeros for a free property", () => {
    expect(calculateRentability({ ...input, price: 0, notaryFees: 0 }).grossYield).toBe(0);
  });
});

describe("calculateCashflow", () => {
  it("computes monthly cash-flow before and after tax", () => {
    const result = calculateCashflow({
      monthlyRent: 700,
      vacancyRate: 0.05,
      monthlyCharges: 60,
      annualPropertyTax: 720,
      monthlyLoanPayment: 550,
      annualTaxes: 360,
    });
    expect(result.collectedRent).toBeCloseTo(665, 6);
    expect(result.monthlyOutflows).toBeCloseTo(670, 6);
    expect(result.beforeTax).toBeCloseTo(-5, 6);
    expect(result.afterTax).toBeCloseTo(-35, 6);
  });
});
