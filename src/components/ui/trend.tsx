import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/utils/cn";
import { formatCurrency, formatPercent } from "@/utils/format";

export interface TrendProps {
  value: number;
  format?: "percent" | "currency";
  /** When true, a negative delta is good (e.g. debt going down). */
  invert?: boolean;
  className?: string;
}

/** Signed delta pill: +4,2 % ↗. Tone reflects whether the move is favourable. */
function Trend({ value, format = "percent", invert = false, className }: TrendProps) {
  const favourable = invert ? value < 0 : value > 0;
  const neutral = value === 0;
  const Icon = neutral ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight;
  const text =
    format === "percent"
      ? formatPercent(value, { signed: true })
      : formatCurrency(value, { signed: true });

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-0.5 rounded-full pr-2 pl-1.5 text-xs font-medium tabular",
        neutral
          ? "bg-secondary text-muted-foreground"
          : favourable
            ? "bg-green-soft text-green"
            : "bg-rose-soft text-rose",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {text}
    </span>
  );
}

export { Trend };
