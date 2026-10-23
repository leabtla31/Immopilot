import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const cardVariants = cva("relative flex flex-col rounded-2xl border text-foreground", {
  variants: {
    variant: {
      glass: "border-border glass shadow-card",
      solid: "border-border bg-surface-strong shadow-card",
      sunken: "border-transparent bg-surface-sunken",
      ghost: "border-transparent",
    },
    interactive: {
      true: [
        "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out-quint",
        "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover",
      ],
      false: "",
    },
  },
  defaultVariants: { variant: "glass", interactive: false },
});

export interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

function Card({ className, variant, interactive, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-6 pt-6 sm:px-7 sm:pt-7",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-[15px] leading-6 font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("col-start-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Top-right slot of the header (menu, badge, link). */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex-1 px-6 py-6 sm:px-7", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 px-6 pb-6 sm:px-7 sm:pb-7", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
