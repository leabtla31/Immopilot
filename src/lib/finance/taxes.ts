import type { RentalRegime } from "@/types";

/**
 * Annual taxation of rental income (France, simplified but faithful in shape).
 *
 * - Micro-foncier: 30 % flat allowance (unfurnished, rents ≤ 15 000 €).
 * - Réel (nu): actual charges, property tax and loan interest are deductible.
 * - Micro-BIC: 50 % flat allowance (furnished, long-term).
 * - LMNP réel: deductible charges + depreciation; depreciation cannot create
 *   a taxable deficit (excess is carried forward, not modelled here).
 *
 * Tax = taxable income × (marginal income-tax rate + social contributions).
 */
export interface RentalTaxInput {
  regime: RentalRegime;
  /** Rents actually collected over the year. */
  annualRent: number;
  /** Deductible operating charges (non-recoverable copro, PNO, management…). */
  annualCharges: number;
  annualPropertyTax: number;
  annualLoanInterest: number;
  annualLoanInsurance: number;
  /** LMNP réel only: yearly depreciation. */
  annualDepreciation?: number;
  marginalTaxRate: number;
  /** Prélèvements sociaux on property income. */
  socialContributionsRate?: number;
}

export interface RentalTaxResult {
  taxableIncome: number;
  incomeTax: number;
  socialContributions: number;
  total: number;
}

export const SOCIAL_CONTRIBUTIONS_RATE = 0.172;
export const MICRO_FONCIER_ALLOWANCE = 0.3;
export const MICRO_BIC_ALLOWANCE = 0.5;

export function calculateTaxes(input: RentalTaxInput): RentalTaxResult {
  const {
    regime,
    annualRent,
    annualCharges,
    annualPropertyTax,
    annualLoanInterest,
    annualLoanInsurance,
    annualDepreciation = 0,
    marginalTaxRate,
    socialContributionsRate = SOCIAL_CONTRIBUTIONS_RATE,
  } = input;

  const deductible = annualCharges + annualPropertyTax + annualLoanInterest + annualLoanInsurance;
  let taxableIncome: number;
  switch (regime) {
    case "NONE":
      taxableIncome = 0;
      break;
    case "MICRO_FONCIER":
      taxableIncome = annualRent * (1 - MICRO_FONCIER_ALLOWANCE);
      break;
    case "MICRO_BIC":
      taxableIncome = annualRent * (1 - MICRO_BIC_ALLOWANCE);
      break;
    case "NU_REEL":
      taxableIncome = annualRent - deductible;
      break;
    case "LMNP_REEL":
      taxableIncome = annualRent - deductible - annualDepreciation;
      break;
  }

  taxableIncome = Math.max(0, taxableIncome);
  const incomeTax = taxableIncome * marginalTaxRate;
  const socialContributions = taxableIncome * socialContributionsRate;
  return { taxableIncome, incomeTax, socialContributions, total: incomeTax + socialContributions };
}

/**
 * Yearly LMNP depreciation: building (85 % of price, land excluded) over
 * 30 years, works over 15 years, furniture over 7 years.
 */
export function calculateLmnpDepreciation(
  price: number,
  works = 0,
  furniture = 0,
  yearsHeld = 0,
): number {
  const building = yearsHeld < 30 ? (price * 0.85) / 30 : 0;
  const worksPart = yearsHeld < 15 ? works / 15 : 0;
  const furniturePart = yearsHeld < 7 ? furniture / 7 : 0;
  return building + worksPart + furniturePart;
}
