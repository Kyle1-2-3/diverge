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
    <section className="border-2 border-black bg-white p-5 shadow-hard-sm">
      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-black">
        {title}
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-xs font-bold uppercase tracking-tight text-black">
                {r.label}
              </span>
              <span className="font-mono text-xs font-bold tabular-nums text-black">
                {r.value}%
              </span>
            </div>
            <div className="mt-1 h-2.5 border-2 border-black bg-white">
              <div
                className="h-full bg-black transition-all duration-700"
                style={{ width: `${Math.min(100, r.value)}%` }}
              />
            </div>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-tight text-muted">
              {r.hint}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t-2 border-black pt-3 text-[11px] leading-snug text-muted">
        There is no perfect feed mix. This shows what you experienced — not
        what you should prefer.
      </p>
    </section>
  )
}
