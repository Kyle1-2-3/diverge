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
    whoPays: 'Advertisers pay. You pay with time.',
    kpi: 'Optimizes time in app',
    philosophy: 'Built to keep you scrolling.',
    feel: 'You’ll lose track of time.',
    accent: '#ff2b47',
  },
  {
    id: 'subscription',
    name: 'Subscription',
    short: 'subscription',
    whoPays: 'You pay. Your attention isn’t for sale.',
    kpi: 'Optimizes your satisfaction',
    philosophy: 'The feed ends. Nothing begs you to stay.',
    feel: 'You’ll feel in control.',
    accent: '#5b5bd6',
  },
  {
    id: 'public',
    name: 'Public-interest',
    short: 'public',
    whoPays: 'Publicly funded, like a library.',
    kpi: 'Optimizes perspective diversity',
    philosophy: 'Widens your view and explains itself.',
    feel: 'You’ll be challenged.',
    accent: '#1e8a5a',
  },
]

export function modelById(id: BusinessModel): ModelMeta {
  return models.find((m) => m.id === id)!
}
