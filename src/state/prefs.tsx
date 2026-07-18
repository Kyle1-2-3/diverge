import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { IntentionId, TopicId } from '../types'
import type { BusinessModel } from '../data/models'
import type { FeedPrefs, TopicAdjust } from '../lib/recommend'

// ---------------------------------------------------------------------------
// Everything the user has told the feed about itself: topic adjustments,
// hidden creators, a remembered intention, one-time coach marks, and the
// per-model session observations shown in the Platform Model Lab.
// Persisted to localStorage so choices genuinely shape later sessions.
// ---------------------------------------------------------------------------

export interface SessionStats {
  seconds: number
  posts: number
  ads: number
  core: number
  adjacent: number
  discovery: number
  creators: string[]
  /** Explicit choices made (feedback, forks taken, dial changes…). */
  choices: number
  endedNaturally: boolean
  feeling: string | null
}

const EMPTY_SESSION: SessionStats = {
  seconds: 0,
  posts: 0,
  ads: 0,
  core: 0,
  adjacent: 0,
  discovery: 0,
  creators: [],
  choices: 0,
  endedNaturally: false,
  feeling: null,
}

interface PrefsValue {
  feedPrefs: FeedPrefs
  adjustTopic: (topic: TopicId, level: 'more' | 'less' | 'paused' | null) => void
  resetAdjust: () => void
  hideCreator: (handle: string) => void
  unhideCreator: (handle: string) => void

  rememberedIntention: IntentionId | null
  setRememberedIntention: (id: IntentionId | null) => void

  /** One-time contextual tips that have already been shown. */
  seen: Record<string, boolean>
  markSeen: (flag: string) => void

  sessions: Partial<Record<BusinessModel, SessionStats>>
  /** Start a fresh observation for a model (called on model entry). */
  resetSession: (model: BusinessModel) => void
  /** Merge an update into a model's current observation. */
  updateSession: (
    model: BusinessModel,
    up: (s: SessionStats) => SessionStats,
  ) => void
}

const PrefsContext = createContext<PrefsValue | null>(null)

const STORAGE_KEY = 'diverge-prefs-v1'

interface Stored {
  topicAdjust?: TopicAdjust
  hiddenCreators?: string[]
  rememberedIntention?: IntentionId | null
  seen?: Record<string, boolean>
  sessions?: Partial<Record<BusinessModel, SessionStats>>
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
const initial = load()

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [topicAdjust, setTopicAdjust] = useState<TopicAdjust>(
    initial.topicAdjust ?? {},
  )
  const [hiddenCreators, setHiddenCreators] = useState<string[]>(
    initial.hiddenCreators ?? [],
  )
  const [rememberedIntention, setRememberedIntention] =
    useState<IntentionId | null>(initial.rememberedIntention ?? null)
  const [seen, setSeen] = useState<Record<string, boolean>>(initial.seen ?? {})
  const [sessions, setSessions] = useState<
    Partial<Record<BusinessModel, SessionStats>>
  >(initial.sessions ?? {})

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          topicAdjust,
          hiddenCreators,
          rememberedIntention,
          seen,
          sessions,
        } satisfies Stored),
      )
    } catch {
      // Storage unavailable — the app still works, it just won't remember.
    }
  }, [topicAdjust, hiddenCreators, rememberedIntention, seen, sessions])

  const value: PrefsValue = {
    feedPrefs: { topicAdjust, hiddenCreators },
    adjustTopic: (topic, level) =>
      setTopicAdjust((prev) => {
        const next = { ...prev }
        if (level === null) delete next[topic]
        else next[topic] = level
        return next
      }),
    resetAdjust: () => setTopicAdjust({}),
    hideCreator: (handle) =>
      setHiddenCreators((prev) =>
        prev.includes(handle) ? prev : [...prev, handle],
      ),
    unhideCreator: (handle) =>
      setHiddenCreators((prev) => prev.filter((h) => h !== handle)),

    rememberedIntention,
    setRememberedIntention,

    seen,
    markSeen: (flag) => setSeen((prev) => ({ ...prev, [flag]: true })),

    sessions,
    resetSession: (model) =>
      setSessions((prev) => ({ ...prev, [model]: { ...EMPTY_SESSION } })),
    updateSession: (model, up) =>
      setSessions((prev) => ({
        ...prev,
        [model]: up(prev[model] ?? { ...EMPTY_SESSION }),
      })),
  }

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

/** Hook for anything reading or writing the user's feed preferences. */
// eslint-disable-next-line react-refresh/only-export-components
export function usePrefs(): PrefsValue {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider')
  return ctx
}
