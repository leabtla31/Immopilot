import { describe, expect, it } from "vitest";

import { allNavItems, findNavItem, getNavItem } from "./navigation";

describe("navigation config", () => {
  it("exposes the nine sections of the product", () => {
    expect(allNavItems.map((item) => item.label)).toEqual([
      "Dashboard",
      "Portefeuille",
      "Roadmap",
      "Simulation",
      "Comparateur",
      "Quartiers",
      "Annonces",
      "Conseiller IA",
      "Paramètres",
    ]);
  });

  it("has unique ids, hrefs and shortcuts", () => {
    for (const key of ["id", "href", "shortcut"] as const) {
      const values = allNavItems.map((item) => item[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("resolves nested paths to their section", () => {
    expect(findNavItem("/annonces/123")?.id).toBe("listings");
    expect(findNavItem("/unknown")).toBeUndefined();
  });

  it("throws on unknown ids", () => {
    expect(() => getNavItem("nope")).toThrow(/Unknown navigation item/);
  });
});
