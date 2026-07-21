import { useState } from 'react'
import { intentions } from '../data/intentions'
import type { IntentionId } from '../types'
import { usePrefs } from '../state/prefs'

interface IntentionalModeProps {
  onConfirm: (intention: IntentionId) => void
  onSkip: () => void
}

/**
 * The session's intention, picked in seconds: five chips, one tap, in.
 * Optional and welcoming — skippable, rememberable, changeable mid-session
 * from the pill in the feed's top bar.
 */
export default function IntentionalMode({
  onConfirm,
  onSkip,
}: IntentionalModeProps) {
  const { rememberedIntention, setRememberedIntention } = usePrefs()
  const [remember, setRemember] = useState(rememberedIntention !== null)

  const pick = (id: IntentionId) => {
    setRememberedIntention(remember ? id : null)
    onConfirm(id)
  }

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-white sm:pt-7">
      <div className="animate-fade-up flex min-h-full flex-col px-6 pb-7 pt-12">
        <header>
          <p className="text-xs font-semibold text-faint">
            Two seconds, promise
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink">
            What's the
            <br />
            vibe today?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Your pick shapes the session — change it anytime from the pill up
            top.
          </p>
        </header>

        {/* One tap = in. No confirm step. */}
        <div className="mt-6 flex flex-col gap-2.5">
          {intentions.map((intention, i) => (
            <button
              key={intention.id}
              onClick={() => pick(intention.id)}
              className="animate-fade-up shadow-soft flex items-center gap-3.5 rounded-xl border border-hairline bg-white px-4 py-3 text-left transition-transform active:scale-[0.98]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-2xl">{intention.emoji}</span>
              <span className="flex-1">
                <span className="block font-display text-sm font-semibold text-ink">
                  {intention.title}
                </span>
                <span className="block text-xs text-muted">
                  {intention.subtitle}
                </span>
              </span>
              <span className="text-faint">→</span>
            </button>
          ))}
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => {
              setRemember(e.target.checked)
              if (!e.target.checked) setRememberedIntention(null)
            }}
            className="h-4 w-4 accent-brand"
          />
          <span className="text-xs font-medium text-muted">
            Remember my pick for next time
          </span>
        </label>

        <button
          onClick={onSkip}
          className="mt-auto pt-6 text-center text-xs font-semibold text-muted"
        >
          Skip for now →
        </button>
      </div>
    </div>
  )
}
