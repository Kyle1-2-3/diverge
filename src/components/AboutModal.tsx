import { useLocale } from '../i18n'
import { LogoMark } from './Logo'

interface AboutModalProps {
  onClose: () => void
}

/**
 * The one place where the research concept explains itself in full — kept out
 * of the everyday feed on purpose. Formal disclaimers live here too.
 */
export default function AboutModal({ onClose }: AboutModalProps) {
  const { t } = useLocale()

  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="animate-pop-in shadow-soft-lg max-h-[88%] w-full overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">
              <LogoMark className="h-4.5 w-4.5" />
            </span>
            <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-ink">
              {t('about.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-semibold text-ink transition-transform active:scale-[0.98]"
          >
            {t('common.close')}
          </button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>

          <div className="rounded-xl bg-brand-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">
              {t('about.ideasTitle')}
            </p>
            <ul className="space-y-2">
              <li>→ {t('about.idea1')}</li>
              <li>→ {t('about.idea2')}</li>
              <li>→ {t('about.idea3')}</li>
            </ul>
          </div>

          <p className="text-xs text-faint">{t('about.disclaimer')}</p>
        </div>
      </div>
    </div>
  )
}
