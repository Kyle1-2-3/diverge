import { useEffect, useMemo, useRef, useState } from 'react'
import type { IntentionId, Post } from '../types'
import type { Ad } from '../data/ads'
import { ads } from '../data/ads'
import { intentions } from '../data/intentions'
import { rankFeed } from '../lib/feed'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import StoriesBar from './StoriesBar'
import StoryViewer from './StoryViewer'
import NotificationsSheet from './NotificationsSheet'
import AlgorithmPanel from './AlgorithmPanel'
import BubbleMap from './BubbleMap'
import PostCard from './PostCard'
import AdCard from './AdCard'
import Logo from './Logo'
import { Heart } from './Icons'

interface FeedProps {
  intentionId: IntentionId
  onReflect: () => void
  onExplore: () => void
  onChangeMood: () => void
}

/** One slot in the feed: a post or (attention model only) an ad. */
type FeedItem =
  | { kind: 'post'; key: string; post: Post }
  | { kind: 'ad'; key: string; ad: Ad }

/** Fake engagement pings for the attention model. */
const PINGS = [
  '❤️ yujin_kim liked your post',
  '🔥 your post is getting attention — 41 new views',
  '👀 mira.styles viewed your profile',
  '❤️ coachreyes and 12 others liked your post',
  '✨ you appeared in search 6 times today',
]

/**
 * The home feed — the room where the business model is felt most.
 *  - attention:    stories, ads, infinite scroll, engagement pings. No exit.
 *  - subscription: chronological, quiet, ends on purpose with a summary.
 *  - public:       explains itself before showing content, mixes viewpoints,
 *                  and closes with a reflective question instead of more feed.
 */
