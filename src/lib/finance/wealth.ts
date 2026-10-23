/** Equity held in a property: market value minus outstanding capital. */
export function calculateEquity(marketValue: number, remainingCapital: number): number {
  return marketValue - remainingCapital;
}

export interface NetWorthInput {
  cash: number;
  financialAssets: number;
  properties: { marketValue: number; remainingCapital: number }[];
}

export interface NetWorthResult {
  realEstateValue: number;
  liquidAssets: number;
  grossAssets: number;
  debt: number;
  realEstateEquity: number;
  netWorth: number;
}

/** Net worth (patrimoine net) = everything owned − everything owed. */
export function calculateNetWorth({
  cash,
  financialAssets,
  properties,
}: NetWorthInput): NetWorthResult {
  const realEstateValue = properties.reduce((sum, p) => sum + p.marketValue, 0);
  const debt = properties.reduce((sum, p) => sum + p.remainingCapital, 0);
  const liquidAssets = cash + financialAssets;
  const grossAssets = realEstateValue + liquidAssets;
  return {
    realEstateValue,
    liquidAssets,
    grossAssets,
    debt,
    realEstateEquity: realEstateValue - debt,
    netWorth: grossAssets - debt,
  };
}
