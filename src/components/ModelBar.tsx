import { useState } from 'react'
import { useLocale } from '../i18n'
import { models, type BusinessModel } from '../data/models'
import { useModel } from '../state/model'

interface ModelBarProps {
  onSwitch: (model: BusinessModel) => void
}

/**
 * The always-visible experiment control: a slim strip above the app stating
 * which business model is running, with a switcher sheet behind it. This is
 * the one piece of UI that belongs to the research prototype rather than to
 * "the app" — kept quiet so the app itself stays in focus.
 */
export default function ModelBar({ onSwitch }: ModelBarProps) {
  const { t } = useLocale()
  const { model, meta } = useModel()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="z-30 flex w-full shrink-0 items-center justify-between gap-2 border-b border-hairline bg-white px-3.5 py-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: meta.accent }}
          />
          <span className="truncate text-xs font-medium text-muted">
            {t(`model.${model}.name`)}
          </span>
        </span>
        <span className="shrink-0 text-xs font-semibold text-brand">
          {t('modelBar.switch')}
        </span>
      </button>

      {open && (
        <div
          className="absolute inset-0 z-50 flex items-end bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-fade-up shadow-soft-lg w-full rounded-t-2xl bg-white p-5 pb-7"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-ink">
              {t('modelBar.sheetTitle')}
            </h3>
            <p className="mt-1 text-[13px] leading-snug text-muted">
              {t('modelBar.sheetSubtitle')}
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              {models.map((m) => {
                const active = m.id === model
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setOpen(false)
                      if (!active) onSwitch(m.id)
                    }}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-transform active:scale-[0.98] ${
                      active
                        ? 'border-transparent bg-ink text-white'
                        : 'shadow-soft-sm border-hairline bg-white text-ink'
                    }`}
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-lg"
                      style={{ background: m.accent }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-semibold">
                        {t(`model.${m.id}.name`)}
                        {active && ` ${t('modelBar.running')}`}
                      </span>
                      <span
                        className={`block truncate text-xs ${
                          active ? 'text-white/70' : 'text-muted'
                        }`}
                      >
                        {t(`model.${m.id}.kpi`)}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
