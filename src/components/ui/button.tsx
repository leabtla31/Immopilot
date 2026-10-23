import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none",
    "transition-[transform,box-shadow,background-color,color,border-color,opacity] duration-200 ease-out-quint",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.14),var(--shadow-sm)]",
          "hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.14),var(--shadow-md)]",
        ],
        secondary: [
          "border border-border glass text-foreground shadow-card",
          "hover:-translate-y-px hover:border-border-strong hover:bg-surface-strong hover:shadow-card-hover",
        ],
        accent: [
          "text-white",
          "bg-[linear-gradient(135deg,var(--violet),color-mix(in_oklch,var(--violet)_55%,var(--blue)))]",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_8px_20px_-8px_color-mix(in_oklch,var(--violet)_60%,transparent)]",
          "hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_12px_28px_-8px_color-mix(in_oklch,var(--violet)_70%,transparent)]",
        ],
        soft: "bg-violet-soft text-violet hover:bg-[color-mix(in_oklch,var(--violet)_16%,transparent)]",
        ghost: "text-foreground-secondary hover:bg-secondary hover:text-foreground",
        outline: "border border-border-strong text-foreground hover:bg-secondary",
        danger: "bg-rose-soft text-rose hover:bg-[color-mix(in_oklch,var(--rose)_16%,transparent)]",
        link: "h-auto rounded-md px-0 text-foreground underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px]",
        md: "h-10 px-4.5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        icon: "size-10",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render the child element instead (e.g. a Next `<Link>`). */
  asChild?: boolean;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Spinner className="size-4" aria-hidden /> : null}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
