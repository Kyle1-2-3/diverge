import { useMemo, useState } from 'react'
import type { GroupId } from '../types'
import { useLocale } from '../i18n'
import { getBubbleStats } from '../lib/feed'
import { useInteractions } from '../state/interactions'

// ---------------------------------------------------------------------------
// The Interest Map's galaxy: you in the middle, the eight topic worlds
// orbiting you. Groups you engage with grow and pull closer, untouched ones
// drift outward, and the dashed ring marks the edge of your current bubble.
// Tap any bubble for its numbers. Neutral by design: it describes what
// shaped your feed — it never grades you.
// ---------------------------------------------------------------------------

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
  const { t } = useLocale()
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
    <div className="shadow-soft overflow-hidden rounded-xl border border-hairline bg-white">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label={t('map.aria')}
      >
        {/* Edge of your current bubble — widens as your mix widens. */}
        <circle
          cx={CX}
          cy={CY}
          r={ringR}
          fill="none"
          stroke="#a39e98"
          strokeWidth="1.25"
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
            stroke="#e6e6e6"
            strokeWidth="1.25"
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
              {/* Soft halo instead of a hard outline when selected. */}
              <circle
                r={b.r}
                fill={b.color}
                stroke="#191918"
                strokeOpacity={isSel ? 0.3 : 0}
                strokeWidth={3}
                style={{ transition: 'r 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              <text
                y={b.upper ? -(b.r + 6) : b.r + 12}
                textAnchor="middle"
                fontSize="9"
                fontWeight="500"
                fill="#615d59"
              >
                {t(`group.short.${b.group}`)}
              </text>
            </g>
          )
        })}

        {/* You, at the center of it all. */}
        <circle
          cx={CX}
          cy={CY}
          r="16"
          style={{ fill: 'var(--color-brand)' }}
        />
        <text
          x={CX}
          y={CY + 3}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="#fff"
        >
          {t('common.you')}
        </text>
      </svg>

      {/* Detail line — fixed height so tapping never jumps the layout. */}
      <div className="flex min-h-[52px] items-center border-t border-hairline px-4 py-2.5">
        {sel ? (
          <div className="flex w-full items-center gap-2.5">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: sel.color }}
            />
            <p className="flex-1 text-[11px] leading-snug text-ink">
              {t('map.postsAround', {
                label: t(`group.${sel.group}`),
                n: sel.feedCount,
                engaged: sel.engaged,
              })}
            </p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                sel.inBubble
                  ? 'bg-ink text-white'
                  : 'border border-hairline bg-white text-muted'
              }`}
            >
              {sel.inBubble ? t('map.closeToYou') : t('map.furtherOut')}
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-muted">{t('map.tapHint')}</p>
        )}
      </div>
    </div>
  )
}
