import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { demoHousehold } from "@/fixtures";

import { toFinancialProfile, toHouseholdMember } from "./mappers";

const D = (value: number) => new Prisma.Decimal(value);

describe("household mapping", () => {
  it("converts members' Decimal incomes to numbers", () => {
    expect(
      toHouseholdMember({
        id: "m1",
        userId: "u",
        firstName: "Arno",
        netMonthlyIncome: D(2600),
        position: 1,
      }),
    ).toEqual({ id: "m1", firstName: "Arno", netMonthlyIncome: 2600, position: 1 });
  });

  it("derives household income from its members (Léa 2 800 € + Arno 2 600 €)", () => {
    const profile = toFinancialProfile(
      {
        id: "p",
        userId: "u",
        birthYear: 1994,
        householdSize: 2,
        city: "Toulouse",
        otherMonthlyIncome: D(0),
        monthlyExpenses: D(2300),
        currentRent: D(1100),
        existingMonthlyDebt: D(0),
        cashSavings: D(64000),
        downPayment: D(45000),
        financialAssets: D(38000),
        monthlySavings: D(2000),
        marginalTaxRate: D(0.3),
        updatedAt: new Date(),
      },
      demoHousehold,
    );
    expect(profile.netMonthlyIncome).toBe(5400);
    expect(profile.monthlyExpenses).toBe(2300);
  });
});
