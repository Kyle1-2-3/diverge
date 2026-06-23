import type { DiversityBar } from '../types'

interface DiversityScoreProps {
  score: number
  bars: DiversityBar[]
}

/**
 * Shows the headline Diversity Score (0–100) as a ring plus a breakdown of the
 * six content buckets as small bars. Both respond when the intention changes.
 */
export default function DiversityScore({ score, bars }: DiversityScoreProps) {
  // Build a conic-gradient ring to visualise the score (score% of 360deg).
  const ring = {
    background: `conic-gradient(var(--color-brand) ${score * 3.6}deg, #e5e7eb 0deg)`,
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-4">
        {/* Score ring */}
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full transition-all duration-500"
          style={ring}
        >
          <div className="flex h-[60px] w-[60px] flex-col items-center justify-center rounded-full bg-white">
            <span className="font-display text-xl font-bold text-ink">
              {score}
            </span>
            <span className="-mt-1 text-[10px] text-muted">/ 100</span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-base font-bold text-ink">
            Feed diversity score
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            How balanced your feed is across topics and viewpoints today.
          </p>
        </div>
      </div>

      {/* Category bars */}
      <div className="mt-4 space-y-2.5">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-medium text-muted">
              {bar.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ${bar.color}`}
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
