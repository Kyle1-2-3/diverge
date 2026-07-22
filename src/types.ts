// Shared type definitions for the whole app.

// ---------------------------------------------------------------------------
// Topics — the backbone of Adjacent Diversity. Every post belongs to one
// primary topic; topics belong to one of eight groups; the adjacency graph
// in data/topics.ts connects them so the feed can expand interests gradually
// (baseball → sports analytics → stadium design) instead of randomly.
// ---------------------------------------------------------------------------

export type GroupId =
  | 'life'
  | 'fashion'
  | 'food'
  | 'sports'
  | 'art'
  | 'travel'
  | 'tech'
  | 'music'

export type TopicId =
  // friends & everyday life
  | 'friends'
  | 'campus-life'
  | 'pets'
  // fashion
  | 'fashion'
  | 'textile-design'
  | 'sustainability'
  | 'beauty'
  // food
  | 'food'
  | 'street-food'
  | 'home-cooking'
  | 'coffee'
  // sports
  | 'baseball'
  | 'football'
  | 'sports-analytics'
  | 'sports-psychology'
  | 'stadium-design'
  | 'sports-economics'
  | 'fitness'
  // art & design
  | 'photography'
  | 'illustration'
  | 'architecture'
  // travel & cities
  | 'travel'
  | 'urban-life'
  // tech & science
  | 'technology'
  | 'ai'
  | 'audio-tech'
  | 'climate-tech'
  // music & culture
  | 'music'
  | 'dance'
  | 'music-history'
  | 'festivals'
  | 'film'

/** Who is behind a post — friends rank differently from publishers. */
export type SourceType = 'friend' | 'creator' | 'publisher' | 'community'

/** Rough emotional register, used by intention matching (never shown raw). */
export type Tone = 'light' | 'calm' | 'informative' | 'discussion'

/** How familiar a post is relative to the user's interests (computed). */
export type Familiarity = 'core' | 'adjacent' | 'discovery'

// ---------------------------------------------------------------------------
// Perspective Paths — thoughtful angles on a post, replacing blunt
// "opposing opinion" flips. Only some posts carry them.
// ---------------------------------------------------------------------------

export type AngleType =
  // discussion posts
  | 'interpretation' // another reading of the same issue
  | 'context' // background that changes how the post reads
  | 'affected' // how another group experiences the issue
  // entertainment posts
  | 'process' // how the creator made it
  | 'culture' // the subculture or history behind it

export interface PerspectiveAngle {
  type: AngleType
  title: string
  body: string
}

// ---------------------------------------------------------------------------
// Intentions — the session's "vibe", picked in a few seconds. Each intention
// genuinely changes ranking weights, the content mix, and chapter length.
// ---------------------------------------------------------------------------

export type IntentionId =
  | 'relax'
  | 'friends'
  | 'explore'
  | 'learn'
  | 'perspective'

export interface Intention {
  id: IntentionId
  emoji: string
  /** Target content mix for a chapter (fractions, sum ≈ 1). */
  mix: { core: number; adjacent: number; discovery: number }
  /** Suggested chapter length for this intention. */
  chapterSize: number
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

/** Media shape of the post photo. Defaults to portrait (4:5). */
export type MediaAspect = 'portrait' | 'square' | 'landscape'

export interface Post {
  id: string
  username: string
  handle: string
  /** An emoji used as the avatar fallback. */
  avatar: string
  verified: boolean
  primaryTopic: TopicId
  secondaryTopics: TopicId[]
  sourceType: SourceType
  tone: Tone
  /** Real photo URL (Lorem Picsum, free + keyless). */
  image: string
  /** Extra photos — when present the post renders as a swipeable carousel. */
  extraImages?: string[]
  aspect?: MediaAspect
  /** A short location label shown under the username, IG-style. */
  location: string
  /** Relative time label, e.g. "2h". */
  timeAgo: string
  /** May be empty — plenty of real posts have no caption at all. */
  caption: string
  /** Language the caption was written in. Defaults to 'en'. User content is
   *  never auto-translated when the app language changes. */
  lang?: 'en' | 'ja'
  /** Predefined translation into the other language, shown on demand. */
  translation?: string
  likes: number
  comments: number
  /** Name of a friend who liked it, for the "liked by X and others" line. */
  likedBy: string
  /** Short label of the viewpoint this post represents, when it has one. */
  perspective?: string
  /** Perspective Paths — only on posts where extra angles genuinely help. */
  paths?: PerspectiveAngle[]
}
