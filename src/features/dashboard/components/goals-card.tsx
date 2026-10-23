import { Check } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, type GaugeTone } from "@/components/ui/gauge";
import type { GoalProgress } from "@/lib/finance";
import { cn } from "@/utils/cn";
import { formatPercent } from "@/utils/format";

const tones: GaugeTone[] = ["violet", "blue", "green", "amber"];

function status({ goal, reachedYear, onTrack }: GoalProgress) {
  if (reachedYear === null) return { text: "Hors horizon", tone: "text-muted-foreground" };
  if (onTrack) return { text: `${reachedYear}`, tone: "text-green", ok: true };
  const late = goal.targetYear ? reachedYear - goal.targetYear : 0;
  return { text: `${reachedYear} · +${late} an${late > 1 ? "s" : ""}`, tone: "text-amber" };
}

/** The four long-term goals as Apple-Watch-style gauges. */
export function GoalsCard({ goals }: { goals: GoalProgress[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Objectifs</CardTitle>
        <CardDescription>Progression actuelle et année d&apos;atteinte projetée.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-7 pt-7 md:grid-cols-4 xl:grid-cols-2">
        {goals.map((progress, index) => {
          const s = status(progress);
          return (
            <div key={progress.goal.id} className="flex flex-col items-center gap-3 text-center">
              <Gauge
                value={progress.ratio}
                label={`${progress.goal.label} : ${formatPercent(progress.ratio, { digits: 0 })}`}
                size={96}
                thickness={8}
                tone={tones[index % tones.length]}
              >
                <span className="text-lg font-semibold tracking-tight tabular">
                  {formatPercent(progress.ratio, { digits: 0 })}
                </span>
              </Gauge>
              <div className="space-y-0.5">
                <p className="text-[13px] leading-5 font-medium">{progress.goal.label}</p>
                <p
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium tabular",
                    s.tone,
                  )}
                >
                  {s.ok ? <Check className="size-3" strokeWidth={3} aria-hidden /> : null}
                  {s.text}
                  {progress.goal.targetYear ? (
                    <span className="font-normal text-faint-foreground">
                      / {progress.goal.targetYear}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
