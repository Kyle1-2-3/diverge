import { useState } from 'react'
import { useLocale } from '../i18n'
import CoachMark from './CoachMark'

// ---------------------------------------------------------------------------
// The natural stopping point at the end of a feed chapter. Continuing is
// always one tap away — the point is conscious continuation, not restriction.
// ---------------------------------------------------------------------------

/** Stable ids stored in session stats; labels localize via `feeling.<id>`. */
export type FeelingId =
  | 'worth'
  | 'fun'
  | 'new'
  | 'repetitive'
  | 'intense'
  | 'notRelevant'

const FEELINGS: FeelingId[] = [
  'worth',
  'fun',
  'new',
  'repetitive',
  'intense',
  'notRelevant',
]

interface FeedChapterEndProps {
  chapter: number
  familiar: number
  discoveries: number
  friends: number
  canContinue: boolean
  /** null hides the reflection strip (already answered this session). */
  onFeeling: ((feeling: FeelingId) => void) | null
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
  const { t } = useLocale()
  const [picked, setPicked] = useState<FeelingId | null>(null)

  const summary = [
    friends > 0 && t('chapterEnd.fromFriends', { n: friends }),
    t('chapterEnd.familiar', { n: familiar }),
    discoveries > 0 &&
      t(discoveries === 1 ? 'chapterEnd.discovery' : 'chapterEnd.discoveries', {
        n: discoveries,
      }),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="animate-fade-up px-5 pb-8 pt-9">
      <p className="text-xs font-semibold text-brand">
        {t('chapterEnd.kicker', { n: chapter })}
      </p>
      <h3 className="mt-1 font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-ink">
        {canContinue ? (
          <>
            {t('chapterEnd.caughtUp1')}
            <br />
            {t('chapterEnd.caughtUp2')}
          </>
        ) : (
          <>
            {t('chapterEnd.everything1')}
            <br />
            {t('chapterEnd.everything2')}
          </>
        )}
      </h3>
      <p className="mt-3 max-w-[19rem] text-sm leading-relaxed text-muted">
        {summary}.{' '}
        {canContinue ? t('chapterEnd.continueHint') : t('chapterEnd.dryHint')}
      </p>

      <div className="mt-4">
        <CoachMark flag="chapter-end">{t('coach.chapterEnd')}</CoachMark>
      </div>

      {/* Skippable one-tap reflection */}
      {onFeeling && (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted">
            {t('chapterEnd.feelingPrompt')}{' '}
            <span className="text-faint">{t('chapterEnd.optional')}</span>
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
                {t(`feeling.${f}`)}
              </button>
            ))}
          </div>
          {picked && (
            <p className="mt-2 text-xs text-faint">{t('chapterEnd.noted')}</p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {canContinue && (
          <button
            onClick={onContinue}
            className="w-full rounded-full bg-ink py-3.5 font-display text-sm font-semibold text-white transition-transform active:scale-[0.97]"
          >
            {t('chapterEnd.continue')}
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
          {t('chapterEnd.closeSession')}
        </button>
      </div>
    </div>
  )
}
