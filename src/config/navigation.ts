import {
  Building2,
  Columns3,
  LayoutGrid,
  MapPinned,
  Milestone,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  WalletMinimal,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";

export interface NavItem {
  id: string;
  label: string;
  href: Route;
  icon: LucideIcon;
  /** One-line context shown in the command menu and page headers. */
  description: string;
  /** Second key of the `G then X` navigation shortcut. */
  shortcut: string;
  /** Shown in the mobile tab bar. */
  primary?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    id: "pilot",
    label: "Pilotage",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutGrid,
        description: "Votre patrimoine et vos prochaines étapes en un coup d'œil.",
        shortcut: "D",
        primary: true,
      },
      {
        id: "portfolio",
        label: "Portefeuille",
        href: "/portefeuille",
        icon: WalletMinimal,
        description: "Vos biens, vos crédits et vos actifs financiers.",
        shortcut: "P",
      },
      {
        id: "roadmap",
        label: "Roadmap",
        href: "/roadmap",
        icon: Milestone,
        description: "Les jalons de votre stratégie jusqu'à la liberté financière.",
        shortcut: "R",
      },
    ],
  },
  {
    id: "analyze",
    label: "Analyse",
    items: [
      {
        id: "simulation",
        label: "Simulation",
        href: "/simulation",
        icon: SlidersHorizontal,
        description: "Projetez votre patrimoine selon vos hypothèses.",
        shortcut: "S",
        primary: true,
      },
      {
        id: "compare",
        label: "Comparateur",
        href: "/comparateur",
        icon: Columns3,
        description: "Résidence principale, locatif ou les deux : comparez côte à côte.",
        shortcut: "C",
      },
    ],
  },
  {
    id: "market",
    label: "Marché",
    items: [
      {
        id: "neighborhoods",
        label: "Quartiers",
        href: "/quartiers",
        icon: MapPinned,
        description: "La carte des quartiers de Toulouse, notés par l'IA.",
        shortcut: "Q",
        primary: true,
      },
      {
        id: "listings",
        label: "Annonces",
        href: "/annonces",
        icon: Building2,
        description: "Analysez une annonce : rentabilité, cash-flow, score IA.",
        shortcut: "A",
        primary: true,
      },
    ],
  },
  {
    id: "ai",
    label: "Intelligence",
    items: [
      {
        id: "advisor",
        label: "Conseiller IA",
        href: "/conseiller",
        icon: Sparkles,
        description: "Posez vos questions, l'IA répond avec vos propres chiffres.",
        shortcut: "I",
        primary: true,
      },
    ],
  },
];

export const settingsNavItem: NavItem = {
  id: "settings",
  label: "Paramètres",
  href: "/parametres",
  icon: Settings2,
  description: "Profil financier, hypothèses et préférences.",
  shortcut: ",",
};

export const allNavItems: NavItem[] = [
  ...navigation.flatMap((group) => group.items),
  settingsNavItem,
];

/** Pages reachable outside the main navigation (command menu, links). */
export const utilityPageTitles: Record<string, string> = {
  "/design-system": "Design System",
};

/** Resolve the nav item matching a pathname (exact or nested). */
export function findNavItem(pathname: string): NavItem | undefined {
  return allNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

/** Resolve a nav item by id; throws on typos so misconfiguration fails at build time. */
export function getNavItem(id: string): NavItem {
  const item = allNavItems.find((navItem) => navItem.id === id);
  if (!item) throw new Error(`Unknown navigation item "${id}"`);
  return item;
}
