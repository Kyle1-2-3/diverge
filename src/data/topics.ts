import type { GroupId, TopicId } from '../types'

// ---------------------------------------------------------------------------
// The topic map behind Adjacent Diversity. Groups are the eight headline
// worlds shown in the Interest Map; the adjacency list connects topics so
// discovery can travel one believable step at a time. Edges are undirected —
// list each once, normalizeAdjacency() mirrors them.
// ---------------------------------------------------------------------------

export interface TopicMeta {
  id: TopicId
  label: string
  group: GroupId
}

export const groupMeta: Record<GroupId, { label: string; color: string }> = {
  life: { label: 'Friends & Life', color: '#f59e0b' },
  fashion: { label: 'Fashion', color: '#ec4899' },
  food: { label: 'Food', color: '#f97316' },
  sports: { label: 'Sports', color: '#3b82f6' },
  art: { label: 'Art & Design', color: '#a855f7' },
  travel: { label: 'Travel & Cities', color: '#14b8a6' },
  tech: { label: 'Tech & Science', color: '#0284c7' },
  music: { label: 'Music & Culture', color: '#16a34a' },
}

export const topics: TopicMeta[] = [
  { id: 'friends', label: 'Friends', group: 'life' },
  { id: 'campus-life', label: 'Campus life', group: 'life' },
  { id: 'pets', label: 'Pets', group: 'life' },

  { id: 'fashion', label: 'Fashion', group: 'fashion' },
  { id: 'textile-design', label: 'Textile design', group: 'fashion' },
  { id: 'sustainability', label: 'Sustainability', group: 'fashion' },
  { id: 'beauty', label: 'Beauty', group: 'fashion' },

  { id: 'food', label: 'Food', group: 'food' },
  { id: 'street-food', label: 'Street food', group: 'food' },
  { id: 'home-cooking', label: 'Home cooking', group: 'food' },
  { id: 'coffee', label: 'Coffee', group: 'food' },

  { id: 'baseball', label: 'Baseball', group: 'sports' },
  { id: 'football', label: 'Football', group: 'sports' },
  { id: 'sports-analytics', label: 'Sports analytics', group: 'sports' },
  { id: 'sports-psychology', label: 'Sports psychology', group: 'sports' },
  { id: 'stadium-design', label: 'Stadium design', group: 'sports' },
  { id: 'sports-economics', label: 'Sports economics', group: 'sports' },
  { id: 'fitness', label: 'Fitness', group: 'sports' },

  { id: 'photography', label: 'Photography', group: 'art' },
  { id: 'illustration', label: 'Illustration', group: 'art' },
  { id: 'architecture', label: 'Architecture', group: 'art' },

  { id: 'travel', label: 'Travel', group: 'travel' },
  { id: 'urban-life', label: 'City life', group: 'travel' },

  { id: 'technology', label: 'Technology', group: 'tech' },
  { id: 'ai', label: 'AI', group: 'tech' },
  { id: 'audio-tech', label: 'Audio tech', group: 'tech' },
  { id: 'climate-tech', label: 'Climate tech', group: 'tech' },

  { id: 'music', label: 'Music', group: 'music' },
  { id: 'dance', label: 'Dance', group: 'music' },
  { id: 'music-history', label: 'Music history', group: 'music' },
  { id: 'festivals', label: 'Festivals', group: 'music' },
  { id: 'film', label: 'Film', group: 'music' },
]

export const topicMeta: Record<TopicId, TopicMeta> = Object.fromEntries(
  topics.map((t) => [t.id, t]),
) as Record<TopicId, TopicMeta>

// One believable step at a time. Each entry lists neighbors one hop away.
const EDGES: Partial<Record<TopicId, TopicId[]>> = {
  friends: ['campus-life', 'pets', 'food', 'travel'],
  'campus-life': ['fitness', 'coffee'],
  pets: ['photography'],

  fashion: ['textile-design', 'beauty', 'photography', 'street-food'],
  'textile-design': ['sustainability', 'illustration'],
  sustainability: ['climate-tech', 'urban-life'],
  beauty: ['photography'],

  food: ['street-food', 'home-cooking', 'coffee', 'travel'],
  'street-food': ['travel', 'festivals'],
  'home-cooking': ['sustainability'],
  coffee: ['urban-life'],

  baseball: [
    'sports-analytics',
    'sports-psychology',
    'stadium-design',
    'sports-economics',
    'fitness',
  ],
  football: ['sports-analytics', 'sports-economics', 'fitness'],
  'sports-analytics': ['ai', 'sports-economics'],
  'sports-psychology': ['fitness'],
  'stadium-design': ['architecture', 'urban-life', 'sports-economics'],
  fitness: ['dance'],

  photography: ['travel', 'illustration', 'film'],
  illustration: ['film'],
  architecture: ['urban-life', 'illustration'],

  travel: ['urban-life', 'festivals'],

  technology: ['ai', 'audio-tech', 'climate-tech'],
  'audio-tech': ['music'],
  ai: [],
  'climate-tech': ['urban-life'],

  music: ['dance', 'music-history', 'festivals'],
  dance: ['festivals'],
  'music-history': ['film'],
  festivals: [],
  film: [],
}

/** Mirrored adjacency list — neighbors one hop away, both directions. */
export const adjacency: Record<TopicId, TopicId[]> = (() => {
  const map = Object.fromEntries(topics.map((t) => [t.id, new Set<TopicId>()])) as Record<
    TopicId,
    Set<TopicId>
  >
  for (const [from, tos] of Object.entries(EDGES) as [TopicId, TopicId[]][]) {
    for (const to of tos) {
      map[from].add(to)
      map[to].add(from)
    }
  }
  return Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, [...v]]),
  ) as Record<TopicId, TopicId[]>
})()

/**
 * Graph distance between two topics (0 = same, 1 = adjacent, …), capped so
 * the search stays cheap. Anything ≥ 3 counts as "far" everywhere it's used.
 */
export function topicDistance(a: TopicId, b: TopicId, cap = 3): number {
  if (a === b) return 0
  let frontier = new Set<TopicId>([a])
  const seen = new Set<TopicId>([a])
  for (let d = 1; d <= cap; d++) {
    const next = new Set<TopicId>()
    for (const t of frontier) {
      for (const n of adjacency[t]) {
        if (n === b) return d
        if (!seen.has(n)) {
          seen.add(n)
          next.add(n)
        }
      }
    }
    frontier = next
  }
  return cap + 1
}
