import { useMemo, useState } from 'react'
import { getBubbleStats } from '../lib/feed'
import { useInteractions } from '../state/interactions'

// ---------------------------------------------------------------------------
// The Bubble Map: your media world drawn as a tiny galaxy. You sit in the
// middle; the six topic buckets orbit you. Topics you engage with grow and
// pull closer, untouched ones drift to the edge, and the dashed ring marks
// the boundary of "your bubble" (it widens with your diversity score).
// Everything animates, so liking a post on the Home tab literally moves
// this map. Tap any bubble for its numbers.
// ---------------------------------------------------------------------------

// One fixed slot per bucket, spaced 60° apart. The hue order around the
// circle was chosen so no two colorblind-confusable hues sit next to each
// other (validated: pink→blue→orange→purple→teal→amber all pass CVD checks).
const SLOTS: { group: string; short: string; color: string }[] = [
  { group: 'Entertainment', short: 'Entertainment', color: '#ec4899' },
  { group: 'News', short: 'News', color: '#3b82f6' },
  { group: 'Sports', short: 'Sports', color: '#f97316' },
  { group: 'Culture', short: 'Culture', color: '#a855f7' },
  { group: 'Education', short: 'Education', color: '#14b8a6' },
  { group: 'Opposing Views', short: 'New views', color: '#f59e0b' },
]

// SVG geometry constants (viewBox coordinates).
const W = 320
const H = 300
const CX = W / 2
const CY = 148

interface BubbleMapProps {
  /** Diversity score 0–100 — sets how wide the dashed bubble ring is. */
  score: number
}

export default function BubbleMap({ score }: BubbleMapProps) {
  const { liked, saved, comments } = useInteractions()
  const [selected, setSelected] = useState<string | null>(null)

  // Union of every post id the user has touched in any way.
  const engagedIds = useMemo(() => {
    const ids = new Set([...liked, ...saved])
    for (const [postId, list] of Object.entries(comments)) {
      if (list.length > 0) ids.add(postId)
    }
    return ids
  }, [liked, saved, comments])

  const stats = useMemo(() => getBubbleStats(engagedIds), [engagedIds])

  // The dashed boundary of "your bubble" widens as your diversity score
  // rises — a bolder intention literally makes your world bigger.
  const ringR = 46 + score * 0.5

  const maxW = Math.max(...stats.map((s) => s.weight), 1)

  // Turn each bucket's weight into a position + size: heavier topics are
  // bigger and orbit closer to you; ignored ones shrink toward the edge.
  const bubbles = SLOTS.map((slot, i) => {
    const stat = stats.find((s) => s.group === slot.group)!
    const rel = stat.weight / maxW
    const r = 15 + rel * 13 // 15..28
    const dist = 106 - rel * 44 // 62..106
    const angle = ((-90 + i * 60) * Math.PI) / 180
    const x = CX + dist * Math.cos(angle)
    const y = CY + dist * Math.sin(angle)
    const inBubble = dist <= ringR
    return { ...slot, ...stat, r, x, y, inBubble, upper: Math.sin(angle) < 0 }
  })

  const sel = bubbles.find((b) => b.group === selected)

  return (
    <div className="border-2 border-black bg-white shadow-hard">
      <div className="border-b-2 border-black px-4 py-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-tight text-black">
          Your bubble map
        </h3>
        <p className="mt-0.5 text-[11px] leading-snug text-muted">
          Topics you touch grow and pull closer. The dashed line is the edge
          of your bubble.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label="Map of your topic bubble: six topics orbiting you, sized by how much you engage with them"
      >
        {/* Boundary of your bubble — widens with your diversity score. */}
        <circle
          cx={CX}
          cy={CY}
          r={ringR}
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          style={{ transition: 'r 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
        {/* Threads from you to every topic, under the bubbles. */}
        {bubbles.map((b) => (
          <line
            key={`l-${b.group}`}
            x1={CX}
            y1={CY}
            x2={b.x}
            y2={b.y}
            stroke="#000"
            strokeWidth="1.5"
            opacity="0.25"
            style={{
              transition: 'x2 0.6s, y2 0.6s',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        ))}

        {/* The six topic bubbles. */}
        {bubbles.map((b) => {
          const isSel = selected === b.group
          return (
            <g
              key={b.group}
              transform={`translate(${b.x}, ${b.y})`}
              style={{
                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                cursor: 'pointer',
              }}
              onClick={() => setSelected(isSel ? null : b.group)}
            >
              {/* Oversized invisible hit target so small bubbles stay tappable. */}
              <circle r={Math.max(b.r, 22)} fill="transparent" />
              <circle
                r={b.r}
                fill={b.color}
                stroke="#000"
                strokeWidth={isSel ? 4 : 2}
                style={{ transition: 'r 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              <text
                y={b.upper ? -(b.r + 7) : b.r + 13}
                textAnchor="middle"
                className="font-mono"
                fontSize="9"
                fontWeight="700"
                fill="#000"
              >
                {b.short.toUpperCase()}
              </text>
            </g>
          )
        })}

        {/* You, at the center of it all. */}
        <circle cx={CX} cy={CY} r="17" fill="#2b3bff" stroke="#000" strokeWidth="2" />
        <text
          x={CX}
          y={CY + 3}
          textAnchor="middle"
          className="font-display"
          fontSize="9"
          fontWeight="700"
          fill="#fff"
          letterSpacing="1"
        >
          YOU
        </text>
      </svg>

      {/* Detail line — fixed height so tapping never jumps the layout. */}
      <div className="flex min-h-[52px] items-center border-t-2 border-black px-4 py-2.5">
        {sel ? (
          <div className="flex w-full items-center gap-2.5">
            <span
              className="h-3.5 w-3.5 shrink-0 border-2 border-black"
              style={{ background: sel.color }}
            />
            <p className="flex-1 text-[11px] leading-snug text-black">
              <span className="font-bold">{sel.group}</span> —{' '}
              {sel.feedCount} post{sel.feedCount === 1 ? '' : 's'} in your
              feed · {sel.engaged} you engaged with
            </p>
            <span
              className={`shrink-0 border-2 border-black px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-tight ${
                sel.inBubble ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {sel.inBubble ? 'In bubble' : 'Beyond'}
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-muted">
            Tap a topic to see how it fits your bubble.
          </p>
        )}
      </div>
    </div>
  )
}
