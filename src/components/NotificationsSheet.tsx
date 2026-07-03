import { useState } from 'react'
import { notifications } from '../data/notifications'
import Avatar from './Avatar'

interface NotificationsSheetProps {
  onClose: () => void
}

/**
 * The activity panel behind the heart icon in the feed's top bar — likes,
 * follows and mentions, with the diverge accent on activity from outside the
 * user's usual circle. Follow-backs toggle locally so the panel feels alive.
 */
export default function NotificationsSheet({
  onClose,
}: NotificationsSheetProps) {
  const [followed, setFollowed] = useState<Set<string>>(new Set())

  const toggleFollow = (id: string) =>
    setFollowed((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div
      className="absolute inset-0 z-40 flex items-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="animate-fade-up flex max-h-[80%] w-full flex-col border-t-4 border-black bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-black">
            Activity
          </span>
          <button
            onClick={onClose}
            className="p-1 font-mono text-lg font-bold leading-none text-black"
            aria-label="Close activity"
          >
            ✕
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto py-1">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center gap-2.5 px-4 py-2.5">
              <span className="relative shrink-0">
                <Avatar name={n.handle} className="h-10 w-10 text-xs" />
                {n.outside && (
                  <span className="absolute -right-1 -top-1 border-2 border-black bg-brand px-0.5 font-mono text-[8px] font-bold text-white">
                    ↯
                  </span>
                )}
              </span>
              <p className="flex-1 text-sm leading-snug text-black">
                <span className="font-display font-bold">{n.handle}</span>{' '}
                {n.text}{' '}
                <span className="font-mono text-[10px] uppercase text-muted">
                  {n.timeAgo}
                </span>
              </p>
              {n.type === 'follow' && (
                <button
                  onClick={() => toggleFollow(n.id)}
                  className={`shrink-0 border-2 border-black px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-tight transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                    followed.has(n.id)
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                  }`}
                >
                  {followed.has(n.id) ? 'Following' : 'Follow back'}
                </button>
              )}
            </div>
          ))}
          <p className="px-4 pb-4 pt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
            You're all caught up
          </p>
        </div>
      </div>
    </div>
  )
}
