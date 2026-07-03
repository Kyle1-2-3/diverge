import type { IntentionId } from '../types'
import { intentions } from '../data/intentions'
import { getFeedForIntention } from '../lib/feed'
import StoriesBar from './StoriesBar'
import PostCard from './PostCard'
import Logo from './Logo'
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
  const outsideCount = feed.filter((p) => p.isOutsideBubble).length

  return (
    <div className="bg-white pb-4">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-4 border-black bg-white px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2.5">
          {/* Current mood pill — tap to change. */}
          {intention && (
            <button
              onClick={onChangeMood}
              className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-tight text-black transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              {intention.title}
            </button>
          )}
          <button className="text-black" aria-label="Notifications">
            <Heart className="h-6 w-6" />
          </button>
        </div>
      </header>

      <StoriesBar />

      {/* Feed — hard black dividers between posts */}
      <div className="divide-y-4 divide-black border-b-4 border-black">
        {feed.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Calm finish — the anti-infinite-scroll moment, stated bluntly, with a
          quick summary of what today's feed actually contained. */}
      <div className="animate-fade-up px-5 pb-8 pt-9">
        <h3 className="font-display text-3xl font-bold uppercase leading-none tracking-tighter text-black">
          End of
          <br />
          feed.
        </h3>
        <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-muted">
          That's today — no endless scroll. That's the point.
        </p>

        {/* Session summary */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="border-2 border-black bg-white p-3">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-black">
              {feed.length}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
              posts today
            </div>
          </div>
          <div className="border-2 border-black bg-brand p-3 text-white">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none">
              {outsideCount}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/90">
              outside your bubble
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onReflect}
            className="w-full border-2 border-black bg-black py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            How did that feel?
          </button>
          <button
            onClick={onExplore}
            className="w-full border-2 border-black bg-white py-3 font-display text-sm font-bold uppercase tracking-widest text-black shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Explore new →
          </button>
        </div>
      </div>
    </div>
  )
}
