import { useModel } from '../state/model'

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
  const { diversity, setDiversity } = useModel()

  // Mirrors mixFor() in lib/recommend.ts for the public model.
  const adj = Math.round((0.1 + (diversity / 100) * 0.3) * 100)
  const far = Math.round((0.05 + (diversity / 100) * 0.15) * 100)
  const core = Math.max(30, 100 - adj - far)

  const rules = [
    'The feed arrives in chapters, then asks — nothing auto-loads.',
    `Today's target mix: ${core}% familiar · ${adj}% adjacent · ${far}% wider. Your dial below sets it.`,
    '“Adjacent” means one believable step from your interests — baseball to stadium design, never baseball to celebrity gossip.',
    'Your “more / less / pause” choices outrank everything else in ranking.',
    'Likes and watch-time never decide what you see here.',
  ]

  return (
    <div
      className="absolute inset-0 z-40 flex items-end bg-black/60"
      onClick={onClose}
    >
      <div
        className="animate-fade-up no-scrollbar max-h-[88%] w-full overflow-y-auto border-t-4 border-black bg-white p-5 pb-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-widest text-brand">
              Full transparency
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-none tracking-tighter text-black">
              The whole
              <br />
              algorithm
            </h3>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black bg-white px-2 py-0.5 font-display text-[11px] font-bold uppercase text-black active:translate-x-0.5 active:translate-y-0.5"
          >
            Close
          </button>
        </div>

        <ol className="mt-5 flex flex-col gap-2.5">
          {rules.map((rule, i) => (
            <li key={i} className="flex gap-3 border-2 border-black p-3">
              <span className="font-mono text-sm font-bold text-brand">
                0{i + 1}
              </span>
              <span className="text-[13px] leading-snug text-black">{rule}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 border-2 border-black bg-brand-soft p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-sm font-bold uppercase tracking-tight text-black">
              Your discovery dial
            </p>
            <p className="font-mono text-2xl font-bold tabular-nums text-brand">
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
            aria-label="How much of your feed goes beyond your usual topics"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-tight text-muted">
            <span>Comfort zone</span>
            <span>Wide open</span>
          </div>
          <p className="mt-3 border-l-4 border-black pl-2.5 text-xs leading-snug text-black">
            Change it and the next chapter re-ranks instantly.
          </p>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          That's the entire algorithm. Nothing else is considered — not your
          age, not your habits, not what would keep you here longer.
        </p>
      </div>
    </div>
  )
}
