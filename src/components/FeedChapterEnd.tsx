import { useState } from 'react'
import CoachMark from './CoachMark'

// ---------------------------------------------------------------------------
// The natural stopping point at the end of a feed chapter. Continuing is
// always one tap away — the point is conscious continuation, not restriction.
// ---------------------------------------------------------------------------

const FEELINGS = [
  'Worth my time',
  'Fun',
  'I found something new',
  'Repetitive',
  'Too intense',
  'Not relevant',
]

interface FeedChapterEndProps {
  chapter: number
  familiar: number
  discoveries: number
  friends: number
  canContinue: boolean
  /** null hides the reflection strip (already answered this session). */
  onFeeling: ((feeling: string) => void) | null
  onContinue: () => void
  /** Member: change intention. Public: adjust the mix. */
  changeLabel: string
  onChange: () => void
  onClose: () => void
}

export default function FeedChapterEnd({
  chapter,
  familiar,
  discoveries,
  friends,
  canContinue,
  onFeeling,
  onContinue,
  changeLabel,
  onChange,
  onClose,
}: FeedChapterEndProps) {
  const [picked, setPicked] = useState<string | null>(null)

  const summary = [
    friends > 0 && `${friends} from friends`,
    `${familiar} familiar`,
    discoveries > 0 && `${discoveries} ${discoveries === 1 ? 'discovery' : 'discoveries'}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="animate-fade-up px-5 pb-8 pt-9">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
        Chapter {chapter} · complete
      </p>
      <h3 className="mt-1 font-display text-3xl font-bold uppercase leading-none tracking-tighter text-black">
        {canContinue ? (
          <>
            You're
            <br />
            caught up.
          </>
        ) : (
          <>
            That's
            <br />
            everything.
          </>
        )}
      </h3>
      <p className="mt-3 max-w-[19rem] text-sm leading-relaxed text-muted">
        {summary}. {canContinue
          ? 'Keep going, change direction, or leave it here — all fine.'
          : 'Nothing new is waiting. A good moment to go be somewhere else.'}
      </p>

      <div className="mt-4">
        <CoachMark flag="chapter-end">
          Feeds here end on purpose. Continuing is always your choice — nothing
          auto-loads behind your back.
        </CoachMark>
      </div>

      {/* Skippable one-tap reflection */}
      {onFeeling && (
        <div className="mt-5">
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-muted">
            How did this stretch feel? <span className="font-mono">(optional)</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {FEELINGS.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setPicked(f)
                  onFeeling(f)
                }}
                disabled={picked !== null}
                className={`border-2 border-black px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-tight transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                  picked === f
                    ? 'bg-black text-white'
                    : picked
                      ? 'bg-white text-muted opacity-50'
                      : 'bg-white text-black'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {picked && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-tight text-muted">
              Noted — the next chapter listens.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {canContinue && (
          <button
            onClick={onContinue}
            className="w-full border-2 border-black bg-black py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Continue another chapter
          </button>
        )}
        <button
          onClick={onChange}
          className="w-full border-2 border-black bg-white py-3 font-display text-sm font-bold uppercase tracking-widest text-black shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {changeLabel}
        </button>
        <button
          onClick={onClose}
          className="w-full border-2 border-black bg-brand py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Close session
        </button>
      </div>
    </div>
  )
}
