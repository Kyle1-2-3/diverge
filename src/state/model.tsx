import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { modelById, type BusinessModel, type ModelMeta } from '../data/models'

// ---------------------------------------------------------------------------
// Which business model the app is currently running under, plus the small
// bits of state that belong to a model rather than to the user's content:
// the public model's diversity dial, the attention model's ever-growing
// unread counter, and when the current session started (for usage insights).
// ---------------------------------------------------------------------------

interface ModelValue {
  model: BusinessModel
  meta: ModelMeta
  setModel: (m: BusinessModel) => void
  /** 0–100 — how much outside-bubble content the public model mixes in. */
  diversity: number
  setDiversity: (n: number) => void
  /** Fake unread count driving the attention model's red badge. */
  unread: number
  bumpUnread: () => void
  clearUnread: () => void
  /** Minutes since this session (or the last model switch) began. */
  sessionMinutes: () => number
}

const ModelContext = createContext<ModelValue | null>(null)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [model, setModelState] = useState<BusinessModel>('attention')
  const [diversity, setDiversity] = useState(70)
  const [unread, setUnread] = useState(3)
  const sessionStart = useRef(Date.now())

  const value = useMemo<ModelValue>(
    () => ({
      model,
      meta: modelById(model),
      setModel: (m) => {
        setModelState(m)
        setUnread(m === 'attention' ? 3 : 0)
        sessionStart.current = Date.now()
      },
      diversity,
      setDiversity,
      unread,
      bumpUnread: () => setUnread((n) => n + 1),
      clearUnread: () => setUnread(0),
      sessionMinutes: () =>
        Math.max(0, Math.round((Date.now() - sessionStart.current) / 60000)),
    }),
    [model, diversity, unread],
  )

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
}

/** Hook for anything that needs to know how the app earns money. */
// eslint-disable-next-line react-refresh/only-export-components
export function useModel(): ModelValue {
  const ctx = useContext(ModelContext)
  if (!ctx) throw new Error('useModel must be used inside ModelProvider')
  return ctx
}
