import { useEffect, useMemo, useRef, useState } from 'react'
import type { IntentionId, Post } from '../types'
import type { Ad } from '../data/ads'
import { ads } from '../data/ads'
import { intentionById } from '../data/intentions'
import { posts } from '../data/posts'
import { topicMeta } from '../data/topics'
import {
  buildInterests,
  composeChapter,
  familiarityOf,
  nearestInterest,
  reasonFor,
  scorePost,
  type RecCtx,
} from '../lib/recommend'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import { usePrefs } from '../state/prefs'
import StoriesBar from './StoriesBar'
import StoryViewer from './StoryViewer'
import NotificationsSheet from './NotificationsSheet'
import AlgorithmPanel from './AlgorithmPanel'
import FeedChapterEnd from './FeedChapterEnd'
import SessionRecap from './SessionRecap'
import CoachMark from './CoachMark'
import PostCard from './PostCard'
import AdCard from './AdCard'
import Logo from './Logo'
import { Heart } from './Icons'

interface FeedProps {
  intentionId: IntentionId
  onChangeMood: () => void
}

/** One slot in the attention model's endless stream: a post or an ad. */
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
 * The home feed — where the business model is felt most.
 *  - attention:    stories, ads, infinite scroll, engagement pings. No exit.
 *  - subscription: intention-led chapters that end on purpose, with a recap.
 *  - public:       transparent chapters, wider mix, the dial one tap away.
 */
