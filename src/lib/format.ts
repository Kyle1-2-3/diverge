// Shared number formatting so every screen renders counts the same way.

/** "2480" → "2.5k", "760" → "760", "8800" → "8.8k". */
export function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n)
}
