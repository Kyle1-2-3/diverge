import { stories } from '../data/stories'
import { useInteractions } from '../state/interactions'
import Avatar from './Avatar'

interface StoriesBarProps {
  /** Called with the tapped story's id — opens the fullscreen viewer. */
  onOpenStory: (id: string) => void
}

/** Horizontal, swipeable story tiles at the top of the feed. */
export default function StoriesBar({ onOpenStory }: StoriesBarProps) {
  const { showToast } = useInteractions()

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto border-b-4 border-black bg-white px-4 py-3">
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() =>
            story.isYou
              ? showToast({ message: 'Posting stories is not in this demo — yet' })
              : onOpenStory(story.id)
          }
          className="flex w-16 shrink-0 flex-col items-center gap-1"
        >
          <span className="relative">
            {story.isYou ? (
              // "Add your story" — a plain bordered box with a plus.
              <span className="flex h-14 w-14 items-center justify-center border-2 border-black bg-white font-mono text-2xl font-bold leading-none text-black">
                +
              </span>
            ) : (
              <Avatar
                name={story.name}
                className={`h-14 w-14 text-lg ${
                  story.outside || story.fresh ? 'shadow-hard-sm' : 'opacity-60'
                }`}
              />
            )}
            {/* Accent marker only for stories from outside the usual circle. */}
            {story.outside && (
              <span className="absolute -right-1 -top-1 border-2 border-black bg-brand px-1 font-mono text-[9px] font-bold text-white">
                NEW
              </span>
            )}
          </span>
          <span className="max-w-full truncate font-mono text-[10px] uppercase tracking-tight text-black">
            {story.isYou ? 'You' : story.name}
          </span>
        </button>
      ))}
    </div>
  )
}
