import { posts } from '../data/posts'
import { useModel } from '../state/model'

interface AlgorithmPanelProps {
  onClose: () => void
}

/**
 * The public-interest model's radical move: the entire ranking algorithm,
 * written in plain language, with the one tunable parameter handed to the
 * user as a physical dial. There is nothing behind the curtain — this panel
 * IS the algorithm.
 */
export default function AlgorithmPanel({ onClose }: AlgorithmPanelProps) {
  const { diversity, setDiversity } = useModel()

  const inside = posts.filter((p) => !p.isOutsideBubble).length
  const outsideTotal = posts.filter((p) => p.isOutsideBubble).length
  const outsideShown = Math.round((outsideTotal * diversity) / 100)
  const total = inside + outsideShown

  const rules = [
    `The feed is finite: ${total} posts today, then it ends.`,
    `${outsideShown} of them come from outside your bubble — you set this below.`,
    'Outside views are spread evenly through the feed, never buried at the end.',
    'Opinion posts carry their strongest counter-argument on the back.',
    'Nothing is ranked by engagement. Likes never decide what you see.',
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

        {/* The five rules — numbered, blunt, complete. */}
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

        {/* The dial — the user owns the one parameter that matters. */}
        <div className="mt-5 border-2 border-black bg-brand-soft p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-sm font-bold uppercase tracking-tight text-black">
              Your diversity dial
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
            aria-label="How much of your feed comes from outside your bubble"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-tight text-muted">
            <span>Comfort zone</span>
            <span>Full exposure</span>
          </div>
          <p className="mt-3 border-l-4 border-black pl-2.5 text-xs leading-snug text-black">
            Right now: {outsideShown} of {total} posts come from beyond your
            bubble. Change it and the feed re-ranks instantly.
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
