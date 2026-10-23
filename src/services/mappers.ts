import type * as Db from "@prisma/client";

import type {
  FinancialProfile,
  Goal,
  HouseholdMember,
  Listing,
  Milestone,
  Neighborhood,
  Property,
  SimulationAssumptions,
  UserSummary,
} from "@/types";

/**
 * Prisma → DTO mappers. Decimals become numbers, Dates become ISO strings, so
 * every DTO is safe to pass to Client Components.
 */
type Decimalish = Db.Prisma.Decimal | number;

const num = (value: Decimalish): number => (typeof value === "number" ? value : value.toNumber());
const numOrNull = (value: Decimalish | null): number | null => (value === null ? null : num(value));

export function toUserSummary(user: Db.User): UserSummary {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
  };
}

export function toHouseholdMember(member: Db.HouseholdMember): HouseholdMember {
  return {
    id: member.id,
    firstName: member.firstName,
    netMonthlyIncome: num(member.netMonthlyIncome),
    position: member.position,
  };
}

/** Household income is derived from its members, the single source of truth. */
export function toFinancialProfile(
  profile: Db.FinancialProfile,
  household: readonly HouseholdMember[],
): FinancialProfile {
  return {
    birthYear: profile.birthYear,
    householdSize: profile.householdSize,
    city: profile.city,
    netMonthlyIncome: household.reduce((sum, member) => sum + member.netMonthlyIncome, 0),
    otherMonthlyIncome: num(profile.otherMonthlyIncome),
    monthlyExpenses: num(profile.monthlyExpenses),
    currentRent: num(profile.currentRent),
    existingMonthlyDebt: num(profile.existingMonthlyDebt),
    cashSavings: num(profile.cashSavings),
    downPayment: num(profile.downPayment),
    financialAssets: num(profile.financialAssets),
    monthlySavings: num(profile.monthlySavings),
    marginalTaxRate: num(profile.marginalTaxRate),
  };
}

export function toAssumptions(assumptions: Db.SimulationAssumptions): SimulationAssumptions {
  return {
    loanRate: num(assumptions.loanRate),
    loanDurationYears: assumptions.loanDurationYears,
    insuranceRate: num(assumptions.insuranceRate),
    notaryFeesRate: num(assumptions.notaryFeesRate),
    maxDebtRatio: num(assumptions.maxDebtRatio),
    inflationRate: num(assumptions.inflationRate),
    salaryGrowthRate: num(assumptions.salaryGrowthRate),
    rentalVacancyRate: num(assumptions.rentalVacancyRate),
    propertyAppreciationRate: num(assumptions.propertyAppreciationRate),
    rentGrowthRate: num(assumptions.rentGrowthRate),
    savingsYieldRate: num(assumptions.savingsYieldRate),
  };
}

export function toProperty(property: Db.Property & { loan: Db.Loan | null }): Property {
  return {
    id: property.id,
    name: property.name,
    neighborhoodId: property.neighborhoodId,
    usage: property.usage,
    rentalRegime: property.rentalRegime,
    purchasePrice: num(property.purchasePrice),
    purchaseDate: property.purchaseDate.toISOString(),
    notaryFees: num(property.notaryFees),
    worksAmount: num(property.worksAmount),
    surface: num(property.surface),
    currentValue: num(property.currentValue),
    monthlyRent: num(property.monthlyRent),
    monthlyCharges: num(property.monthlyCharges),
    propertyTax: num(property.propertyTax),
    energyClass: property.energyClass,
    loan: property.loan
      ? {
          principal: num(property.loan.principal),
          annualRate: num(property.loan.annualRate),
          insuranceRate: num(property.loan.insuranceRate),
          durationMonths: property.loan.durationMonths,
          startDate: property.loan.startDate.toISOString(),
        }
      : null,
  };
}

export function toGoal(goal: Db.Goal): Goal {
  return {
    id: goal.id,
    kind: goal.kind,
    label: goal.label,
    targetAmount: num(goal.targetAmount),
    targetYear: goal.targetYear,
    position: goal.position,
  };
}

export function toMilestone(milestone: Db.Milestone): Milestone {
  return {
    id: milestone.id,
    year: milestone.year,
    title: milestone.title,
    description: milestone.description,
    kind: milestone.kind,
    status: milestone.status,
    budget: numOrNull(milestone.budget),
  };
}

export function toNeighborhood(neighborhood: Db.Neighborhood): Neighborhood {
  return {
    id: neighborhood.id,
    slug: neighborhood.slug,
    name: neighborhood.name,
    city: neighborhood.city,
    latitude: neighborhood.latitude,
    longitude: neighborhood.longitude,
    globalScore: neighborhood.globalScore,
    pricePerSqm: neighborhood.pricePerSqm,
    priceTrend5y: num(neighborhood.priceTrend5y),
    rentPerSqm: num(neighborhood.rentPerSqm),
    appreciationPotential: neighborhood.appreciationPotential,
    rentalDemand: neighborhood.rentalDemand,
    familyScore: neighborhood.familyScore,
    studentScore: neighborhood.studentScore,
    youngProfessionalScore: neighborhood.youngProfessionalScore,
    lineC: neighborhood.lineC,
    metroDistanceMeters: neighborhood.metroDistanceMeters,
    metroStation: neighborhood.metroStation,
    aiSummary: neighborhood.aiSummary,
    aiStrengths: neighborhood.aiStrengths,
    aiWatchouts: neighborhood.aiWatchouts,
  };
}

export function toListing(listing: Db.Listing): Listing {
  return {
    id: listing.id,
    neighborhoodId: listing.neighborhoodId,
    title: listing.title,
    sourceUrl: listing.sourceUrl,
    imageUrl: listing.imageUrl,
    price: num(listing.price),
    surface: num(listing.surface),
    rooms: listing.rooms,
    floor: listing.floor,
    energyClass: listing.energyClass,
    monthlyCharges: num(listing.monthlyCharges),
    propertyTax: num(listing.propertyTax),
    worksEstimate: num(listing.worksEstimate),
    estimatedRent: num(listing.estimatedRent),
    status: listing.status,
    aiScore: listing.aiScore,
    negotiationRate: numOrNull(listing.negotiationRate),
    aiSummary: listing.aiSummary,
  };
}
