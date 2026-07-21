import type { ReactNode } from 'react'
import { usePrefs } from '../state/prefs'

interface CoachMarkProps {
  /** Unique flag; the mark renders once, ever, per browser. */
  flag: string
  children: ReactNode
}

/**
 * A one-time contextual tip. Small, dismissible, never modal — features
 * introduce themselves the first time they appear, then get out of the way.
 */
export default function CoachMark({ flag, children }: CoachMarkProps) {
  const { seen, markSeen } = usePrefs()
  if (seen[flag]) return null
  return (
    <div className="animate-fade-up flex items-start gap-2.5 rounded-xl bg-brand-soft px-3.5 py-2.5">
      <span className="mt-0.5 shrink-0 rounded-full bg-brand px-2 py-0.5 text-[9px] font-semibold text-white">
        New
      </span>
      <p className="flex-1 text-[11px] leading-snug text-ink">{children}</p>
      <button
        onClick={() => markSeen(flag)}
        className="shrink-0 p-0.5 text-sm leading-none text-muted"
        aria-label="Dismiss tip"
      >
        ✕
      </button>
    </div>
  )
}
