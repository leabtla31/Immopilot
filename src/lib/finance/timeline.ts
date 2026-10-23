import type { FinancialProfile, RentalRegime, SimulationAssumptions } from "@/types";

import { calculateDebtRatio } from "./capacity";
import { calculateMonthlyPayment, calculateRemainingCapital } from "./loan";
import { calculateLmnpDepreciation, calculateTaxes } from "./taxes";

/**
 * Year-by-year wealth projection — the heart of ImmoPilot.
 *
 * Row `startYear` is today's opening balance. Each following row is the state
 * at the end of that year after: planned acquisitions (start of year), a year
 * of income, expenses, rents, loan service and taxes, then market revaluation.
 * Amounts are nominal euros.
 */

export type AcquisitionUsage = "RENTAL" | "PRIMARY_RESIDENCE";

export interface PlannedAcquisition {
  id: string;
  label: string;
  year: number;
  usage: AcquisitionUsage;
  price: number;
  works?: number;
  /** Rental only: rent at purchase date. */
  monthlyRent?: number;
  monthlyCharges: number;
  annualPropertyTax: number;
  regime?: RentalRegime;
  /** Cash put in. Defaults: notary fees (rental) or notary fees + 10 % (primary). */
  contribution?: number;
  loanRate?: number;
  loanDurationYears?: number;
}

export interface TimelineInput {
  startYear: number;
  endYear: number;
  profile: Pick<
    FinancialProfile,
    | "birthYear"
    | "netMonthlyIncome"
    | "otherMonthlyIncome"
    | "monthlyExpenses"
    | "currentRent"
    | "existingMonthlyDebt"
    | "cashSavings"
    | "financialAssets"
    | "marginalTaxRate"
  >;
  assumptions: SimulationAssumptions;
  acquisitions: PlannedAcquisition[];
  /** Months of living costs kept aside, never used as down payment. */
  emergencyFundMonths?: number;
  /** Sustainable withdrawal rate applied to financial assets for passive income. */
  withdrawalRate?: number;
}

export interface AcquisitionOutcome {
  id: string;
  label: string;
  year: number;
  usage: AcquisitionUsage;
  price: number;
  notaryFees: number;
  contribution: number;
  loanAmount: number;
  /** Payment + insurance. */
  monthlyPayment: number;
  /** Household debt ratio right after the purchase. */
  debtRatio: number;
  /** Highest price compatible with the max debt ratio at that date, same contribution. */
  maxAffordablePrice: number;
  feasible: boolean;
  warnings: string[];
}

export interface TimelineYear {
  year: number;
  age: number;
  /** Net monthly earned income. */
  monthlyIncome: number;
  /** Monthly living costs: expenses + housing (rent or primary residence costs and loan). */
  monthlyLivingCosts: number;
  /** Cash + financial investments. */
  financialAssets: number;
  realEstateValue: number;
  debt: number;
  grossAssets: number;
  netWorth: number;
  realEstateEquity: number;
  /** Capital repaid during the year / since today. */
  principalRepaid: number;
  cumulativePrincipalRepaid: number;
  interestPaid: number;
  cumulativeInterestPaid: number;
  /** Rents collected during the year (after vacancy). */
  annualRentalIncome: number;
  /** Rents after vacancy, charges, property tax and income tax — before loans — per month. */
  monthlyNetRentalIncome: number;
  /** Rental cash-flow after charges, taxes and loan payments, per month. */
  monthlyRentalCashflow: number;
  /** Net rental income + sustainable withdrawal on financial assets, per month. */
  monthlyPassiveIncome: number;
  /** Cash actually available without working: rental cash-flow + withdrawal, per month (≥ 0). */
  monthlyFreedomIncome: number;
  /** Money saved during the year (can be negative). */
  annualSavings: number;
  debtRatio: number;
  /** Freedom income / living costs. ≥ 1 means financial freedom. */
  freedomRatio: number;
  propertiesCount: number;
  acquisitionIds: string[];
}

export interface TimelineResult {
  years: TimelineYear[];
  acquisitions: AcquisitionOutcome[];
}

