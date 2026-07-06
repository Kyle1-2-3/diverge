// ---------------------------------------------------------------------------
// The core experiment: the SAME app under three business models.
// Everything that differs between the three versions of Diverge should trace
// back to one of these entries — who pays decides how the product behaves.
// ---------------------------------------------------------------------------

export type BusinessModel = 'attention' | 'subscription' | 'public'

export interface ModelMeta {
  id: BusinessModel
  /** Full display name, e.g. on the selection screen. */
  name: string
  /** Very short label for the persistent experiment bar. */
  short: string
  /** Who actually pays for the platform. */
  whoPays: string
  /** The single number this version of the app optimizes. */
  kpi: string
  /** The design philosophy that KPI produces. */
  philosophy: string
  /** What the user should feel — shown on the selection cards. */
  feel: string
  /** Accent colour; becomes --color-brand inside this model's scope. */
  accent: string
}

export const models: ModelMeta[] = [
  {
    id: 'attention',
    name: 'Attention-funded',
    short: 'ads',
    whoPays: 'Advertisers pay for your attention. Free — you pay with time.',
    kpi: 'KPI: minutes spent in app',
    philosophy: 'Keep you scrolling as long as possible.',
    feel: 'You will lose track of time.',
    accent: '#ff2b47',
  },
  {
    id: 'subscription',
    name: 'Subscription-funded',
    short: 'subscription',
    whoPays: 'You pay directly. Your attention is no longer for sale.',
    kpi: 'KPI: long-term satisfaction',
    philosophy: 'Respect your time — the feed ends, nothing begs you to stay.',
    feel: 'You will feel calm and in control.',
    accent: '#5b5bd6',
  },
  {
    id: 'public',
    name: 'Public-interest',
    short: 'public',
    whoPays: 'Publicly funded, like a library. Built for benefit, not profit.',
    kpi: 'KPI: perspective diversity',
    philosophy: 'Widen your view, explain every decision, then let you go.',
    feel: 'You will be challenged, not manipulated.',
    accent: '#1e8a5a',
  },
]

export function modelById(id: BusinessModel): ModelMeta {
  return models.find((m) => m.id === id)!
}
