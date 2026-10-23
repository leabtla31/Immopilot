-- CreateEnum
CREATE TYPE "PropertyUsage" AS ENUM ('PRIMARY_RESIDENCE', 'RENTAL', 'SECONDARY');

-- CreateEnum
CREATE TYPE "RentalRegime" AS ENUM ('NONE', 'LMNP_REEL', 'MICRO_BIC', 'NU_REEL', 'MICRO_FONCIER');

-- CreateEnum
CREATE TYPE "EnergyClass" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('NEW', 'ANALYZED', 'FAVORITE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GoalKind" AS ENUM ('NET_WORTH', 'PASSIVE_INCOME', 'FINANCIAL_FREEDOM');

-- CreateEnum
CREATE TYPE "MilestoneKind" AS ENUM ('RENTAL_PURCHASE', 'PRIMARY_PURCHASE', 'FINANCIAL_FREEDOM', 'OTHER');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "ScenarioKind" AS ENUM ('PRIMARY_FIRST', 'RENTAL_FIRST', 'RENTAL_THEN_PRIMARY');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "householdSize" INTEGER NOT NULL DEFAULT 1,
    "city" TEXT NOT NULL,
    "netMonthlyIncome" DECIMAL(12,2) NOT NULL,
    "otherMonthlyIncome" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "monthlyExpenses" DECIMAL(12,2) NOT NULL,
    "currentRent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "existingMonthlyDebt" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cashSavings" DECIMAL(12,2) NOT NULL,
    "downPayment" DECIMAL(12,2) NOT NULL,
    "financialAssets" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "monthlySavings" DECIMAL(12,2) NOT NULL,
    "marginalTaxRate" DECIMAL(7,5) NOT NULL DEFAULT 0.30,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationAssumptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loanRate" DECIMAL(7,5) NOT NULL,
    "loanDurationYears" INTEGER NOT NULL,
    "insuranceRate" DECIMAL(7,5) NOT NULL,
    "notaryFeesRate" DECIMAL(7,5) NOT NULL,
    "maxDebtRatio" DECIMAL(7,5) NOT NULL,
    "inflationRate" DECIMAL(7,5) NOT NULL,
    "salaryGrowthRate" DECIMAL(7,5) NOT NULL,
    "rentalVacancyRate" DECIMAL(7,5) NOT NULL,
    "propertyAppreciationRate" DECIMAL(7,5) NOT NULL,
    "rentGrowthRate" DECIMAL(7,5) NOT NULL,
    "savingsYieldRate" DECIMAL(7,5) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationAssumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "globalScore" INTEGER NOT NULL,
    "pricePerSqm" INTEGER NOT NULL,
    "priceTrend5y" DECIMAL(7,5) NOT NULL,
    "rentPerSqm" DECIMAL(6,2) NOT NULL,
    "appreciationPotential" INTEGER NOT NULL,
    "rentalDemand" INTEGER NOT NULL,
    "familyScore" INTEGER NOT NULL,
    "studentScore" INTEGER NOT NULL,
    "youngProfessionalScore" INTEGER NOT NULL,
    "lineC" BOOLEAN NOT NULL DEFAULT false,
    "metroDistanceMeters" INTEGER NOT NULL,
    "metroStation" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "aiStrengths" TEXT[],
    "aiWatchouts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "neighborhoodId" TEXT,
    "name" TEXT NOT NULL,
    "usage" "PropertyUsage" NOT NULL,
    "rentalRegime" "RentalRegime" NOT NULL DEFAULT 'NONE',
    "purchasePrice" DECIMAL(12,2) NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "notaryFees" DECIMAL(12,2) NOT NULL,
    "worksAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "surface" DECIMAL(7,2) NOT NULL,
    "currentValue" DECIMAL(12,2) NOT NULL,
    "monthlyRent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "monthlyCharges" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "propertyTax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "energyClass" "EnergyClass",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "principal" DECIMAL(12,2) NOT NULL,
    "annualRate" DECIMAL(7,5) NOT NULL,
    "insuranceRate" DECIMAL(7,5) NOT NULL DEFAULT 0,
    "durationMonths" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "neighborhoodId" TEXT,
    "title" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "imageUrl" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "surface" DECIMAL(7,2) NOT NULL,
    "rooms" INTEGER NOT NULL,
    "floor" INTEGER,
    "energyClass" "EnergyClass" NOT NULL,
    "monthlyCharges" DECIMAL(12,2) NOT NULL,
    "propertyTax" DECIMAL(12,2) NOT NULL,
    "worksEstimate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estimatedRent" DECIMAL(12,2) NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'NEW',
    "aiScore" INTEGER,
    "negotiationRate" DECIMAL(7,5),
    "aiSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "GoalKind" NOT NULL,
    "label" TEXT NOT NULL,
    "targetAmount" DECIMAL(12,2) NOT NULL,
    "targetYear" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "kind" "MilestoneKind" NOT NULL,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PLANNED',
    "budget" DECIMAL(12,2),

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ScenarioKind" NOT NULL,
    "name" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProfile_userId_key" ON "FinancialProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationAssumptions_userId_key" ON "SimulationAssumptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_slug_key" ON "Neighborhood"("slug");

-- CreateIndex
CREATE INDEX "Neighborhood_city_idx" ON "Neighborhood"("city");

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "Property"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_propertyId_key" ON "Loan"("propertyId");

-- CreateIndex
CREATE INDEX "Listing_userId_status_idx" ON "Listing"("userId", "status");

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "Milestone_userId_year_idx" ON "Milestone"("userId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_userId_kind_key" ON "Scenario"("userId", "kind");

-- CreateIndex
CREATE INDEX "Conversation_userId_updatedAt_idx" ON "Conversation"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "FinancialProfile" ADD CONSTRAINT "FinancialProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationAssumptions" ADD CONSTRAINT "SimulationAssumptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
