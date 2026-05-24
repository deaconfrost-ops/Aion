/** Small, dependency-free helpers shared across apps. */

/** Sum integer cents safely (no float math). */
export function sumCents(values: number[]): number {
  return values.reduce((acc, v) => acc + Math.round(v), 0);
}

export function formatCents(cents: number, currency: 'CAD' | 'USD' = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(cents / 100);
}

export function isoNow(): string {
  return new Date().toISOString();
}
