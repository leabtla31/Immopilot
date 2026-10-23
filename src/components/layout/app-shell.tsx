"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useUiStore } from "@/store/ui-store-provider";
import type { UserSummary } from "@/types";
import { cn } from "@/utils/cn";

import { CommandMenu } from "./command-menu";
import { MobileNavDrawer, MobileTabBar } from "./mobile-nav";
import { Topbar } from "./topbar";

/**
 * Application frame: floating glass sidebar (desktop), context top bar,
 * floating tab bar (mobile) and global command palette.
 * Server Components are passed through `children` untouched.
 */
export function AppShell({
  user,
  demo = false,
  children,
}: {
  user: UserSummary;
  /** Running on the bundled demo workspace (no database). */
  demo?: boolean;
  children: React.ReactNode;
}) {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
      >
        Aller au contenu
      </a>
      <Sidebar />
      <div
        className={cn(
          "min-h-dvh transition-[padding] duration-300 ease-out-expo",
          collapsed
            ? "lg:pl-[calc(var(--sidebar-width-collapsed)+0.75rem)]"
            : "lg:pl-[calc(var(--sidebar-width)+0.75rem)]",
        )}
      >
        <Topbar user={user} demo={demo} />
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-(--content-max-width) px-4 pt-4 pb-32 outline-none sm:px-6 lg:px-10 lg:pb-16"
        >
          {children}
        </main>
      </div>
      <MobileTabBar />
      <MobileNavDrawer />
      <CommandMenu />
    </>
  );
}
