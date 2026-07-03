import { useState } from 'react'
import { intentions } from '../data/intentions'
import type { IntentionId } from '../types'

interface IntentionalModeProps {
  onConfirm: (intention: IntentionId) => void
  onSkip: () => void
}

/**
 * A quick "set your intention" moment. One tap selects; a blunt one-liner
 * confirms how the feed will shift, then they're in. Framed as a deliberate
 * choice the user makes — not a vibe the app guesses.
 */
export default function IntentionalMode({
  onConfirm,
  onSkip,
}: IntentionalModeProps) {
  const [selected, setSelected] = useState<IntentionId | null>(null)
  const chosen = intentions.find((i) => i.id === selected) ?? null

  return (
    // Outer = scroll viewport (matches phone height). Inner = at-least-full
    // content, so on short screens the whole thing scrolls and the button below
    // stays reachable.
    <div className="no-scrollbar h-full overflow-y-auto bg-white sm:pt-7">
      <div className="animate-fade-up flex min-h-full flex-col px-6 pb-7 pt-12">
        <header className="border-b-4 border-black pb-4">
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-muted">
            01 — set intention
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-none tracking-tighter text-black">
            How do you
            <br />
            want to feel?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your pick decides what you see. You choose — not the algorithm.
          </p>
        </header>

        {/* Mood tiles */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {intentions.map((intention, i) => {
            const active = selected === intention.id
            return (
              <button
                key={intention.id}
                onClick={() => setSelected(intention.id)}
                className={`flex flex-col items-start gap-3 border-2 border-black p-4 text-left transition-all ${
                  active
                    ? 'bg-black text-white shadow-hard'
                    : 'bg-white text-black active:translate-x-0.5 active:translate-y-0.5'
                }`}
              >
                <span className="font-mono text-2xl font-bold leading-none tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-sm font-bold uppercase leading-tight tracking-tight">
                  {intention.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* Blunt confirmation, appears on select */}
        {chosen && (
          <div className="animate-pop-in mt-5 border-2 border-black bg-brand-soft p-4 text-sm leading-relaxed text-black">
            <span className="font-bold uppercase">→ </span>
            {chosen.message}
          </div>
        )}

        <div className="mt-auto pt-5">
          <button
            disabled={!selected}
            onClick={() => selected && onConfirm(selected)}
            className="w-full border-2 border-black bg-black py-4 font-display text-base font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
          >
            Start scrolling
          </button>
          <button
            onClick={onSkip}
            className="mt-3 w-full py-2 font-display text-xs uppercase tracking-wider text-muted underline underline-offset-4 active:text-black"
          >
            Just show me the feed
          </button>
        </div>
      </div>
    </div>
  )
}
