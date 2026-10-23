/**
 * Locale-aware formatters (fr-FR). Formatter instances are cached because
 * `Intl.NumberFormat` construction is comparatively expensive and these run
 * on every animation frame of animated numbers.
 */

const LOCALE = "fr-FR";
const cache = new Map<string, Intl.NumberFormat>();

function formatter(key: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  let instance = cache.get(key);
  if (!instance) {
    instance = new Intl.NumberFormat(LOCALE, options);
    cache.set(key, instance);
  }
  return instance;
}

/** Replace the narrow/regular no-break spaces Intl emits with a single regular NBSP. */
function normalizeSpaces(value: string): string {
  return value.replace(/[  ]/g, " ");
}

export interface CurrencyOptions {
  /** Show cents. Defaults to false. */
  cents?: boolean;
  /** Prefix positive values with "+". */
  signed?: boolean;
}

export function formatCurrency(
  value: number,
  { cents = false, signed = false }: CurrencyOptions = {},
): string {
  const digits = cents ? 2 : 0;
  const fmt = formatter(`cur-${digits}-${signed}`, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  });
  return normalizeSpaces(fmt.format(value));
}

/** 1 250 000 → "1,25 M€", 84 000 → "84 k€". */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    return `${sign}${formatNumber(abs / 1_000_000, { maxDigits: abs >= 10_000_000 ? 1 : 2 })} M€`;
  }
  if (abs >= 10_000) {
    return `${sign}${formatNumber(abs / 1_000, { maxDigits: 0 })} k€`;
  }
  if (abs >= 1_000) {
    return `${sign}${formatNumber(abs / 1_000, { maxDigits: 1 })} k€`;
  }
  return formatCurrency(value);
}

export interface NumberOptions {
  minDigits?: number;
  maxDigits?: number;
}

export function formatNumber(
  value: number,
  { minDigits = 0, maxDigits = 0 }: NumberOptions = {},
): string {
  const fmt = formatter(`num-${minDigits}-${maxDigits}`, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: Math.max(minDigits, maxDigits),
  });
  return normalizeSpaces(fmt.format(value));
}

/** 0.0335 → "3,35 %". */
export function formatPercent(
  value: number,
  { digits = 1, signed = false }: { digits?: number; signed?: boolean } = {},
): string {
  const fmt = formatter(`pct-${digits}-${signed}`, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  });
  return normalizeSpaces(fmt.format(value));
}

/** 18 months → "1 an et 6 mois". */
export function formatDuration(months: number): string {
  const total = Math.max(0, Math.round(months));
  const years = Math.floor(total / 12);
  const rest = total % 12;
  const y = years > 0 ? `${years} an${years > 1 ? "s" : ""}` : "";
  const m = rest > 0 ? `${rest} mois` : "";
  if (y && m) return `${y} et ${m}`;
  return y || m || "0 mois";
}

/** Surface in m², without decimals unless needed. */
export function formatSurface(value: number): string {
  return `${formatNumber(value, { maxDigits: 1 })} m²`;
}
