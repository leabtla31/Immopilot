import { Banknote, Landmark, PiggyBank, Sunrise } from "lucide-react";

import { RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { Progress } from "@/components/ui/progress";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/utils/format";

import type { DashboardModel } from "../lib/build-dashboard";

export function KpiGrid({ model }: { model: DashboardModel }) {
  const { capacity, today, freedom, household } = model;
  const notaryCoverage = today.downPayment / 0.075;
  const precautionRatio = today.cash > 0 ? today.emergencyFund / today.cash : 0;

  const cards = [
    <MetricCard
      key="capacity"
      icon={Landmark}
      tone="violet"
      label="Capacité d'emprunt"
      value={Math.floor(capacity.maxLoan / 100) * 100}
      footer={
        <div className="space-y-1">
          <p>
            Mensualité max{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(capacity.maxMonthlyPayment)}
            </span>{" "}
            · {capacity.durationYears} ans à {formatPercent(capacity.annualRate, { digits: 2 })}
          </p>
          {household.length > 1 ? (
            <p>
              {household.map((member, index) => (
                <span key={member.id}>
                  {index > 0 ? " · " : null}
                  {member.firstName}{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(member.netMonthlyIncome)}
                  </span>
                </span>
              ))}
            </p>
          ) : null}
        </div>
      }
    />,
    <MetricCard
      key="down-payment"
      icon={PiggyBank}
      tone="blue"
      label="Apport mobilisable"
      value={today.downPayment}
      footer={
        <>
          Couvre les frais de notaire jusqu&apos;à{" "}
          <span className="font-medium text-foreground">
            {formatCompactCurrency(notaryCoverage)}
          </span>{" "}
          d&apos;achat
        </>
      }
    />,
    <MetricCard
      key="cash"
      icon={Banknote}
      tone="green"
      label="Cash disponible"
      value={today.cash}
      footer={
        <div className="space-y-2">
          <Progress
            value={precautionRatio}
            tone="green"
            size="sm"
            label="Part d'épargne de précaution"
          />
          <p>
            dont{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(today.emergencyFund)}
            </span>{" "}
            d&apos;épargne de précaution
          </p>
        </div>
      }
    />,
    <MetricCard
      key="freedom"
      icon={Sunrise}
      tone="amber"
      label="Liberté financière"
      value={freedom.year ? String(freedom.year) : "—"}
      badge={
        freedom.targetYear ? <Badge tone="neutral">Objectif {freedom.targetYear}</Badge> : undefined
      }
      footer={
        <div className="space-y-2">
          <Progress
            value={freedom.currentRatio}
            tone="amber"
            size="sm"
            label="Dépenses couvertes par vos revenus passifs"
          />
          <p>
            <span className="font-medium text-foreground">
              {formatPercent(freedom.currentRatio, { digits: 0 })}
            </span>{" "}
            de vos dépenses couvertes sans travailler
          </p>
        </div>
      }
    />,
  ];

  return cards.map((card) => (
    <RevealItem key={card.key} className="xl:col-span-3">
      {card}
    </RevealItem>
  ));
}
