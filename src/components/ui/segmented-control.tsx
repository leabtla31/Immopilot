"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { spring } from "@/config/motion";
import { cn } from "@/utils/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * iOS-style segmented control with a spring-animated selection pill.
 * Implements the WAI-ARIA radio group pattern (arrow keys move the selection).
 */
function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  label,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  const layoutId = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + options.length) % options.length;
    const option = options[next];
    if (!option) return;
    onValueChange(option.value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-sunken p-1",
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap",
              "transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none",
              "[&_svg]:size-4",
              size === "sm" ? "h-7 px-3 text-[13px]" : "h-8 px-3.5 text-sm",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                transition={spring.snappy}
                className="absolute inset-0 rounded-full border border-border bg-surface-strong shadow-sm"
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };
