import { ArrowRight, Building2, Home, Sunrise, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTooltip } from "@/components/ui/tooltip";
import type { MilestoneKind } from "@/types";
import { cn } from "@/utils/cn";
import { formatCompactCurrency, formatPercent } from "@/utils/format";

import type { RoadmapItem } from "../lib/build-dashboard";

const kindIcon: Record<MilestoneKind, typeof Building2> = {
  RENTAL_PURCHASE: Building2,
  PRIMARY_PURCHASE: Home,
  FINANCIAL_FREEDOM: Sunrise,
  OTHER: Building2,
};

/** Compact horizontal timeline of the strategy (full view lives in /roadmap). */
export function RoadmapStrip({
  items,
  freedomYear,
}: {
  items: RoadmapItem[];
  freedomYear: number | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feuille de route</CardTitle>
        <CardDescription>
          Vos jalons, de votre premier achat à la liberté financière.
        </CardDescription>
        <CardAction>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Tout voir <ArrowRight className="size-4" />
          </Link>
        </CardAction>
      </CardHeader>
      <div className="scrollbar-none overflow-x-auto mask-fade-x px-6 pt-7 pb-7 sm:px-7">
        <ol className="relative flex min-w-max gap-3">
          <span
            aria-hidden
            className="absolute top-5 right-10 left-10 h-px bg-[linear-gradient(90deg,var(--violet),var(--border-strong))]"
          />
          {items.map((item) => {
            const Icon = kindIcon[item.kind];
            const flagged = item.outcome && !item.outcome.feasible;
            const current = item.status === "IN_PROGRESS";
            const projectedFreedom =
              item.kind === "FINANCIAL_FREEDOM" && freedomYear && freedomYear !== item.year;
            return (
              <li
                key={item.id}
                className="relative flex w-48 flex-col items-center gap-3 text-center"
              >
                <span
                  className={cn(
                    "relative z-10 grid size-10 place-items-center rounded-full border shadow-sm transition-transform duration-300 hover:scale-110",
                    current
                      ? "border-transparent bg-[linear-gradient(135deg,var(--violet),color-mix(in_oklch,var(--violet)_55%,var(--blue)))] text-white"
                      : "border-border bg-surface-strong text-muted-foreground",
                  )}
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                  {current ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-violet/30 [animation-duration:2.4s]"
                    />
                  ) : null}
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-muted-foreground tabular">{item.year}</p>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-[13px] text-muted-foreground tabular">
                    {item.outcome
                      ? formatCompactCurrency(item.outcome.price)
                      : projectedFreedom
                        ? `Projetée en ${freedomYear}`
                        : "Objectif"}
                  </p>
                </div>
                {flagged && item.outcome ? (
                  <SimpleTooltip
                    label={`Endettement à ${formatPercent(item.outcome.debtRatio, { digits: 0 })} — au-delà du plafond`}
                  >
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-soft px-2 py-0.5 text-xs font-medium text-[color-mix(in_oklch,var(--amber)_75%,var(--foreground))]">
                      <TriangleAlert className="size-3" aria-hidden />
                      {formatPercent(item.outcome.debtRatio, { digits: 0 })} d&apos;endettement
                    </span>
                  </SimpleTooltip>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
