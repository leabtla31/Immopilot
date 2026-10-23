"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import * as React from "react";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryProvider } from "./query-provider";

/** Root client providers. Kept minimal: each one is justified app-wide. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <MotionConfig reducedMotion="user">
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </MotionConfig>
      </QueryProvider>
    </ThemeProvider>
  );
}
