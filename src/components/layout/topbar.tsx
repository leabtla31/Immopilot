"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { findNavItem, navigation, utilityPageTitles } from "@/config/navigation";
import { useUiStore } from "@/store/ui-store-provider";
import type { UserSummary } from "@/types";
import { cn } from "@/utils/cn";

import { LogoMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/** Context bar: where am I (section › page), global search, theme and account. */
export function Topbar({ user }: { user: UserSummary }) {
  const pathname = usePathname();
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 8));

  const item = findNavItem(pathname);
  const group = navigation.find((g) => g.items.some((i) => i.id === item?.id));

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-b border-border glass" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-(--topbar-height) max-w-(--content-max-width) items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/dashboard" aria-label="ImmoPilot, accueil" className="lg:hidden">
          <LogoMark />
        </Link>

        <nav aria-label="Fil d'Ariane" className="min-w-0 flex-1">
          <motion.ol
            key={pathname}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm"
          >
            {group ? (
              <li className="hidden text-muted-foreground sm:block">
                {group.label}
                <span aria-hidden className="ml-2 text-faint-foreground">
                  /
                </span>
              </li>
            ) : null}
            <li aria-current="page" className="truncate font-medium">
              {item?.label ?? utilityPageTitles[pathname] ?? "ImmoPilot"}
            </li>
          </motion.ol>
        </nav>

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className={cn(
            "hidden h-10 w-64 items-center gap-2.5 rounded-full border border-border bg-surface px-4 text-sm whitespace-nowrap text-muted-foreground shadow-xs md:flex lg:hidden",
            "transition-[border-color,color,box-shadow] duration-200 hover:border-border-strong hover:text-foreground hover:shadow-sm",
            "focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none",
          )}
        >
          <Search className="size-4" strokeWidth={1.75} />
          <span>Rechercher, naviguer…</span>
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Rechercher"
            onClick={() => setCommandOpen(true)}
          >
            <Search strokeWidth={1.75} />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Ouvrir la navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu strokeWidth={1.75} />
          </Button>
          <div className="ml-1.5 hidden sm:block">
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
