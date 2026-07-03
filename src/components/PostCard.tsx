import { useRef, useState } from 'react'
import type { Post } from '../types'
import { categoryMeta } from '../data/categories'
import { useInteractions } from '../state/interactions'
import { compact } from '../lib/format'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import CommentsSheet from './CommentsSheet'
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
}

/**
 * An immersive, Instagram-style post. The "diverge" mechanic (why am I seeing
 * this) is hidden inside the "..." menu — discoverable, never preachy.
 * Likes / saves / comments live in the shared interactions store, so they
 * survive tab switches and page refreshes.
 */
export default function PostCard({ post }: PostCardProps) {
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [burst, setBurst] = useState(false) // double-tap heart animation
  const lastTap = useRef(0)
  const meta = categoryMeta[post.category]

  const isLiked = liked.has(post.id)
  const isSaved = saved.has(post.id)
  const commentCount = post.comments + (comments[post.id]?.length ?? 0)

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

  const notInterested = () => {
    setMenuOpen(false)
    hidePost(post.id)
    showToast({
      message: 'Post hidden',
      actionLabel: 'Undo',
      onAction: () => unhidePost(post.id),
    })
  }

  return (
    <article className="animate-fade-up bg-white">
      {/* Outside-your-bubble banner — makes the diverge mechanic felt in-feed,
          not just in the recap. Accent = a signal from outside your bubble. */}
      {post.isOutsideBubble && (
        <div className="flex items-center gap-2 border-b-2 border-black bg-brand px-3.5 py-1.5 text-white">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest">
            ↯ Outside your usual
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <Avatar name={post.handle} className="h-9 w-9 text-xs" />
        <div className="flex-1 leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-display text-sm font-bold text-black">
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
          className="relative -mr-1 p-1 text-black"
          aria-label="More options"
        >
          <More className="h-5 w-5" />
        </button>
      </div>

      {/* "..." menu — this is where the transparency feature lives */}
      {menuOpen && (
        <div className="animate-pop-in mx-3.5 mb-2 border-2 border-black bg-white shadow-hard">
          <button
            onClick={() => {
              setShowWhy(true)
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left font-display text-sm font-bold text-black hover:bg-brand-soft"
          >
            ? Why am I seeing this?
          </button>
          <button
            onClick={notInterested}
            className="flex w-full items-center gap-2 border-t-2 border-black px-4 py-3 text-left text-sm text-muted hover:bg-gray-50"
          >
            Not interested
          </button>
        </div>
      )}

      {/* Photo */}
      <div
        className="relative aspect-[4/5] w-full select-none border-y-2 border-black"
        onClick={onPhotoTap}
      >
        <SmartImage
          src={post.image}
          alt={post.caption}
          className="h-full w-full"
        />
        {/* Double-tap burst heart */}
        {burst && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <HeartFilled className="h-24 w-24 animate-pop-in text-white drop-shadow-lg" />
          </div>
        )}
        {/* Category chip — text only, hard-bordered, lower-left */}
        <span className="absolute bottom-2.5 left-2.5 border-2 border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-tight text-black">
          {meta.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-3.5 pt-3 text-black">
        <button
          onClick={() => (isLiked ? toggleLike(post.id) : likeWithBurst())}
          className="transition-transform active:scale-75"
          aria-label="Like"
        >
          {isLiked ? (
            <HeartFilled className="h-7 w-7 text-black" />
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
        <p className="font-display text-sm font-bold text-black">
          {compact(post.likes + (isLiked ? 1 : 0))} likes
        </p>
        <p className="mt-1 text-sm leading-snug text-black">
          <span className="font-bold">{post.handle}</span> {post.caption}
        </p>
        <button
          onClick={() => setShowComments(true)}
          className="mt-1.5 text-sm text-muted"
        >
          View all {compact(commentCount)} comments
        </button>
        <p className="mt-1 font-display text-[11px] uppercase tracking-wide text-muted">
          {post.timeAgo} ago
        </p>
      </div>

      {/* Why-am-I-seeing-this sheet */}
      {showWhy && (
        <WhySheet reason={post.whyReason} onClose={() => setShowWhy(false)} />
      )}

      {/* Comments sheet */}
      {showComments && (
        <CommentsSheet post={post} onClose={() => setShowComments(false)} />
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
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/50 p-3"
      onClick={onClose}
    >
      <div
        className="animate-fade-up w-full border-2 border-black bg-white p-6 pb-7 text-left shadow-hard-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-[11px] font-bold uppercase tracking-widest text-brand">
          Transparency
        </p>
        <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-black">
          Why you're seeing this
        </h3>
        <p className="mt-2 border-l-4 border-black pl-3 text-sm leading-relaxed text-black">
          {reason}
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full border-2 border-black bg-black py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
