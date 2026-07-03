import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

// ---------------------------------------------------------------------------
// One central store for everything the user *does* — likes, saves, comments,
// hidden posts — plus a small toast for feedback ("Post hidden · Undo").
// Before this, each PostCard kept its own state, so a like disappeared the
// moment you switched tabs. Now interactions live here and persist to
// localStorage, so the app remembers you like a real one does.
// ---------------------------------------------------------------------------

/** A comment written by the user in this browser. */
export interface UserComment {
  id: string
  text: string
}

/** A transient message shown at the bottom of the phone. */
export interface Toast {
  message: string
  actionLabel?: string
  onAction?: () => void
}

interface InteractionsValue {
  liked: Set<string>
  saved: Set<string>
  hidden: Set<string>
  comments: Record<string, UserComment[]>
  toast: Toast | null
  like: (postId: string) => void
  toggleLike: (postId: string) => void
  toggleSave: (postId: string) => void
  hidePost: (postId: string) => void
  unhidePost: (postId: string) => void
  addComment: (postId: string, text: string) => void
  showToast: (toast: Toast) => void
  clearToast: () => void
}

const InteractionsContext = createContext<InteractionsValue | null>(null)

const STORAGE_KEY = 'diverge-interactions-v1'

// Read whatever was saved last visit. Wrapped in try/catch so a corrupt or
// blocked localStorage (private browsing, old data) can never crash the app.
function loadSaved(): {
  liked?: string[]
  saved?: string[]
  hidden?: string[]
  comments?: Record<string, UserComment[]>
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
const initial = loadSaved()

/** Immutable Set toggle — React state needs a fresh Set to notice changes. */
function toggled(set: Set<string>, id: string): Set<string> {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

export function InteractionsProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState(() => new Set(initial.liked ?? []))
  const [saved, setSaved] = useState(() => new Set(initial.saved ?? []))
  const [hidden, setHidden] = useState(() => new Set(initial.hidden ?? []))
  const [comments, setComments] = useState<Record<string, UserComment[]>>(
    () => initial.comments ?? {},
  )
  const [toast, setToast] = useState<Toast | null>(null)

  // Persist after every change (toast is transient and not saved).
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          liked: [...liked],
          saved: [...saved],
          hidden: [...hidden],
          comments,
        }),
      )
    } catch {
      // Storage unavailable — the app still works, it just won't remember.
    }
  }, [liked, saved, hidden, comments])

  const value: InteractionsValue = {
    liked,
    saved,
    hidden,
    comments,
    toast,
    // `like` only ever adds (double-tap never un-likes, same as Instagram).
    like: (id) => setLiked((s) => (s.has(id) ? s : new Set(s).add(id))),
    toggleLike: (id) => setLiked((s) => toggled(s, id)),
    toggleSave: (id) => setSaved((s) => toggled(s, id)),
    hidePost: (id) => setHidden((s) => new Set(s).add(id)),
    unhidePost: (id) =>
      setHidden((s) => {
        const next = new Set(s)
        next.delete(id)
        return next
      }),
    addComment: (postId, text) =>
      setComments((c) => ({
        ...c,
        [postId]: [
          ...(c[postId] ?? []),
          { id: `c-${Date.now()}`, text },
        ],
      })),
    showToast: setToast,
    clearToast: () => setToast(null),
  }

  return (
    <InteractionsContext.Provider value={value}>
      {children}
    </InteractionsContext.Provider>
  )
}

/** Hook used by any component that reads or records an interaction. The hook
 * and provider belong together; hot-reload still works fine for this file. */
// eslint-disable-next-line react-refresh/only-export-components
export function useInteractions(): InteractionsValue {
  const ctx = useContext(InteractionsContext)
  if (!ctx)
    throw new Error('useInteractions must be used inside InteractionsProvider')
  return ctx
}
