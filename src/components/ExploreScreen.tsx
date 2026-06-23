import { posts } from '../data/posts'
import { categoryMeta } from '../data/categories'
import SmartImage from './SmartImage'
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
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/85 px-4 py-3 backdrop-blur-xl">
        <h1 className="mb-2.5 font-display text-2xl font-extrabold tracking-tight text-ink">
          Explore
        </h1>
        <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2.5 text-sm text-gray-400">
          <span>🔍</span>
          <span>Try “festivals”, “solar”, “street food”…</span>
        </div>
      </header>

      {/* Topic chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {['For you', '✨ Beyond your bubble', 'Trending', 'Nearby', 'Fresh'].map(
          (chip, i) => (
            <button
              key={chip}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                i === 0
                  ? 'bg-ink text-white'
                  : 'bg-gray-100 text-ink active:bg-gray-200'
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
              className="mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className="relative">
                <SmartImage
                  src={post.image}
                  gradient={post.gradient}
                  emoji={post.visual}
                  alt={post.caption}
                  className={`w-full ${heights[i % heights.length]}`}
                />
                {post.isOutsideBubble && (
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink backdrop-blur">
                    ✨ new for you
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="line-clamp-2 text-xs leading-snug text-ink">
                  {post.caption}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-muted">
                    <span>{post.avatar}</span>
                    {post.handle}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted">
                    <Heart className="h-3 w-3" />
                    {(post.likes / 1000).toFixed(1)}k
                  </span>
                </div>
                <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.badge}`}>
                  {meta.emoji} {meta.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
