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
    <div className="animate-fade-up flex items-start gap-2.5 border-2 border-black bg-brand-soft px-3 py-2.5">
      <span className="mt-0.5 shrink-0 border-2 border-black bg-brand px-1 font-mono text-[9px] font-bold text-white">
        NEW
      </span>
      <p className="flex-1 text-[11px] leading-snug text-black">{children}</p>
      <button
        onClick={() => markSeen(flag)}
        className="shrink-0 p-0.5 font-mono text-sm font-bold leading-none text-black"
        aria-label="Dismiss tip"
      >
        ✕
      </button>
    </div>
  )
}
