import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Insight, InsightSeverity } from "@/lib/insights";
import { cn } from "@/utils/cn";

const severityDot: Record<InsightSeverity, string> = {
  critical: "bg-amber",
  opportunity: "bg-green",
  info: "bg-blue",
};

const severityLabel: Record<InsightSeverity, string> = {
  critical: "À traiter",
  opportunity: "Opportunité",
  info: "À savoir",
};

/** "Suggestion IA": the top insight, plus the next ones in compact form. */
export function InsightCard({ insights }: { insights: Insight[] }) {
  const [primary, ...others] = insights;
  if (!primary) return null;

  return (
    <Card className="relative h-full overflow-hidden">
      {/* Soft violet aura — the only coloured surface on the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(closest-side,var(--violet-soft),transparent)] blur-2xl"
      />
      <div className="relative flex h-full flex-col gap-6 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <span className="grid size-7 place-items-center rounded-lg bg-[linear-gradient(135deg,var(--violet),color-mix(in_oklch,var(--violet)_55%,var(--blue)))] text-white shadow-[0_4px_12px_-4px_var(--violet)]">
              <Sparkles className="size-3.5" />
            </span>
            Suggestion IA
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span
              aria-hidden
              className={cn("size-1.5 rounded-full", severityDot[primary.severity])}
            />
            {severityLabel[primary.severity]}
          </span>
        </div>

        <div className="space-y-2.5">
          <h2 className="text-xl font-semibold tracking-tight text-balance">{primary.title}</h2>
          <p className="max-w-prose text-[15px] leading-7 text-muted-foreground">{primary.body}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {primary.metric ? (
            <div className="rounded-2xl border border-border bg-surface-sunken px-4 py-2.5">
              <p className="text-xs text-muted-foreground">{primary.metric.label}</p>
              <p className="text-base font-semibold tabular">{primary.metric.value}</p>
            </div>
          ) : null}
          <Button asChild className="ml-auto">
            <Link href={primary.action.href}>
              {primary.action.label} <ArrowRight />
            </Link>
          </Button>
        </div>

        {others.length > 0 ? (
          <ul className="mt-auto divide-y divide-border border-t border-border">
            {others.slice(0, 3).map((insight) => (
              <li key={insight.id}>
                <Link
                  href={insight.action.href}
                  className="group/insight -mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-secondary"
                >
                  <span
                    aria-hidden
                    className={cn("size-1.5 shrink-0 rounded-full", severityDot[insight.severity])}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">{insight.title}</span>
                  {insight.metric ? (
                    <span className="shrink-0 text-xs font-medium text-muted-foreground tabular">
                      {insight.metric.value}
                    </span>
                  ) : null}
                  <ArrowRight className="size-4 shrink-0 text-faint-foreground transition-transform group-hover/insight:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Card>
  );
}
