import { describe, expect, it } from "vitest";

import { calculateCapacity, calculateDebtRatio } from "./capacity";

const base = {
  monthlyIncome: 3650,
  existingMonthlyDebt: 0,
  maxDebtRatio: 0.35,
  annualRate: 0.0335,
  durationYears: 25,
  insuranceRate: 0.003,
  downPayment: 38_000,
  notaryFeesRate: 0.075,
};

describe("calculateCapacity", () => {
  it("applies the 35 % HCSF rule, insurance included", () => {
    const result = calculateCapacity(base);
    expect(result.maxMonthlyPayment).toBeCloseTo(1277.5, 6);
    expect(result.maxLoan).toBeCloseTo(246_805, 0);
    expect(result.maxBudget).toBeCloseTo(284_805, 0);
    expect(result.maxPropertyPrice).toBeCloseTo(264_935, 0);
  });

  it("counts existing debts against capacity", () => {
    const withDebt = calculateCapacity({ ...base, existingMonthlyDebt: 300 });
    expect(withDebt.maxMonthlyPayment).toBeCloseTo(977.5, 6);
    expect(withDebt.maxLoan).toBeLessThan(calculateCapacity(base).maxLoan);
  });

  it("weights rents at 70 %", () => {
    const result = calculateCapacity({ ...base, monthlyRentalIncome: 1000 });
    expect(result.weightedIncome).toBe(4350);
  });

  it("returns zero capacity when debts exceed the cap", () => {
    const result = calculateCapacity({ ...base, existingMonthlyDebt: 2000 });
    expect(result.maxMonthlyPayment).toBe(0);
    expect(result.maxLoan).toBe(0);
    expect(result.maxBudget).toBe(38_000);
  });

  it("supports zero-rate loans", () => {
    const result = calculateCapacity({
      ...base,
      annualRate: 0,
      insuranceRate: 0,
      durationYears: 10,
    });
    expect(result.maxLoan).toBeCloseTo(1277.5 * 120, 6);
  });

  it("rejects negative inputs", () => {
    expect(() => calculateCapacity({ ...base, monthlyIncome: -1 })).toThrow(RangeError);
  });
});

describe("calculateDebtRatio", () => {
  it("divides debt service by weighted income", () => {
    expect(calculateDebtRatio(1400, 4000)).toBe(0.35);
    expect(calculateDebtRatio(1400, 3300, 1000)).toBe(0.35);
  });

  it("handles a household without income", () => {
    expect(calculateDebtRatio(0, 0)).toBe(0);
    expect(calculateDebtRatio(100, 0)).toBe(Number.POSITIVE_INFINITY);
  });
});
