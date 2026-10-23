"use client";

import { ArrowRight, Moon, PanelLeft, Palette, Sun } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { allNavItems, navigation, settingsNavItem } from "@/config/navigation";
import { useHotkey, useSequenceHotkeys } from "@/hooks/use-hotkeys";
import { useUiStore } from "@/store/ui-store-provider";

/** ⌘K palette + Linear-style `G then X` navigation shortcuts. */
export function CommandMenu() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  useHotkey(
    "k",
    (event) => {
      event.preventDefault();
      setOpen(!open);
    },
    { mod: true, allowInInputs: true },
  );
  useHotkey("[", toggleSidebar);

  useSequenceHotkeys(
    "g",
    Object.fromEntries(allNavItems.map((item) => [item.shortcut, () => router.push(item.href)])),
  );

  const run = useCallback(
    (action: () => void) => {
      setOpen(false);
      action();
    },
    [setOpen],
  );

  const go = (href: Route) => run(() => router.push(href));

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Palette de commandes"
      description="Recherchez une page ou lancez une action."
    >
      <CommandInput placeholder="Rechercher une page, une action…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        {[...navigation, { id: "account", label: "Compte", items: [settingsNavItem] }].map(
          (group) => (
            <CommandGroup key={group.id} heading={group.label}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.label} ${item.description}`}
                    onSelect={() => go(item.href)}
                    className="group/item"
                  >
                    <span className="grid size-8 place-items-center rounded-lg border border-border bg-surface-strong">
                      <Icon strokeWidth={1.75} className="text-muted-foreground" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      <Kbd>G</Kbd>
                      <Kbd>{item.shortcut}</Kbd>
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ),
        )}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="text-muted-foreground" />
            ) : (
              <Moon className="text-muted-foreground" />
            )}
            Basculer le thème
          </CommandItem>
          <CommandItem onSelect={() => run(toggleSidebar)}>
            <PanelLeft className="text-muted-foreground" />
            Replier / déplier la barre latérale
            <Kbd className="ml-auto">[</Kbd>
          </CommandItem>
          <CommandItem onSelect={() => go("/design-system")}>
            <Palette className="text-muted-foreground" />
            Design System
            <ArrowRight className="ml-auto text-muted-foreground" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
