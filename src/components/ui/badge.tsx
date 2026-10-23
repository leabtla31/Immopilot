import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-foreground-secondary",
        violet: "bg-violet-soft text-violet",
        blue: "bg-blue-soft text-blue",
        green: "bg-green-soft text-green",
        amber: "bg-amber-soft text-[color-mix(in_oklch,var(--amber)_75%,var(--foreground))]",
        rose: "bg-rose-soft text-rose",
        outline: "border border-border-strong text-foreground-secondary",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  /** Leading status dot. */
  dot?: boolean;
}

function Badge({ className, tone, dot = false, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
