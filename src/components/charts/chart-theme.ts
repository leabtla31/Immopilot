/**
 * Shared Recharts styling. Colours are CSS variables so charts follow the
 * theme without re-rendering.
 */
export const chartColors = {
  netWorth: "var(--chart-1)",
  debt: "var(--chart-2)",
  income: "var(--chart-3)",
  interest: "var(--chart-4)",
  reference: "var(--chart-5)",
  grid: "var(--chart-grid)",
} as const;

export const axisTick = {
  fill: "var(--muted-foreground)",
  fontSize: 12,
  fontWeight: 500,
} as const;

export const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: axisTick,
  tickMargin: 10,
} as const;

/** Entrance animation shared by every series. */
export const seriesAnimation = {
  isAnimationActive: true,
  animationDuration: 1100,
  animationEasing: "ease-out",
} as const;
