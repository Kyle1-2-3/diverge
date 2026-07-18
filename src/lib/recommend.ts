import type {
  Familiarity,
  IntentionId,
  Post,
  TopicId,
} from '../types'
import type { BusinessModel } from '../data/models'
import { intentionById } from '../data/intentions'
import { adjacency, topicDistance, topicMeta } from '../data/topics'

// ---------------------------------------------------------------------------
// The recommendation engine. Deliberately transparent: a handful of named,
// human-readable signals, combined with weights that differ per business
// model and per intention. No ML, no magic — the same numbers the Algorithm
// panel describes are the numbers used here.
// ---------------------------------------------------------------------------

/** Per-topic adjustments the user makes ("more", "less", pause). */
export type TopicAdjust = Partial<Record<TopicId, 'more' | 'less' | 'paused'>>

export interface FeedPrefs {
  topicAdjust: TopicAdjust
  hiddenCreators: string[]
}

export interface RecCtx {
  model: BusinessModel
  intentionId: IntentionId
  /** Public model's diversity dial, 0–100. */
  diversity: number
  /** Interest weight per topic, seeded + learned from likes/saves. */
  interests: Partial<Record<TopicId, number>>
  prefs: FeedPrefs
  /** Set from session reflections: "Repetitive" → novelty, "Too intense" → calm. */
  bias?: 'novelty' | 'calm'
}

// The account's starting interests — what the mock user "already likes".
// Engagement (likes/saves) adds to these at runtime via buildInterests.
const SEED_INTERESTS: Partial<Record<TopicId, number>> = {
  friends: 1,
  fashion: 1,
  baseball: 1,
  food: 1,
  music: 0.7,
}

/** Interests = seeds + what the user actually engaged with. */
export function buildInterests(
  posts: Post[],
  engagedIds: Set<string>,
): Partial<Record<TopicId, number>> {
  const interests: Partial<Record<TopicId, number>> = { ...SEED_INTERESTS }
  for (const post of posts) {
    if (!engagedIds.has(post.id)) continue
    interests[post.primaryTopic] = (interests[post.primaryTopic] ?? 0) + 0.4
    for (const t of post.secondaryTopics) {
      interests[t] = (interests[t] ?? 0) + 0.15
    }
  }
  return interests
}

/** Distance from the nearest real interest to this post's primary topic. */
function interestDistance(
  post: Post,
  interests: Partial<Record<TopicId, number>>,
): number {
  let best = 4
  for (const [topic, w] of Object.entries(interests) as [TopicId, number][]) {
    if ((w ?? 0) < 0.3) continue
    best = Math.min(best, topicDistance(topic, post.primaryTopic))
    if (best === 0) break
  }
  return best
}

/** core = a topic you're into · adjacent = one hop away · discovery = further. */
export function familiarityOf(
  post: Post,
  interests: Partial<Record<TopicId, number>>,
): Familiarity {
  const d = interestDistance(post, interests)
  return d === 0 ? 'core' : d === 1 ? 'adjacent' : 'discovery'
}

/** The interest topic nearest to this post — used for reason sentences. */
export function nearestInterest(
  post: Post,
  interests: Partial<Record<TopicId, number>>,
): TopicId | null {
  let best: TopicId | null = null
  let bestD = 4
  for (const [topic, w] of Object.entries(interests) as [TopicId, number][]) {
    if ((w ?? 0) < 0.3) continue
    const d = topicDistance(topic, post.primaryTopic)
    if (d < bestD) {
      bestD = d
      best = topic
    }
  }
  return best
}

// ---- scoring ---------------------------------------------------------------

interface Weights {
  relevance: number
  adjacencyBonus: number
  novelty: number
  social: number
  engagement: number
  intention: number
  viewpoint: number
}

const MODEL_WEIGHTS: Record<BusinessModel, Weights> = {
  // Engagement first, familiarity second, everything else barely counts.
  attention: {
    relevance: 0.3,
    adjacencyBonus: 0,
    novelty: 0.05,
    social: 0.05,
    engagement: 0.55,
    intention: 0,
    viewpoint: 0,
  },
  // Your stated intention leads; discovery is present but never pushy.
  subscription: {
    relevance: 0.3,
    adjacencyBonus: 0.15,
    novelty: 0.05,
    social: 0.15,
    engagement: 0.05,
    intention: 0.3,
    viewpoint: 0,
  },
  // Balance and breadth get real weight, alongside relevance.
  public: {
    relevance: 0.25,
    adjacencyBonus: 0.2,
    novelty: 0.15,
    social: 0.1,
    engagement: 0.05,
    intention: 0.15,
    viewpoint: 0.1,
  },
}

