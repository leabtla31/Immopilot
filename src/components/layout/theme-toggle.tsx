"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { spring } from "@/config/motion";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Passer en mode clair" : "Passer en mode sombre";

  return (
    <SimpleTooltip label={label}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={spring.snappy}
            className="grid place-items-center"
          >
            {isDark ? <Moon strokeWidth={1.75} /> : <Sun strokeWidth={1.75} />}
          </motion.span>
        </AnimatePresence>
      </Button>
    </SimpleTooltip>
  );
}
