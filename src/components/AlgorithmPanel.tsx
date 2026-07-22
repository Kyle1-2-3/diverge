import { useRef } from 'react'
import { useLocale } from '../i18n'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import { usePrefs } from '../state/prefs'

interface AlgorithmPanelProps {
  onClose: () => void
}

/**
 * The public-interest model's radical move: the entire ranking recipe,
 * written in plain language, with the one big parameter handed to the user
 * as a dial. There is nothing behind the curtain — this panel IS the
 * algorithm (see lib/recommend.ts, which uses exactly these rules).
 */
export default function AlgorithmPanel({ onClose }: AlgorithmPanelProps) {
  const { t } = useLocale()
  const { diversity, setDiversity } = useModel()
  const { showToast } = useInteractions()
  const { pushChoice } = usePrefs()
  // Dial value when the panel opened — used to notice a real change on close.
  const opened = useRef(diversity)

  // Mirrors mixFor() in lib/recommend.ts for the public model.
  const adj = Math.round((0.1 + (diversity / 100) * 0.3) * 100)
  const far = Math.round((0.05 + (diversity / 100) * 0.15) * 100)
  const core = Math.max(30, 100 - adj - far)

  const close = () => {
    if (diversity !== opened.current) {
      pushChoice({ kind: 'diversity', from: opened.current, to: diversity })
      showToast({ message: t('toast.reshaped') })
    }
    onClose()
  }

  const rules = [
    t('algo.rule.chapters'),
    t('algo.rule.mix', { core, adj, far }),
    t('algo.rule.adjacent'),
    t('algo.rule.choices'),
    t('algo.rule.engagement'),
  ]

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/40" onClick={close}>
      <div
        className="animate-fade-up shadow-soft-lg no-scrollbar max-h-[88%] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-brand">{t('algo.kicker')}</p>
            <h3 className="mt-1 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-ink">
              {t('algo.title')}
            </h3>
          </div>
          <button
            onClick={close}
            className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-semibold text-ink transition-transform active:scale-[0.98]"
          >
            {t('common.close')}
          </button>
        </div>

        <ol className="mt-5 flex flex-col gap-2.5">
          {rules.map((rule, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-xl border border-hairline p-3"
            >
              <span className="tnum text-sm font-semibold text-brand">
                0{i + 1}
              </span>
              <span className="text-[13px] leading-snug text-ink">{rule}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-xl bg-brand-soft p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-ink">
              {t('algo.dialTitle')}
            </p>
            <p className="tnum font-display text-2xl font-bold text-brand">
              {diversity}%
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={diversity}
            onChange={(e) => setDiversity(Number(e.target.value))}
            className="mt-3 w-full accent-brand"
            aria-label={t('algo.dialAria')}
          />
          <div className="mt-1 flex justify-between text-[11px] font-medium text-muted">
            <span>{t('algo.dialLow')}</span>
            <span>{t('algo.dialHigh')}</span>
          </div>
          <p className="mt-3 text-xs leading-snug text-muted">
            {t('algo.dialHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
