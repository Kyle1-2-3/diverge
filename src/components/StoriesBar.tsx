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
    <div className="no-scrollbar flex gap-3 overflow-x-auto border-b border-hairline bg-white px-4 py-3">
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
              // "Add your story" — a quiet circle with a plus.
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-white text-2xl leading-none text-muted">
                +
              </span>
            ) : (
              <Avatar
                name={story.name}
                className={`h-14 w-14 text-lg ${
                  story.outside || story.fresh
                    ? 'ring-2 ring-brand ring-offset-2'
                    : 'opacity-60'
                }`}
              />
            )}
            {/* Accent marker only for stories from outside the usual circle. */}
            {story.outside && (
              <span className="absolute -right-1 -top-1 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-semibold leading-none text-white">
                New
              </span>
            )}
          </span>
          <span className="max-w-full truncate text-[10px] font-medium text-muted">
            {story.isYou ? 'You' : story.name}
          </span>
        </button>
      ))}
    </div>
  )
}
