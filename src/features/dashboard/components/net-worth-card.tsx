import { Info } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { formatCompactCurrency, formatPercent } from "@/utils/format";

import { NetWorthChartLazy as NetWorthChart } from "./net-worth-chart-lazy";
import type { DashboardModel } from "../lib/build-dashboard";

function trajectoryBadge({ target }: DashboardModel) {
  if (target.reachedYear === null) return <Badge tone="amber">Objectif hors horizon</Badge>;
  if (target.onTrack)
    return (
      <Badge tone="green" dot>
        Dans les temps · {target.reachedYear}
      </Badge>
    );
  return <Badge tone="amber">Atteint en {target.reachedYear}</Badge>;
}

/** Hero: today's net worth, progress to the target, projected trajectory. */
export function NetWorthCard({ model }: { model: DashboardModel }) {
  const milestones = Object.fromEntries(
    model.roadmap.flatMap((m) =>
      m.outcome ? [[m.year, `${m.title} · ${formatCompactCurrency(m.outcome.price)}`]] : [],
    ),
  );
  const in10 = model.projection.find((y) => y.year === model.startYear + 10);

  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="flex flex-col gap-7 py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              Patrimoine net actuel
              <SimpleTooltip label="Épargne et placements, plus la valeur de vos biens, moins le capital restant dû.">
                <button
                  type="button"
                  aria-label="Définition du patrimoine net"
                  className="rounded-full text-faint-foreground hover:text-foreground"
                >
                  <Info className="size-3.5" />
                </button>
              </SimpleTooltip>
            </div>
            <AnimatedNumber
              value={model.today.netWorth}
              format="currency"
              className="block text-5xl font-semibold tracking-[-0.04em] sm:text-6xl"
            />
            <div className="flex flex-wrap items-center gap-2">
              {trajectoryBadge(model)}
              {in10 ? (
                <span className="text-[13px] text-muted-foreground">
                  {formatCompactCurrency(in10.netWorth)} projetés en {in10.year}
                </span>
              ) : null}
            </div>
          </div>

          <div className="w-full space-y-2.5 lg:max-w-72">
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="text-muted-foreground">
                Objectif{" "}
                <span className="font-medium text-foreground">
                  {formatCompactCurrency(model.target.amount)}
                </span>
                {model.target.year ? ` · ${model.target.year}` : ""}
              </span>
              <span className="font-semibold tabular">
                {formatPercent(model.target.ratio, { digits: 0 })}
              </span>
            </div>
            <Progress
              value={model.target.ratio}
              label="Progression vers l'objectif de patrimoine"
            />
          </div>
        </div>

        <NetWorthChart
          projection={model.projection}
          target={model.target.amount}
          milestones={milestones}
        />
      </CardContent>
    </Card>
  );
}
