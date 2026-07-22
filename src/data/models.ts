// ---------------------------------------------------------------------------
// The core experiment: the SAME app under three business models.
// Everything that differs between the three versions of Diverge should trace
// back to who pays. Display strings live in i18n under `model.<id>.*`
// (name, whoPays, kpi, philosophy) and `model.short.<id>`.
// ---------------------------------------------------------------------------

export type BusinessModel = 'attention' | 'subscription' | 'public'

export interface ModelMeta {
  id: BusinessModel
  /** Accent colour; becomes --color-brand inside this model's scope. */
  accent: string
}

export const models: ModelMeta[] = [
  { id: 'attention', accent: '#ff2b47' },
  { id: 'subscription', accent: '#5b5bd6' },
  { id: 'public', accent: '#1e8a5a' },
]

export function modelById(id: BusinessModel): ModelMeta {
  return models.find((m) => m.id === id)!
}
