import { assertNonNegative } from "./guards";

/**
 * Borrowing capacity under the French HCSF rule: total monthly debt service
 * (insurance included) may not exceed `maxDebtRatio` (35 %) of income, where
 * banks retain 70 % of gross rents.
 */
export interface CapacityInput {
  /** Net monthly household income (salaries, pensions…). */
  monthlyIncome: number;
  /** Gross monthly rents already received. */
  monthlyRentalIncome?: number;
  existingMonthlyDebt: number;
  maxDebtRatio: number;
  annualRate: number;
  durationYears: number;
  insuranceRate: number;
  downPayment: number;
  notaryFeesRate: number;
  /** Share of rents retained by banks. */
  rentalIncomeWeight?: number;
}

export interface CapacityResult {
  /** Income retained by the bank. */
  weightedIncome: number;
  /** Maximum new monthly payment, insurance included. */
  maxMonthlyPayment: number;
  /** Maximum amount that can be borrowed. */
  maxLoan: number;
  /** Loan + down payment: the total envelope (price + notary fees). */
  maxBudget: number;
  /** Highest property price affordable once notary fees are paid. */
  maxPropertyPrice: number;
}

export function calculateCapacity(input: CapacityInput): CapacityResult {
  const {
    monthlyIncome,
    monthlyRentalIncome = 0,
    existingMonthlyDebt,
    maxDebtRatio,
    annualRate,
    durationYears,
    insuranceRate,
    downPayment,
    notaryFeesRate,
    rentalIncomeWeight = 0.7,
  } = input;
  for (const [name, value] of Object.entries({
    monthlyIncome,
    monthlyRentalIncome,
    existingMonthlyDebt,
    maxDebtRatio,
    annualRate,
    durationYears,
    insuranceRate,
    downPayment,
    notaryFeesRate,
  })) {
    assertNonNegative(name, value);
  }

  const weightedIncome = monthlyIncome + monthlyRentalIncome * rentalIncomeWeight;
  const maxMonthlyPayment = Math.max(0, weightedIncome * maxDebtRatio - existingMonthlyDebt);
  const months = durationYears * 12;

  let maxLoan = 0;
  if (maxMonthlyPayment > 0 && months > 0) {
    const r = annualRate / 12;
    // Monthly cost of borrowing 1 € (annuity factor + insurance on initial capital).
    const annuityFactor = r === 0 ? 1 / months : r / (1 - (1 + r) ** -months);
    maxLoan = maxMonthlyPayment / (annuityFactor + insuranceRate / 12);
  }

  const maxBudget = maxLoan + downPayment;
  return {
    weightedIncome,
    maxMonthlyPayment,
    maxLoan,
    maxBudget,
    maxPropertyPrice: maxBudget / (1 + notaryFeesRate),
  };
}

/** Debt-to-income ratio (taux d'endettement), rents weighted at 70 %. */
export function calculateDebtRatio(
  monthlyDebtService: number,
  monthlyIncome: number,
  monthlyRentalIncome = 0,
  rentalIncomeWeight = 0.7,
): number {
  const income = monthlyIncome + monthlyRentalIncome * rentalIncomeWeight;
  if (income <= 0) return monthlyDebtService > 0 ? Number.POSITIVE_INFINITY : 0;
  return monthlyDebtService / income;
}
