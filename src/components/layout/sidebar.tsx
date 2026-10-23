"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Kbd } from "@/components/ui/kbd";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { spring } from "@/config/motion";
import { navigation, settingsNavItem, type NavItem } from "@/config/navigation";
import { useUiStore } from "@/store/ui-store-provider";
import { cn } from "@/utils/cn";

import { Logo } from "./logo";

function isActive(pathname: string, item: NavItem) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <SimpleTooltip label={item.label} side="right" disabled={!collapsed}>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group/link relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none",
          "transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-ring/40",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          collapsed && "justify-center px-0",
        )}
      >
        {active ? (
          <motion.span
            layoutId="sidebar-active"
            transition={spring.smooth}
            className="absolute inset-0 rounded-xl border border-border bg-surface-strong shadow-sm"
          />
        ) : (
          <span className="absolute inset-0 rounded-xl bg-secondary opacity-0 transition-opacity duration-200 group-hover/link:opacity-100" />
        )}
        <Icon
          strokeWidth={1.75}
          className={cn(
            "relative z-10 size-[18px] shrink-0 transition-transform duration-300 ease-out-expo group-hover/link:scale-110",
            active && "text-violet",
          )}
        />
        {collapsed ? null : <span className="relative z-10 truncate">{item.label}</span>}
      </Link>
    </SimpleTooltip>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);

  return (
    <aside
      aria-label="Navigation principale"
      data-collapsed={collapsed}
      className={cn(
        "fixed inset-y-3 left-3 z-40 hidden flex-col rounded-3xl border border-border glass shadow-card lg:flex",
        "transition-[width] duration-300 ease-out-expo",
        collapsed ? "w-(--sidebar-width-collapsed)" : "w-(--sidebar-width)",
      )}
    >
      <div className={cn("flex h-16 items-center px-5", collapsed && "justify-center px-0")}>
        <Link
          href="/dashboard"
          aria-label="ImmoPilot, accueil"
          className="rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
        >
          <Logo collapsed={collapsed} />
        </Link>
      </div>

      <div className={cn("px-3 pb-2", collapsed && "flex justify-center")}>
        <SimpleTooltip label="Rechercher" side="right" disabled={!collapsed}>
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Rechercher ou lancer une commande"
            className={cn(
              "flex h-10 w-full items-center gap-2.5 rounded-xl border border-border bg-surface-sunken px-3 text-sm text-muted-foreground",
              "transition-[border-color,background-color,color] duration-200 hover:border-border-strong hover:text-foreground",
              "focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none",
              collapsed && "size-10 justify-center px-0",
            )}
          >
            <Search className="size-4 shrink-0" strokeWidth={1.75} />
            {collapsed ? null : (
              <>
                <span>Rechercher</span>
                <Kbd className="ml-auto">⌘K</Kbd>
              </>
            )}
          </button>
        </SimpleTooltip>
      </div>

      <nav className="scrollbar-none flex-1 overflow-y-auto px-3 py-2">
        {navigation.map((group) => (
          <div key={group.id} className="mb-5 last:mb-0">
            <AnimatePresence initial={false}>
              {collapsed ? (
                <div className="mx-auto mb-2 h-px w-6 bg-border" />
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1.5 px-3 text-xs font-medium text-faint-foreground"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <SidebarLink
                    item={item}
                    active={isActive(pathname, item)}
                    collapsed={collapsed}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-border p-3">
        <SidebarLink
          item={settingsNavItem}
          active={isActive(pathname, settingsNavItem)}
          collapsed={collapsed}
        />
        <SimpleTooltip
          label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
          side="right"
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
            aria-expanded={!collapsed}
            className={cn(
              "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground",
              "transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-[18px]" strokeWidth={1.75} />
            ) : (
              <>
                <PanelLeftClose className="size-[18px]" strokeWidth={1.75} />
                <span>Replier</span>
                <Kbd className="ml-auto">[</Kbd>
              </>
            )}
          </button>
        </SimpleTooltip>
      </div>
    </aside>
  );
}
