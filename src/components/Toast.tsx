import { useEffect } from 'react'
import { useInteractions } from '../state/interactions'

/**
 * The little feedback pill at the bottom of the phone ("Post hidden ·
 * Undo", "Link copied"). Rendered once in App; any component can trigger it
 * through the interactions store.
 */
export default function ToastHost() {
  const { toast, clearToast } = useInteractions()

  // Auto-dismiss after a few seconds. Keyed on the toast object so a new
  // message restarts the timer.
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(clearToast, 3500)
    return () => window.clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null

  return (
    <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-[60] flex justify-center px-6">
      <div className="animate-fade-up shadow-soft-lg pointer-events-auto flex items-center gap-3 rounded-full bg-ink px-4 py-2.5">
        <span className="text-xs text-white">{toast.message}</span>
        {toast.actionLabel && (
          <button
            onClick={() => {
              toast.onAction?.()
              clearToast()
            }}
            className="text-xs font-semibold text-white underline underline-offset-2"
          >
            {toast.actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
