// Story bubbles shown at the top of the feed, IG/BeReal-style.
// The first entry is always "you". `fresh` adds the colourful unseen ring.
export interface Story {
  id: string
  name: string
  avatar: string
  /** Tailwind gradient for the avatar background. */
  ring: string
  fresh: boolean
  isYou?: boolean
  /** Stories from outside the user's usual circle get a subtle sparkle. */
  outside?: boolean
}

export const stories: Story[] = [
  {
    id: 's0',
    name: 'Your story',
    avatar: '➕',
    ring: 'from-gray-200 to-gray-200',
    fresh: false,
    isYou: true,
  },
  { id: 's1', name: 'mira', avatar: '🧥', ring: 'from-pink-400 to-fuchsia-500', fresh: true },
  { id: 's2', name: 'yujin', avatar: '🎧', ring: 'from-violet-400 to-purple-500', fresh: true },
  {
    id: 's3',
    name: 'oaxaca_fest',
    avatar: '🎭',
    ring: 'from-amber-400 to-orange-500',
    fresh: true,
    outside: true,
  },
  { id: 's4', name: 'kai', avatar: '🏃', ring: 'from-cyan-400 to-blue-500', fresh: true },
  {
    id: 's5',
    name: 'greengrid',
    avatar: '⚡',
    ring: 'from-lime-400 to-emerald-500',
    fresh: true,
    outside: true,
  },
  { id: 's6', name: 'noodle', avatar: '🍜', ring: 'from-orange-400 to-rose-400', fresh: false },
  { id: 's7', name: 'futurelab', avatar: '🤖', ring: 'from-indigo-400 to-violet-500', fresh: false },
]
