import { assertNonNegative } from "./guards";

/**
 * Fixed-rate amortising loan (prêt amortissable à mensualités constantes).
 * Borrower insurance follows the French market default: a fixed monthly
 * premium computed on the initial capital.
 */
export interface LoanParams {
  principal: number;
  /** Nominal annual rate, as a fraction (0.0335). */
  annualRate: number;
  durationMonths: number;
  /** Annual insurance rate on initial capital, as a fraction (0.003). */
  insuranceRate?: number;
}

export interface LoanYear {
  /** 1-based year of the loan. */
  year: number;
  startingCapital: number;
  endingCapital: number;
  principalPaid: number;
  interestPaid: number;
  insurancePaid: number;
}

export interface LoanSummary {
  /** Monthly payment excluding insurance. */
  monthlyPayment: number;
  monthlyInsurance: number;
  /** Payment + insurance: what leaves the account each month. */
  monthlyTotal: number;
  totalInterest: number;
  totalInsurance: number;
  /** Interest + insurance. */
  totalCost: number;
  /** Yearly amortisation table. */
  schedule: LoanYear[];
}

function validate({ principal, annualRate, durationMonths, insuranceRate = 0 }: LoanParams) {
  assertNonNegative("principal", principal);
  assertNonNegative("annualRate", annualRate);
  assertNonNegative("durationMonths", durationMonths);
  assertNonNegative("insuranceRate", insuranceRate);
}

/** Constant monthly payment (excluding insurance). */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  durationMonths: number,
): number {
  validate({ principal, annualRate, durationMonths });
  if (principal === 0 || durationMonths === 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return principal / durationMonths;
  return (principal * r) / (1 - (1 + r) ** -durationMonths);
}

/** Capital still owed after `elapsedMonths` payments (closed form). */
export function calculateRemainingCapital(
  principal: number,
  annualRate: number,
  durationMonths: number,
  elapsedMonths: number,
): number {
  validate({ principal, annualRate, durationMonths });
  if (elapsedMonths <= 0) return principal;
  if (elapsedMonths >= durationMonths) return 0;
  const r = annualRate / 12;
  if (r === 0) return principal * (1 - elapsedMonths / durationMonths);
  const payment = calculateMonthlyPayment(principal, annualRate, durationMonths);
  const growth = (1 + r) ** elapsedMonths;
  return Math.max(0, principal * growth - (payment * (growth - 1)) / r);
}

/** Full loan summary with a yearly amortisation schedule. */
export function calculateLoan(params: LoanParams): LoanSummary {
  validate(params);
  const { principal, annualRate, durationMonths, insuranceRate = 0 } = params;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, durationMonths);
  const monthlyInsurance = durationMonths > 0 ? (principal * insuranceRate) / 12 : 0;

  const schedule: LoanYear[] = [];
  const years = Math.ceil(durationMonths / 12);
  for (let year = 1; year <= years; year++) {
    const startMonth = (year - 1) * 12;
    const months = Math.min(12, durationMonths - startMonth);
    const startingCapital = calculateRemainingCapital(
      principal,
      annualRate,
      durationMonths,
      startMonth,
    );
    const endingCapital = calculateRemainingCapital(
      principal,
      annualRate,
      durationMonths,
      startMonth + months,
    );
    const principalPaid = startingCapital - endingCapital;
    schedule.push({
      year,
      startingCapital,
      endingCapital,
      principalPaid,
      interestPaid: monthlyPayment * months - principalPaid,
      insurancePaid: monthlyInsurance * months,
    });
  }

  const totalInterest = monthlyPayment * durationMonths - principal;
  const totalInsurance = monthlyInsurance * durationMonths;

  return {
    monthlyPayment,
    monthlyInsurance,
    monthlyTotal: monthlyPayment + monthlyInsurance,
    totalInterest: Math.max(0, totalInterest),
    totalInsurance,
    totalCost: Math.max(0, totalInterest) + totalInsurance,
    schedule,
  };
}
