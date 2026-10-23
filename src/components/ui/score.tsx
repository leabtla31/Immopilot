import { cn } from "@/utils/cn";

import { Gauge, type GaugeTone } from "./gauge";

export interface ScoreProps {
  /** Score from 0 to 100. */
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { box: 44, thickness: 4, text: "text-[13px]" },
  md: { box: 64, thickness: 6, text: "text-lg" },
  lg: { box: 112, thickness: 9, text: "text-3xl" },
} as const;

/** Qualitative band of a 0–100 score, shared by every scored entity. */
export function scoreBand(value: number): { tone: GaugeTone; label: string } {
  if (value >= 85) return { tone: "green", label: "Excellent" };
  if (value >= 75) return { tone: "violet", label: "Très bon" };
  if (value >= 60) return { tone: "blue", label: "Correct" };
  if (value >= 45) return { tone: "amber", label: "Moyen" };
  return { tone: "rose", label: "Faible" };
}

/** Circular 0–100 score (quartiers, annonces, stratégies). */
function Score({ value, label = "Score", size = "md", className }: ScoreProps) {
  const band = scoreBand(value);
  const spec = sizes[size];
  return (
    <Gauge
      value={value / 100}
      label={`${label} : ${value} sur 100, ${band.label.toLowerCase()}`}
      size={spec.box}
      thickness={spec.thickness}
      tone={band.tone}
      arc={360}
      className={className}
    >
      <span className={cn("font-semibold tracking-tight tabular", spec.text)}>{value}</span>
      {size === "lg" ? (
        <span className="text-xs font-medium text-muted-foreground">{band.label}</span>
      ) : null}
    </Gauge>
  );
}

export { Score };
