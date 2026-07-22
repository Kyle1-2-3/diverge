import { useRef, useState } from 'react'
import type { Post } from '../types'
import { useLocale } from '../i18n'
import type { ReasonSummary } from '../lib/recommend'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import { usePrefs } from '../state/prefs'
import { compact, timeAgo } from '../lib/format'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import CommentsSheet from './CommentsSheet'
import PerspectivePathSheet, { isBehindThe } from './PerspectivePathSheet'
import {
  Heart,
  HeartFilled,
  Comment,
  Share,
  Bookmark,
  BookmarkFilled,
  More,
  Verified,
} from './Icons'

interface PostCardProps {
  post: Post
  /** Structured, honest explanation for why this post is here. */
  reason?: ReasonSummary
}

const ASPECT: Record<NonNullable<Post['aspect']>, string> = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
}

/**
 * An immersive, Instagram-style post. Feedback controls live in the "..."
 * menu and genuinely steer later recommendations; Perspective Paths sit
 * quietly under captions that earn them. Under the attention model most of
 * this transparency is stripped away — that contrast is the experiment.
 */
export default function PostCard({ post, reason }: PostCardProps) {
  const { t, lang } = useLocale()
  const {
    liked,
    saved,
    follows,
    comments,
    like,
    toggleLike,
    toggleSave,
    toggleFollow,
    hidePost,
    unhidePost,
    showToast,
  } = useInteractions()
  const { model } = useModel()
  const { adjustTopic, hideCreator, unhideCreator, updateSession, pushChoice } =
    usePrefs()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showPaths, setShowPaths] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [slide, setSlide] = useState(0)
  const [burst, setBurst] = useState(false) // double-tap heart animation
  const lastTap = useRef(0)
  const topicLabel = t(`topic.${post.primaryTopic}`)

  // The attention model treats "why am I seeing this" as a legal obligation,
  // not a feature — so its answer says nothing.
  const whySentences =
    model === 'attention'
      ? [t('post.whyAttention')]
      : reason
        ? formatReason(reason, t)
        : [t('reason.fallback')]

  const isLiked = liked.has(post.id)
  const isSaved = saved.has(post.id)
  const isFollowed = follows.has(post.handle)
  const commentCount = post.comments + (comments[post.id]?.length ?? 0)
  const images = [post.image, ...(post.extraImages ?? [])]
  const aspectClass = ASPECT[post.aspect ?? 'portrait']
  // "See translation" appears only on posts written in the other language.
  const canTranslate =
    post.translation !== undefined && (post.lang ?? 'en') !== lang

  /** Every explicit feedback action counts as a "choice" in the session log. */
  const trackChoice = () =>
    updateSession(model, (s) => ({ ...s, choices: s.choices + 1 }))

  const likeWithBurst = () => {
    like(post.id)
    setBurst(true)
    window.setTimeout(() => setBurst(false), 700)
  }

  // Double-tap the photo to like, like the real thing.
  const onPhotoTap = () => {
    const now = Date.now()
    if (now - lastTap.current < 300) likeWithBurst()
    lastTap.current = now
  }

  const closeMenu = () => setMenuOpen(false)

  const notInterested = () => {
    closeMenu()
    trackChoice()
    hidePost(post.id)
    showToast({
      message: t('toast.postHidden'),
      actionLabel: t('common.undo'),
      onAction: () => unhidePost(post.id),
    })
  }

  const moreLikeThis = () => {
    closeMenu()
    trackChoice()
    adjustTopic(post.primaryTopic, 'more')
    pushChoice({ kind: 'topic', topic: post.primaryTopic, level: 'more' })
    showToast({
      message: t('toast.moreTopic', { topic: topicLabel }),
      actionLabel: t('common.undo'),
      onAction: () => adjustTopic(post.primaryTopic, null),
    })
  }

  const lessLikeThis = () => {
    closeMenu()
    trackChoice()
    adjustTopic(post.primaryTopic, 'less')
    pushChoice({ kind: 'topic', topic: post.primaryTopic, level: 'less' })
    showToast({
      message: t('toast.lessTopic', { topic: topicLabel }),
      actionLabel: t('common.undo'),
      onAction: () => adjustTopic(post.primaryTopic, null),
    })
  }

  const pauseTopic = () => {
    closeMenu()
    trackChoice()
    adjustTopic(post.primaryTopic, 'paused')
    pushChoice({ kind: 'topic', topic: post.primaryTopic, level: 'paused' })
    showToast({
      message: t('toast.pausedTopic', { topic: topicLabel }),
      actionLabel: t('common.undo'),
      onAction: () => adjustTopic(post.primaryTopic, null),
    })
  }

  const hideThisCreator = () => {
    closeMenu()
    trackChoice()
    hideCreator(post.handle)
    pushChoice({ kind: 'creator', handle: post.handle })
    showToast({
      message: t('toast.hidCreator', { handle: post.handle }),
      actionLabel: t('common.undo'),
      onAction: () => unhideCreator(post.handle),
    })
  }

  const followCreator = () => {
    toggleFollow(post.handle)
    showToast({
      message: isFollowed
        ? t('toast.unfollowed', { handle: post.handle })
        : t('toast.followed', { handle: post.handle }),
    })
  }

  const menuItem =
    'flex w-full items-center gap-2 border-t border-hairline px-4 py-2.5 text-left text-sm text-ink hover:bg-canvas'

  return (
    <article className="animate-fade-up bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <Avatar name={post.handle} className="h-9 w-9 text-xs" />
        <div className="flex-1 leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-ink">
              {post.handle}
            </span>
            {post.verified && <Verified className="h-3.5 w-3.5" />}
            {/* Follow — creators only; friends are already followed. */}
            {post.sourceType !== 'friend' && !isFollowed && (
              <button
                onClick={followCreator}
                className="ml-1 text-xs font-semibold text-brand"
              >
                · {t('common.follow')}
              </button>
            )}
          </div>
          {post.location && (
            <span className="text-[11px] text-muted">{post.location}</span>
          )}
        </div>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="relative -mr-1 p-1 text-ink"
          aria-label={t('a11y.moreOptions')}
        >
          <More className="h-5 w-5" />
        </button>
      </div>

      {/* "..." menu. Attention: minimal, transparency buried in small print.
          Elsewhere: real controls that genuinely steer the feed. */}
      {menuOpen && (
        <div className="animate-pop-in shadow-soft mx-3.5 mb-2 overflow-hidden rounded-xl border border-hairline bg-white">
          {model === 'attention' ? (
            <>
              <button onClick={notInterested} className={`${menuItem} border-t-0 font-semibold`}>
                {t('post.fewerLikeThis')}
              </button>
              <button
                onClick={() => {
                  closeMenu()
                  showToast({ message: t('toast.reported') })
                }}
                className={menuItem}
              >
                {t('post.report')}
              </button>
              <button
                onClick={() => {
                  setShowWhy(true)
                  closeMenu()
                }}
                className="flex w-full items-center gap-2 border-t border-hairline px-4 py-2 text-left text-xs text-faint hover:bg-canvas"
              >
                {t('post.whySeeingThis')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowWhy(true)
                  closeMenu()
                }}
                className={`${menuItem} border-t-0 font-semibold hover:bg-brand-soft`}
              >
                ? {t('post.whySeeingThis')}
              </button>
              <button onClick={moreLikeThis} className={menuItem}>
                {t('post.moreLikeThis')}
              </button>
              <button onClick={lessLikeThis} className={menuItem}>
                {t('post.lessLikeThis')}
              </button>
              <button onClick={pauseTopic} className={menuItem}>
                {t('post.pauseTopic', { topic: topicLabel })}
              </button>
              <button onClick={hideThisCreator} className={menuItem}>
                {t('post.hideCreator', { handle: post.handle })}
              </button>
              <button onClick={notInterested} className={`${menuItem} text-muted`}>
                {t('post.notInterested')}
              </button>
            </>
          )}
        </div>
      )}

      {/* Photo — single image or a swipeable carousel. */}
      <div
        className={`relative w-full select-none ${aspectClass}`}
        onClick={onPhotoTap}
      >
        {images.length === 1 ? (
          <SmartImage
            src={post.image}
            alt={post.caption || post.handle}
            className="h-full w-full"
          />
        ) : (
          <div
            className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
            onScroll={(e) => {
              const el = e.currentTarget
              setSlide(Math.round(el.scrollLeft / el.clientWidth))
            }}
          >
            {images.map((src, i) => (
              <SmartImage
                key={src}
                src={src}
                alt={`${post.handle} ${i + 1}`}
                className="h-full w-full shrink-0 snap-center"
              />
            ))}
          </div>
        )}
        {images.length > 1 && (
          <>
            <span className="tnum absolute right-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">
              {slide + 1}/{images.length}
            </span>
            <span className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === slide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </span>
          </>
        )}
        {burst && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <HeartFilled className="h-24 w-24 animate-pop-in text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-3.5 pt-3 text-ink">
        <button
          onClick={() => (isLiked ? toggleLike(post.id) : likeWithBurst())}
          className="transition-transform active:scale-75"
          aria-label={t('a11y.like')}
        >
          {isLiked ? (
            <HeartFilled className="h-7 w-7 text-brand" />
          ) : (
            <Heart className="h-7 w-7" />
          )}
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="transition-transform active:scale-75"
          aria-label={t('a11y.comment')}
        >
          <Comment className="h-7 w-7" />
        </button>
        <button
          onClick={() =>
            showToast({ message: t('toast.linkCopied', { handle: post.handle }) })
          }
          className="transition-transform active:scale-75"
          aria-label={t('a11y.share')}
        >
          <Share className="h-6 w-6" />
        </button>
        <button
          onClick={() => toggleSave(post.id)}
          className="ml-auto transition-transform active:scale-75"
          aria-label={t('a11y.save')}
        >
          {isSaved ? (
            <BookmarkFilled className="h-7 w-7" />
          ) : (
            <Bookmark className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Likes + caption + comments */}
      <div className="px-3.5 pb-4 pt-2">
        <p className="tnum text-sm font-semibold text-ink">
          {compact(post.likes + (isLiked ? 1 : 0))} {t('common.likes')}
        </p>
        {post.likedBy && post.likes >= 50 && (
          <p className="mt-0.5 text-xs text-muted">
            {t('post.likedBy', { name: post.likedBy })}
          </p>
        )}
        {post.caption && (
          <p className="mt-1 text-sm leading-snug text-ink">
            <span className="font-semibold">{post.handle}</span> {post.caption}
          </p>
        )}
        {canTranslate && (
          <button
            onClick={() => setShowTranslation((v) => !v)}
            className="mt-1 block text-xs font-semibold text-muted"
          >
            {showTranslation ? t('post.hideTranslation') : t('post.seeTranslation')}
          </button>
        )}
        {canTranslate && showTranslation && (
          <p className="mt-1 text-sm leading-snug text-muted">
            {post.translation}
          </p>
        )}

        {/* Perspective Paths — quiet, and only where they genuinely help. */}
        {post.paths && post.paths.length > 0 && model !== 'attention' && (
          <button
            onClick={() => setShowPaths(true)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
          >
            {isBehindThe(post) ? t('post.behindThis') : t('post.anotherAngle')}
          </button>
        )}

        {commentCount > 0 && (
          <button
            onClick={() => setShowComments(true)}
            className="mt-1.5 block text-sm text-muted"
          >
            {t('post.viewComments', { n: compact(commentCount) })}
          </button>
        )}
        <p className="mt-1 text-[11px] text-faint">{timeAgo(post.timeAgo, t)}</p>
      </div>

      {/* Sheets */}
      {showWhy && (
        <WhySheet sentences={whySentences} onClose={() => setShowWhy(false)} />
      )}
      {showComments && (
        <CommentsSheet post={post} onClose={() => setShowComments(false)} />
      )}
      {showPaths && (
        <PerspectivePathSheet post={post} onClose={() => setShowPaths(false)} />
      )}
    </article>
  )
}

/** Turn a structured reason into localized sentences. */
function formatReason(
  reason: ReasonSummary,
  t: ReturnType<typeof useLocale>['t'],
): string[] {
  const out: string[] = []
  const m = reason.main
  if (m.kind === 'friend') out.push(t('reason.friend', { handle: m.handle }))
  else if (m.kind === 'core')
    out.push(t('reason.core', { topic: t(`topic.${m.topic}`) }))
  else if (m.kind === 'adjacent')
    out.push(
      t('reason.adjacent', {
        near: t(`topic.${m.near}`),
        topic: t(`topic.${m.topic}`),
      }),
    )
  else out.push(t('reason.discovery'))

  if (reason.intentionId) {
    out.push(
      t('reason.intention', {
        intention: t(`intent.${reason.intentionId}.title`),
      }),
    )
  }
  if (reason.askedMore) {
    out.push(t('reason.more', { topic: t(`topic.${reason.askedMore}`) }))
  }
  return out
}

/** A small slide-up sheet explaining why the post appeared. */
function WhySheet({
  sentences,
  onClose,
}: {
  sentences: string[]
  onClose: () => void
}) {
  const { t } = useLocale()
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="animate-fade-up shadow-soft-lg w-full rounded-t-2xl bg-white p-6 pb-7 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold text-brand">{t('post.whyKicker')}</p>
        <h3 className="mt-1 font-display text-lg font-bold tracking-[-0.01em] text-ink">
          {t('post.whyTitle')}
        </h3>
        {sentences.map((s, i) => (
          <p key={i} className="mt-2 text-sm leading-relaxed text-muted">
            {s}
          </p>
        ))}
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.97]"
        >
          {t('common.gotIt')}
        </button>
      </div>
    </div>
  )
}
