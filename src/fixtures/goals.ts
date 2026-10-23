import type { Goal, Milestone } from "@/types";

export const demoGoals: Goal[] = [
  {
    id: "goal-million",
    kind: "NET_WORTH",
    label: "Premier million",
    targetAmount: 1_000_000,
    targetYear: 2040,
    position: 0,
  },
  {
    id: "goal-passive-3000",
    kind: "PASSIVE_INCOME",
    label: "3 000 €/mois passifs",
    targetAmount: 3000,
    targetYear: 2038,
    position: 1,
  },
  {
    id: "goal-passive-5000",
    kind: "PASSIVE_INCOME",
    label: "5 000 €/mois passifs",
    targetAmount: 5000,
    targetYear: 2043,
    position: 2,
  },
  {
    id: "goal-freedom",
    kind: "FINANCIAL_FREEDOM",
    label: "Liberté financière",
    // 0 = dynamic target: monthly living costs at the evaluated year.
    targetAmount: 0,
    targetYear: 2040,
    position: 3,
  },
];

export const demoMilestones: Milestone[] = [
  {
    id: "ms-2027",
    year: 2027,
    title: "Premier achat",
    description: "Studio ou T2 meublé près du métro, à Rangueil ou Montaudran.",
    kind: "RENTAL_PURCHASE",
    status: "IN_PROGRESS",
    budget: 140_000,
  },
  {
    id: "ms-2029",
    year: 2029,
    title: "Deuxième achat",
    description: "T2 à Bonnefoy, porté par l'arrivée de la ligne C.",
    kind: "RENTAL_PURCHASE",
    status: "PLANNED",
    budget: 165_000,
  },
  {
    id: "ms-2032",
    year: 2032,
    title: "Résidence principale",
    description: "T4 avec extérieur aux Minimes, proche métro B et canal du Midi.",
    kind: "PRIMARY_PURCHASE",
    status: "PLANNED",
    budget: 360_000,
  },
  {
    id: "ms-2035",
    year: 2035,
    title: "Troisième achat",
    description: "T3 en colocation à Borderouge, cash-flow positif visé.",
    kind: "RENTAL_PURCHASE",
    status: "PLANNED",
    budget: 230_000,
  },
  {
    id: "ms-2040",
    year: 2040,
    title: "Liberté financière",
    description: "Les revenus passifs couvrent l'intégralité du train de vie.",
    kind: "FINANCIAL_FREEDOM",
    status: "PLANNED",
    budget: null,
  },
];
