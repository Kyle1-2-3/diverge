import { useRef, useState } from 'react'
import type { Post } from '../types'
import { topicMeta } from '../data/topics'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import { usePrefs } from '../state/prefs'
import { compact } from '../lib/format'
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
  /** Specific, generated explanation for why this post is here. */
  reason?: string
}

/**
 * An immersive, Instagram-style post. Feedback controls live in the "..."
 * menu and genuinely steer later recommendations; Perspective Paths sit
 * quietly under captions that earn them. Under the attention model most of
 * this transparency is stripped away — that contrast is the experiment.
 */
export default function PostCard({ post, reason }: PostCardProps) {
  const {
    liked,
    saved,
    comments,
    like,
    toggleLike,
    toggleSave,
    hidePost,
    unhidePost,
    showToast,
  } = useInteractions()
  const { model } = useModel()
  const { adjustTopic, hideCreator, unhideCreator, updateSession } = usePrefs()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showPaths, setShowPaths] = useState(false)
  const [burst, setBurst] = useState(false) // double-tap heart animation
  const lastTap = useRef(0)
  const topic = topicMeta[post.primaryTopic]

  // The attention model treats "why am I seeing this" as a legal obligation,
  // not a feature — so its answer says nothing.
  const whyText =
    model === 'attention'
      ? 'Our systems predicted this content would keep you engaged. Ad relevance may also have played a role. That’s all we can share.'
      : (reason ?? 'This matches topics you follow.')

  const isLiked = liked.has(post.id)
  const isSaved = saved.has(post.id)
  const commentCount = post.comments + (comments[post.id]?.length ?? 0)

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
      message: 'Post hidden',
      actionLabel: 'Undo',
      onAction: () => unhidePost(post.id),
    })
  }

  const moreLikeThis = () => {
    closeMenu()
    trackChoice()
    adjustTopic(post.primaryTopic, 'more')
    showToast({
      message: `More ${topic.label.toLowerCase()} coming up`,
      actionLabel: 'Undo',
      onAction: () => adjustTopic(post.primaryTopic, null),
    })
  }

  const lessLikeThis = () => {
    closeMenu()
    trackChoice()
    adjustTopic(post.primaryTopic, 'less')
    showToast({
      message: `Less ${topic.label.toLowerCase()} from now on`,
      actionLabel: 'Undo',
      onAction: () => adjustTopic(post.primaryTopic, null),
    })
  }

  const pauseTopic = () => {
    closeMenu()
    trackChoice()
    adjustTopic(post.primaryTopic, 'paused')
    showToast({
      message: `${topic.label} paused — resume it in your Interest Map`,
      actionLabel: 'Undo',
      onAction: () => adjustTopic(post.primaryTopic, null),
    })
  }

  const hideThisCreator = () => {
    closeMenu()
    trackChoice()
    hideCreator(post.handle)
    showToast({
      message: `You won't see ${post.handle} anymore`,
      actionLabel: 'Undo',
      onAction: () => unhideCreator(post.handle),
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
          </div>
          {post.location && (
            <span className="text-[11px] text-muted">{post.location}</span>
          )}
        </div>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="relative -mr-1 p-1 text-ink"
          aria-label="More options"
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
                See fewer posts like this
              </button>
              <button
                onClick={() => {
                  closeMenu()
                  showToast({ message: 'Reported. Our systems will take a look.' })
                }}
                className={menuItem}
              >
                Report
              </button>
              <button
                onClick={() => {
                  setShowWhy(true)
                  closeMenu()
                }}
                className="flex w-full items-center gap-2 border-t border-hairline px-4 py-2 text-left text-xs text-faint hover:bg-canvas"
              >
                Why am I seeing this?
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
                ? Why am I seeing this?
              </button>
              <button onClick={moreLikeThis} className={menuItem}>
                Show me more like this
              </button>
              <button onClick={lessLikeThis} className={menuItem}>
                Show me less like this
              </button>
              <button onClick={pauseTopic} className={menuItem}>
                Pause “{topic.label}”
              </button>
              <button onClick={hideThisCreator} className={menuItem}>
                Hide {post.handle}
              </button>
              <button onClick={notInterested} className={`${menuItem} text-muted`}>
                Not interested
              </button>
            </>
          )}
        </div>
      )}

      {/* Photo */}
      <div
        className="relative aspect-[4/5] w-full select-none"
        onClick={onPhotoTap}
      >
        <SmartImage
          src={post.image}
          alt={post.caption}
          className="h-full w-full"
        />
        {burst && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <HeartFilled className="h-24 w-24 animate-pop-in text-white drop-shadow-lg" />
          </div>
        )}
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-ink">
          {topic.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-3.5 pt-3 text-ink">
        <button
          onClick={() => (isLiked ? toggleLike(post.id) : likeWithBurst())}
          className="transition-transform active:scale-75"
          aria-label="Like"
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
          aria-label="Comment"
        >
          <Comment className="h-7 w-7" />
        </button>
        <button
          onClick={() =>
            showToast({ message: `Link to @${post.handle}'s post copied` })
          }
          className="transition-transform active:scale-75"
          aria-label="Share"
        >
          <Share className="h-6 w-6" />
        </button>
        <button
          onClick={() => toggleSave(post.id)}
          className="ml-auto transition-transform active:scale-75"
          aria-label="Save"
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
          {compact(post.likes + (isLiked ? 1 : 0))} likes
        </p>
        <p className="mt-1 text-sm leading-snug text-ink">
          <span className="font-semibold">{post.handle}</span> {post.caption}
        </p>

        {/* Perspective Paths — quiet, and only where they genuinely help. */}
        {post.paths && post.paths.length > 0 && model !== 'attention' && (
          <button
            onClick={() => setShowPaths(true)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
          >
            {isBehindThe(post) ? '◇ Behind this' : '◇ See another angle'}
          </button>
        )}

        <button
          onClick={() => setShowComments(true)}
          className="mt-1.5 block text-sm text-muted"
        >
          View all {compact(commentCount)} comments
        </button>
        <p className="mt-1 text-[11px] text-faint">{post.timeAgo} ago</p>
      </div>

      {/* Sheets */}
      {showWhy && (
        <WhySheet reason={whyText} onClose={() => setShowWhy(false)} />
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

/** A small slide-up sheet explaining why the post appeared. */
function WhySheet({
  reason,
  onClose,
}: {
  reason: string
  onClose: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="animate-fade-up shadow-soft-lg w-full rounded-t-2xl bg-white p-6 pb-7 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold text-brand">Transparency</p>
        <h3 className="mt-1 font-display text-lg font-bold tracking-[-0.01em] text-ink">
          Why you're seeing this
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{reason}</p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.97]"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
