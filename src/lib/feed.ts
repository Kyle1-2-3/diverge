import type { DiversityBar, IntentionId, Post } from '../types'
import type { BusinessModel } from '../data/models'
import { posts } from '../data/posts'
import { intentions } from '../data/intentions'
import { categoryMeta } from '../data/categories'

// ---------------------------------------------------------------------------
// Pure helper functions that turn the user's chosen intention into:
//   1. an ordered list of posts for the feed
//   2. a Diversity Score (0–100) and the six category bars
//   3. a Bubble Awareness summary
// Keeping this logic separate from the UI keeps components small and testable.
// ---------------------------------------------------------------------------

/** Order the feed for a given intention. */
export function getFeedForIntention(intentionId: IntentionId): Post[] {
  // "Explore" and "perspective" push bubble-broadening posts to the top so the
  // feed visibly responds to the more adventurous intentions.
  if (intentionId === 'explore' || intentionId === 'perspective') {
    return [...posts].sort(
      (a, b) => Number(b.isOutsideBubble) - Number(a.isOutsideBubble),
    )
  }
  // "Relax" leads with calming, familiar content first.
  if (intentionId === 'relax') {
    return [...posts].sort(
      (a, b) => Number(a.isOutsideBubble) - Number(b.isOutsideBubble),
    )
  }
  // Other intentions keep the natural, mixed ordering.
  return posts
}

// ---------------------------------------------------------------------------
// The experiment's centrepiece: three ranking algorithms, one per business
// model. Same posts in, completely different feed out.
// ---------------------------------------------------------------------------

/** Minutes ago, parsed from labels like "38m" / "2h" / "1d". */
function ageMinutes(timeAgo: string): number {
  const n = parseInt(timeAgo, 10) || 0
  if (timeAgo.endsWith('m')) return n
  if (timeAgo.endsWith('h')) return n * 60
  return n * 1440
}

/** How emotionally sticky a post is — the only thing ads care about. */
function engagementScore(p: Post): number {
  // Comments beat likes (arguments hold attention); content from outside the
  // bubble is heavily demoted because familiarity keeps people scrolling.
  const raw = p.likes + p.comments * 6
  return p.isOutsideBubble ? raw * 0.25 : raw
}

/**
 * Rank the feed under a business model.
 * - attention:    engagement-sorted, bubble-reinforcing. The KPI is minutes.
 * - subscription: strictly chronological. No algorithm to game you.
 * - public:       viewpoint-balanced; `diversity` (0–100) genuinely controls
 *                 how much outside-bubble content is mixed in and how early.
 */
export function rankFeed(
  model: BusinessModel,
  intentionId: IntentionId,
  diversity: number,
): Post[] {
  if (model === 'attention') {
    return [...posts].sort((a, b) => engagementScore(b) - engagementScore(a))
  }

  if (model === 'subscription') {
    return [...posts].sort((a, b) => ageMinutes(a.timeAgo) - ageMinutes(b.timeAgo))
  }

  // public — split the pool, keep only as many outside posts as the user's
  // diversity dial asks for, then interleave them evenly through the feed.
  const inside = posts.filter((p) => !p.isOutsideBubble)
  const outside = posts.filter((p) => p.isOutsideBubble)
  const outsideCount = Math.round((outside.length * diversity) / 100)
  const chosen = outside.slice(0, outsideCount)

  const total = inside.length + chosen.length
  const outsideSlots = new Set(
    chosen.map((_, k) => Math.floor(((k + 0.5) * total) / chosen.length)),
  )
  const mixed: Post[] = []
  let ii = 0
  let oi = 0
  for (let i = 0; i < total; i++) {
    if (outsideSlots.has(i) && oi < chosen.length) mixed.push(chosen[oi++])
    else if (ii < inside.length) mixed.push(inside[ii++])
    else mixed.push(chosen[oi++])
  }
  void intentionId // intention only matters where the user sets one (M2)
  return mixed
}

/** The headline diversity score for an intention (mock, intention-driven). */
export function getDiversityScore(intentionId: IntentionId): number {
  return intentions.find((i) => i.id === intentionId)?.targetScore ?? 60
}

// The six headline buckets shown as bars, with a fixed colour each.
const BUCKETS: { label: DiversityBar['label']; color: string }[] = [
  { label: 'Entertainment', color: 'bg-pink-400' },
  { label: 'News', color: 'bg-blue-400' },
  { label: 'Culture', color: 'bg-purple-400' },
  { label: 'Sports', color: 'bg-orange-400' },
  { label: 'Opposing Views', color: 'bg-amber-400' },
  { label: 'Education', color: 'bg-teal-400' },
]

