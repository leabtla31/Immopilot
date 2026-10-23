import type { Route } from "next";

import {
  calculateFreedom,
  calculateTimeline,
  type AcquisitionOutcome,
  type PlannedAcquisition,
  type TimelineInput,
  type TimelineResult,
} from "@/lib/finance";
import type { Goal, Listing } from "@/types";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/utils/format";

/**
 * Deterministic insight engine. Each rule inspects the projection, may
 * re-run it with one lever changed, and reports a quantified recommendation.
 * The AI advisor (sprint 7) narrates these facts — it never invents numbers.
 */

export type InsightSeverity = "critical" | "opportunity" | "info";

export interface Insight {
  id: string;
  severity: InsightSeverity;
  title: string;
  body: string;
  /** Headline number backing the insight. */
  metric?: { label: string; value: string };
  action: { label: string; href: Route };
}

export interface InsightContext {
  input: TimelineInput;
  result: TimelineResult;
  goals: readonly Goal[];
  listings: readonly Listing[];
  /** Year the projection is evaluated at (for "net worth at horizon" comparisons). */
  horizonYear: number;
}

const severityRank: Record<InsightSeverity, number> = { critical: 0, opportunity: 1, info: 2 };

function netWorthAt(result: TimelineResult, year: number): number {
  return result.years.find((y) => y.year === year)?.netWorth ?? result.years.at(-1)?.netWorth ?? 0;
}

function debtRatioBreach({ input, result }: InsightContext): Insight | null {
  const breach = result.acquisitions.find((a) => a.debtRatio > input.assumptions.maxDebtRatio);
  if (!breach) return null;
  const cap = formatPercent(input.assumptions.maxDebtRatio, { digits: 0 });
  return {
    id: `debt-ratio-${breach.id}`,
    severity: "critical",
    title: `${breach.label} ${breach.year} : endettement à ${formatPercent(breach.debtRatio, { digits: 0 })}`,
    body: `Ce projet dépasserait le plafond bancaire de ${cap}. Ramené à ${formatCompactCurrency(
      roundDown(breach.maxAffordablePrice),
    )} (ou avec un apport plus élevé), il reste finançable sans dérogation.`,
    metric: {
      label: "Budget finançable",
      value: formatCurrency(roundDown(breach.maxAffordablePrice)),
    },
    action: { label: "Ajuster la simulation", href: "/simulation" },
  };
}

function roundDown(value: number, step = 5_000): number {
  return Math.floor(value / step) * step;
}

/** If savings already cover the next purchase, quantify buying it one year earlier. */
function anticipateNextPurchase({ input, result, horizonYear }: InsightContext): Insight | null {
  const next = [...input.acquisitions]
    .filter((a) => a.year > input.startYear + 1)
    .sort((a, b) => a.year - b.year)[0];
  if (!next) return null;
  const earlierYear = next.year - 1;
  const opening = result.years.find((y) => y.year === earlierYear);
  if (!opening) return null;

  const variant = calculateTimeline({
    ...input,
    acquisitions: input.acquisitions.map(
      (a): PlannedAcquisition => (a.id === next.id ? { ...a, year: earlierYear } : a),
    ),
  });
  const outcome = variant.acquisitions.find((a) => a.id === next.id);
  const gain = netWorthAt(variant, horizonYear) - netWorthAt(result, horizonYear);
  if (!outcome?.feasible || gain <= 1_000) return null;

  return {
    id: `anticipate-${next.id}`,
    severity: "opportunity",
    title: `Anticiper « ${next.label} » en ${earlierYear}`,
    body: `Votre épargne couvre déjà l'apport. Acheter un an plus tôt ajoute ${formatCompactCurrency(
      gain,
    )} à votre patrimoine en ${horizonYear}, grâce à un an de revalorisation et de loyers supplémentaires.`,
    metric: { label: `Patrimoine ${horizonYear}`, value: `+${formatCompactCurrency(gain)}` },
    action: { label: "Voir la roadmap", href: "/roadmap" },
  };
}

/** Surface the best-scored listing that fits the next rental budget. */
function matchingListing({ input, listings }: InsightContext): Insight | null {
  const next = input.acquisitions.find((a) => a.usage === "RENTAL" && a.year >= input.startYear);
  if (!next) return null;
  const candidate = [...listings]
    .filter((l) => l.aiScore !== null && l.price <= next.price * 1.05 && l.status !== "ARCHIVED")
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))[0];
  if (!candidate) return null;
  const grossYield = (candidate.estimatedRent * 12) / candidate.price;
  return {
    id: `listing-${candidate.id}`,
    severity: "opportunity",
    title: `Une annonce colle à votre ${next.label.toLowerCase()}`,
    body: `« ${candidate.title} » à ${formatCompactCurrency(candidate.price)} : rendement brut de ${formatPercent(
      grossYield,
    )} et score IA de ${candidate.aiScore}/100.`,
    metric: { label: "Score IA", value: `${candidate.aiScore}/100` },
    action: { label: "Analyser l'annonce", href: "/annonces" },
  };
}

function freedomGap({ result, goals }: InsightContext): Insight | null {
  const goal = goals.find((g) => g.kind === "FINANCIAL_FREEDOM");
  if (!goal?.targetYear) return null;
  const freedom = calculateFreedom(result.years);
  if (freedom.year !== null && freedom.year <= goal.targetYear) return null;
  const firstRental = result.acquisitions.find((a) => a.usage === "RENTAL");
  return {
    id: "freedom-gap",
    severity: "info",
    title: freedom.year
      ? `Liberté financière projetée en ${freedom.year}`
      : "Liberté financière hors de l'horizon",
    body: firstRental
      ? `Vos mensualités locatives absorbent les loyers jusqu'au remboursement des crédits. Viser des biens à cash-flow positif ou rembourser par anticipation rapprocherait l'objectif ${goal.targetYear}.`
      : `Sans revenus locatifs, seuls vos placements financent votre liberté. Un premier investissement locatif accélérerait l'objectif ${goal.targetYear}.`,
    metric: { label: "Objectif", value: String(goal.targetYear) },
    action: { label: "Comparer les stratégies", href: "/comparateur" },
  };
}

const rules = [debtRatioBreach, anticipateNextPurchase, matchingListing, freedomGap];

export function generateInsights(context: InsightContext): Insight[] {
  return rules
    .map((rule) => rule(context))
    .filter((insight): insight is Insight => insight !== null)
    .sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}

export type { AcquisitionOutcome };
