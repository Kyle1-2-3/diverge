import { useEffect, useState } from 'react'
import { stories } from '../data/stories'
import SmartImage from './SmartImage'
import Avatar from './Avatar'

interface StoryViewerProps {
  /** id of the story that was tapped in the StoriesBar. */
  initialId: string
  onClose: () => void
}

// How long each story stays up. Must match .animate-story-bar in index.css.
const STORY_MS = 5000

// Simple mock timestamps, one per story slot.
const TIMES = ['1h', '2h', '4h', '6h', '9h', '12h', '16h']

/**
 * Fullscreen story viewer, IG-style: segmented progress bars up top,
 * auto-advance every 5s, tap the right side for next / left side for
 * previous. Closes itself after the last story.
 */
export default function StoryViewer({ initialId, onClose }: StoryViewerProps) {
  const viewable = stories.filter((s) => !s.isYou)
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      viewable.findIndex((s) => s.id === initialId),
    ),
  )
  const story = viewable[index]

  // Auto-advance. Re-runs whenever `index` changes, so tapping also resets
  // the 5-second clock.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (index < viewable.length - 1) setIndex(index + 1)
      else onClose()
    }, STORY_MS)
    return () => window.clearTimeout(t)
  }, [index, viewable.length, onClose])

  const next = () =>
    index < viewable.length - 1 ? setIndex(index + 1) : onClose()
  const prev = () => index > 0 && setIndex(index - 1)

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      {/* The story photo. Keyed on the story so each one fades in fresh. */}
      <SmartImage
        key={story.id}
        src={`https://picsum.photos/seed/divstory-${story.id}/800/1400`}
        alt={`${story.name}'s story`}
        className="absolute inset-0"
      />
      {/* Soft top/bottom scrims so the white UI stays readable. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Progress bars */}
      <div className="relative z-10 flex gap-1 px-3 pt-3">
        {viewable.map((s, i) => (
          <div key={s.id} className="h-1 flex-1 overflow-hidden bg-white/30">
            {i < index && <div className="h-full w-full bg-white" />}
            {i === index && (
              <div key={index} className="animate-story-bar h-full bg-white" />
            )}
          </div>
        ))}
      </div>

      {/* Header: who + when + close */}
      <div className="relative z-10 flex items-center gap-2.5 px-3.5 pt-3">
        <Avatar name={story.name} className="h-9 w-9 text-xs" />
        <span className="font-display text-sm font-bold text-white">
          {story.name}
        </span>
        <span className="font-mono text-[11px] text-white/70">
          {TIMES[index % TIMES.length]}
        </span>
        {story.outside && (
          <span className="border-2 border-black bg-brand px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
            outside your circle
          </span>
        )}
        <button
          onClick={onClose}
          className="ml-auto p-1 font-mono text-xl font-bold leading-none text-white"
          aria-label="Close story"
        >
          ✕
        </button>
      </div>

      {/* Invisible tap zones: left third = back, rest = forward. */}
      <div className="relative z-10 flex flex-1">
        <button className="w-1/3" onClick={prev} aria-label="Previous story" />
        <button className="w-2/3" onClick={next} aria-label="Next story" />
      </div>
    </div>
  )
}
