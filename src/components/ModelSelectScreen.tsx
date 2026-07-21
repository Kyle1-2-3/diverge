import { models, type BusinessModel } from '../data/models'

interface ModelSelectScreenProps {
  onSelect: (model: BusinessModel) => void
}

/**
 * The experiment's front door: before entering the app, the user chooses who
 * pays for it. Quiet cards on white — the accent dot is the only colour, and
 * it follows the chosen model through the whole app.
 */
export default function ModelSelectScreen({ onSelect }: ModelSelectScreenProps) {
  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-white sm:pt-7">
      <div className="animate-fade-up flex min-h-full flex-col px-6 pb-8 pt-12">
        <header>
          <p className="text-xs font-semibold text-faint">The experiment</p>
          <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink">
            Who pays for
            <br />
            your feed?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Same app, three ways of making money. Every design choice follows
            the money — switch anytime.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-3">
          {models.map((m, i) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="animate-fade-up shadow-soft rounded-xl border border-hairline bg-white px-4 py-4 text-left transition-transform active:scale-[0.98]"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  {/* Accent dot — this colour follows the model through the app */}
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: m.accent }}
                  />
                  <span className="font-display text-base font-semibold text-ink">
                    {m.name}
                  </span>
                </span>
                <span className="text-faint">→</span>
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-ink">
                {m.whoPays}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-muted">
                {m.philosophy}
              </p>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          Design-research prototype
        </p>
      </div>
    </div>
  )
}