/** 0–1: how well a post matches the session intention. */
function intentionMatch(post: Post, intentionId: IntentionId): number {
  switch (intentionId) {
    case 'relax':
      return post.tone === 'calm' ? 1 : post.tone === 'light' ? 0.8 : 0.2
    case 'friends':
      return post.sourceType === 'friend'
        ? 1
        : post.sourceType === 'community'
          ? 0.4
          : 0.15
    case 'learn':
      return post.tone === 'informative' ? 1 : 0.3
    case 'perspective':
      return post.paths?.length ? 1 : post.tone === 'discussion' ? 0.7 : 0.25
    case 'explore':
      return 0.5 // explore's push lives in the mix ratios, not per-post score
  }
}

export function scorePost(post: Post, ctx: RecCtx): number {
  const w = MODEL_WEIGHTS[ctx.model]
  const fam = familiarityOf(post, ctx.interests)

  const primaryW = ctx.interests[post.primaryTopic] ?? 0
  const secondaryW = Math.max(
    0,
    ...post.secondaryTopics.map((t) => ctx.interests[t] ?? 0),
  )
  const relevance = Math.min(1, primaryW + secondaryW * 0.5)
  const adjacencyBonus = fam === 'adjacent' ? 1 : 0
  const novelty = 1 - Math.min(1, primaryW)
  const social =
    post.sourceType === 'friend' ? 1 : post.sourceType === 'community' ? 0.4 : 0
  const engagement = Math.min(1, post.likes / 6000)
  const viewpoint = post.paths?.length ? 1 : post.perspective ? 0.5 : 0

  let score =
    relevance * w.relevance +
    adjacencyBonus * w.adjacencyBonus +
    novelty * w.novelty +
    social * w.social +
    engagement * w.engagement +
    intentionMatch(post, ctx.intentionId) * w.intention +
    viewpoint * w.viewpoint

  // Reflection feedback nudges the next chapter without a settings screen.
  if (ctx.bias === 'novelty') score += novelty * 0.2
  if (ctx.bias === 'calm') score += (post.tone === 'calm' ? 1 : 0) * 0.2

  // Explicit user adjustments always outrank the model's own preferences.
  const adjust = ctx.prefs.topicAdjust[post.primaryTopic]
  if (adjust === 'more') score += 0.35
  if (adjust === 'less') score -= 0.5

  return score
}

/** True when the user has explicitly removed this kind of post. */
function excluded(post: Post, prefs: FeedPrefs): boolean {
  if (prefs.hiddenCreators.includes(post.handle)) return true
  if (prefs.topicAdjust[post.primaryTopic] === 'paused') return true
  return false
}

// ---- chapter composition ---------------------------------------------------

/** The familiar/adjacent/discovery mix a chapter aims for. */
export function mixFor(ctx: RecCtx): {
  core: number
  adjacent: number
  discovery: number
} {
  if (ctx.model === 'attention') {
    // Bubble-reinforcing on purpose: familiarity keeps people scrolling.
    return { core: 0.9, adjacent: 0.1, discovery: 0 }
  }
  let base = intentionById(ctx.intentionId).mix
  // "Repetitive" feedback opens the mix a little wider next chapter.
  if (ctx.bias === 'novelty') {
    base = {
      core: Math.max(0.3, base.core - 0.15),
      adjacent: base.adjacent + 0.1,
      discovery: base.discovery + 0.05,
    }
  }
  if (ctx.model === 'public') {
    // The diversity dial genuinely shifts the mix (0 → all-core, 100 → wide).
    const adj = 0.1 + (ctx.diversity / 100) * 0.3
    const far = 0.05 + (ctx.diversity / 100) * 0.15
    return { core: Math.max(0.3, 1 - adj - far), adjacent: adj, discovery: far }
  }
  return base
}

export function chapterSizeFor(ctx: RecCtx): number {
  return intentionById(ctx.intentionId).chapterSize
}

/**
 * Compose the next chapter: bucket the unseen pool by familiarity, fill each
 * bucket's quota by score, then interleave so discoveries are spread through
 * the chapter instead of dumped at the end. Returns [] when the pool is dry.
 */
