import type { FeedMixSummary } from '../lib/recommend'

// ---------------------------------------------------------------------------
// The Feed Mix: five descriptive dimensions instead of one moral score.
// It describes what a session contained — it never grades the user.
// ---------------------------------------------------------------------------

interface FeedMixProps {
  mix: FeedMixSummary
  title?: string
}

export default function FeedMix({ mix, title = 'Your feed mix' }: FeedMixProps) {
  const rows = [
    { label: 'Familiar', value: mix.familiar, hint: 'topics you already follow' },
    { label: 'Discovery', value: mix.discovery, hint: 'adjacent + wider picks' },
    { label: 'Viewpoints', value: mix.viewpoints, hint: 'discussions with extra angles' },
    { label: 'Creator variety', value: mix.creators, hint: 'distinct voices' },
    { label: 'Topic variety', value: mix.topics, hint: 'of 8 topic worlds' },
  ]

  return (
    <section className="shadow-soft rounded-xl border border-hairline bg-white p-5">
      <h3 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
        {title}
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
        There is no perfect mix — this shows what you experienced, not what you
        should prefer.
      </p>
    </section>
  )
}
