import { useState } from 'react'
import type { AngleType, PerspectiveAngle, Post } from '../types'
import { usePrefs } from '../state/prefs'

// ---------------------------------------------------------------------------
// Perspective Paths: thoughtful angles on a post, replacing blunt "opposite
// opinion" flips. Discussion posts get interpretation / context / affected
// voices; entertainment posts get process and culture. Never pro-vs-anti.
// ---------------------------------------------------------------------------

const ANGLE_LABEL: Record<AngleType, string> = {
  interpretation: 'Another reading',
  context: 'Missing context',
  affected: 'Who else feels this',
  process: 'How it was made',
  culture: 'The culture behind it',
}

/** True when a post's angles are entertainment-flavored. */
// eslint-disable-next-line react-refresh/only-export-components
export function isBehindThe(post: Post): boolean {
  return (post.paths ?? []).every(
    (a) => a.type === 'process' || a.type === 'culture',
  )
}

interface PerspectivePathSheetProps {
  post: Post
  onClose: () => void
}

export default function PerspectivePathSheet({
  post,
  onClose,
}: PerspectivePathSheetProps) {
  const { seen, markSeen } = usePrefs()
  const angles: PerspectiveAngle[] = post.paths ?? []
  const [active, setActive] = useState(0)
  const angle = angles[active]
  const firstTime = !seen['path-sheet']

  return (
    <div
      className="absolute inset-0 z-40 flex items-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="animate-fade-up no-scrollbar max-h-[85%] w-full overflow-y-auto border-t-4 border-black bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-black">
            {isBehindThe(post) ? 'Behind this' : 'More angles'}
          </span>
          <button
            onClick={onClose}
            className="p-1 font-mono text-lg font-bold leading-none text-black"
            aria-label="Close perspectives"
          >
            ✕
          </button>
        </div>

        {/* One-time, dismissed automatically when the sheet closes. */}
        {firstTime && (
          <div className="border-b-2 border-black bg-brand-soft px-4 py-2.5">
            <p className="text-[11px] leading-snug text-black">
              Some posts carry extra angles — not to argue with you, just to
              show the same thing from more than one seat.
            </p>
          </div>
        )}

        {/* Angle tabs */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
          {angles.map((a, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 border-2 border-black px-3 py-1 font-display text-[11px] font-bold uppercase tracking-tight transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                i === active ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {ANGLE_LABEL[a.type]}
            </button>
          ))}
        </div>

        {angle && (
          <div className="px-5 pb-6">
            <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-black">
              {angle.title}
            </h3>
            <p className="mt-2 border-l-4 border-black pl-3 text-sm leading-relaxed text-black">
              {angle.body}
            </p>
            <button
              onClick={() => {
                if (firstTime) markSeen('path-sheet')
                onClose()
              }}
              className="mt-5 w-full border-2 border-black bg-black py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Back to the feed
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
