import { useState } from 'react'
import { models, type BusinessModel } from '../data/models'
import { useModel } from '../state/model'

interface ModelBarProps {
  onSwitch: (model: BusinessModel) => void
}

/**
 * The always-visible experiment control: a slim lab-style strip above the app
 * stating which business model is running, with a switcher sheet behind it.
 * This is the one piece of UI that belongs to the research prototype rather
 * than to "the app" — deliberately styled like an instrument label.
 */
export default function ModelBar({ onSwitch }: ModelBarProps) {
  const { model, meta } = useModel()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="z-30 flex w-full shrink-0 items-center justify-between gap-2 border-b-4 border-black bg-black px-3 py-1.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 border border-white"
            style={{ background: meta.accent }}
          />
          <span className="truncate font-mono text-[10px] font-bold uppercase tracking-widest text-white">
            model: {meta.name}
          </span>
        </span>
        <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest text-white/70">
          switch ▾
        </span>
      </button>

      {open && (
        <div
          className="absolute inset-0 z-50 flex items-end bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-fade-up w-full border-t-4 border-black bg-white p-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-display text-[11px] font-bold uppercase tracking-widest text-muted">
              The experiment
            </p>
            <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-black">
              Change who pays
            </h3>
            <p className="mt-1 text-xs leading-snug text-muted">
              The whole app rebuilds itself around the new incentive.
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
                    className={`flex items-center gap-3 border-2 border-black p-3 text-left transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                      active ? 'bg-black text-white' : 'bg-white text-black shadow-hard-sm'
                    }`}
                  >
                    <span
                      className="h-8 w-8 shrink-0 border-2 border-black"
                      style={{ background: m.accent }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-bold uppercase tracking-tight">
                        {m.name}
                        {active && ' — running'}
                      </span>
                      <span
                        className={`block truncate font-mono text-[10px] uppercase tracking-tight ${
                          active ? 'text-white/70' : 'text-muted'
                        }`}
                      >
                        {m.kpi}
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
