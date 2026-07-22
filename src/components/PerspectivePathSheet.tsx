import { useState } from 'react'
import type { AngleType, PerspectiveAngle, Post } from '../types'
import { useLocale } from '../i18n'
import type { TranslationKey } from '../i18n/translations'
import { usePrefs } from '../state/prefs'

// ---------------------------------------------------------------------------
// Perspective Paths: thoughtful angles on a post, replacing blunt "opposite
// opinion" flips. Discussion posts get interpretation / context / affected
// voices; entertainment posts get process and culture. Never pro-vs-anti.
// ---------------------------------------------------------------------------

const ANGLE_KEY: Record<AngleType, TranslationKey> = {
  interpretation: 'angle.interpretation',
  context: 'angle.context',
  affected: 'angle.affected',
  process: 'angle.process',
  culture: 'angle.culture',
}

/** True when a post's angles are entertainment-flavored. */
// eslint-disable-next-line react-refresh/only-export-components
export function isBehindThe(post: Post): boolean {
  return (post.paths ?? []).every(
    (a) => a.type === 'process' || a.type === 'culture',
  )
}

interface PerspectivePathSheetProps {
  post: Post
  onClose: () => void
}

export default function PerspectivePathSheet({
  post,
  onClose,
}: PerspectivePathSheetProps) {
  const { t } = useLocale()
  const { seen, markSeen } = usePrefs()
  const angles: PerspectiveAngle[] = post.paths ?? []
  const [active, setActive] = useState(0)
  const angle = angles[active]
  const firstTime = !seen['path-sheet']

  return (
    <div
      className="absolute inset-0 z-40 flex items-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="animate-fade-up shadow-soft-lg no-scrollbar max-h-[85%] w-full overflow-y-auto rounded-t-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <span className="font-display text-sm font-bold tracking-[-0.01em] text-ink">
            {isBehindThe(post) ? t('paths.behindThis') : t('paths.moreAngles')}
          </span>
          <button
            onClick={onClose}
            className="p-1 text-lg leading-none text-muted"
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </div>

        {/* One-time, dismissed automatically when the sheet closes. */}
        {firstTime && (
          <div className="border-b border-hairline bg-brand-soft px-4 py-2.5">
            <p className="text-[11px] leading-snug text-ink">
              {t('paths.firstTime')}
            </p>
          </div>
        )}

        {/* Angle tabs */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
          {angles.map((a, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-transform active:scale-[0.98] ${
                i === active
                  ? 'bg-ink text-white'
                  : 'border border-hairline bg-white text-ink'
              }`}
            >
              {t(ANGLE_KEY[a.type])}
            </button>
          ))}
        </div>

        {angle && (
          <div className="px-5 pb-6">
            <h3 className="font-display text-lg font-bold leading-tight tracking-[-0.01em] text-ink">
              {angle.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {angle.body}
            </p>
            <button
              onClick={() => {
                if (firstTime) markSeen('path-sheet')
                onClose()
              }}
              className="mt-5 w-full rounded-full bg-brand py-3 font-display text-sm font-semibold text-white transition-transform active:scale-[0.97]"
            >
              {t('paths.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
