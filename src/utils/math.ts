/** Clamp `value` into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Round to `decimals` places, avoiding binary floating-point artefacts (1.005 → 1.01). */
export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Ratio `value / target` clamped to [0, 1]; 0 when target is not positive. */
export function progressRatio(value: number, target: number): number {
  if (target <= 0) return 0;
  return clamp(value / target, 0, 1);
}

/** Sum of a numeric projection over a list. */
export function sumBy<T>(items: readonly T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0);
}