/**
 * Build the six diversity bars. We start from the real category mix in the
 * feed, then nudge the balance toward the intention's target score so the bars
 * visibly shift when the user changes intention.
 */
export function getDiversityBars(intentionId: IntentionId): DiversityBar[] {
  // Count posts per headline bucket.
  const counts: Record<string, number> = {}
  for (const post of posts) {
    const group = categoryMeta[post.category].group
    counts[group] = (counts[group] ?? 0) + 1
  }
  const max = Math.max(...Object.values(counts), 1)
  const score = getDiversityScore(intentionId)

  return BUCKETS.map(({ label, color }) => {
    const base = ((counts[label] ?? 0) / max) * 100
    // Blend the raw mix with the intention's target so higher-diversity
    // intentions lift the under-represented bars (like Opposing Views).
    const isUnderdog = label === 'Opposing Views' || label === 'Education'
    const nudged = isUnderdog
      ? base + (score - 50) * 0.7
      : base - (score - 50) * 0.2
    return {
      label,
      color,
      value: Math.max(8, Math.min(100, Math.round(nudged))),
    }
  })
}

/** Per-bucket numbers behind the Bubble Map on the "You" tab. */
export interface BubbleStat {
  group: DiversityBar['label']
  /** How many feed posts fall in this bucket. */
  feedCount: number
  /** How many of those the user liked, saved or commented on. */
  engaged: number
  /** feedCount + 2×engaged — engagement counts double so the map visibly
   *  reacts when the user interacts with a topic. */
  weight: number
}

/**
 * Aggregate the feed + the user's interactions into one stat per headline
 * bucket. `engagedIds` is the union of liked/saved/commented post ids.
 */
export function getBubbleStats(engagedIds: Set<string>): BubbleStat[] {
  return BUCKETS.map(({ label }) => {
    const inGroup = posts.filter(
      (p) => categoryMeta[p.category].group === label,
    )
    const engaged = inGroup.filter((p) => engagedIds.has(p.id)).length
    return {
      group: label,
      feedCount: inGroup.length,
      engaged,
      weight: inGroup.length + engaged * 2,
    }
  })
}

/**
 * Spotify-Wrapped-style recap for the "You" tab. This is where the diverge
 * mechanics surface — as a celebration of growth, not a lecture.
 */
export function getRecap(intentionId: IntentionId) {
  const feed = getFeedForIntention(intentionId)
  const score = getDiversityScore(intentionId)
  const outside = feed.filter((p) => p.isOutsideBubble).length
  const topics = new Set(feed.map((p) => p.category)).size

  // A warm, shareable headline that scales with how far they ranged.
  const headline =
    score >= 85
      ? 'You went way past your bubble this week'
      : score >= 65
        ? 'You stretched your feed nicely this week'
        : 'A quiet week — room to roam next time'

  return {
    headline,
    score,
    topics,
    outside,
    // Three "stat cards" for the recap, BeReal/Wrapped style.
    stats: [
      { emoji: '🌍', value: String(topics), label: 'topics explored' },
      { emoji: '✨', value: String(outside), label: 'posts beyond your bubble' },
      { emoji: '🧭', value: `${score}`, label: 'diversity score' },
    ],
    bars: getDiversityBars(intentionId),
  }
}

/** A short, human-readable bubble-awareness summary for the chosen intention. */
export function getBubbleSummary(intentionId: IntentionId): {
  headline: string
  detail: string
  addedCount: number
} {
  const feed = getFeedForIntention(intentionId)
  const addedCount = feed.filter((p) => p.isOutsideBubble).length

  const detailByIntention: Record<IntentionId, string> = {
    relax:
      'Your feed leans toward familiar, comforting topics today. Diverge still slipped in a few posts from outside your usual interests.',
    learn:
      'Your feed is currently heavy on fashion and entertainment. Diverge added educational posts to stretch what you know.',
    perspective:
      'Diverge pulled forward viewpoints you’d normally scroll past, so opposing voices share the spotlight today.',
    trends:
      'Trending content dominates your feed right now. Diverge balanced it with stories the trend machine usually hides.',
    explore:
      'Your bubble has been turned inside-out. Distant topics and opposing views were promoted to the top of your feed.',
  }

  return {
    headline: 'Your current bubble',
    detail: detailByIntention[intentionId],
    addedCount,
  }
}
