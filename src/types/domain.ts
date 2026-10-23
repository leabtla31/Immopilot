/**
 * Domain DTOs shared by services, features and UI.
 *
 * These are plain serialisable objects (numbers, strings, ISO dates) so they can
 * cross the Server Component → Client Component boundary safely. Rates are
 * fractions (0.035 = 3,5 %), amounts are EUR.
 */

export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type PropertyUsage = "PRIMARY_RESIDENCE" | "RENTAL" | "SECONDARY";
export type RentalRegime = "NONE" | "LMNP_REEL" | "MICRO_BIC" | "NU_REEL" | "MICRO_FONCIER";
export type ListingStatus = "NEW" | "ANALYZED" | "FAVORITE" | "ARCHIVED";
export type GoalKind = "NET_WORTH" | "PASSIVE_INCOME" | "FINANCIAL_FREEDOM";
export type MilestoneKind = "RENTAL_PURCHASE" | "PRIMARY_PURCHASE" | "FINANCIAL_FREEDOM" | "OTHER";
export type MilestoneStatus = "PLANNED" | "IN_PROGRESS" | "DONE";
export type ScenarioKind = "PRIMARY_FIRST" | "RENTAL_FIRST" | "RENTAL_THEN_PRIMARY";

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
}

export interface HouseholdMember {
  id: string;
  firstName: string;
  netMonthlyIncome: number;
  position: number;
}

export interface FinancialProfile {
  birthYear: number;
  householdSize: number;
  city: string;
  /** Household net salaries: sum of the household members' incomes. */
  netMonthlyIncome: number;
  otherMonthlyIncome: number;
  monthlyExpenses: number;
  currentRent: number;
  existingMonthlyDebt: number;
  cashSavings: number;
  downPayment: number;
  financialAssets: number;
  monthlySavings: number;
  marginalTaxRate: number;
}

export interface SimulationAssumptions {
  loanRate: number;
  loanDurationYears: number;
  insuranceRate: number;
  notaryFeesRate: number;
  maxDebtRatio: number;
  inflationRate: number;
  salaryGrowthRate: number;
  rentalVacancyRate: number;
  propertyAppreciationRate: number;
  rentGrowthRate: number;
  savingsYieldRate: number;
}

export interface Neighborhood {
  id: string;
  slug: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  globalScore: number;
  pricePerSqm: number;
  priceTrend5y: number;
  rentPerSqm: number;
  appreciationPotential: number;
  rentalDemand: number;
  familyScore: number;
  studentScore: number;
  youngProfessionalScore: number;
  lineC: boolean;
  metroDistanceMeters: number;
  metroStation: string;
  aiSummary: string;
  aiStrengths: string[];
  aiWatchouts: string[];
}

export interface Loan {
  principal: number;
  annualRate: number;
  insuranceRate: number;
  durationMonths: number;
  startDate: string;
}

export interface Property {
  id: string;
  name: string;
  neighborhoodId: string | null;
  usage: PropertyUsage;
  rentalRegime: RentalRegime;
  purchasePrice: number;
  purchaseDate: string;
  notaryFees: number;
  worksAmount: number;
  surface: number;
  currentValue: number;
  monthlyRent: number;
  monthlyCharges: number;
  propertyTax: number;
  energyClass: EnergyClass | null;
  loan: Loan | null;
}

export interface Listing {
  id: string;
  neighborhoodId: string | null;
  title: string;
  sourceUrl: string | null;
  imageUrl: string | null;
  price: number;
  surface: number;
  rooms: number;
  floor: number | null;
  energyClass: EnergyClass;
  monthlyCharges: number;
  propertyTax: number;
  worksEstimate: number;
  estimatedRent: number;
  status: ListingStatus;
  aiScore: number | null;
  negotiationRate: number | null;
  aiSummary: string | null;
}

export interface Goal {
  id: string;
  kind: GoalKind;
  label: string;
  targetAmount: number;
  targetYear: number | null;
  position: number;
}

export interface Milestone {
  id: string;
  year: number;
  title: string;
  description: string;
  kind: MilestoneKind;
  status: MilestoneStatus;
  budget: number | null;
}

/** Everything the app needs to project a user's wealth. */
export interface WealthSnapshot {
  user: UserSummary;
  household: HouseholdMember[];
  profile: FinancialProfile;
  assumptions: SimulationAssumptions;
  properties: Property[];
  goals: Goal[];
  milestones: Milestone[];
}
