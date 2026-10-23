import type { Goal } from "@/types";

import type { TimelineYear } from "./timeline";

export interface FreedomResult {
  /** First projected year where passive income covers living costs, or null. */
  year: number | null;
  /** Today's freedom income / living costs. */
  currentRatio: number;
  /** Today's freedom income (cash available without working), per month. */
  currentFreedomIncome: number;
  currentLivingCosts: number;
  /** Years from the first row to freedom, or null. */
  yearsToFreedom: number | null;
}

/**
 * Financial freedom: the cash produced without working (rental cash-flow after
 * loans + sustainable withdrawal on investments) covers monthly living costs.
 */
export function calculateFreedom(years: readonly TimelineYear[]): FreedomResult {
  const first = years[0];
  if (!first) {
    return {
      year: null,
      currentRatio: 0,
      currentFreedomIncome: 0,
      currentLivingCosts: 0,
      yearsToFreedom: null,
    };
  }
  const reached = years.find((row) => row.freedomRatio >= 1);
  return {
    year: reached?.year ?? null,
    currentRatio: first.freedomRatio,
    currentFreedomIncome: first.monthlyFreedomIncome,
    currentLivingCosts: first.monthlyLivingCosts,
    yearsToFreedom: reached ? reached.year - first.year : null,
  };
}

export interface GoalProgress {
  goal: Goal;
  /** Value of the tracked metric at the evaluated year. */
  current: number;
  /** current / target, clamped to [0, 1]. */
  ratio: number;
  /** First projected year the goal is met, or null within the horizon. */
  reachedYear: number | null;
  /** True when the goal is met no later than its target year. */
  onTrack: boolean;
}

function metric(goal: Goal, row: TimelineYear): number {
  switch (goal.kind) {
    case "NET_WORTH":
      return row.netWorth;
    case "PASSIVE_INCOME":
      return row.monthlyPassiveIncome;
    case "FINANCIAL_FREEDOM":
      return row.monthlyFreedomIncome;
  }
}

function isMet(goal: Goal, row: TimelineYear): boolean {
  if (goal.kind === "FINANCIAL_FREEDOM") return row.freedomRatio >= 1;
  return metric(goal, row) >= goal.targetAmount;
}

/** Progress of each goal at `year` (defaults to the first row) and the year it is met. */
export function calculateGoalsProgress(
  goals: readonly Goal[],
  years: readonly TimelineYear[],
  year?: number,
): GoalProgress[] {
  const row = (year === undefined ? years[0] : years.find((y) => y.year === year)) ?? years[0];
  if (!row) return [];
  return goals.map((goal) => {
    const current = metric(goal, row);
    const target = goal.kind === "FINANCIAL_FREEDOM" ? row.monthlyLivingCosts : goal.targetAmount;
    const reachedYear = years.find((y) => isMet(goal, y))?.year ?? null;
    return {
      goal,
      current,
      ratio: target > 0 ? Math.min(1, Math.max(0, current / target)) : 0,
      reachedYear,
      onTrack: reachedYear !== null && (goal.targetYear === null || reachedYear <= goal.targetYear),
    };
  });
}
