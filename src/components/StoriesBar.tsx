import { stories } from '../data/stories'

/** Horizontal, swipeable story bubbles at the top of the feed. */
export default function StoriesBar() {
  return (
    <div className="no-scrollbar flex gap-3.5 overflow-x-auto border-b border-black/5 bg-white px-4 py-3">
      {stories.map((story) => (
        <button key={story.id} className="flex w-16 shrink-0 flex-col items-center gap-1">
          <span
            className={`relative rounded-full bg-gradient-to-tr p-[2.5px] ${
              story.fresh ? story.ring : 'from-gray-200 to-gray-200'
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-100 to-pink-100 text-2xl">
              {story.avatar}
            </span>
            {/* Subtle sparkle marks stories from outside the usual circle. */}
            {story.outside && (
              <span className="absolute -right-0.5 -top-0.5 text-xs">✨</span>
            )}
          </span>
          <span className="max-w-full truncate text-[11px] text-ink">
            {story.isYou ? 'You' : story.name}
          </span>
        </button>
      ))}
    </div>
  )
}
