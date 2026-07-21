import { useMemo, useState } from 'react'
import type { Post } from '../types'
import type { BusinessModel } from '../data/models'
import { posts } from '../data/posts'
import { topicMeta } from '../data/topics'
import { compact } from '../lib/format'
import { buildInterests, familiarityOf } from '../lib/recommend'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import { Heart } from './Icons'

interface Chip {
  label: string
  test: (p: Post) => boolean
}

interface ExploreCfg {
  title: string
  placeholder: string
  note: string | null
  chips: Chip[]
  order: (list: Post[]) => Post[]
}

const fresh = (p: Post) =>
  p.timeAgo.endsWith('m') || p.timeAgo === '1h' || p.timeAgo === '2h'

/** Minutes ago, for the subscription model's chronological wall. */
const age = (p: Post) => {
  const n = parseInt(p.timeAgo, 10) || 0
  if (p.timeAgo.endsWith('m')) return n
  if (p.timeAgo.endsWith('h')) return n * 60
  return n * 1440
}

/**
 * The discovery grid. Under the attention model it's a heat-ranked "For you"
 * wall; under subscription it's a search tool; under public interest it leads
 * with adjacent discoveries — relevant, never random.
 */
export default function ExploreScreen() {
  const { model } = useModel()
  const { liked, saved } = useInteractions()
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState(0)

  const interests = useMemo(
    () => buildInterests(posts, new Set([...liked, ...saved])),
    [liked, saved],
  )
  /** Posts beyond the user's core topics (adjacent or wider). */
  const discoveryIds = useMemo(
    () =>
      new Set(
        posts
          .filter((p) => familiarityOf(p, interests) !== 'core')
          .map((p) => p.id),
      ),
    [interests],
  )

  // What "discovery" even means depends on who pays for it.
  const cfg = useMemo<ExploreCfg>(() => {
    const configs: Record<BusinessModel, ExploreCfg> = {
      attention: {
        title: 'For you',
        placeholder: 'Search (or just keep scrolling)',
        note: null,
        chips: [
          { label: 'For you', test: () => true },
          { label: '🔥 Viral', test: (p) => p.likes >= 3000 },
          { label: 'Trending', test: (p) => p.likes >= 2000 },
          { label: 'Fresh', test: fresh },
        ],
        order: (list) => [...list].sort((a, b) => b.likes - a.likes),
      },
      subscription: {
        title: 'Search',
        placeholder: 'What are you looking for?',
        note: 'Less recommending, more choosing. Newest first.',
        chips: [
          { label: 'Everything', test: () => true },
          { label: 'Fresh', test: fresh },
        ],
        order: (list) => [...list].sort((a, b) => age(a) - age(b)),
      },
      public: {
        title: 'One step out',
        placeholder: 'Search every topic…',
        note: 'Discovery starts one step from your usual — never random.',
        chips: [
          { label: '→ Near your interests', test: (p) => discoveryIds.has(p.id) },
          { label: 'Balanced mix', test: () => true },
          { label: 'Your usual', test: (p) => !discoveryIds.has(p.id) },
        ],
        order: (list) => list,
      },
    }
    return configs[model]
  }, [model, discoveryIds])

  // No reset-on-model-switch needed: the app remounts this screen per model.

  // Vary card heights for a masonry feel.
  const heights = ['h-52', 'h-64', 'h-44', 'h-60', 'h-48', 'h-56']

  const q = query.trim().toLowerCase()
  const activeChip = cfg.chips[Math.min(chip, cfg.chips.length - 1)]
  const visible = cfg
    .order(posts.filter(activeChip.test))
    .filter(
      (p) =>
        !q ||
        p.caption.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        topicMeta[p.primaryTopic].label.toLowerCase().includes(q),
    )

  return (
    <div className="bg-white pb-6">
      {/* Top bar + search */}
      <header className="sticky top-0 z-20 border-b border-hairline bg-white px-4 py-3">
        <h1 className="mb-2.5 font-display text-2xl font-bold tracking-[-0.02em] text-ink">
          {cfg.title}
        </h1>
        <div className="flex items-center gap-2 rounded-md border border-hairline bg-white px-3 py-2">
          <span className="text-faint">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={cfg.placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-sm font-semibold text-muted"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {cfg.note && (
          <p className="mt-2 text-xs text-faint">
            {cfg.note}
          </p>
        )}
      </header>

      {/* Topic chips — tap to filter the wall */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {cfg.chips.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setChip(i)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-transform active:scale-[0.98] ${
              i === chip
                ? 'bg-ink text-white'
                : 'border border-hairline bg-white text-muted'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 gap-3 px-3">
        {visible.map((post, i) => (
          <div
            key={post.id}
            className="shadow-soft-sm mb-3 break-inside-avoid overflow-hidden rounded-xl border border-hairline bg-white"
          >
            <div className="relative">
              <SmartImage
                src={post.image}
                alt={post.caption}
                className={`w-full ${heights[i % heights.length]}`}
              />
              {/* The attention model never labels discovery — that would
                  remind you there's a world outside the wall. */}
              {discoveryIds.has(post.id) && model !== 'attention' && (
                <span className="absolute right-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white">
                  {model === 'public' ? 'One step out' : 'New for you'}
                </span>
              )}
            </div>
            <div className="p-2.5">
              <p className="line-clamp-2 text-xs leading-snug text-ink">
                {post.caption}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] text-muted">
                  <Avatar name={post.handle} className="h-4 w-4 text-[8px]" />
                  {post.handle}
                </span>
                {/* Public model shows no like-counts in discovery. */}
                {model !== 'public' && (
                  <span className="tnum flex items-center gap-1 text-[11px] text-muted">
                    <Heart className="h-3 w-3" />
                    {compact(post.likes)}
                  </span>
                )}
              </div>
              <span className="mt-2 inline-block rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                {topicMeta[post.primaryTopic].label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state when a search finds nothing */}
      {visible.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
            Nothing here
          </p>
          <p className="mt-1 text-sm text-muted">
            Try another word — results update as you type.
          </p>
        </div>
      )}
    </div>
  )
}
