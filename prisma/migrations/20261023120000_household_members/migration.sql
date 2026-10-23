-- Household income moves from FinancialProfile to HouseholdMember rows
-- (one per earner). Existing incomes are preserved as a single member
-- named after the account owner before the column is dropped.

-- CreateTable
CREATE TABLE "HouseholdMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "netMonthlyIncome" DECIMAL(12,2) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HouseholdMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HouseholdMember_userId_idx" ON "HouseholdMember"("userId");

-- AddForeignKey
ALTER TABLE "HouseholdMember" ADD CONSTRAINT "HouseholdMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill
INSERT INTO "HouseholdMember" ("id", "userId", "firstName", "netMonthlyIncome", "position")
SELECT 'hm_' || md5(fp."userId"), fp."userId", u."firstName", fp."netMonthlyIncome", 0
FROM "FinancialProfile" fp
JOIN "User" u ON u."id" = fp."userId";

-- AlterTable
ALTER TABLE "FinancialProfile" DROP COLUMN "netMonthlyIncome";
