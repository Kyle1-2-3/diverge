import type { Intention } from '../types'

// The five session intentions. Each one genuinely changes the feed:
// `mix` sets the familiar/adjacent/discovery balance for a chapter, and
// `chapterSize` nudges how long a session naturally runs. Weights in
// lib/recommend.ts read the id for tone/source matching.
export const intentions: Intention[] = [
  {
    id: 'relax',
    emoji: '🛋️',
    title: 'Relax',
    subtitle: 'Easy, familiar, no pressure',
    message: 'Keeping it light — familiar things, calm pace.',
    mix: { core: 0.85, adjacent: 0.1, discovery: 0.05 },
    chapterSize: 12,
  },
  {
    id: 'friends',
    emoji: '💬',
    title: 'Catch up',
    subtitle: 'Friends first',
    message: 'Friends first — everything recent from your people.',
    mix: { core: 0.8, adjacent: 0.15, discovery: 0.05 },
    chapterSize: 12,
  },
  {
    id: 'explore',
    emoji: '🧭',
    title: 'Explore',
    subtitle: 'Wander a little further',
    message: 'A few doors near your interests are open today.',
    mix: { core: 0.55, adjacent: 0.3, discovery: 0.15 },
    chapterSize: 16,
  },
  {
    id: 'learn',
    emoji: '📚',
    title: 'Learn something',
    subtitle: 'Interesting, not homework',
    message: 'Leaning informative — still your interests, more depth.',
    mix: { core: 0.65, adjacent: 0.25, discovery: 0.1 },
    chapterSize: 14,
  },
  {
    id: 'perspective',
    emoji: '🔭',
    title: 'Another angle',
    subtitle: 'Same topics, more views',
    message: 'Same topics you love — with more angles on them.',
    mix: { core: 0.65, adjacent: 0.25, discovery: 0.1 },
    chapterSize: 14,
  },
]

export const intentionById = (id: Intention['id']) =>
  intentions.find((i) => i.id === id) ?? intentions[2]
