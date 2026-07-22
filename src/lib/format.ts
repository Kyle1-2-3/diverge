import type { TFunc } from '../i18n'

// Shared number formatting so every screen renders counts the same way.

/** "2480" → "2.5k", "760" → "760", "8800" → "8.8k". */
export function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n)
}

/** Localize a compact relative time label ("38m" → "38m ago" / 「38分前」). */
export function timeAgo(label: string, t: TFunc): string {
  if (!label || label === 'now') return t('time.now')
  const n = parseInt(label, 10)
  if (Number.isNaN(n)) return label
  if (label.endsWith('m')) return t('time.m', { n })
  if (label.endsWith('h')) return t('time.h', { n })
  if (label.endsWith('d')) return t('time.d', { n })
  return label
}
