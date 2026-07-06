import { useEffect, useState } from 'react'
import type { Post } from '../types'
import type { BusinessModel } from '../data/models'
import { posts } from '../data/posts'
import { categoryMeta } from '../data/categories'
import { compact } from '../lib/format'
import { useModel } from '../state/model'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import { Heart } from './Icons'

interface Chip {
  label: string
  test: (p: Post) => boolean
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

// What "discovery" even means depends on who pays for it.
const EXPLORE: Record<
  BusinessModel,
  {
    title: string
    placeholder: string
    note: string | null
    chips: Chip[]
    order: (list: Post[]) => Post[]
  }
> = {
  attention: {
    title: 'For you',
    placeholder: 'search (or just keep scrolling)',
    note: null,
    chips: [
      { label: 'For you', test: () => true },
      { label: '🔥 Viral', test: (p) => p.likes >= 3000 },
      { label: 'Trending', test: (p) => p.likes >= 2000 },
      { label: 'Fresh', test: fresh },
    ],
    // The wall is ranked by pure heat.
    order: (list) => [...list].sort((a, b) => b.likes - a.likes),
  },
  subscription: {
    title: 'Search',
    placeholder: 'what are you looking for?',
    note: 'We recommend less, so you choose more. Results are newest first.',
    chips: [
      { label: 'Everything', test: () => true },
      { label: 'Fresh', test: fresh },
    ],
    order: (list) => [...list].sort((a, b) => age(a) - age(b)),
  },
  public: {
    title: 'Outside your bubble',
    placeholder: 'search every perspective…',
    note: 'Discovery starts beyond your usual. Flip the chips to compare worlds.',
    chips: [
      { label: '→ Beyond your bubble', test: (p) => p.isOutsideBubble },
      { label: 'Balanced mix', test: () => true },
      { label: 'Your usual', test: (p) => !p.isOutsideBubble },
    ],
    order: (list) => list,
  },
}

/**
 * The discovery grid. Under the attention model it's a heat-ranked "For you"
 * wall; under subscription it's a search tool; under public interest it leads
 * with everything you don't usually see.
 */
export default function ExploreScreen() {
  const { model } = useModel()
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState(0)
  const cfg = EXPLORE[model]

  // A model switch redefines the chips — reset to that model's default lens.
  useEffect(() => {
    setChip(0)
    setQuery('')
  }, [model])

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
        categoryMeta[p.category].label.toLowerCase().includes(q),
    )

  return (
    <div className="bg-white pb-6">
      {/* Top bar + search */}
      <header className="sticky top-0 z-20 border-b-4 border-black bg-white px-4 py-3">
        <h1 className="mb-2.5 font-display text-2xl font-bold uppercase tracking-tighter text-black">
          {cfg.title}
        </h1>
        <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2">
          <span className="text-muted">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={cfg.placeholder}
            className="min-w-0 flex-1 bg-transparent font-display text-sm text-black placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="font-mono text-sm font-bold text-black"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {cfg.note && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-tight text-muted">
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
            className={`shrink-0 border-2 border-black px-3 py-1 font-display text-[11px] font-bold uppercase tracking-tight transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
              i === chip ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 gap-3 px-3">
        {visible.map((post, i) => {
          const meta = categoryMeta[post.category]
          return (
            <div
              key={post.id}
              className="mb-3 break-inside-avoid border-2 border-black bg-white shadow-hard-sm"
            >
              <div className="relative border-b-2 border-black">
                <SmartImage
                  src={post.image}
                  alt={post.caption}
                  className={`w-full ${heights[i % heights.length]}`}
                />
                {/* The attention model never labels what's outside your bubble —
                    that would remind you there's a bubble. */}
                {post.isOutsideBubble && model !== 'attention' && (
                  <span className="absolute right-2 top-2 border-2 border-black bg-brand px-1.5 py-0.5 font-display text-[10px] font-bold uppercase text-white">
                    {model === 'public' ? 'different view' : 'new for you'}
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="line-clamp-2 text-xs leading-snug text-black">
                  {post.caption}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Avatar name={post.handle} className="h-4 w-4 text-[8px]" />
                    {post.handle}
                  </span>
                  {/* Public model shows no like-counts in discovery. */}
                  {model !== 'public' && (
                    <span className="flex items-center gap-1 text-[11px] tabular-nums text-muted">
                      <Heart className="h-3 w-3" />
                      {compact(post.likes)}
                    </span>
                  )}
                </div>
                <span className="mt-2 inline-block border-2 border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-tight text-black">
                  {meta.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state when a search finds nothing */}
      {visible.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="font-display text-lg font-bold uppercase tracking-tight text-black">
            Nothing here
          </p>
          <p className="mt-1 text-sm text-muted">
            Try another word — the wall re-filters as you type.
          </p>
        </div>
      )}
    </div>
  )
}
