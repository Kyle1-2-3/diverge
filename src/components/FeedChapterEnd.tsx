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
      <p className="text-xs font-semibold text-brand">
        Chapter {chapter} · complete
      </p>
      <h3 className="mt-1 font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-ink">
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
          ? 'Keep going, change direction, or leave it here.'
          : 'Nothing new is waiting — a good moment to be somewhere else.'}
      </p>

      <div className="mt-4">
        <CoachMark flag="chapter-end">
          Feeds here end on purpose — nothing auto-loads. Continuing is your
          choice.
        </CoachMark>
      </div>

      {/* Skippable one-tap reflection */}
      {onFeeling && (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted">
            How did this stretch feel?{' '}
            <span className="text-faint">(optional)</span>
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-transform active:scale-[0.98] ${
                  picked === f
                    ? 'bg-ink text-white'
                    : picked
                      ? 'border border-hairline bg-white text-faint opacity-60'
                      : 'border border-hairline bg-white text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {picked && (
            <p className="mt-2 text-xs text-faint">
              Noted — the next chapter listens.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {canContinue && (
          <button
            onClick={onContinue}
            className="w-full rounded-full bg-ink py-3.5 font-display text-sm font-semibold text-white transition-transform active:scale-[0.97]"
          >
            Continue another chapter
          </button>
        )}
        <button
          onClick={onChange}
          className="w-full rounded-full border border-hairline bg-white py-3 font-display text-sm font-semibold text-ink transition-transform active:scale-[0.97]"
        >
          {changeLabel}
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-full bg-brand py-3 font-display text-sm font-semibold text-white transition-transform active:scale-[0.97]"
        >
          Close session
        </button>
      </div>
    </div>
  )
}
