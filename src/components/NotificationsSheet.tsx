import { useLocale } from '../i18n'
import { notifications } from '../data/notifications'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import { timeAgo } from '../lib/format'
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
  const { t } = useLocale()
  const { model } = useModel()
  const { follows, toggleFollow } = useInteractions()

  // Public model drops like-counts entirely — engagement isn't news.
  const items =
    model === 'public'
      ? notifications.filter((n) => n.type !== 'like')
      : notifications
  const likeCount = notifications.filter((n) => n.type === 'like').length
  const followCount = notifications.filter((n) => n.type === 'follow').length
  const commentCount = notifications.filter((n) => n.type === 'comment').length

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
            {t(`notif.${model}.title`)}
          </span>
          <button
            onClick={onClose}
            className="p-1 text-lg leading-none text-muted"
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </div>

        {/* Model-specific framing before the list */}
        {model === 'attention' && (
          <div className="border-b border-hairline bg-brand px-4 py-2.5 text-white">
            <p className="text-xs font-semibold">{t('notif.attention.banner')}</p>
          </div>
        )}
        {model === 'subscription' && (
          <div className="border-b border-hairline bg-brand-soft px-4 py-2.5">
            <p className="text-xs leading-snug text-ink">
              {t('notif.subscription.banner', {
                likes: likeCount,
                follows: followCount,
                comments: commentCount,
              })}
            </p>
          </div>
        )}
        {model === 'public' && (
          <div className="border-b border-hairline bg-brand-soft px-4 py-2.5">
            <p className="text-xs leading-snug text-ink">
              {t('notif.public.banner')}
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
                <span className="font-semibold">{n.handle}</span>{' '}
                {t(`notif.item.${n.kind}`)}
                {n.quote ? ` “${n.quote}”` : ''}{' '}
                <span className="text-[11px] text-faint">
                  {timeAgo(n.timeAgo, t)}
                </span>
              </p>
              {n.type === 'follow' && (
                <button
                  onClick={() => toggleFollow(n.handle)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-transform active:scale-[0.98] ${
                    follows.has(n.handle)
                      ? 'border border-hairline bg-white text-ink'
                      : 'bg-ink text-white'
                  }`}
                >
                  {follows.has(n.handle)
                    ? t('common.following')
                    : t('common.followBack')}
                </button>
              )}
            </div>
          ))}
          <p className="px-4 pb-4 pt-2 text-center text-[11px] text-faint">
            {t(`notif.${model}.footer`)}
          </p>
        </div>
      </div>
    </div>
  )
}
