import { useRef, useState } from 'react'
import type { Post } from '../types'
import { categoryMeta } from '../data/categories'
import SmartImage from './SmartImage'
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

function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n)
}

/**
 * An immersive, Instagram-style post. The "diverge" mechanic (why am I seeing
 * this) is hidden inside the "..." menu — discoverable, never preachy.
 */
export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [burst, setBurst] = useState(false) // double-tap heart animation
  const lastTap = useRef(0)
  const meta = categoryMeta[post.category]

  const like = () => {
    setLiked(true)
    setBurst(true)
    window.setTimeout(() => setBurst(false), 700)
  }

  // Double-tap the photo to like, like the real thing.
  const onPhotoTap = () => {
    const now = Date.now()
    if (now - lastTap.current < 300) like()
    lastTap.current = now
  }

  return (
    <article className="animate-fade-up bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-200 to-pink-200 text-lg">
          {post.avatar}
        </div>
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

      {/* "..." menu — this is where the transparency feature lives */}
      {menuOpen && (
        <div className="animate-pop-in mx-3.5 mb-1 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-lg">
          <button
            onClick={() => {
              setShowWhy(true)
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-ink hover:bg-gray-50"
          >
            ✨ Why am I seeing this?
          </button>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-2 border-t border-black/5 px-4 py-3 text-left text-sm text-muted hover:bg-gray-50"
          >
            Not interested
          </button>
        </div>
      )}

      {/* Photo */}
      <div
        className="relative aspect-[4/5] w-full select-none"
        onClick={onPhotoTap}
      >
        <SmartImage
          src={post.image}
          gradient={post.gradient}
          emoji={post.visual}
          alt={post.caption}
          className="h-full w-full"
        />
        {/* Double-tap burst heart */}
        {burst && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <HeartFilled className="h-24 w-24 animate-pop-in text-white drop-shadow-lg" />
          </div>
        )}
        {/* Category chip — subtle, lower-left */}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
          {meta.emoji} {meta.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-3.5 pt-3 text-ink">
        <button
          onClick={() => (liked ? setLiked(false) : like())}
          className="transition-transform active:scale-75"
          aria-label="Like"
        >
          {liked ? (
            <HeartFilled className="h-7 w-7 text-rose-500" />
          ) : (
            <Heart className="h-7 w-7" />
          )}
        </button>
        <button className="transition-transform active:scale-75" aria-label="Comment">
          <Comment className="h-7 w-7" />
        </button>
        <button className="transition-transform active:scale-75" aria-label="Share">
          <Share className="h-6 w-6" />
        </button>
        <button
          onClick={() => setSaved((v) => !v)}
          className="ml-auto transition-transform active:scale-75"
          aria-label="Save"
        >
          {saved ? (
            <BookmarkFilled className="h-7 w-7" />
          ) : (
            <Bookmark className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Likes + caption + comments */}
      <div className="px-3.5 pb-4 pt-2">
        <p className="text-sm font-semibold text-ink">
          {compact(post.likes + (liked ? 1 : 0))} likes
        </p>
        <p className="mt-1 text-sm leading-snug text-ink">
          <span className="font-semibold">{post.handle}</span> {post.caption}
        </p>
        <button className="mt-1.5 text-sm text-muted">
          View all {post.comments} comments
        </button>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">
          {post.timeAgo} ago
        </p>
      </div>

      {/* Why-am-I-seeing-this sheet */}
      {showWhy && (
        <WhySheet reason={post.whyReason} onClose={() => setShowWhy(false)} />
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
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fade-up w-full rounded-t-3xl bg-white p-6 pb-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200" />
        <span className="text-3xl">🧭</span>
        <h3 className="mt-2 font-display text-lg font-bold text-ink">
          Why you're seeing this
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
          {reason}
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-ink py-3.5 text-sm font-semibold text-white"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
