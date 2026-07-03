import type { DiversityBar } from '../types'

interface DiversityScoreProps {
  score: number
  bars: DiversityBar[]
}

/**
 * The signature "bubble map": your feed's coverage across the six topic
 * buckets, drawn as filled columns. Thin coverage (a gap in your bubble) is
 * marked in the accent colour — the one place the app points you outward.
 */
export default function DiversityScore({ score, bars }: DiversityScoreProps) {
  return (
    <section className="border-2 border-black bg-white p-5 shadow-hard-sm">
      {/* Header + score slab */}
      <div className="flex items-start justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-black">
            Bubble map
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            What your feed covered — and where it's thin.
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center border-2 border-black bg-brand text-white">
          <span className="font-mono text-2xl font-bold leading-none tabular-nums">
            {score}
          </span>
          <span className="mt-0.5 font-mono text-[9px] uppercase tracking-tight">
            / 100
          </span>
        </div>
      </div>

      {/* Coverage columns */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {bars.map((bar) => {
          const gap = bar.value < 35
          return (
            <div key={bar.label}>
              <div className="relative h-20 overflow-hidden border-2 border-black bg-white">
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ${
                    gap ? 'bg-brand' : 'bg-black'
                  }`}
                  style={{ height: `${bar.value}%` }}
                />
                {gap && (
                  <span className="absolute left-1 top-1 font-mono text-[8px] font-bold uppercase tracking-widest text-brand">
                    gap
                  </span>
                )}
              </div>
              <p className="mt-1 truncate font-mono text-[9px] uppercase leading-tight tracking-tight text-black">
                {bar.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 border-t-2 border-black pt-2 font-mono text-[9px] uppercase tracking-widest">
        <span className="flex items-center gap-1 text-black">
          <span className="inline-block h-2.5 w-2.5 bg-black" /> exposure
        </span>
        <span className="flex items-center gap-1 text-brand">
          <span className="inline-block h-2.5 w-2.5 bg-brand" /> gap → explore
        </span>
      </div>
    </section>
  )
}
