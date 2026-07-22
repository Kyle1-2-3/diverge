import { useState } from 'react'
import type { GroupId, TopicId } from '../types'
import { useLocale } from '../i18n'
import { adjacency, groupMeta, topics } from '../data/topics'
import { useModel } from '../state/model'
import { usePrefs } from '../state/prefs'
import BubbleMap from './BubbleMap'

// ---------------------------------------------------------------------------
// Profile → Interest Map: the galaxy plus real controls. Neutral by design —
// it shows what shaped the feed recently and hands the user the dials.
// ---------------------------------------------------------------------------

const LEVELS = [
  { key: 'more', labelKey: 'map.level.more' },
  { key: null, labelKey: 'map.level.normal' },
  { key: 'less', labelKey: 'map.level.less' },
  { key: 'paused', labelKey: 'map.level.pause' },
] as const

interface InterestMapScreenProps {
  onClose: () => void
}

export default function InterestMapScreen({ onClose }: InterestMapScreenProps) {
  const { t } = useLocale()
  const { diversity } = useModel()
  const { feedPrefs, adjustTopic, resetAdjust } = usePrefs()
  const [openTopic, setOpenTopic] = useState<TopicId | null>(null)

  const score = 40 + Math.round(diversity * 0.55)
  const adjustedCount = Object.keys(feedPrefs.topicAdjust).length
  const groups = Object.keys(groupMeta) as GroupId[]

  return (
    <div className="animate-fade-up absolute inset-0 z-40 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b border-hairline bg-white px-4 py-3 sm:mt-7">
        <div>
          <h2 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
            {t('map.title')}
          </h2>
          <p className="text-[11px] text-muted">{t('map.subtitle')}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
        >
          {t('common.done')}
        </button>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <BubbleMap score={score} />

        <div className="mt-4 flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-ink">
            {t('map.tuneTopics')}
          </h3>
          {adjustedCount > 0 && (
            <button
              onClick={resetAdjust}
              className="rounded-full border border-hairline bg-white px-2.5 py-0.5 text-[11px] font-medium text-muted transition-transform active:scale-[0.98]"
            >
              {t(adjustedCount === 1 ? 'map.reset' : 'map.resetPlural', {
                n: adjustedCount,
              })}
            </button>
          )}
        </div>

        {groups.map((g) => (
          <div key={g} className="mt-3">
            <p className="flex items-center gap-2 text-xs font-medium text-faint">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: groupMeta[g].color }}
              />
              {t(`group.${g}`)}
            </p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {topics
                .filter((topic) => topic.group === g)
                .map((topic) => {
                  const level = feedPrefs.topicAdjust[topic.id] ?? null
                  const open = openTopic === topic.id
                  const nearby = adjacency[topic.id]
                  return (
                    <div
                      key={topic.id}
                      className="overflow-hidden rounded-lg border border-hairline bg-white"
                    >
                      <div className="flex items-center gap-2 px-2.5 py-1.5">
                        <button
                          onClick={() => setOpenTopic(open ? null : topic.id)}
                          className="flex-1 text-left text-xs font-medium text-ink"
                        >
                          {t(`topic.${topic.id}`)}
                          {level && (
                            <span className="ml-1.5 text-[10px] font-semibold text-brand">
                              ·{' '}
                              {t(
                                level === 'more'
                                  ? 'map.level.more'
                                  : level === 'less'
                                    ? 'map.level.less'
                                    : 'map.level.pause',
                              )}
                            </span>
                          )}
                        </button>
                        <div className="flex gap-1">
                          {LEVELS.map((l) => (
                            <button
                              key={l.labelKey}
                              onClick={() => adjustTopic(topic.id, l.key)}
                              aria-pressed={level === l.key}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-transform active:scale-[0.98] ${
                                level === l.key
                                  ? 'bg-ink text-white'
                                  : 'border border-hairline bg-white text-muted'
                              }`}
                            >
                              {t(l.labelKey)}
                            </button>
                          ))}
                        </div>
                      </div>
                      {open && nearby.length > 0 && (
                        <div className="bg-brand-soft px-2.5 py-1.5">
                          <p className="text-[11px] text-brand">
                            {t('map.nearby', {
                              list: nearby
                                .map((n) => t(`topic.${n}`))
                                .join(' · '),
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}

        <p className="mt-4 pb-2 text-[11px] leading-snug text-faint">
          {t('map.footnote')}
        </p>
      </div>
    </div>
  )
}
