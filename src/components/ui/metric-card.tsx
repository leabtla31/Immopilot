import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

import { AnimatedNumber, type NumberFormatPreset } from "./animated-number";
import { Card } from "./card";
import { IconTile } from "./icon-tile";

export interface MetricCardProps {
  icon: LucideIcon;
  tone?: "neutral" | "violet" | "blue" | "green" | "amber" | "rose";
  label: string;
  /** Numeric value (animated) or a pre-rendered node. */
  value: number | React.ReactNode;
  format?: NumberFormatPreset;
  /** Top-right slot (badge, trend). */
  badge?: React.ReactNode;
  /** Bottom content: hint, progress bar… */
  footer?: React.ReactNode;
  className?: string;
}

/** KPI card: icon, label, big number, context. The building block of every overview. */
export function MetricCard({
  icon,
  tone = "neutral",
  label,
  value,
  format = "currency",
  badge,
  footer,
  className,
}: MetricCardProps) {
  return (
    <Card interactive className={cn("h-full gap-5 p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <IconTile icon={icon} tone={tone} />
        {badge}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-[28px] leading-9 font-semibold tracking-[-0.025em]">
          {typeof value === "number" ? <AnimatedNumber value={value} format={format} /> : value}
        </p>
      </div>
      {footer ? (
        <div className="mt-auto text-[13px] leading-5 text-muted-foreground">{footer}</div>
      ) : null}
    </Card>
  );
}
