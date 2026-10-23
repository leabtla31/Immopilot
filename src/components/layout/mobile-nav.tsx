"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { spring } from "@/config/motion";
import { allNavItems, navigation, settingsNavItem } from "@/config/navigation";
import { useUiStore } from "@/store/ui-store-provider";
import { cn } from "@/utils/cn";

const tabItems = allNavItems.filter((item) => item.primary);

/** iOS-style floating tab bar for the five most used destinations. */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation rapide"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between rounded-full border border-border glass-strong p-1.5 shadow-float">
        {tabItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.id} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-xs font-medium",
                  "transition-colors duration-200 outline-none focus-visible:ring-4 focus-visible:ring-ring/40 active:scale-95",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="tabbar-active"
                    transition={spring.smooth}
                    className="absolute inset-0 rounded-full bg-secondary"
                  />
                ) : null}
                <Icon
                  strokeWidth={1.75}
                  className={cn("relative z-10 size-5", active && "text-violet")}
                />
                <span className="relative z-10 max-w-full truncate px-1">
                  {item.label.replace(" IA", "")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Full navigation in a bottom sheet (opened from the mobile top bar). */
export function MobileNavDrawer() {
  const pathname = usePathname();
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Toutes les sections d&apos;ImmoPilot.</DrawerDescription>
        </DrawerHeader>
        <nav className="overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {[...navigation, { id: "account", label: "Compte", items: [settingsNavItem] }].map(
            (group) => (
              <div key={group.id} className="mb-4">
                <p className="mb-1.5 px-3 text-xs font-medium text-faint-foreground">
                  {group.label}
                </p>
                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
                            active ? "bg-secondary" : "hover:bg-secondary",
                          )}
                        >
                          <Icon
                            strokeWidth={1.75}
                            className={cn("size-5 text-muted-foreground", active && "text-violet")}
                          />
                          <span className="flex flex-col">
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
          )}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
