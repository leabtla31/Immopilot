"use client";

import { motion } from "framer-motion";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";

import { spring } from "@/config/motion";
import { cn } from "@/utils/cn";

interface TabsContextValue {
  value: string | undefined;
  layoutId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

/**
 * Radix Tabs with a shared, spring-animated active indicator. Works both
 * controlled (`value`) and uncontrolled (`defaultValue`).
 */
function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const layoutId = React.useId();

  const handleChange = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value, layoutId }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        value={value}
        onValueChange={handleChange}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-fit items-center gap-0.5 rounded-full border border-border bg-surface-sunken p-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const context = React.useContext(TabsContext);
  const active = context?.value === value;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap",
        "text-muted-foreground transition-colors duration-200 hover:text-foreground data-[state=active]:text-foreground",
        "focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {active && context ? (
        <motion.span
          layoutId={context.layoutId}
          transition={spring.snappy}
          className="absolute inset-0 rounded-full border border-border bg-surface-strong shadow-sm"
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "outline-none data-[state=active]:animate-in data-[state=active]:duration-300 data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
