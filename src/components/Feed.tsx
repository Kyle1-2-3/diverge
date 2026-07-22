import { useEffect, useMemo, useRef, useState } from 'react'
import type { IntentionId, Post } from '../types'
import type { Ad } from '../data/ads'
import { ads } from '../data/ads'
import { intentionById } from '../data/intentions'
import { posts } from '../data/posts'
import { useLocale } from '../i18n'
import type { TranslationKey } from '../i18n/translations'
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
import FeedChapterEnd, { type FeelingId } from './FeedChapterEnd'
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
const PING_KEYS: TranslationKey[] = [
  'ping.liked',
  'ping.views',
  'ping.profile',
  'ping.likedMany',
  'ping.search',
]

/**
 * The home feed — where the business model is felt most.
 *  - attention:    stories, ads, infinite scroll, engagement pings. No exit.
 *  - subscription: intention-led chapters that end on purpose, with a recap.
 *  - public:       transparent chapters, wider mix, the dial one tap away.
 */
export default function Feed({ intentionId, onChangeMood }: FeedProps) {
  const { t } = useLocale()
  const { hidden, liked, saved, showToast } = useInteractions()
  const { model, diversity, unread, bumpUnread, clearUnread, sessionMinutes } =
    useModel()
  const { feedPrefs, updateSession, resetSession } = usePrefs()

  const [storyId, setStoryId] = useState<string | null>(null)
  const [activityOpen, setActivityOpen] = useState(false)
  const [algoOpen, setAlgoOpen] = useState(false)
  const [recapOpen, setRecapOpen] = useState(false)
  const [closed, setClosed] = useState(false)
  const [feeling, setFeeling] = useState<FeelingId | null>(null)
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
                // Same tags, different lock → a fresh matching photo per page.
                image: p.image.replace('?lock=', `?lock=${page}9`),
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
    const timer = window.setInterval(() => {
      showToast({
        message: t(PING_KEYS[Math.floor(Math.random() * PING_KEYS.length)]),
      })
      bumpUnread()
    }, 22000)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  // Subscription model: one gentle break reminder, then silence.
  useEffect(() => {
    if (model !== 'subscription') return
    const timer = window.setTimeout(() => {
      showToast({ message: t('toast.break') })
    }, 180000)
    return () => window.clearTimeout(timer)
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

  const onFeeling = (f: FeelingId) => {
    setFeeling(f)
    if (f === 'repetitive') setBias('novelty')
    if (f === 'intense') setBias('calm')
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
        <p className="text-xs font-medium text-faint">
          {t('feed.sessionEnded')}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-ink">
          {t('feed.closedTitle1')}
          <br />
          {t('feed.closedTitle2')}
        </h2>
        <button
          onClick={startNewSession}
          className="mt-8 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
        >
          {t('feed.newSession')}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white pb-4">
      {/* Top bar — same slot, three philosophies. */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-white px-4 py-3">
        <Logo />
        <div className="flex items-center gap-2.5">
          {model === 'subscription' && (
            <button
              onClick={onChangeMood}
              className="flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
            >
              {intentionEmoji(intentionId)} {t(`intent.${intentionId}.title`)}
            </button>
          )}
          {model === 'public' && (
            <button
              onClick={() => setAlgoOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand transition-transform active:scale-[0.98]"
            >
              {t('feed.mixAlgo')}
            </button>
          )}
          <button
            onClick={() => {
              setActivityOpen(true)
              clearUnread()
            }}
            className="relative text-ink"
            aria-label={t('nav.notifications')}
          >
            <Heart className="h-6 w-6" />
            {model === 'attention' && unread > 0 && (
              <span className="tnum absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold leading-none text-white">
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
          className="flex w-full items-center justify-between bg-brand-soft px-4 py-2 text-left"
        >
          <span className="text-xs font-medium text-brand">
            {t('feed.publicBanner')}
          </span>
          <span className="text-xs font-semibold text-brand">
            {t('feed.publicBannerHow')}
          </span>
        </button>
      )}

      {/* ---- The stream --------------------------------------------------- */}
      {model === 'attention' ? (
        <>
          <div className="divide-y divide-hairline border-b border-hairline">
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
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand" />
            <span className="text-xs font-medium text-faint">
              {t('feed.findingMore')}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="divide-y divide-hairline border-b border-hairline">
            {chapters.map((chapter, ci) => (
              <div key={ci} className="divide-y divide-hairline">
                {ci > 0 && (
                  <p className="tnum bg-white px-4 py-2 text-center text-xs font-medium text-faint">
                    {t('feed.chapter', { n: ci + 1 })}
                  </p>
                )}
                {chapter.filter(visible).map((post) => (
                  <div key={post.id}>
                    {/* The first sideways step introduces itself, once ever. */}
                    {post.id === firstDiscovery?.id && near && (
                      <div className="px-3.5 pt-3">
                        <CoachMark flag="adjacent-post">
                          {t('coach.adjacent', {
                            near: t(`topic.${near}`),
                            topic: t(`topic.${post.primaryTopic}`),
                          })}
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
              model === 'subscription'
                ? t('chapterEnd.changeIntention')
                : t('chapterEnd.adjustMix')
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

function intentionEmoji(id: IntentionId): string {
  return intentionById(id).emoji
}
