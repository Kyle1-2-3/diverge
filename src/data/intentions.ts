import type { Intention } from '../types'

// The five session intentions. Each one genuinely changes the feed:
// `mix` sets the familiar/adjacent/discovery balance for a chapter, and
// `chapterSize` nudges how long a session naturally runs. Weights in
// lib/recommend.ts read the id for tone/source matching. Titles and
// subtitles live in i18n as `intent.<id>.title` / `intent.<id>.subtitle`.
export const intentions: Intention[] = [
  {
    id: 'relax',
    emoji: '🛋️',
    mix: { core: 0.85, adjacent: 0.1, discovery: 0.05 },
    chapterSize: 12,
  },
  {
    id: 'friends',
    emoji: '💬',
    mix: { core: 0.8, adjacent: 0.15, discovery: 0.05 },
    chapterSize: 12,
  },
  {
    id: 'explore',
    emoji: '🧭',
    mix: { core: 0.55, adjacent: 0.3, discovery: 0.15 },
    chapterSize: 16,
  },
  {
    id: 'learn',
    emoji: '📚',
    mix: { core: 0.65, adjacent: 0.25, discovery: 0.1 },
    chapterSize: 14,
  },
  {
    id: 'perspective',
    emoji: '🔭',
    mix: { core: 0.65, adjacent: 0.25, discovery: 0.1 },
    chapterSize: 14,
  },
]

export const intentionById = (id: Intention['id']) =>
  intentions.find((i) => i.id === id) ?? intentions[2]
