import { useState } from 'react'
import type { Post } from '../types'
import { posts } from '../data/posts'
import { categoryMeta } from '../data/categories'
import { compact } from '../lib/format'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import { Heart } from './Icons'

// Each chip is a real filter over the feed, not just a label.
const CHIPS: { label: string; test: (p: Post) => boolean }[] = [
  { label: 'For you', test: () => true },
  { label: '→ Beyond your bubble', test: (p) => p.isOutsideBubble },
  { label: 'Trending', test: (p) => p.likes >= 2000 },
  { label: 'Nearby', test: (p) => p.location !== '' },
  { label: 'Fresh', test: (p) => p.timeAgo.endsWith('m') || p.timeAgo === '1h' || p.timeAgo === '2h' },
]

/**
 * A Lemon8 / Pinterest-style discovery grid. This is where "exploring outside
 * your bubble" feels fun rather than instructive — a wall of tempting content,
 * subtly seeded with topics the user doesn't usually see. The search box and
 * chips genuinely filter the wall.
 */
export default function ExploreScreen() {
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState(0)

  // Vary card heights for a masonry feel.
  const heights = ['h-52', 'h-64', 'h-44', 'h-60', 'h-48', 'h-56']

  const q = query.trim().toLowerCase()
  const visible = posts
    .filter(CHIPS[chip].test)
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
          Explore
        </h1>
        <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2">
          <span className="text-muted">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="festivals / solar / street food…"
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
      </header>

      {/* Topic chips — tap to filter the wall */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {CHIPS.map((c, i) => (
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
                {post.isOutsideBubble && (
                  <span className="absolute right-2 top-2 border-2 border-black bg-brand px-1.5 py-0.5 font-display text-[10px] font-bold uppercase text-white">
                    new for you
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
                  <span className="flex items-center gap-1 text-[11px] tabular-nums text-muted">
                    <Heart className="h-3 w-3" />
                    {compact(post.likes)}
                  </span>
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
            Try another word — or tap “Beyond your bubble” for something new.
          </p>
        </div>
      )}
    </div>
  )
}
