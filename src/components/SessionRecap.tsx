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
    <div className="absolute inset-0 z-40 flex items-end bg-black/60" onClick={onDone}>
      <div
        className="animate-fade-up no-scrollbar max-h-[90%] w-full overflow-y-auto border-t-4 border-black bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-[11px] font-bold uppercase tracking-widest text-brand">
          Session closed
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold uppercase leading-none tracking-tighter text-black">
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
            <div key={s.label} className="border-2 border-black bg-white p-3 text-center">
              <div className="font-mono text-2xl font-bold tabular-nums leading-none text-black">
                {s.value}
              </div>
              <div className="mt-1.5 font-mono text-[9px] uppercase leading-tight tracking-tight text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {feeling && (
          <p className="mt-3 border-l-4 border-black pl-3 text-xs text-muted">
            You called it: <span className="font-bold text-black">{feeling}</span>
          </p>
        )}

        <div className="mt-4">
          <FeedMix mix={mix} title="This session's mix" />
        </div>

        <button
          onClick={onDone}
          className="mt-5 w-full border-2 border-black bg-black py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          See you when you're curious →
        </button>
      </div>
    </div>
  )
}
