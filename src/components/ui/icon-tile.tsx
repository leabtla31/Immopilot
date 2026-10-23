import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

const iconTileVariants = cva(
  "inline-grid shrink-0 place-items-center rounded-xl border border-border shadow-[inset_0_1px_0_var(--highlight)]",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-foreground-secondary",
        violet: "bg-violet-soft text-violet",
        blue: "bg-blue-soft text-blue",
        green: "bg-green-soft text-green",
        amber: "bg-amber-soft text-amber",
        rose: "bg-rose-soft text-rose",
      },
      size: {
        sm: "size-8 [&_svg]:size-4",
        md: "size-10 [&_svg]:size-[18px]",
        lg: "size-12 rounded-2xl [&_svg]:size-5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export interface IconTileProps extends VariantProps<typeof iconTileVariants> {
  icon: LucideIcon;
  className?: string;
}

/** Consistent container for every Lucide icon used as a visual anchor. */
function IconTile({ icon: Icon, tone, size, className }: IconTileProps) {
  return (
    <span aria-hidden className={cn(iconTileVariants({ tone, size }), className)}>
      <Icon strokeWidth={1.75} />
    </span>
  );
}

export { IconTile, iconTileVariants };
