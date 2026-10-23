/** Input guards shared by the finance engine: fail loudly on nonsense inputs. */
export function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value))
    throw new RangeError(`${name} doit être un nombre fini (reçu ${value})`);
}

export function assertNonNegative(name: string, value: number): void {
  assertFinite(name, value);
  if (value < 0) throw new RangeError(`${name} doit être positif ou nul (reçu ${value})`);
}
