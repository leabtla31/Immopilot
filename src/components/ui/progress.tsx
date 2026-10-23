"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import * as React from "react";

import { spring } from "@/config/motion";
import { cn } from "@/utils/cn";
import { clamp } from "@/utils/math";

const indicatorVariants = cva("absolute inset-y-0 left-0 rounded-full", {
  variants: {
    tone: {
      violet:
        "bg-[linear-gradient(90deg,color-mix(in_oklch,var(--violet)_65%,var(--blue)),var(--violet))]",
      blue: "bg-blue",
      green: "bg-green",
      amber: "bg-amber",
      neutral: "bg-foreground",
    },
  },
  defaultVariants: { tone: "violet" },
});

export interface ProgressProps
  extends Omit<React.ComponentProps<"div">, "children">, VariantProps<typeof indicatorVariants> {
  /** Value between 0 and 1. */
  value: number;
  /** Accessible label. */
  label: string;
  size?: "sm" | "md";
}

function Progress({ value, label, tone, size = "md", className, ...props }: ProgressProps) {
  const ratio = clamp(value, 0, 1);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(ratio * 100)}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        size === "sm" ? "h-1.5" : "h-2",
        className,
      )}
      {...props}
    >
      <motion.div
        className={indicatorVariants({ tone })}
        initial={{ width: 0 }}
        animate={{ width: `${ratio * 100}%` }}
        transition={spring.gentle}
      />
    </div>
  );
}

export { Progress };
