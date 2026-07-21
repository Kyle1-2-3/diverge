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
      className="absolute inset-0 z-40 flex items-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="animate-fade-up shadow-soft-lg flex max-h-[80%] w-full flex-col rounded-t-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <span className="font-display text-sm font-bold tracking-[-0.01em] text-ink">
            {title}
          </span>
          <button
            onClick={onClose}
            className="p-1 text-lg leading-none text-muted"
            aria-label="Close activity"
          >
            ✕
          </button>
        </div>

        {/* Model-specific framing before the list */}
        {model === 'attention' && (
          <div className="border-b border-hairline bg-brand px-4 py-2.5 text-white">
            <p className="text-xs font-semibold">
              🔥 3 people posted while you were away — don't fall behind
            </p>
          </div>
        )}
        {model === 'subscription' && (
          <div className="border-b border-hairline bg-brand-soft px-4 py-2.5">
            <p className="text-xs leading-snug text-ink">
              Once a day, at a time you chose. Today:{' '}
              <span className="font-semibold">
                {likeCount} likes · {followCount} follows · {commentCount}{' '}
                comments
              </span>
              . Nothing pinged you.
            </p>
          </div>
        )}
        {model === 'public' && (
          <div className="border-b border-hairline bg-brand-soft px-4 py-2.5">
            <p className="text-xs leading-snug text-ink">
              We notify you about <span className="font-semibold">people</span>,
              never numbers. Likes won't come looking for you.
            </p>
          </div>
        )}

        <div className="no-scrollbar flex-1 overflow-y-auto py-1">
          {items.map((n) => (
            <div key={n.id} className="flex items-center gap-2.5 px-4 py-2.5">
              <span className="relative shrink-0">
                <Avatar name={n.handle} className="h-10 w-10 text-xs" />
                {n.outside && model !== 'attention' && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white">
                    ↯
                  </span>
                )}
              </span>
              <p className="flex-1 text-sm leading-snug text-ink">
                <span className="font-semibold">{n.handle}</span> {n.text}{' '}
                <span className="text-[11px] text-faint">{n.timeAgo}</span>
              </p>
              {n.type === 'follow' && (
                <button
                  onClick={() => toggleFollow(n.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-transform active:scale-[0.98] ${
                    followed.has(n.id)
                      ? 'border border-hairline bg-white text-ink'
                      : 'bg-ink text-white'
                  }`}
                >
                  {followed.has(n.id) ? 'Following' : 'Follow back'}
                </button>
              )}
            </div>
          ))}
          <p className="px-4 pb-4 pt-2 text-center text-[11px] text-faint">
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
