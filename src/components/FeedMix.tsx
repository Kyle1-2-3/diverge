import { useLocale } from '../i18n'
import type { FeedMixSummary } from '../lib/recommend'

// ---------------------------------------------------------------------------
// The Feed Mix: five descriptive dimensions instead of one moral score.
// It describes what a session contained — it never grades the user.
// ---------------------------------------------------------------------------

interface FeedMixProps {
  mix: FeedMixSummary
  title?: string
}

export default function FeedMix({ mix, title }: FeedMixProps) {
  const { t } = useLocale()
  const rows = [
    { label: t('mix.familiar'), value: mix.familiar, hint: t('mix.familiarHint') },
    { label: t('mix.discovery'), value: mix.discovery, hint: t('mix.discoveryHint') },
    { label: t('mix.viewpoints'), value: mix.viewpoints, hint: t('mix.viewpointsHint') },
    { label: t('mix.creators'), value: mix.creators, hint: t('mix.creatorsHint') },
    { label: t('mix.topics'), value: mix.topics, hint: t('mix.topicsHint') },
  ]

  return (
    <section className="shadow-soft rounded-xl border border-hairline bg-white p-5">
      <h3 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
        {title ?? t('mix.title')}
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-ink">{r.label}</span>
              <span className="tnum text-xs font-semibold text-ink">
                {r.value}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-hairline">
              <div
                className="h-full rounded-full bg-brand transition-all duration-700"
                style={{ width: `${Math.min(100, r.value)}%` }}
              />
            </div>
            <p className="mt-0.5 text-[10px] text-faint">{r.hint}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-hairline pt-3 text-[11px] leading-snug text-muted">
        {t('mix.footnote')}
      </p>
    </section>
  )
}
