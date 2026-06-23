import type { IntentionId } from '../types'
import { intentions } from '../data/intentions'
import { getFeedForIntention } from '../lib/feed'
import StoriesBar from './StoriesBar'
import PostCard from './PostCard'
import { Heart } from './Icons'

interface FeedProps {
  intentionId: IntentionId
  onReflect: () => void
  onExplore: () => void
  onChangeMood: () => void
}

/**
 * The home feed: pure content, like a real app. Stories on top, an immersive
 * stream of posts, and a calm finish instead of infinite scroll. None of the
 * "research" UI is here — it's felt through the posts, not explained.
 */
export default function Feed({
  intentionId,
  onReflect,
  onExplore,
  onChangeMood,
}: FeedProps) {
  const intention = intentions.find((i) => i.id === intentionId)
  const feed = getFeedForIntention(intentionId)

  return (
    <div className="bg-white pb-4">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/5 bg-white/85 px-4 py-3 backdrop-blur-xl">
        <span className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Diverge
        </span>
        <div className="flex items-center gap-3">
          {/* Current mood pill — tap to change. Subtle, not a dashboard. */}
          {intention && (
            <button
              onClick={onChangeMood}
              className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-ink transition-colors active:bg-gray-200"
            >
              <span>{intention.emoji}</span>
              <span>{intention.title}</span>
            </button>
          )}
          <button className="text-ink" aria-label="Notifications">
            <Heart className="h-6 w-6" />
          </button>
        </div>
      </header>

      <StoriesBar />

      {/* Feed — thin dividers between posts, like IG */}
      <div className="divide-y divide-black/5">
        {feed.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Calm finish — the anti-infinite-scroll moment, kept gentle. */}
      <div className="animate-fade-up px-6 pb-8 pt-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-2xl">
          🌙
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-ink">
          You're all caught up
        </h3>
        <p className="mx-auto mt-1 max-w-[15rem] text-sm text-muted">
          That's today's feed — no endless scroll. Nice pace.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={onReflect}
            className="w-full rounded-2xl bg-ink py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
          >
            How did that feel?
          </button>
          <button
            onClick={onExplore}
            className="w-full rounded-2xl py-3 text-sm font-semibold text-brand transition-colors active:text-violet-700"
          >
            Explore something new →
          </button>
        </div>
      </div>
    </div>
  )
}
