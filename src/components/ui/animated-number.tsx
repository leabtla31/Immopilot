"use client";

import { animate, useMotionValue, useReducedMotion } from "framer-motion";
import * as React from "react";

import { cn } from "@/utils/cn";
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from "@/utils/format";

/**
 * Named presets rather than a formatter callback: functions cannot be passed
 * from Server Components, presets can.
 */
export type NumberFormatPreset =
  | "currency"
  | "currency-signed"
  | "compact"
  | "percent"
  | "number"
  | "decimal";

export function formatPreset(value: number, preset: NumberFormatPreset): string {
  switch (preset) {
    case "currency":
      return formatCurrency(value);
    case "currency-signed":
      return formatCurrency(value, { signed: true });
    case "compact":
      return formatCompactCurrency(value);
    case "percent":
      return formatPercent(value);
    case "decimal":
      return formatNumber(value, { maxDigits: 1 });
    case "number":
      return formatNumber(value);
  }
}

export interface AnimatedNumberProps extends Omit<React.ComponentProps<"span">, "children"> {
  value: number;
  format?: NumberFormatPreset;
  /** Animation duration in seconds. */
  duration?: number;
}

/**
 * Counts smoothly towards `value` on mount and on every change (e.g. Vision mode).
 * Updates the DOM directly through a ref to avoid a React render per frame.
 * The final value is always exposed to assistive tech.
 */
function AnimatedNumber({
  value,
  format = "number",
  duration = 1.1,
  className,
  ...props
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const finalText = formatPreset(value, format);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduceMotion) {
      node.textContent = finalText;
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = formatPreset(latest, format);
      },
    });
    return () => controls.stop();
  }, [value, format, duration, reduceMotion, motionValue, finalText]);

  return (
    <span className={cn("tabular", className)} {...props}>
      <span ref={ref} aria-hidden suppressHydrationWarning>
        {finalText}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}

export { AnimatedNumber };