export function composeChapter(
  pool: Post[],
  ctx: RecCtx,
  shownIds: Set<string>,
  size = chapterSizeFor(ctx),
): Post[] {
  const candidates = pool.filter(
    (p) => !shownIds.has(p.id) && !excluded(p, ctx.prefs),
  )
  if (candidates.length === 0) return []

  const byScore = (a: Post, b: Post) => scorePost(b, ctx) - scorePost(a, ctx)
  const buckets: Record<Familiarity, Post[]> = {
    core: [],
    adjacent: [],
    discovery: [],
  }
  for (const p of candidates) buckets[familiarityOf(p, ctx.interests)].push(p)
  for (const key of Object.keys(buckets) as Familiarity[]) {
    buckets[key].sort(byScore)
  }

  const mix = mixFor(ctx)
  const want: Record<Familiarity, number> = {
    core: Math.round(size * mix.core),
    adjacent: Math.round(size * mix.adjacent),
    discovery: Math.max(0, size - Math.round(size * mix.core) - Math.round(size * mix.adjacent)),
  }

  const picked: Record<Familiarity, Post[]> = {
    core: buckets.core.slice(0, want.core),
    adjacent: buckets.adjacent.slice(0, want.adjacent),
    discovery: buckets.discovery.slice(0, want.discovery),
  }
  // Backfill unfilled quota from whatever remains, best score first.
  let total = picked.core.length + picked.adjacent.length + picked.discovery.length
  if (total < size) {
    const leftovers = candidates
      .filter(
        (p) =>
          !picked.core.includes(p) &&
          !picked.adjacent.includes(p) &&
          !picked.discovery.includes(p),
      )
      .sort(byScore)
    for (const p of leftovers) {
      if (total >= size) break
      picked[familiarityOf(p, ctx.interests)].push(p)
      total++
    }
  }

  // Interleave: mostly core, with adjacent/discovery slotted every few posts
  // so the chapter breathes instead of front-loading the familiar.
  const others = [...picked.adjacent, ...picked.discovery]
  const core = [...picked.core]
  const out: Post[] = []
  const gap = others.length > 0 ? Math.max(2, Math.floor(total / (others.length + 1))) : total
  while (core.length || others.length) {
    for (let i = 0; i < gap && core.length; i++) out.push(core.shift()!)
    if (others.length) out.push(others.shift()!)
  }
  return out
}

// ---- reasons ---------------------------------------------------------------

const label = (t: TopicId) => topicMeta[t].label.toLowerCase()

/**
 * A specific, honest explanation for why this post is here. Assembled from
 * the same signals the score used — nothing invented.
 */
export function reasonFor(post: Post, ctx: RecCtx): string {
  const parts: string[] = []
  const fam = familiarityOf(post, ctx.interests)
  const near = nearestInterest(post, ctx.interests)

  if (post.sourceType === 'friend') {
    parts.push(`${post.handle} is someone you follow closely`)
  } else if (fam === 'core') {
    parts.push(`you often engage with ${label(post.primaryTopic)} posts`)
  } else if (fam === 'adjacent' && near && near !== post.primaryTopic) {
    parts.push(
      `you're into ${label(near)}, and this connects it with ${label(post.primaryTopic)}`,
    )
  } else {
    parts.push(
      `this is a wider pick — ${label(post.primaryTopic)} sits a few steps beyond your usual topics`,
    )
  }

  if (ctx.model !== 'attention') {
    const intention = intentionById(ctx.intentionId)
    if (intentionMatch(post, ctx.intentionId) >= 0.7) {
      parts.push(`you picked “${intention.title}” for this session`)
    }
  }

  const adjust = ctx.prefs.topicAdjust[post.primaryTopic]
  if (adjust === 'more') {
    parts.push(`you asked for more ${label(post.primaryTopic)}`)
  }

  const sentence = parts.join(', and ')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}

// ---- feed mix (session summary) -------------------------------------------

export interface FeedMixSummary {
  /** % of posts from topics you're already into. */
  familiar: number
  /** % adjacent + wider discovery. */
  discovery: number
  /** Distinct viewpoint angles present, as a % of discussion posts. */
  viewpoints: number
  /** Unique creators as a % of posts. */
  creators: number
  /** Topic groups touched, out of 8, as a %. */
  topics: number
  counts: { total: number; core: number; adjacent: number; discovery: number }
}

/** Describe (never judge) what a set of posts contained. */
export function feedMixOf(
  shown: Post[],
  interests: Partial<Record<TopicId, number>>,
): FeedMixSummary {
  const total = shown.length || 1
  let core = 0
  let adjacent = 0
  let far = 0
  for (const p of shown) {
    const f = familiarityOf(p, interests)
    if (f === 'core') core++
    else if (f === 'adjacent') adjacent++
    else far++
  }
  const discussion = shown.filter(
    (p) => p.tone === 'discussion' || p.paths?.length,
  )
  const withAngles = discussion.filter((p) => (p.paths?.length ?? 0) > 0)
  const uniqueCreators = new Set(shown.map((p) => p.handle)).size
  const uniqueGroups = new Set(shown.map((p) => topicMeta[p.primaryTopic].group))
    .size

  return {
    familiar: Math.round((core / total) * 100),
    discovery: Math.round(((adjacent + far) / total) * 100),
    viewpoints: discussion.length
      ? Math.round((withAngles.length / discussion.length) * 100)
      : 0,
    creators: Math.round((uniqueCreators / total) * 100),
    topics: Math.round((uniqueGroups / 8) * 100),
    counts: { total: shown.length, core, adjacent, discovery: far },
  }
}

/** Adjacent topics to a given one — used by "explore nearby" affordances. */
export function adjacentTopics(topic: TopicId): TopicId[] {
  return adjacency[topic] ?? []
}
