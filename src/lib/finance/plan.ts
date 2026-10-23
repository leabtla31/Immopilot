import type { Milestone } from "@/types";

import type { PlannedAcquisition } from "./timeline";

/**
 * Default economics used to turn a roadmap milestone into a priced acquisition
 * until the user attaches a real listing to it.
 */
export const PLAN_DEFAULTS = {
  rental: {
    grossYield: 0.062,
    /** Non-recoverable charges, insurance and management, as a share of rent. */
    chargesShareOfRent: 0.1,
    /** Property tax ≈ 1.1 month of rent. */
    propertyTaxMonthsOfRent: 1.1,
  },
  primary: {
    monthlyChargesShareOfPrice: 0.0004,
    propertyTaxShareOfPrice: 0.004,
  },
} as const;

/** Convert purchase milestones into acquisitions understood by the projection engine. */
export function acquisitionsFromMilestones(milestones: readonly Milestone[]): PlannedAcquisition[] {
  return milestones.flatMap((milestone): PlannedAcquisition[] => {
    if (milestone.budget === null || milestone.budget <= 0) return [];
    const price = milestone.budget;

    if (milestone.kind === "RENTAL_PURCHASE") {
      const monthlyRent = (price * PLAN_DEFAULTS.rental.grossYield) / 12;
      return [
        {
          id: milestone.id,
          label: milestone.title,
          year: milestone.year,
          usage: "RENTAL",
          price,
          monthlyRent,
          monthlyCharges: monthlyRent * PLAN_DEFAULTS.rental.chargesShareOfRent,
          annualPropertyTax: monthlyRent * PLAN_DEFAULTS.rental.propertyTaxMonthsOfRent,
          regime: "LMNP_REEL",
        },
      ];
    }

    if (milestone.kind === "PRIMARY_PURCHASE") {
      return [
        {
          id: milestone.id,
          label: milestone.title,
          year: milestone.year,
          usage: "PRIMARY_RESIDENCE",
          price,
          monthlyCharges: price * PLAN_DEFAULTS.primary.monthlyChargesShareOfPrice,
          annualPropertyTax: price * PLAN_DEFAULTS.primary.propertyTaxShareOfPrice,
          regime: "NONE",
        },
      ];
    }

    return [];
  });
}
