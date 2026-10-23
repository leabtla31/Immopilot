"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { spring } from "@/config/motion";
import { cn } from "@/utils/cn";
import { clamp } from "@/utils/math";

export type GaugeTone = "violet" | "blue" | "green" | "amber" | "rose" | "neutral";

const toneStroke: Record<GaugeTone, string> = {
  violet: "var(--violet)",
  blue: "var(--blue)",
  green: "var(--green)",
  amber: "var(--amber)",
  rose: "var(--rose)",
  neutral: "var(--foreground)",
};

export interface GaugeProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Ratio between 0 and 1. */
  value: number;
  /** Accessible label, e.g. "Progression vers le premier million". */
  label: string;
  size?: number;
  thickness?: number;
  tone?: GaugeTone;
  /** Arc span in degrees: 360 for a ring, 270 for an Apple-Watch style gauge. */
  arc?: 360 | 270;
  children?: React.ReactNode;
}

/** Radial progress gauge with a soft glow and a spring-animated arc. */
function Gauge({
  value,
  label,
  size = 120,
  thickness = 10,
  tone = "violet",
  arc = 270,
  className,
  children,
  ...props
}: GaugeProps) {
  const ratio = clamp(value, 0, 1);
  const reduceMotion = useReducedMotion();
  const gradientId = React.useId();
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (arc / 360) * circumference;
  const rotation = arc === 360 ? -90 : 135;
  const stroke = toneStroke[tone];

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`color-mix(in oklch, ${stroke} 60%, var(--blue))`} />
            <stop offset="100%" stopColor={stroke} />
          </linearGradient>
        </defs>
        <g transform={`rotate(${rotation} ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: reduceMotion ? arcLength * (1 - ratio) : arcLength }}
            animate={{ strokeDashoffset: arcLength * (1 - ratio) }}
            transition={{ ...spring.gentle, delay: 0.15 }}
            style={{
              filter: `drop-shadow(0 2px 6px color-mix(in oklch, ${stroke} 35%, transparent))`,
            }}
          />
        </g>
      </svg>
      <div className="relative flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

export { Gauge };
