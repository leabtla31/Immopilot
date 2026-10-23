import { describe, expect, it } from "vitest";

import { calculateLoan, calculateMonthlyPayment, calculateRemainingCapital } from "./loan";

describe("calculateMonthlyPayment", () => {
  it("matches the reference annuity (200 k€, 4 %, 20 ans)", () => {
    expect(calculateMonthlyPayment(200_000, 0.04, 240)).toBeCloseTo(1211.96, 2);
  });

  it("handles a zero rate as straight-line repayment", () => {
    expect(calculateMonthlyPayment(120_000, 0, 240)).toBe(500);
  });

  it("returns 0 for an empty loan", () => {
    expect(calculateMonthlyPayment(0, 0.03, 240)).toBe(0);
    expect(calculateMonthlyPayment(100_000, 0.03, 0)).toBe(0);
  });

  it("rejects invalid inputs", () => {
    expect(() => calculateMonthlyPayment(-1, 0.03, 240)).toThrow(RangeError);
    expect(() => calculateMonthlyPayment(100_000, Number.NaN, 240)).toThrow(RangeError);
  });
});

describe("calculateRemainingCapital", () => {
  it("is the principal before any payment and zero at term", () => {
    expect(calculateRemainingCapital(200_000, 0.04, 240, 0)).toBe(200_000);
    expect(calculateRemainingCapital(200_000, 0.04, 240, 240)).toBe(0);
    expect(calculateRemainingCapital(200_000, 0.04, 240, 300)).toBe(0);
  });

  it("decreases slowly at first then faster (amortisation profile)", () => {
    const after5 = 200_000 - calculateRemainingCapital(200_000, 0.04, 240, 60);
    const last5 =
      calculateRemainingCapital(200_000, 0.04, 240, 180) -
      calculateRemainingCapital(200_000, 0.04, 240, 240);
    expect(after5).toBeLessThan(last5);
    // Independent check: remaining capital = present value of the remaining payments.
    const r = 0.04 / 12;
    const payment = calculateMonthlyPayment(200_000, 0.04, 240);
    const presentValue = (payment * (1 - (1 + r) ** -120)) / r;
    expect(calculateRemainingCapital(200_000, 0.04, 240, 120)).toBeCloseTo(presentValue, 6);
  });

  it("is linear at zero rate", () => {
    expect(calculateRemainingCapital(120_000, 0, 240, 120)).toBe(60_000);
  });
});

describe("calculateLoan", () => {
  const loan = calculateLoan({
    principal: 200_000,
    annualRate: 0.04,
    durationMonths: 240,
    insuranceRate: 0.003,
  });

  it("computes payment, insurance and total cost", () => {
    expect(loan.monthlyPayment).toBeCloseTo(1211.96, 2);
    expect(loan.monthlyInsurance).toBe(50);
    expect(loan.monthlyTotal).toBeCloseTo(1261.96, 2);
    expect(loan.totalInterest).toBeCloseTo(90_870.07, 0);
    expect(loan.totalInsurance).toBe(12_000);
    expect(loan.totalCost).toBeCloseTo(loan.totalInterest + 12_000, 6);
  });

  it("produces a consistent yearly schedule", () => {
    expect(loan.schedule).toHaveLength(20);
    const principal = loan.schedule.reduce((sum, y) => sum + y.principalPaid, 0);
    const interest = loan.schedule.reduce((sum, y) => sum + y.interestPaid, 0);
    expect(principal).toBeCloseTo(200_000, 6);
    expect(interest).toBeCloseTo(loan.totalInterest, 6);
    expect(loan.schedule.at(-1)?.endingCapital).toBe(0);
    expect(loan.schedule[0]!.interestPaid).toBeGreaterThan(loan.schedule[19]!.interestPaid);
  });

  it("handles partial last years", () => {
    const short = calculateLoan({ principal: 10_000, annualRate: 0.02, durationMonths: 18 });
    expect(short.schedule).toHaveLength(2);
    expect(short.schedule[1]!.endingCapital).toBe(0);
  });
});
