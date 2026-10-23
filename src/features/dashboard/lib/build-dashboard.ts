import type { Route } from "next";

import { siteConfig } from "@/config/site";
import {
  acquisitionsFromMilestones,
  calculateCapacity,
  calculateFreedom,
  calculateGoalsProgress,
  calculateNetWorth,
  calculateTimeline,
  type AcquisitionOutcome,
  type CapacityResult,
  type FreedomResult,
  type GoalProgress,
  type TimelineInput,
  type TimelineYear,
} from "@/lib/finance";
import { generateInsights, type Insight } from "@/lib/insights";
import type { HouseholdMember, Listing, Milestone, WealthSnapshot } from "@/types";

/**
 * Pure composition of everything the dashboard renders. No I/O, no React:
 * unit-testable with fixtures and safe to run on the server.
 */

/** Freedom is often reached after the visible horizon: search further. */
const FREEDOM_SEARCH_END_YEAR = 2065;

export interface ChecklistItem {
  label: string;
  detail: string;
  done: boolean;
}

export interface NextStep {
  milestone: RoadmapItem;
  checklist: ChecklistItem[];
  action: { label: string; href: Route };
}

export interface RoadmapItem extends Milestone {
  outcome: AcquisitionOutcome | null;
}

export interface DashboardModel {
  firstName: string;
  /** Earners whose incomes back the borrowing capacity. */
  household: HouseholdMember[];
  startYear: number;
  endYear: number;
  today: {
    netWorth: number;
    grossAssets: number;
    cash: number;
    financialAssets: number;
    downPayment: number;
    monthlySavings: number;
    emergencyFund: number;
  };
  target: {
    amount: number;
    year: number | null;
    ratio: number;
    reachedYear: number | null;
    onTrack: boolean;
  };
  capacity: CapacityResult & { durationYears: number; annualRate: number };
  freedom: FreedomResult & { targetYear: number | null };
  goals: GoalProgress[];
  /** One row per year, startYear → endYear. */
  projection: TimelineYear[];
  roadmap: RoadmapItem[];
  insights: Insight[];
  nextStep: NextStep | null;
}

export function buildDashboard(
  snapshot: WealthSnapshot,
  listings: readonly Listing[],
): DashboardModel {
  const { profile, assumptions, goals, milestones } = snapshot;
  const { startYear, endYear } = siteConfig.vision;

  const input: TimelineInput = {
    startYear,
    endYear: FREEDOM_SEARCH_END_YEAR,
    profile,
    assumptions,
    acquisitions: acquisitionsFromMilestones(milestones),
  };
  const result = calculateTimeline(input);
  const projection = result.years.filter((y) => y.year <= endYear);

  const today = calculateNetWorth({
    cash: profile.cashSavings,
    financialAssets: profile.financialAssets,
    properties: snapshot.properties.map((p) => ({
      marketValue: p.currentValue,
      remainingCapital: p.loan?.principal ?? 0,
    })),
  });

  const capacity = calculateCapacity({
    monthlyIncome: profile.netMonthlyIncome + profile.otherMonthlyIncome,
    monthlyRentalIncome: snapshot.properties.reduce((sum, p) => sum + p.monthlyRent, 0),
    existingMonthlyDebt: profile.existingMonthlyDebt,
    maxDebtRatio: assumptions.maxDebtRatio,
    annualRate: assumptions.loanRate,
    durationYears: assumptions.loanDurationYears,
    insuranceRate: assumptions.insuranceRate,
    downPayment: profile.downPayment,
    notaryFeesRate: assumptions.notaryFeesRate,
  });

  const goalsProgress = calculateGoalsProgress(goals, result.years);
  const netWorthGoal = goalsProgress.find((g) => g.goal.kind === "NET_WORTH");
  const freedomGoal = goals.find((g) => g.kind === "FINANCIAL_FREEDOM");

  const outcomes = new Map(result.acquisitions.map((a) => [a.id, a]));
  const roadmap = milestones.map((m) => ({ ...m, outcome: outcomes.get(m.id) ?? null }));

  const emergencyFund = 6 * (profile.monthlyExpenses + profile.currentRent);

  return {
    firstName: snapshot.user.firstName,
    household: snapshot.household,
    startYear,
    endYear,
    today: {
      netWorth: today.netWorth,
      grossAssets: today.grossAssets,
      cash: profile.cashSavings,
      financialAssets: profile.financialAssets,
      downPayment: profile.downPayment,
      monthlySavings: profile.monthlySavings,
      emergencyFund,
    },
    target: {
      amount: netWorthGoal?.goal.targetAmount ?? 1_000_000,
      year: netWorthGoal?.goal.targetYear ?? null,
      ratio: netWorthGoal?.ratio ?? 0,
      reachedYear: netWorthGoal?.reachedYear ?? null,
      onTrack: netWorthGoal?.onTrack ?? false,
    },
    capacity: {
      ...capacity,
      durationYears: assumptions.loanDurationYears,
      annualRate: assumptions.loanRate,
    },
    freedom: { ...calculateFreedom(result.years), targetYear: freedomGoal?.targetYear ?? null },
    goals: goalsProgress,
    projection,
    roadmap,
    insights: generateInsights({ input, result, goals, listings, horizonYear: endYear }),
    nextStep: buildNextStep(roadmap, listings, capacity, profile.downPayment),
  };
}

function buildNextStep(
  roadmap: RoadmapItem[],
  listings: readonly Listing[],
  capacity: CapacityResult,
  downPayment: number,
): NextStep | null {
  const milestone = roadmap.find((m) => m.status !== "DONE");
  if (!milestone) return null;
  const { outcome } = milestone;

  if (!outcome) {
    return {
      milestone,
      checklist: [],
      action: { label: "Voir la roadmap", href: "/roadmap" },
    };
  }

  const candidate = [...listings]
    .filter((l) => l.price <= outcome.price * 1.05 && l.status !== "ARCHIVED")
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))[0];

  const checklist: ChecklistItem[] = [
    {
      label: "Capacité d'emprunt",
      detail:
        outcome.loanAmount <= capacity.maxLoan
          ? "Le prêt nécessaire tient dans votre capacité"
          : "Prêt supérieur à votre capacité actuelle",
      done: outcome.loanAmount <= capacity.maxLoan,
    },
    {
      label: "Apport",
      detail:
        outcome.contribution <= downPayment
          ? "Frais de notaire couverts par votre apport"
          : "Apport à compléter",
      done: outcome.contribution <= downPayment,
    },
    {
      label: "Bien identifié",
      detail: candidate
        ? `${candidate.title} · score ${candidate.aiScore ?? "—"}`
        : "Aucune annonce dans ce budget",
      done: candidate?.status === "FAVORITE",
    },
    {
      label: "Accord de principe bancaire",
      detail: "À obtenir avant de faire une offre",
      done: false,
    },
  ];

  return {
    milestone,
    checklist,
    action: { label: "Analyser les annonces", href: "/annonces" },
  };
}
