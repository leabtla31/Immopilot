"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

import { floatingAnimation } from "@/components/ui/popover";
import { cn } from "@/utils/cn";

function TooltipProvider({
  delayDuration = 250,
  skipDelayDuration = 400,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 flex max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-2 rounded-xl border border-border px-3 py-1.5",
          "glass-strong text-xs font-medium text-foreground shadow-md",
          floatingAnimation,
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/** Convenience wrapper: `<SimpleTooltip label="…"><Button/></SimpleTooltip>`. */
function SimpleTooltip({
  label,
  children,
  side,
  disabled = false,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  side?: React.ComponentProps<typeof TooltipPrimitive.Content>["side"];
  disabled?: boolean;
}) {
  if (disabled) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}

export { SimpleTooltip, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