export default function Feed({
  intentionId,
  onReflect,
  onExplore,
  onChangeMood,
}: FeedProps) {
  const { hidden, showToast } = useInteractions()
  const { model, diversity, unread, bumpUnread, clearUnread } = useModel()
  const [storyId, setStoryId] = useState<string | null>(null)
  const [activityOpen, setActivityOpen] = useState(false)
  const [algoOpen, setAlgoOpen] = useState(false)
  const [pages, setPages] = useState(1)

  const intention = intentions.find((i) => i.id === intentionId)
  const feed = useMemo(
    () => rankFeed(model, intentionId, diversity).filter((p) => !hidden.has(p.id)),
    [model, intentionId, diversity, hidden],
  )
  const outsideCount = feed.filter((p) => p.isOutsideBubble).length
  const publicScore = 40 + Math.round(diversity * 0.55)

  // ---- Attention model: build an endless stream of pages + ads ----------
  const items = useMemo<FeedItem[]>(() => {
    if (model !== 'attention') {
      return feed.map((post) => ({ kind: 'post', key: post.id, post }))
    }
    const out: FeedItem[] = []
    let adIdx = 0
    for (let page = 0; page < pages; page++) {
      // Later pages re-serve rotated content with fresh photos — the
      // "recommendations never run out" illusion every ad-funded feed sells.
      const rot = (page * 5) % feed.length
      const seq = [...feed.slice(rot), ...feed.slice(0, rot)]
      seq.forEach((p, i) => {
        const post: Post =
          page === 0
            ? p
            : {
                ...p,
                id: `${p.id}~${page}`,
                image: p.image.replace('/seed/', `/seed/p${page}`),
                timeAgo: 'now',
              }
        out.push({ kind: 'post', key: post.id, post })
        // An ad every three posts. The rhythm of the business model.
        if ((i + 1) % 3 === 0) {
          const ad = ads[adIdx++ % ads.length]
          out.push({ kind: 'ad', key: `ad-${page}-${i}`, ad })
        }
      })
    }
    return out
  }, [model, feed, pages])

  // Infinite scroll sentinel (attention only).
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (model !== 'attention') return
    const el = sentinelRef.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPages((p) => Math.min(p + 1, 12))
      },
      { rootMargin: '600px' },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [model])
  useEffect(() => setPages(1), [model])

  // Attention model: manufactured urgency, delivered on a schedule.
  useEffect(() => {
    if (model !== 'attention') return
    const t = window.setInterval(() => {
      showToast({ message: PINGS[Math.floor(Math.random() * PINGS.length)] })
      bumpUnread()
    }, 22000)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  // Subscription model: one gentle break reminder, then silence.
  useEffect(() => {
    if (model !== 'subscription') return
    const t = window.setTimeout(() => {
      showToast({
        message: 'You’ve been here a few minutes. Everything new has been seen 🌿',
      })
    }, 180000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  return (
    <div className="bg-white pb-4">
      {/* Top bar — same slot, three philosophies. */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-4 border-black bg-white px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2.5">
          {/* Subscription: your stated intention, always visible, tap to change. */}
          {model === 'subscription' && intention && (
            <button
              onClick={onChangeMood}
              className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-tight text-black transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              {intention.title}
            </button>
          )}

          {/* Public: live diversity score + the algorithm, one tap away. */}
          {model === 'public' && (
            <button
              onClick={() => setAlgoOpen(true)}
              className="flex items-center gap-1.5 border-2 border-black bg-brand-soft px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-tight text-black transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              ◐ {publicScore} · algorithm
            </button>
          )}

          <button
            onClick={() => {
              setActivityOpen(true)
              clearUnread()
            }}
            className="relative text-black"
            aria-label="Notifications"
          >
            <Heart className="h-6 w-6" />
            {/* Attention: a counting red badge. Others: nothing blinks at you. */}
            {model === 'attention' && unread > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center border-2 border-white bg-brand px-0.5 font-mono text-[9px] font-bold leading-none text-white">
                {unread}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Stories exist to be checked compulsively — attention model only. */}
      {model === 'attention' && <StoriesBar onOpenStory={setStoryId} />}

      {/* Public: the feed explains itself BEFORE you scroll it. */}
      {model === 'public' && (
        <div className="border-b-4 border-black bg-brand-soft px-4 py-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
            Before you scroll — how this feed was built
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-black">
            {feed.length} posts today: {feed.length - outsideCount} from your
            interests, {outsideCount} from beyond your bubble, spread evenly.
            Ranked for balance — never for engagement.
          </p>
          <button
            onClick={() => setAlgoOpen(true)}
            className="mt-2.5 border-2 border-black bg-white px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-tight text-black shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            See the whole algorithm →
          </button>
        </div>
      )}

      {/* Public: your bubble, on the home screen where you can't ignore it. */}
      {model === 'public' && (
        <div className="border-b-4 border-black p-4">
          <BubbleMap score={publicScore} />
        </div>
      )}

      {/* The stream */}
      <div className="divide-y-4 divide-black border-b-4 border-black">
        {items.map((item) =>
          item.kind === 'post' ? (
            <PostCard key={item.key} post={item.post} />
          ) : (
            <AdCard key={item.key} ad={item.ad} />
          ),
        )}
      </div>

      {/* ---- Three endings ------------------------------------------------ */}

      {model === 'attention' && (
        // No ending. Just a loader that always delivers.
        <div ref={sentinelRef} className="flex items-center justify-center gap-2 px-5 py-8">
          <span className="h-2.5 w-2.5 animate-pulse bg-brand" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted">
            finding more for you…
          </span>
        </div>
      )}

      {model === 'subscription' && (
        <div className="animate-fade-up px-5 pb-8 pt-9">
          <h3 className="font-display text-3xl font-bold uppercase leading-none tracking-tighter text-black">
            End of
            <br />
            feed.
          </h3>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-muted">
            That's everything since you last visited — newest first, no
            algorithm. You paid for this app; it doesn't need more of your day.
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
                ~{Math.max(1, Math.round(feed.length * 0.4))}m
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/90">
                of your time, total
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
              Search for something →
            </button>
          </div>
        </div>
      )}

      {model === 'public' && (
        <div className="animate-fade-up px-5 pb-8 pt-9">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
            Feed complete · a question before you go
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight tracking-tighter text-black">
            {outsideCount > 0
              ? `You heard ${outsideCount} voices from outside your bubble today. Which one would you have scrolled past a year ago?`
              : 'Your diversity dial kept today inside your bubble. What are you avoiding?'}
          </h3>
          <p className="mt-3 max-w-[19rem] text-sm leading-relaxed text-muted">
            No more content today — that's deliberate. Sit with the question,
            or widen the dial for tomorrow.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={onReflect}
              className="w-full border-2 border-black bg-black py-3.5 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Reflect on it
            </button>
            <button
              onClick={() => setAlgoOpen(true)}
              className="w-full border-2 border-black bg-white py-3 font-display text-sm font-bold uppercase tracking-widest text-black shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Adjust your diversity dial
            </button>
          </div>
        </div>
      )}

      {/* Overlays */}
      {storyId && (
        <StoryViewer initialId={storyId} onClose={() => setStoryId(null)} />
      )}
      {activityOpen && (
        <NotificationsSheet onClose={() => setActivityOpen(false)} />
      )}
      {algoOpen && <AlgorithmPanel onClose={() => setAlgoOpen(false)} />}
    </div>
  )
}
