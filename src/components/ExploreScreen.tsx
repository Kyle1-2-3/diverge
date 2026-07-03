import { posts } from '../data/posts'
import { categoryMeta } from '../data/categories'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import { Heart } from './Icons'

/**
 * A Lemon8 / Pinterest-style discovery grid. This is where "exploring outside
 * your bubble" feels fun rather than instructive — a wall of tempting content,
 * subtly seeded with topics the user doesn't usually see.
 */
export default function ExploreScreen() {
  // Vary card heights for a masonry feel.
  const heights = ['h-52', 'h-64', 'h-44', 'h-60', 'h-48', 'h-56']

  return (
    <div className="bg-white pb-6">
      {/* Top bar + fake search */}
      <header className="sticky top-0 z-20 border-b-4 border-black bg-white px-4 py-3">
        <h1 className="mb-2.5 font-display text-2xl font-bold uppercase tracking-tighter text-black">
          Explore
        </h1>
        <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-display text-sm text-muted">
          <span>⌕</span>
          <span>festivals / solar / street food…</span>
        </div>
      </header>

      {/* Topic chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {['For you', '→ Beyond your bubble', 'Trending', 'Nearby', 'Fresh'].map(
          (chip, i) => (
            <button
              key={chip}
              className={`shrink-0 border-2 border-black px-3 py-1 font-display text-[11px] font-bold uppercase tracking-tight transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                i === 0 ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {chip}
            </button>
          ),
        )}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 gap-3 px-3">
        {posts.map((post, i) => {
          const meta = categoryMeta[post.category]
          return (
            <div
              key={post.id}
              className="mb-3 break-inside-avoid border-2 border-black bg-white shadow-hard-sm"
            >
              <div className="relative border-b-2 border-black">
                <SmartImage
                  src={post.image}
                  gradient={post.gradient}
                  emoji={post.visual}
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
                    {(post.likes / 1000).toFixed(1)}k
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
    </div>
  )
}
