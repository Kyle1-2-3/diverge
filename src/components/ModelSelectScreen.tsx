import { models, type BusinessModel } from '../data/models'

interface ModelSelectScreenProps {
  onSelect: (model: BusinessModel) => void
}

/**
 * The experiment's front door: before entering the app, the user chooses who
 * pays for it. Framed as the research question it is — every difference they
 * are about to experience follows from this one choice.
 */
export default function ModelSelectScreen({ onSelect }: ModelSelectScreenProps) {
  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-white sm:pt-7">
      <div className="animate-fade-up flex min-h-full flex-col px-6 pb-8 pt-12">
        <header className="border-b-4 border-black pb-4">
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-muted">
            The experiment — pick a business model
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-none tracking-tighter text-black">
            Who pays
            <br />
            for your feed?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Same app. Same posts. Three ways of making money. Watch every
            design decision follow the money — you can switch anytime.
          </p>
        </header>

        <div className="mt-5 flex flex-col gap-4">
          {models.map((m, i) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="animate-fade-up border-2 border-black bg-white text-left shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {/* Accent slab — this colour follows the model through the app */}
              <div
                className="flex items-center justify-between border-b-2 border-black px-4 py-2"
                style={{ background: m.accent }}
              >
                <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
                  {`0${i + 1} — ${m.name}`}
                </span>
                <span className="font-mono text-lg font-bold text-white">→</span>
              </div>
              <div className="px-4 py-3">
                <p className="font-display text-sm font-bold leading-snug text-black">
                  {m.whoPays}
                </p>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-tight text-muted">
                  {m.kpi}
                </p>
                <p className="mt-2 border-l-4 pl-2.5 text-[13px] leading-snug text-black" style={{ borderColor: m.accent }}>
                  {m.philosophy}
                </p>
                <p className="mt-2 font-mono text-[11px] italic text-muted">
                  {m.feel}
                </p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
          An interactive design-research prototype
        </p>
      </div>
    </div>
  )
}
