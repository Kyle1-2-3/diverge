import { useState } from 'react'
import type { GroupId, TopicId } from '../types'
import { adjacency, groupMeta, topicMeta, topics } from '../data/topics'
import { useModel } from '../state/model'
import { usePrefs } from '../state/prefs'
import BubbleMap from './BubbleMap'

// ---------------------------------------------------------------------------
// Profile → Interest Map: the galaxy plus real controls. Neutral by design —
// it shows what shaped the feed recently and hands the user the dials.
// ---------------------------------------------------------------------------

const LEVELS = [
  { key: 'more', label: 'More' },
  { key: null, label: 'Normal' },
  { key: 'less', label: 'Less' },
  { key: 'paused', label: 'Pause' },
] as const

interface InterestMapScreenProps {
  onClose: () => void
}

export default function InterestMapScreen({ onClose }: InterestMapScreenProps) {
  const { diversity } = useModel()
  const { feedPrefs, adjustTopic, resetAdjust } = usePrefs()
  const [openTopic, setOpenTopic] = useState<TopicId | null>(null)

  const score = 40 + Math.round(diversity * 0.55)
  const adjustedCount = Object.keys(feedPrefs.topicAdjust).length
  const groups = Object.keys(groupMeta) as GroupId[]

  return (
    <div className="animate-fade-up absolute inset-0 z-40 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b-4 border-black bg-white px-4 py-3 sm:mt-7">
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-black">
            Interest map
          </h2>
          <p className="text-[11px] text-muted">
            What's shaped your feed recently — tune it however you like.
          </p>
        </div>
        <button
          onClick={onClose}
          className="border-2 border-black bg-white px-2.5 py-1 font-display text-[11px] font-bold uppercase text-black active:translate-x-0.5 active:translate-y-0.5"
        >
          Done
        </button>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <BubbleMap score={score} />

        <div className="mt-4 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-tight text-black">
            Tune topics
          </h3>
          {adjustedCount > 0 && (
            <button
              onClick={resetAdjust}
              className="border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-tight text-black active:translate-x-0.5 active:translate-y-0.5"
            >
              Reset {adjustedCount} change{adjustedCount === 1 ? '' : 's'}
            </button>
          )}
        </div>

        {groups.map((g) => (
          <div key={g} className="mt-3">
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
              <span
                className="inline-block h-2.5 w-2.5 border border-black"
                style={{ background: groupMeta[g].color }}
              />
              {groupMeta[g].label}
            </p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {topics
                .filter((t) => t.group === g)
                .map((t) => {
                  const level = feedPrefs.topicAdjust[t.id] ?? null
                  const open = openTopic === t.id
                  const nearby = adjacency[t.id]
                  return (
                    <div key={t.id} className="border-2 border-black bg-white">
                      <div className="flex items-center gap-2 px-2.5 py-1.5">
                        <button
                          onClick={() => setOpenTopic(open ? null : t.id)}
                          className="flex-1 text-left font-display text-xs font-bold text-black"
                        >
                          {t.label}
                          {level && (
                            <span className="ml-1.5 font-mono text-[9px] uppercase text-brand">
                              · {level}
                            </span>
                          )}
                        </button>
                        <div className="flex gap-1">
                          {LEVELS.map((l) => (
                            <button
                              key={l.label}
                              onClick={() => adjustTopic(t.id, l.key)}
                              aria-pressed={level === l.key}
                              className={`border-2 border-black px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-tight transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                                level === l.key
                                  ? 'bg-black text-white'
                                  : 'bg-white text-black'
                              }`}
                            >
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {open && nearby.length > 0 && (
                        <div className="border-t-2 border-black bg-brand-soft px-2.5 py-1.5">
                          <p className="font-mono text-[9px] uppercase tracking-tight text-black">
                            Nearby:{' '}
                            {nearby.map((n) => topicMeta[n].label).join(' · ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}

        <p className="mt-4 pb-2 text-[11px] leading-snug text-muted">
          “More” and “less” re-rank future chapters. “Pause” removes a topic
          until you resume it here. Nothing here judges your taste.
        </p>
      </div>
    </div>
  )
}
