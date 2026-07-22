import type { Post } from '../types'
import { useLocale } from '../i18n'
import type { RecCtx } from '../lib/recommend'
import { feedMixOf } from '../lib/recommend'
import type { FeelingId } from './FeedChapterEnd'
import FeedMix from './FeedMix'

// ---------------------------------------------------------------------------
// Shown when the user closes a session: a quiet receipt of what they saw,
// then the door. No guilt, no streaks — leaving is the well-designed path.
// ---------------------------------------------------------------------------

interface SessionRecapProps {
  shown: Post[]
  minutes: number
  feeling: FeelingId | null
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
  const { t } = useLocale()
  const mix = feedMixOf(shown, ctx.interests)

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/40" onClick={onDone}>
      <div
        className="animate-fade-up no-scrollbar shadow-soft-lg max-h-[90%] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold text-brand">{t('recap.kicker')}</p>
        <h2 className="mt-1 font-display text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-ink">
          {t('recap.title1')}
          <br />
          {t('recap.title2')}
        </h2>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { value: String(mix.counts.total), label: t('recap.postsSeen') },
            { value: `${Math.max(1, minutes)}m`, label: t('recap.ofYourTime') },
            {
              value: String(mix.counts.adjacent + mix.counts.discovery),
              label: t('recap.discoveries'),
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
            {t('recap.youCalledIt')}{' '}
            <span className="font-semibold text-ink">
              {t(`feeling.${feeling}`)}
            </span>
          </p>
        )}

        <div className="mt-4">
          <FeedMix mix={mix} title={t('mix.sessionTitle')} />
        </div>

        <button
          onClick={onDone}
          className="mt-5 w-full rounded-full bg-brand py-3.5 font-display text-sm font-semibold text-white transition-transform active:scale-[0.97]"
        >
          {t('recap.cta')}
        </button>
      </div>
    </div>
  )
}
