import type { Post } from '../types'
import type { RecCtx } from '../lib/recommend'
import { feedMixOf } from '../lib/recommend'
import FeedMix from './FeedMix'

// ---------------------------------------------------------------------------
// Shown when the user closes a session: a quiet receipt of what they saw,
// then the door. No guilt, no streaks — leaving is the well-designed path.
// ---------------------------------------------------------------------------

interface SessionRecapProps {
  shown: Post[]
  minutes: number
  feeling: string | null
  ctx: RecCtx
  onDone: () => void
}

export default function SessionRecap({
  shown,
  minutes,
  feeling,
  ctx,
  onDone,
}: SessionRecapProps) {
  const mix = feedMixOf(shown, ctx.interests)

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/40" onClick={onDone}>
      <div
        className="animate-fade-up no-scrollbar shadow-soft-lg max-h-[90%] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold text-brand">Session closed</p>
        <h2 className="mt-1 font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-ink">
          Time well
          <br />
          spent.
        </h2>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { value: String(mix.counts.total), label: 'posts seen' },
            { value: `${Math.max(1, minutes)}m`, label: 'of your time' },
            {
              value: String(mix.counts.adjacent + mix.counts.discovery),
              label: 'discoveries',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-hairline bg-white p-3 text-center"
            >
              <div className="tnum text-2xl font-bold leading-none text-ink">
                {s.value}
              </div>
              <div className="mt-1.5 text-[10px] leading-tight text-faint">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {feeling && (
          <p className="mt-3 text-xs text-muted">
            You called it:{' '}
            <span className="font-semibold text-ink">{feeling}</span>
          </p>
        )}

        <div className="mt-4">
          <FeedMix mix={mix} title="This session's mix" />
        </div>

        <button
          onClick={onDone}
          className="mt-5 w-full rounded-full bg-brand py-3.5 font-display text-sm font-semibold text-white transition-transform active:scale-[0.97]"
        >
          See you when you're curious →
        </button>
      </div>
    </div>
  )
}
