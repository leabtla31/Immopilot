import type {
  FinancialProfile,
  HouseholdMember,
  SimulationAssumptions,
  UserSummary,
} from "@/types";

/** Demo persona used by the seed, stories and tests. */
export const demoUser: UserSummary = {
  id: "demo-lea",
  email: "lea@immopilot.app",
  firstName: "Léa",
  lastName: "Martin",
  avatarUrl: null,
};

/** Léa and Arno, co-borrowers. */
export const demoHousehold: HouseholdMember[] = [
  { id: "member-lea", firstName: "Léa", netMonthlyIncome: 2800, position: 0 },
  { id: "member-arno", firstName: "Arno", netMonthlyIncome: 2600, position: 1 },
];

export const demoProfile: FinancialProfile = {
  birthYear: 1994,
  householdSize: 2,
  city: "Toulouse",
  netMonthlyIncome: demoHousehold.reduce((sum, member) => sum + member.netMonthlyIncome, 0),
  otherMonthlyIncome: 0,
  monthlyExpenses: 2300,
  currentRent: 1100,
  existingMonthlyDebt: 0,
  cashSavings: 64000,
  downPayment: 45000,
  financialAssets: 38000,
  monthlySavings: 2000,
  marginalTaxRate: 0.3,
};

export const demoAssumptions: SimulationAssumptions = {
  loanRate: 0.0335,
  loanDurationYears: 25,
  insuranceRate: 0.003,
  notaryFeesRate: 0.075,
  maxDebtRatio: 0.35,
  inflationRate: 0.02,
  salaryGrowthRate: 0.025,
  rentalVacancyRate: 0.05,
  propertyAppreciationRate: 0.02,
  rentGrowthRate: 0.015,
  savingsYieldRate: 0.03,
};
