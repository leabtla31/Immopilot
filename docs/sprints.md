# Plan de livraison

| Sprint | Périmètre                                                                                              | Statut   |
| ------ | ------------------------------------------------------------------------------------------------------ | -------- |
| 1      | Architecture, outillage, design system, shell applicatif, Prisma + seed                                | ✅ Livré |
| 2      | Dashboard + cœur du moteur financier + moteur d'insights                                               | ✅ Livré |
| 3      | Simulation : formulaire d'hypothèses, 3 scénarios côte à côte, TRI, score d'investissement, paramètres | À venir  |
| 4      | Graphiques avancés (dette, cash-flow, loyers), Roadmap / timeline, **Mode Vision 2026 → 2045**         | À venir  |
| 5      | Quartiers : carte MapLibre de Toulouse, 10 quartiers notés, ligne C                                    | À venir  |
| 6      | Annonces : analyse d'un bien, composant de score, négociation ; Portefeuille                           | À venir  |
| 7      | Conseiller IA : interface conversationnelle ancrée sur le simulateur                                   | À venir  |
| 8      | Optimisations : performance, accessibilité, e-mails, SEO, monitoring                                   | À venir  |

## Sprint 1 — Architecture

- Next.js 15 / React 19 / TypeScript strict (`noUncheckedIndexedAccess`), routes typées.
- Design system complet : tokens, 25+ composants (boutons, cartes, champs, select, slider, switch, tabs animés, contrôle segmenté, dialog, drawer, popover, menu, tooltip, toast, tableau, skeleton, spinner, jauge, score, tendance, métrique…).
- Shell : sidebar verre flottante repliable (état persistant en cookie, sans flash), topbar contextuelle, tab bar mobile, palette ⌘K, raccourcis clavier, mode clair/sombre/système, lien d'évitement.
- Prisma : 11 modèles, migration initiale, seed idempotent (persona Léa, 10 quartiers, 6 annonces, jalons, objectifs).
- Qualité : ESLint (règle interdisant la logique métier dans `components/ui`), Prettier, Husky, CI GitHub Actions avec Postgres, Vitest, Playwright desktop + mobile, Storybook avec addon a11y.

## Sprint 2 — Dashboard

- Moteur financier (crédit, capacité HCSF, patrimoine, fiscalité, rentabilité, cash-flow, projection, liberté financière, objectifs) — 98 % de couverture.
- Moteur d'insights : alerte d'endettement avec budget finançable, anticipation d'achat chiffrée, annonce compatible, écart à la liberté financière.
- Dashboard : patrimoine net animé, objectif et progression, trajectoire 2026 → 2045 avec jalons et ligne d'objectif, 4 jauges d'objectifs, capacité d'emprunt, apport, cash, liberté financière, suggestion IA, prochaine étape avec checklist, feuille de route.
- Foyer : co-emprunteurs (`HouseholdMember`) — Léa 2 800 € + Arno 2 600 € ; le revenu du foyer est dérivé des membres (migration avec reprise des données existantes).
- Performance : graphique chargé après l'interactivité (−100 kB JS initial), CLS 0, LCP ≈ 150 ms en local.
