/**
 * Rental economics of a single property: yields and monthly cash-flow.
 */
export interface RentabilityInput {
  price: number;
  notaryFees: number;
  works?: number;
  monthlyRent: number;
  vacancyRate: number;
  monthlyCharges: number;
  annualPropertyTax: number;
  /** Annual tax on rental income (see `calculateTaxes`). */
  annualTaxes?: number;
}

export interface RentabilityResult {
  /** Annual rent / price. */
  grossYield: number;
  /** (Collected rent − charges − property tax) / total cost. */
  netYield: number;
  /** Net yield after income tax and social contributions. */
  netNetYield: number;
  totalCost: number;
}

export function calculateRentability(input: RentabilityInput): RentabilityResult {
  const {
    price,
    notaryFees,
    works = 0,
    monthlyRent,
    vacancyRate,
    monthlyCharges,
    annualPropertyTax,
    annualTaxes = 0,
  } = input;
  const totalCost = price + notaryFees + works;
  if (price <= 0 || totalCost <= 0)
    return { grossYield: 0, netYield: 0, netNetYield: 0, totalCost };
  const annualRent = monthlyRent * 12;
  const operatingIncome = annualRent * (1 - vacancyRate) - monthlyCharges * 12 - annualPropertyTax;
  return {
    grossYield: annualRent / price,
    netYield: operatingIncome / totalCost,
    netNetYield: (operatingIncome - annualTaxes) / totalCost,
    totalCost,
  };
}

export interface CashflowInput {
  monthlyRent: number;
  vacancyRate: number;
  monthlyCharges: number;
  annualPropertyTax: number;
  /** Loan payment including insurance. */
  monthlyLoanPayment: number;
  annualTaxes?: number;
}

export interface CashflowResult {
  /** Rent actually collected per month, after vacancy. */
  collectedRent: number;
  /** Charges + property tax + loan, per month. */
  monthlyOutflows: number;
  /** Cash-flow before income tax. */
  beforeTax: number;
  /** Cash-flow after income tax (net-net). */
  afterTax: number;
}

export function calculateCashflow(input: CashflowInput): CashflowResult {
  const {
    monthlyRent,
    vacancyRate,
    monthlyCharges,
    annualPropertyTax,
    monthlyLoanPayment,
    annualTaxes = 0,
  } = input;
  const collectedRent = monthlyRent * (1 - vacancyRate);
  const monthlyOutflows = monthlyCharges + annualPropertyTax / 12 + monthlyLoanPayment;
  const beforeTax = collectedRent - monthlyOutflows;
  return { collectedRent, monthlyOutflows, beforeTax, afterTax: beforeTax - annualTaxes / 12 };
}
