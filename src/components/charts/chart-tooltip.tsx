import { cn } from "@/utils/cn";

/** Glass tooltip surface used by every chart. */
export function ChartTooltipCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-52 rounded-2xl border border-border glass-strong px-4 py-3 shadow-float",
        "animate-in duration-150 fade-in-0 zoom-in-[0.98]",
        className,
      )}
    >
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold">{title}</span>
        {subtitle ? <span className="text-xs text-muted-foreground">{subtitle}</span> : null}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export function ChartTooltipRow({
  color,
  label,
  value,
  emphasis = false,
}: {
  color: string;
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 text-[13px]">
      <span className="flex items-center gap-2 text-muted-foreground">
        <span aria-hidden className="size-2 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span
        className={cn(
          "tabular",
          emphasis ? "font-semibold text-foreground" : "font-medium text-foreground-secondary",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function ChartLegendItem({
  color,
  label,
  dashed = false,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
      <span
        aria-hidden
        className={cn(
          "h-0.5 w-3.5 rounded-full",
          dashed && "border-t-2 border-dashed bg-transparent",
        )}
        style={dashed ? { borderColor: color } : { background: color }}
      />
      {label}
    </span>
  );
}
