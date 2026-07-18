import { useMemo, useState } from 'react'
import type { GroupId } from '../types'
import { getBubbleStats } from '../lib/feed'
import { useInteractions } from '../state/interactions'

// ---------------------------------------------------------------------------
// The Interest Map's galaxy: you in the middle, the eight topic worlds
// orbiting you. Groups you engage with grow and pull closer, untouched ones
// drift outward, and the dashed ring marks the edge of your current bubble.
// Tap any bubble for its numbers. Neutral by design: it describes what
// shaped your feed — it never grades you.
// ---------------------------------------------------------------------------

/** Short labels that fit the map. */
const SHORT: Record<GroupId, string> = {
  life: 'Friends',
  fashion: 'Fashion',
  food: 'Food',
  sports: 'Sports',
  art: 'Art',
  travel: 'Cities',
  tech: 'Tech',
  music: 'Music',
}

// Fixed slot order around the circle, chosen so neighboring hues differ.
const ORDER: GroupId[] = [
  'fashion',
  'sports',
  'food',
  'tech',
  'life',
  'art',
  'music',
  'travel',
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
  const [selected, setSelected] = useState<GroupId | null>(null)

  // Union of every post id the user has touched in any way.
  const engagedIds = useMemo(() => {
    const ids = new Set([...liked, ...saved])
    for (const [postId, list] of Object.entries(comments)) {
      if (list.length > 0) ids.add(postId)
    }
    return ids
  }, [liked, saved, comments])

  const stats = useMemo(() => getBubbleStats(engagedIds), [engagedIds])
  const ringR = 46 + score * 0.5
  const maxW = Math.max(...stats.map((s) => s.weight), 1)

  const bubbles = ORDER.map((group, i) => {
    const stat = stats.find((s) => s.group === group)!
    const rel = stat.weight / maxW
    const r = 13 + rel * 9 // 13..22
    const dist = 108 - rel * 42 // 66..108
    const angle = ((-90 + i * 45) * Math.PI) / 180
    const x = CX + dist * Math.cos(angle)
    const y = CY + dist * Math.sin(angle)
    return {
      ...stat,
      r,
      x,
      y,
      inBubble: dist <= ringR,
      upper: Math.sin(angle) < -0.01,
    }
  })

  const sel = bubbles.find((b) => b.group === selected)

  return (
    <div className="border-2 border-black bg-white shadow-hard">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label="Map of your interests: eight topic worlds orbiting you, sized by how much you engage with them"
      >
        {/* Edge of your current bubble — widens as your mix widens. */}
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

        {bubbles.map((b) => (
          <line
            key={`l-${b.group}`}
            x1={CX}
            y1={CY}
            x2={b.x}
            y2={b.y}
            stroke="#000"
            strokeWidth="1.5"
            opacity="0.22"
            style={{
              transition: 'x2 0.6s, y2 0.6s',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        ))}

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
              <circle r={Math.max(b.r, 20)} fill="transparent" />
              <circle
                r={b.r}
                fill={b.color}
                stroke="#000"
                strokeWidth={isSel ? 4 : 2}
                style={{ transition: 'r 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              <text
                y={b.upper ? -(b.r + 6) : b.r + 12}
                textAnchor="middle"
                className="font-mono"
                fontSize="8.5"
                fontWeight="700"
                fill="#000"
              >
                {SHORT[b.group].toUpperCase()}
              </text>
            </g>
          )
        })}

        {/* You, at the center of it all. */}
        <circle cx={CX} cy={CY} r="16" fill="#2b3bff" stroke="#000" strokeWidth="2" />
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
              <span className="font-bold">{sel.label}</span> —{' '}
              {sel.feedCount} post{sel.feedCount === 1 ? '' : 's'} around ·{' '}
              {sel.engaged} you engaged with
            </p>
            <span
              className={`shrink-0 border-2 border-black px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-tight ${
                sel.inBubble ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {sel.inBubble ? 'Close to you' : 'Further out'}
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-muted">
            Tap a world to see how it fits your feed.
          </p>
        )}
      </div>
    </div>
  )
}
