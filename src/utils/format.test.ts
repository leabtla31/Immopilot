import { describe, expect, it } from "vitest";

import {
  formatCompactCurrency,
  formatCurrency,
  formatDuration,
  formatNumber,
  formatPercent,
  formatSurface,
} from "./format";

// Intl output uses no-break spaces; normalise for readable assertions.
const s = (value: string) => value.replace(/ /g, " ");

describe("formatCurrency", () => {
  it("formats euros without cents by default", () => {
    expect(s(formatCurrency(172000))).toBe("172 000 €");
  });

  it("keeps cents when asked", () => {
    expect(s(formatCurrency(1234.5, { cents: true }))).toBe("1 234,50 €");
  });

  it("signs positive values when asked", () => {
    expect(s(formatCurrency(320, { signed: true }))).toBe("+320 €");
    expect(s(formatCurrency(-320, { signed: true }))).toBe("-320 €");
    expect(s(formatCurrency(0, { signed: true }))).toBe("0 €");
  });
});

describe("formatCompactCurrency", () => {
  it.each([
    [1_250_000, "1,25 M€"],
    [12_400_000, "12,4 M€"],
    [84_000, "84 k€"],
    [4_500, "4,5 k€"],
    [950, "950 €"],
    [-84_000, "-84 k€"],
  ])("%d → %s", (value, expected) => {
    expect(s(formatCompactCurrency(value))).toBe(expected);
  });
});

describe("formatPercent", () => {
  it("formats fractions as percentages", () => {
    expect(s(formatPercent(0.0335, { digits: 2 }))).toBe("3,35 %");
    expect(s(formatPercent(0.05))).toBe("5 %");
  });

  it("supports explicit signs", () => {
    expect(s(formatPercent(0.084, { signed: true }))).toBe("+8,4 %");
  });
});

describe("formatNumber / formatSurface", () => {
  it("groups thousands", () => {
    expect(s(formatNumber(1234567))).toBe("1 234 567");
  });

  it("formats surfaces", () => {
    expect(s(formatSurface(44))).toBe("44 m²");
    expect(s(formatSurface(44.5))).toBe("44,5 m²");
  });
});

describe("formatDuration", () => {
  it.each([
    [0, "0 mois"],
    [5, "5 mois"],
    [12, "1 an"],
    [18, "1 an et 6 mois"],
    [300, "25 ans"],
    [-3, "0 mois"],
  ])("%d months → %s", (months, expected) => {
    expect(s(formatDuration(months))).toBe(expected);
  });
});
