export const siteConfig = {
  name: "ImmoPilot",
  tagline: "Le copilote IA pour construire son patrimoine immobilier.",
  description:
    "ImmoPilot vous aide à décider entre résidence principale, investissement locatif ou les deux — simulations, quartiers, annonces et conseiller IA.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "fr-FR",
  currency: "EUR",
  /** First and last year reachable by the Vision mode slider. */
  vision: { startYear: 2026, endYear: 2045 },
} as const;

export type SiteConfig = typeof siteConfig;
