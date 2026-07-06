import { useState } from 'react'
import { notifications } from '../data/notifications'
import { useModel } from '../state/model'
import Avatar from './Avatar'

interface NotificationsSheetProps {
  onClose: () => void
}

/**
 * The activity panel — one of the clearest reads on a business model:
 *  - attention:    every ping is urgent, red, and about you. Don't fall behind.
 *  - subscription: one calm daily digest, delivered on your schedule.
 *  - public:       only people, never numbers. Nothing to "miss".
 */
export default function NotificationsSheet({
  onClose,
}: NotificationsSheetProps) {
  const { model } = useModel()
  const [followed, setFollowed] = useState<Set<string>>(new Set())

  const toggleFollow = (id: string) =>
    setFollowed((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // Public model drops like-counts entirely — engagement isn't news.
  const items =
    model === 'public'
      ? notifications.filter((n) => n.type !== 'like')
      : notifications
  const likeCount = notifications.filter((n) => n.type === 'like').length
  const followCount = notifications.filter((n) => n.type === 'follow').length
  const commentCount = notifications.filter((n) => n.type === 'comment').length

  const title =
    model === 'attention'
      ? 'Activity'
      : model === 'subscription'
        ? 'Daily digest'
        : 'Updates'

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
            {title}
          </span>
          <button
            onClick={onClose}
            className="p-1 font-mono text-lg font-bold leading-none text-black"
            aria-label="Close activity"
          >
            ✕
          </button>
        </div>

        {/* Model-specific framing before the list */}
        {model === 'attention' && (
          <div className="border-b-2 border-black bg-brand px-4 py-2 text-white">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest">
              🔥 3 people posted while you were away — don't fall behind
            </p>
          </div>
        )}
        {model === 'subscription' && (
          <div className="border-b-2 border-black bg-brand-soft px-4 py-2.5">
            <p className="text-xs leading-snug text-black">
              Delivered once a day, at a time you chose. Today:{' '}
              <span className="font-bold">
                {likeCount} likes · {followCount} follows · {commentCount}{' '}
                comments
              </span>
              . Nothing pinged you.
            </p>
          </div>
        )}
        {model === 'public' && (
          <div className="border-b-2 border-black bg-brand-soft px-4 py-2.5">
            <p className="text-xs leading-snug text-black">
              We notify you about <span className="font-bold">people</span>,
              never about numbers. Likes are visible on your posts if you go
              looking — they won't come looking for you.
            </p>
          </div>
        )}

        <div className="no-scrollbar flex-1 overflow-y-auto py-1">
          {items.map((n) => (
            <div key={n.id} className="flex items-center gap-2.5 px-4 py-2.5">
              <span className="relative shrink-0">
                <Avatar name={n.handle} className="h-10 w-10 text-xs" />
                {n.outside && model !== 'attention' && (
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
            {model === 'attention'
              ? 'Things move fast — check back soon'
              : model === 'subscription'
                ? "That's everything. See you tomorrow."
                : 'No streaks. No red dots. Nothing to miss.'}
          </p>
        </div>
      </div>
    </div>
  )
}
