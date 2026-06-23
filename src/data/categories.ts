import type { Category } from '../types'

// Visual + grouping metadata for each category.
// `group` maps detailed categories onto the six headline buckets shown in the
// Diversity Score panel.
export interface CategoryMeta {
  label: string
  emoji: string
  /** Tailwind text/badge colour classes. */
  badge: string
  group:
    | 'Entertainment'
    | 'News'
    | 'Culture'
    | 'Sports'
    | 'Opposing Views'
    | 'Education'
}

export const categoryMeta: Record<Category, CategoryMeta> = {
  fashion: {
    label: 'Fashion',
    emoji: '👗',
    badge: 'bg-pink-100 text-pink-700',
    group: 'Entertainment',
  },
  sports: {
    label: 'Sports',
    emoji: '⚽',
    badge: 'bg-orange-100 text-orange-700',
    group: 'Sports',
  },
  'world news': {
    label: 'World News',
    emoji: '🌍',
    badge: 'bg-blue-100 text-blue-700',
    group: 'News',
  },
  'mental health': {
    label: 'Mental Health',
    emoji: '🧠',
    badge: 'bg-teal-100 text-teal-700',
    group: 'Education',
  },
  culture: {
    label: 'Culture',
    emoji: '🎭',
    badge: 'bg-purple-100 text-purple-700',
    group: 'Culture',
  },
  technology: {
    label: 'Technology',
    emoji: '💻',
    badge: 'bg-indigo-100 text-indigo-700',
    group: 'Education',
  },
  environment: {
    label: 'Environment',
    emoji: '🌱',
    badge: 'bg-green-100 text-green-700',
    group: 'News',
  },
  'opposing opinion': {
    label: 'Different Perspective',
    emoji: '🔄',
    badge: 'bg-amber-100 text-amber-800',
    group: 'Opposing Views',
  },
}
