import { useRef, useState } from 'react'
import type { Post, PostFlip } from '../types'
import { categoryMeta } from '../data/categories'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
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
  const { model } = useModel()
  const [menuOpen, setMenuOpen] = useState(false)
  const [flipped, setFlipped] = useState(false) // showing the opposite take?
  const [showWhy, setShowWhy] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [burst, setBurst] = useState(false) // double-tap heart animation
  const lastTap = useRef(0)
  const meta = categoryMeta[post.category]

  // The attention model treats "why am I seeing this" as a legal obligation,
  // not a feature — so its answer says nothing.
  const whyText =
    model === 'attention'
      ? 'Our systems predicted this content would keep you engaged. Ad relevance may also have played a role. That’s all we can share.'
      : post.whyReason

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

  // The normal face of the card. Kept as a fragment so flippable posts can
  // mount it as the front of a 3D flip while plain posts render it directly.
  const front = (
    <>
      {/* Outside-your-bubble banner — makes the diverge mechanic felt in-feed,
          not just in the recap. Accent = a signal from outside your bubble. */}
      {post.isOutsideBubble && model !== 'attention' && (
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

      {/* "..." menu. In the attention model, transparency is buried at the
          bottom in small print; elsewhere it's the first thing you see. */}
      {menuOpen && (
        <div className="animate-pop-in mx-3.5 mb-2 border-2 border-black bg-white shadow-hard">
          {model === 'attention' ? (
            <>
              <button
                onClick={notInterested}
                className="flex w-full items-center gap-2 px-4 py-3 text-left font-display text-sm font-bold text-black hover:bg-brand-soft"
              >
                See fewer posts like this
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  showToast({ message: 'Reported. Our systems will take a look.' })
                }}
                className="flex w-full items-center gap-2 border-t-2 border-black px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
              >
                Report
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  showToast({ message: 'Account info is available on their profile.' })
                }}
                className="flex w-full items-center gap-2 border-t-2 border-black px-4 py-3 text-left text-sm text-black hover:bg-gray-50"
              >
                About this account
              </button>
              <button
                onClick={() => {
                  setShowWhy(true)
                  setMenuOpen(false)
                }}
                className="flex w-full items-center gap-2 border-t-2 border-black px-4 py-2 text-left font-mono text-[11px] text-muted hover:bg-gray-50"
              >
                Why am I seeing this?
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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
        {/* Flip-the-perspective entry point — a public-interest feature. */}
        {post.flip && model === 'public' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setFlipped(true)
            }}
            className="absolute right-2.5 top-2.5 border-2 border-black bg-brand px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-tight text-white shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            ⇄ Flip side
          </button>
        )}
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
        {/* Public model: controversial stories carry their other outlets. */}
        {model === 'public' && post.sources && (
          <div className="mt-2 border-2 border-black bg-brand-soft px-2.5 py-1.5">
            <p className="font-mono text-[10px] uppercase tracking-tight text-black">
              Also covered by: {post.sources.join(' · ')}
            </p>
          </div>
        )}
        <button
          onClick={() => setShowComments(true)}
          className="mt-1.5 text-sm text-muted"
        >
          View all {compact(commentCount)} comments
        </button>
        {/* Paid & public models: transparency lives on the post itself. */}
        {model !== 'attention' && (
          <button
            onClick={() => setShowWhy(true)}
            className="mt-1 block font-mono text-[11px] font-bold uppercase tracking-tight text-brand"
          >
            ? Why this post
          </button>
        )}
        <p className="mt-1 font-display text-[11px] uppercase tracking-wide text-muted">
          {post.timeAgo} ago
        </p>
      </div>
    </>
  )

  return (
    <article className="animate-fade-up bg-white">
      {post.flip ? (
        // Flippable card: front = the post, back = the opposite take. The
        // overlay sheets below stay outside this transformed subtree.
        <div className="flip-scene">
          <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
            <div className="flip-face bg-white">{front}</div>
            <div className="flip-face flip-face-back bg-white">
              <FlipSide
                flip={post.flip}
                category={meta.label}
                onFlipBack={() => setFlipped(false)}
              />
            </div>
          </div>
        </div>
      ) : (
        front
      )}

      {/* Why-am-I-seeing-this sheet */}
      {showWhy && (
        <WhySheet reason={whyText} onClose={() => setShowWhy(false)} />
      )}

      {/* Comments sheet */}
      {showComments && (
        <CommentsSheet post={post} onClose={() => setShowComments(false)} />
      )}
    </article>
  )
}

/**
 * The back of a flippable card: the same topic argued from the other side.
 * Deliberately simpler than the front (no like/save row) — you're peeking at
 * a perspective, not being asked to engage with it.
 */
function FlipSide({
  flip,
  category,
  onFlipBack,
}: {
  flip: PostFlip
  category: string
  onFlipBack: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Banner doubles as the flip-back control */}
      <button
        onClick={onFlipBack}
        className="flex w-full items-center justify-between border-b-2 border-black bg-black px-3.5 py-1.5 text-left text-white"
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest">
          ⇄ The flip side
        </span>
        <span className="font-mono text-[11px] uppercase tracking-tight text-white/80">
          flip back
        </span>
      </button>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <Avatar name={flip.handle} className="h-9 w-9 text-xs" />
        <div className="flex-1 leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-display text-sm font-bold text-black">
              {flip.handle}
            </span>
            {flip.verified && <Verified className="h-3.5 w-3.5" />}
          </div>
          {flip.location && (
            <span className="text-[11px] text-muted">{flip.location}</span>
          )}
        </div>
      </div>

      {/* Photo */}
      <div className="relative aspect-[4/5] w-full select-none border-y-2 border-black">
        <SmartImage
          src={flip.image}
          alt={flip.caption}
          className="h-full w-full"
        />
        <span className="absolute bottom-2.5 left-2.5 border-2 border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-tight text-black">
          {category}
        </span>
        <button
          onClick={onFlipBack}
          className="absolute right-2.5 top-2.5 border-2 border-black bg-black px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-tight text-white shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          ⇄ Flip back
        </button>
      </div>

      {/* Caption + the one-line reason this exists */}
      <div className="px-3.5 pb-4 pt-3">
        <p className="font-display text-sm font-bold text-black">
          {compact(flip.likes)} likes
        </p>
        <p className="mt-1 text-sm leading-snug text-black">
          <span className="font-bold">{flip.handle}</span> {flip.caption}
        </p>
        <p className="mt-2 border-l-4 border-brand pl-2 text-[11px] leading-snug text-muted">
          Diverge pairs takes on the same topic, so one side never becomes
          your whole feed.
        </p>
      </div>
    </div>
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
