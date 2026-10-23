import { ArrowRight, Check, Flag } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { cn } from "@/utils/cn";
import { formatCompactCurrency, formatCurrency } from "@/utils/format";

import type { NextStep } from "../lib/build-dashboard";

export function NextStepCard({ step }: { step: NextStep }) {
  const { milestone, checklist } = step;
  const done = checklist.filter((item) => item.done).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <IconTile icon={Flag} tone="green" />
          <div>
            <CardDescription>Prochaine étape · {milestone.year}</CardDescription>
            <CardTitle className="text-lg">{milestone.title}</CardTitle>
          </div>
        </div>
        <CardAction>
          <Badge tone="neutral" className="tabular">
            {done}/{checklist.length}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">{milestone.description}</p>
        {milestone.outcome ? (
          <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-sunken p-3.5 text-center">
            <div>
              <dt className="text-xs text-muted-foreground">Budget</dt>
              <dd className="text-sm font-semibold tabular">
                {formatCompactCurrency(milestone.outcome.price)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Apport</dt>
              <dd className="text-sm font-semibold tabular">
                {formatCompactCurrency(milestone.outcome.contribution)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Mensualité</dt>
              <dd className="text-sm font-semibold tabular">
                {formatCurrency(milestone.outcome.monthlyPayment)}
              </dd>
            </div>
          </dl>
        ) : null}
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                  item.done ? "border-transparent bg-green text-white" : "border-border-strong",
                )}
              >
                {item.done ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {item.label}
                  <span className="sr-only">{item.done ? " — fait" : " — à faire"}</span>
                </p>
                <p className="truncate text-[13px] text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" asChild className="w-full">
          <Link href={step.action.href}>
            {step.action.label} <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
