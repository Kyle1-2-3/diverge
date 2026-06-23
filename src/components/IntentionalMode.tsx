import { useState } from 'react'
import { intentions } from '../data/intentions'
import type { IntentionId } from '../types'

interface IntentionalModeProps {
  onConfirm: (intention: IntentionId) => void
  onSkip: () => void
}

/**
 * A quick, emotional "set your mood" moment — feels like picking a vibe, not
 * filling out a survey. One tap selects; a warm one-liner confirms how the feed
 * will shift, then they're in.
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
    <div className="no-scrollbar h-full overflow-y-auto bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="animate-fade-up flex min-h-full flex-col px-6 pb-7 pt-16">
      <header>
        <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink">
          How do you want
          <br />
          to feel today?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Your pick gently shapes what you see. Change it anytime.
        </p>
      </header>

      {/* Mood tiles */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {intentions.map((intention) => {
          const active = selected === intention.id
          return (
            <button
              key={intention.id}
              onClick={() => setSelected(intention.id)}
              className={`flex flex-col items-start gap-2 rounded-3xl border p-4 text-left transition-all active:scale-[0.97] ${
                active
                  ? 'border-brand bg-brand-soft shadow-md'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="text-3xl">{intention.emoji}</span>
              <span className="text-sm font-bold leading-tight text-ink">
                {intention.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* Warm confirmation, appears on select */}
      {chosen && (
        <div className="animate-pop-in mt-5 rounded-2xl bg-ink/[0.04] p-4 text-sm leading-relaxed text-ink">
          {chosen.message}
        </div>
      )}

      <div className="mt-auto pt-5">
        <button
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
          className="w-full rounded-2xl bg-ink py-4 text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-25"
        >
          Start scrolling
        </button>
        <button
          onClick={onSkip}
          className="mt-2 w-full py-2 text-sm font-medium text-muted active:text-ink"
        >
          Just show me the feed
        </button>
      </div>
      </div>
    </div>
  )
}