export default function Feed({ intentionId, onChangeMood }: FeedProps) {
  const { hidden, liked, saved, showToast } = useInteractions()
  const { model, diversity, unread, bumpUnread, clearUnread, sessionMinutes } =
    useModel()
  const { feedPrefs, updateSession, resetSession } = usePrefs()

  const [storyId, setStoryId] = useState<string | null>(null)
  const [activityOpen, setActivityOpen] = useState(false)
  const [algoOpen, setAlgoOpen] = useState(false)
  const [recapOpen, setRecapOpen] = useState(false)
  const [closed, setClosed] = useState(false)
  const [feeling, setFeeling] = useState<string | null>(null)
  const [bias, setBias] = useState<'novelty' | 'calm' | undefined>(undefined)

  // ---- ranking context ----------------------------------------------------
  const engagedIds = useMemo(
    () => new Set([...liked, ...saved]),
    [liked, saved],
  )
  const interests = useMemo(
    () => buildInterests(posts, engagedIds),
    [engagedIds],
  )
  const ctx: RecCtx = useMemo(
    () => ({
      model,
      intentionId,
      diversity,
      interests,
      prefs: feedPrefs,
      bias,
    }),
    [model, intentionId, diversity, interests, feedPrefs, bias],
  )
  // Latest ctx for event handlers, synced after render (render stays pure).
  const ctxRef = useRef(ctx)
  useEffect(() => {
    ctxRef.current = ctx
  }, [ctx])

  const intention = intentionById(intentionId)

  // ---- chapters (subscription + public) -----------------------------------
  const [chapters, setChapters] = useState<Post[][]>(() =>
    model === 'attention' ? [] : [composeChapter(posts, ctx, new Set())],
  )
  const shownIds = useMemo(
    () => new Set(chapters.flat().map((p) => p.id)),
    [chapters],
  )

  /** Posts a feedback action removed mid-chapter disappear immediately. */
  const visible = (p: Post) =>
    !hidden.has(p.id) &&
    !feedPrefs.hiddenCreators.includes(p.handle) &&
    feedPrefs.topicAdjust[p.primaryTopic] !== 'paused'

  const remaining = posts.filter((p) => !shownIds.has(p.id) && visible(p))
  const canContinue = remaining.length > 0

  const continueChapter = () => {
    const next = composeChapter(posts, ctxRef.current, shownIds)
    if (next.length) setChapters((c) => [...c, next])
    updateSession(model, (s) => ({ ...s, choices: s.choices + 1 }))
  }

  const startNewSession = () => {
    resetSession(model)
    trackedPosts.current = 0
    trackedAds.current = 0
    setFeeling(null)
    setBias(undefined)
    setRecapOpen(false)
    setClosed(false)
    if (model === 'subscription') {
      onChangeMood()
    } else {
      setChapters([composeChapter(posts, ctxRef.current, new Set())])
    }
  }

  // ---- attention model: endless stream + ads ------------------------------
  const [pages, setPages] = useState(1)
  const rankedPool = useMemo(
    () =>
      model === 'attention'
        ? [...posts]
            .filter((p) => !hidden.has(p.id))
            .sort((a, b) => scorePost(b, ctx) - scorePost(a, ctx))
        : [],
    [model, ctx, hidden],
  )
  const items = useMemo<FeedItem[]>(() => {
    if (model !== 'attention') return []
    const out: FeedItem[] = []
    let adIdx = 0
    for (let page = 0; page < pages; page++) {
      // Later pages re-serve rotated content with fresh photos — the
      // "recommendations never run out" illusion every ad-funded feed sells.
      const rot = (page * 7) % rankedPool.length
      const seq = [...rankedPool.slice(rot), ...rankedPool.slice(0, rot)]
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
        if ((i + 1) % 3 === 0) {
          const ad = ads[adIdx++ % ads.length]
          out.push({ kind: 'ad', key: `ad-${page}-${i}`, ad })
        }
      })
    }
    return out
  }, [model, rankedPool, pages])

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
        message: 'You’ve been here a while. The feed keeps until tomorrow 🌿',
      })
    }, 180000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  // ---- session observations (Platform Model Lab) --------------------------
  const trackedPosts = useRef(0)
  const trackedAds = useRef(0)
  useEffect(() => {
    const flatPosts =
      model === 'attention'
        ? items.filter((i) => i.kind === 'post').map((i) => (i as { post: Post }).post)
        : chapters.flat()
    const adCount =
      model === 'attention' ? items.filter((i) => i.kind === 'ad').length : 0
    const newPosts = flatPosts.slice(trackedPosts.current)
    const newAds = adCount - trackedAds.current
    if (newPosts.length === 0 && newAds <= 0) return
    trackedPosts.current = flatPosts.length
    trackedAds.current = adCount
    updateSession(model, (s) => {
      let core = s.core
      let adjacent = s.adjacent
      let discovery = s.discovery
      for (const p of newPosts) {
        const f = familiarityOf(p, interests)
        if (f === 'core') core++
        else if (f === 'adjacent') adjacent++
        else discovery++
      }
      return {
        ...s,
        posts: s.posts + newPosts.length,
        ads: s.ads + Math.max(0, newAds),
        core,
        adjacent,
        discovery,
        creators: [...new Set([...s.creators, ...newPosts.map((p) => p.handle)])],
        seconds: Math.max(s.seconds, sessionMinutes() * 60),
        endedNaturally: model !== 'attention',
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, items, model])

  const onFeeling = (f: string) => {
    setFeeling(f)
    if (f === 'Repetitive') setBias('novelty')
    if (f === 'Too intense') setBias('calm')
    updateSession(model, (s) => ({ ...s, feeling: f, choices: s.choices + 1 }))
  }

  // ---- derived bits for rendering ----------------------------------------
  const flatShown = chapters.flat().filter(visible)
  const firstDiscovery = flatShown.find(
    (p) => familiarityOf(p, interests) !== 'core',
  )
  const near = firstDiscovery ? nearestInterest(firstDiscovery, interests) : null
  const chapterStats = (() => {
    let familiar = 0
    let discoveries = 0
    let friends = 0
    for (const p of flatShown) {
      if (p.sourceType === 'friend') friends++
      if (familiarityOf(p, interests) === 'core') familiar++
      else discoveries++
    }
    return { familiar, discoveries, friends }
  })()

  // ---- closed state -------------------------------------------------------
  if (closed) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white px-8 text-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
          Session ended
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-none tracking-tighter text-black">
          Nothing here is
          <br />
          counting your absence.
        </h2>
        <button
          onClick={startNewSession}
          className="mt-8 border-2 border-black bg-black px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Start a new session
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white pb-4">
      {/* Top bar — same slot, three philosophies. */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-4 border-black bg-white px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2.5">
          {model === 'subscription' && (
            <button
              onClick={onChangeMood}
              className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-tight text-black transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              {intention.emoji} {intention.title}
            </button>
          )}
          {model === 'public' && (
            <button
              onClick={() => setAlgoOpen(true)}
              className="flex items-center gap-1.5 border-2 border-black bg-brand-soft px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-tight text-black transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              ◐ mix · algorithm
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

      {/* Public: one quiet line on how the feed was built. Details on tap. */}
      {model === 'public' && (
        <button
          onClick={() => setAlgoOpen(true)}
          className="flex w-full items-center justify-between border-b-4 border-black bg-brand-soft px-4 py-2 text-left"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
            Ranked for balance, never engagement
          </span>
          <span className="font-mono text-[10px] font-bold uppercase text-brand">
            how? →
          </span>
        </button>
      )}

      {/* ---- The stream --------------------------------------------------- */}
      {model === 'attention' ? (
        <>
          <div className="divide-y-4 divide-black border-b-4 border-black">
            {items.map((item) =>
              item.kind === 'post' ? (
                <PostCard key={item.key} post={item.post} />
              ) : (
                <AdCard key={item.key} ad={item.ad} />
              ),
            )}
          </div>
          <div
            ref={sentinelRef}
            className="flex items-center justify-center gap-2 px-5 py-8"
          >
            <span className="h-2.5 w-2.5 animate-pulse bg-brand" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted">
              finding more for you…
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="divide-y-4 divide-black border-b-4 border-black">
            {chapters.map((chapter, ci) => (
              <div key={ci} className="divide-y-4 divide-black">
                {ci > 0 && (
                  <p className="bg-white px-4 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                    — chapter {ci + 1} —
                  </p>
                )}
                {chapter.filter(visible).map((post) => (
                  <div key={post.id}>
                    {/* The first sideways step introduces itself, once ever. */}
                    {post.id === firstDiscovery?.id && near && (
                      <div className="px-3.5 pt-3">
                        <CoachMark flag="adjacent-post">
                          A step sideways: you're into{' '}
                          {topicMeta[near].label.toLowerCase()}, and{' '}
                          {topicMeta[post.primaryTopic].label.toLowerCase()}{' '}
                          lives next door. The ··· menu tunes it.
                        </CoachMark>
                      </div>
                    )}
                    <PostCard post={post} reason={reasonFor(post, ctx)} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <FeedChapterEnd
            chapter={chapters.length}
            familiar={chapterStats.familiar}
            discoveries={chapterStats.discoveries}
            friends={chapterStats.friends}
            canContinue={canContinue}
            onFeeling={feeling === null ? onFeeling : null}
            onContinue={continueChapter}
            changeLabel={
              model === 'subscription' ? 'Change intention' : 'Adjust the mix'
            }
            onChange={
              model === 'subscription' ? onChangeMood : () => setAlgoOpen(true)
            }
            onClose={() => setRecapOpen(true)}
          />
        </>
      )}

      {/* Overlays */}
      {storyId && (
        <StoryViewer initialId={storyId} onClose={() => setStoryId(null)} />
      )}
      {activityOpen && (
        <NotificationsSheet onClose={() => setActivityOpen(false)} />
      )}
      {algoOpen && <AlgorithmPanel onClose={() => setAlgoOpen(false)} />}
      {recapOpen && (
        <SessionRecap
          shown={flatShown}
          minutes={sessionMinutes()}
          feeling={feeling}
          ctx={ctx}
          onDone={() => {
            setRecapOpen(false)
            setClosed(true)
          }}
        />
      )}
    </div>
  )
}
