"use client";

import { useId, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

import { axisProps, chartColors, seriesAnimation } from "@/components/charts/chart-theme";
import {
  ChartLegendItem,
  ChartTooltipCard,
  ChartTooltipRow,
} from "@/components/charts/chart-tooltip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { TimelineYear } from "@/lib/finance";
import { formatCompactCurrency, formatCurrency } from "@/utils/format";

type Range = "5" | "10" | "all";

const ranges = [
  { value: "5", label: "5 ans" },
  { value: "10", label: "10 ans" },
  { value: "all", label: "2045" },
] as const;

interface Point {
  year: number;
  age: number;
  netWorth: number;
  debt: number;
  grossAssets: number;
  passive: number;
  milestone?: string;
}

export interface NetWorthChartProps {
  projection: TimelineYear[];
  target: number;
  /** year → milestone title, for markers and tooltips. */
  milestones: Record<number, string>;
}

function NetWorthTooltip({ active, payload }: TooltipContentProps<number, string>) {
  const point = payload?.[0]?.payload as Point | undefined;
  if (!active || !point) return null;
  return (
    <ChartTooltipCard title={point.year} subtitle={`${point.age} ans`}>
      {point.milestone ? (
        <p className="mb-2 rounded-lg bg-violet-soft px-2 py-1 text-xs font-medium text-violet">
          {point.milestone}
        </p>
      ) : null}
      <ChartTooltipRow
        color={chartColors.netWorth}
        label="Patrimoine net"
        value={formatCurrency(point.netWorth)}
        emphasis
      />
      <ChartTooltipRow
        color={chartColors.reference}
        label="Patrimoine brut"
        value={formatCurrency(point.grossAssets)}
      />
      <ChartTooltipRow color={chartColors.debt} label="Dette" value={formatCurrency(point.debt)} />
      <ChartTooltipRow
        color={chartColors.income}
        label="Revenus passifs"
        value={`${formatCurrency(point.passive)}/mois`}
      />
    </ChartTooltipCard>
  );
}

/** Net worth trajectory with debt, target line and milestone markers. */
export function NetWorthChart({ projection, target, milestones }: NetWorthChartProps) {
  const [range, setRange] = useState<Range>("all");
  const gradientId = useId();
  const debtGradientId = useId();

  const data = useMemo<Point[]>(() => {
    const first = projection[0]?.year ?? 0;
    const limit = range === "all" ? Number.POSITIVE_INFINITY : first + Number(range);
    return projection
      .filter((row) => row.year <= limit)
      .map((row) => ({
        year: row.year,
        age: row.age,
        netWorth: Math.round(row.netWorth),
        debt: Math.round(row.debt),
        grossAssets: Math.round(row.grossAssets),
        passive: Math.round(row.monthlyPassiveIncome),
        milestone: milestones[row.year],
      }));
  }, [projection, range, milestones]);

  const maxValue = Math.max(...data.map((d) => Math.max(d.grossAssets, d.netWorth)));
  const showTarget = target <= maxValue * 1.15;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <ChartLegendItem color={chartColors.netWorth} label="Patrimoine net" />
          <ChartLegendItem color={chartColors.reference} label="Patrimoine brut" dashed />
          <ChartLegendItem color={chartColors.debt} label="Dette" />
        </div>
        <SegmentedControl
          label="Horizon du graphique"
          size="sm"
          options={ranges}
          value={range}
          onValueChange={setRange}
        />
      </div>

      <div
        className="-mx-2 h-[260px] sm:h-[300px]"
        role="img"
        aria-label="Projection du patrimoine net, de la dette et du patrimoine brut par année"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.netWorth} stopOpacity={0.32} />
                <stop offset="100%" stopColor={chartColors.netWorth} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={debtGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.debt} stopOpacity={0.16} />
                <stop offset="100%" stopColor={chartColors.debt} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis dataKey="year" {...axisProps} interval="preserveStartEnd" minTickGap={24} />
            <YAxis
              {...axisProps}
              width={64}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
              domain={[0, "auto"]}
            />
            <Tooltip
              content={NetWorthTooltip}
              cursor={{ stroke: "var(--border-strong)", strokeWidth: 1, strokeDasharray: "4 4" }}
              wrapperStyle={{ outline: "none" }}
            />
            {showTarget ? (
              <ReferenceLine
                y={target}
                stroke={chartColors.reference}
                strokeDasharray="4 6"
                strokeOpacity={0.6}
                label={{
                  value: `Objectif ${formatCompactCurrency(target)}`,
                  position: "insideTopLeft",
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
            ) : null}
            <Area
              type="monotone"
              dataKey="debt"
              stroke={chartColors.debt}
              strokeWidth={1.5}
              fill={`url(#${debtGradientId})`}
              {...seriesAnimation}
            />
            <Line
              type="monotone"
              dataKey="grossAssets"
              stroke={chartColors.reference}
              strokeWidth={1.5}
              strokeDasharray="3 5"
              dot={false}
              activeDot={false}
              {...seriesAnimation}
            />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke={chartColors.netWorth}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              activeDot={{
                r: 5,
                strokeWidth: 3,
                stroke: "var(--surface-strong)",
                fill: chartColors.netWorth,
              }}
              {...seriesAnimation}
            />
            {data
              .filter((d) => d.milestone)
              .map((d) => (
                <ReferenceDot
                  key={d.year}
                  x={d.year}
                  y={d.netWorth}
                  r={4}
                  fill="var(--surface-strong)"
                  stroke={chartColors.netWorth}
                  strokeWidth={2}
                  ifOverflow="extendDomain"
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