interface HeldProperty {
  acquisition: PlannedAcquisition;
  purchaseYear: number;
  marketValue: number;
  monthlyRent: number;
  monthlyCharges: number;
  annualPropertyTax: number;
  loan: {
    principal: number;
    annualRate: number;
    durationMonths: number;
    insuranceRate: number;
    monthsPaid: number;
  };
}

const RENTAL_WEIGHT = 0.7;

export function defaultContribution(
  acquisition: PlannedAcquisition,
  notaryFeesRate: number,
): number {
  const notary = acquisition.price * notaryFeesRate;
  return acquisition.usage === "PRIMARY_RESIDENCE" ? notary + acquisition.price * 0.1 : notary;
}

function loanPayment(p: HeldProperty): number {
  const { principal, annualRate, durationMonths, insuranceRate } = p.loan;
  if (p.loan.monthsPaid >= durationMonths) return 0;
  return (
    calculateMonthlyPayment(principal, annualRate, durationMonths) +
    (principal * insuranceRate) / 12
  );
}

function remaining(p: HeldProperty, monthsPaid = p.loan.monthsPaid): number {
  const { principal, annualRate, durationMonths } = p.loan;
  return calculateRemainingCapital(principal, annualRate, durationMonths, monthsPaid);
}

export function calculateTimeline(input: TimelineInput): TimelineResult {
  const {
    startYear,
    endYear,
    profile,
    assumptions: a,
    emergencyFundMonths = 6,
    withdrawalRate = 0.035,
  } = input;
  if (endYear < startYear) throw new RangeError("endYear doit être postérieur à startYear");

  const acquisitions = [...input.acquisitions].sort((x, y) => x.year - y.year);
  const held: HeldProperty[] = [];
  const outcomes: AcquisitionOutcome[] = [];
  const years: TimelineYear[] = [];

  let financialAssets = profile.cashSavings + profile.financialAssets;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  const growth = (rate: number, t: number) => (1 + rate) ** t;
  const monthlyIncomeAt = (t: number) =>
    (profile.netMonthlyIncome + profile.otherMonthlyIncome) * growth(a.salaryGrowthRate, t);
  const expensesAt = (t: number) => profile.monthlyExpenses * growth(a.inflationRate, t);
  const primary = () => held.find((p) => p.acquisition.usage === "PRIMARY_RESIDENCE");

  /** Monthly housing cost: rent until the primary residence is bought. */
  const housingAt = (t: number) => {
    const home = primary();
    if (!home) return profile.currentRent * growth(a.inflationRate, t);
    return home.monthlyCharges + home.annualPropertyTax / 12 + loanPayment(home);
  };

  const rentals = () => held.filter((p) => p.acquisition.usage === "RENTAL");
  const debtService = () =>
    held.reduce((sum, p) => sum + loanPayment(p), 0) + profile.existingMonthlyDebt;

  function buy(acquisition: PlannedAcquisition, t: number) {
    const notaryFees = acquisition.price * a.notaryFeesRate;
    const works = acquisition.works ?? 0;
    const wanted = acquisition.contribution ?? defaultContribution(acquisition, a.notaryFeesRate);
    const emergencyFund = emergencyFundMonths * (expensesAt(t) + housingAt(t));
    const available = Math.max(0, financialAssets - emergencyFund);
    const contribution = Math.min(wanted, available);
    const loanAmount = Math.max(0, acquisition.price + notaryFees + works - contribution);
    const durationMonths = (acquisition.loanDurationYears ?? a.loanDurationYears) * 12;
    const annualRate = acquisition.loanRate ?? a.loanRate;

    // Room left under the debt-ratio cap before this purchase (rents of the new
    // property count at 70 % once it is let).
    const rentsBefore = rentals().reduce((sum, p) => sum + p.monthlyRent, 0);
    const newRent = acquisition.usage === "RENTAL" ? (acquisition.monthlyRent ?? 0) : 0;
    const weightedIncome = monthlyIncomeAt(t) + (rentsBefore + newRent) * RENTAL_WEIGHT;
    const room = Math.max(0, weightedIncome * a.maxDebtRatio - debtService());
    const r = annualRate / 12;
    const annuity = r === 0 ? 1 / durationMonths : r / (1 - (1 + r) ** -durationMonths);
    const maxLoan = room / (annuity + a.insuranceRate / 12);
    const maxAffordablePrice = Math.max(
      0,
      (maxLoan + contribution - works) / (1 + a.notaryFeesRate),
    );

    const property: HeldProperty = {
      acquisition,
      purchaseYear: acquisition.year,
      marketValue: acquisition.price + works * 0.5,
      monthlyRent: acquisition.usage === "RENTAL" ? (acquisition.monthlyRent ?? 0) : 0,
      monthlyCharges: acquisition.monthlyCharges,
      annualPropertyTax: acquisition.annualPropertyTax,
      loan: {
        principal: loanAmount,
        annualRate,
        durationMonths,
        insuranceRate: a.insuranceRate,
        monthsPaid: 0,
      },
    };
    financialAssets -= contribution;
    held.push(property);

    const rents = rentals().reduce((sum, p) => sum + p.monthlyRent, 0);
    const debtRatio = calculateDebtRatio(debtService(), monthlyIncomeAt(t), rents, RENTAL_WEIGHT);
    const warnings: string[] = [];
    if (contribution < wanted)
      warnings.push("Apport inférieur au montant prévu : épargne insuffisante.");
    if (contribution < notaryFees)
      warnings.push("Les frais de notaire ne sont pas couverts par l'apport.");
    if (debtRatio > a.maxDebtRatio)
      warnings.push(`Taux d'endettement supérieur à ${Math.round(a.maxDebtRatio * 100)} %.`);

    outcomes.push({
      id: acquisition.id,
      label: acquisition.label,
      year: acquisition.year,
      usage: acquisition.usage,
      price: acquisition.price,
      notaryFees,
      contribution,
      loanAmount,
      monthlyPayment: loanPayment(property),
      debtRatio,
      maxAffordablePrice,
      feasible: debtRatio <= a.maxDebtRatio && contribution >= notaryFees,
      warnings,
    });
  }

  function snapshot(
    year: number,
    t: number,
    flows: {
      principal: number;
      interest: number;
      rentalIncome: number;
      netRentalIncome: number;
      rentalCashflow: number;
      savings: number;
    },
    acquisitionIds: string[],
  ): TimelineYear {
    const realEstateValue = held.reduce((sum, p) => sum + p.marketValue, 0);
    const debt = held.reduce((sum, p) => sum + remaining(p), 0);
    const grossAssets = realEstateValue + financialAssets;
    const monthlyLivingCosts = expensesAt(t) + housingAt(t) + profile.existingMonthlyDebt;
    const withdrawal = (Math.max(0, financialAssets) * withdrawalRate) / 12;
    const monthlyPassiveIncome = Math.max(0, flows.netRentalIncome / 12 + withdrawal);
    const monthlyFreedomIncome = Math.max(0, flows.rentalCashflow / 12 + withdrawal);
    const rents = rentals().reduce((sum, p) => sum + p.monthlyRent, 0);
    return {
      year,
      age: year - profile.birthYear,
      monthlyIncome: monthlyIncomeAt(t),
      monthlyLivingCosts,
      financialAssets,
      realEstateValue,
      debt,
      grossAssets,
      netWorth: grossAssets - debt,
      realEstateEquity: realEstateValue - debt,
      principalRepaid: flows.principal,
      cumulativePrincipalRepaid: cumulativePrincipal,
      interestPaid: flows.interest,
      cumulativeInterestPaid: cumulativeInterest,
      annualRentalIncome: flows.rentalIncome,
      monthlyNetRentalIncome: flows.netRentalIncome / 12,
      monthlyRentalCashflow: flows.rentalCashflow / 12,
      monthlyPassiveIncome,
      monthlyFreedomIncome,
      annualSavings: flows.savings,
      debtRatio: calculateDebtRatio(debtService(), monthlyIncomeAt(t), rents, RENTAL_WEIGHT),
      freedomRatio: monthlyLivingCosts > 0 ? monthlyFreedomIncome / monthlyLivingCosts : 0,
      propertiesCount: held.length,
      acquisitionIds,
    };
  }

  // Opening balance: today. Purchases dated today or earlier happen immediately.
  const opening = acquisitions.filter((acq) => acq.year <= startYear);
  opening.forEach((acq) => buy(acq, 0));
  years.push(
    snapshot(
      startYear,
      0,
      {
        principal: 0,
        interest: 0,
        rentalIncome: 0,
        netRentalIncome: 0,
        rentalCashflow: 0,
        savings: 0,
      },
      opening.map((x) => x.id),
    ),
  );

  for (let year = startYear + 1; year <= endYear; year++) {
    const t = year - startYear;
    const bought = acquisitions.filter((acq) => acq.year === year);
    bought.forEach((acq) => buy(acq, t));

    let principal = 0;
    let interest = 0;
    let rentalIncome = 0;
    let netRentalIncome = 0;
    let rentalCashflow = 0;
    let propertyOutflows = 0;

    for (const p of held) {
      const before = remaining(p);
      const payment = loanPayment(p);
      const monthsThisYear = Math.max(0, Math.min(12, p.loan.durationMonths - p.loan.monthsPaid));
      const after = remaining(p, p.loan.monthsPaid + monthsThisYear);
      const paid = payment * monthsThisYear;
      const insurance =
        monthsThisYear > 0 ? ((p.loan.principal * p.loan.insuranceRate) / 12) * monthsThisYear : 0;
      const principalPaid = before - after;
      const interestPaid = Math.max(0, paid - insurance - principalPaid);
      principal += principalPaid;
      interest += interestPaid;
      p.loan.monthsPaid += monthsThisYear;

      const charges = p.monthlyCharges * 12;
      if (p.acquisition.usage === "RENTAL") {
        const collected = p.monthlyRent * 12 * (1 - a.rentalVacancyRate);
        const taxes = calculateTaxes({
          regime: p.acquisition.regime ?? "LMNP_REEL",
          annualRent: collected,
          annualCharges: charges,
          annualPropertyTax: p.annualPropertyTax,
          annualLoanInterest: interestPaid,
          annualLoanInsurance: insurance,
          annualDepreciation: calculateLmnpDepreciation(
            p.acquisition.price,
            p.acquisition.works ?? 0,
            0,
            year - p.purchaseYear,
          ),
          marginalTaxRate: profile.marginalTaxRate,
        }).total;
        const net = collected - charges - p.annualPropertyTax - taxes;
        rentalIncome += collected;
        netRentalIncome += net;
        rentalCashflow += net - paid;
      } else {
        propertyOutflows += charges + p.annualPropertyTax + paid;
      }
    }

    cumulativePrincipal += principal;
    cumulativeInterest += interest;

    const earned = monthlyIncomeAt(t) * 12;
    const expenses = expensesAt(t) * 12;
    const rent = primary() ? 0 : profile.currentRent * growth(a.inflationRate, t) * 12;
    const savings =
      earned -
      expenses -
      rent -
      propertyOutflows -
      profile.existingMonthlyDebt * 12 +
      rentalCashflow;

    // Savings are invested progressively: half a year of yield on the new money.
    financialAssets =
      financialAssets * (1 + a.savingsYieldRate) + savings * (1 + a.savingsYieldRate / 2);

    for (const p of held) {
      p.marketValue *= 1 + a.propertyAppreciationRate;
      p.monthlyRent *= 1 + a.rentGrowthRate;
      p.monthlyCharges *= 1 + a.inflationRate;
      p.annualPropertyTax *= 1 + a.inflationRate;
    }

    years.push(
      snapshot(
        year,
        t,
        { principal, interest, rentalIncome, netRentalIncome, rentalCashflow, savings },
        bought.map((x) => x.id),
      ),
    );
  }

  return { years, acquisitions: outcomes };
}
