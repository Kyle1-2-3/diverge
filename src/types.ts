// Shared type definitions for the whole app.

/** The content categories a post can belong to. */
export type Category =
  | 'fashion'
  | 'sports'
  | 'world news'
  | 'mental health'
  | 'culture'
  | 'technology'
  | 'environment'
  | 'opposing opinion'

/** The intentions a user can pick before viewing the feed. */
export type IntentionId =
  | 'relax'
  | 'learn'
  | 'perspective'
  | 'trends'
  | 'explore'

export interface Intention {
  id: IntentionId
  emoji: string
  title: string
  /** Short blurb shown on the selection card. */
  subtitle: string
  /** Confirmation message shown after the user picks this intention. */
  message: string
  /** Mock diversity score (0–100) this intention nudges the feed toward. */
  targetScore: number
}

export interface Post {
  id: string
  username: string
  handle: string
  /** An emoji used as the avatar fallback. */
  avatar: string
  /** Whether to show a verified checkmark next to the name. */
  verified: boolean
  category: Category
  /** Tailwind gradient classes used as a fallback / loading background. */
  gradient: string
  /** Large emoji shown on the gradient fallback. */
  visual: string
  /** Real photo URL (Lorem Picsum, free + keyless). Falls back to gradient. */
  image: string
  /** A short location label shown under the username, IG-style. */
  location: string
  /** Relative time label, e.g. "2h". */
  timeAgo: string
  caption: string
  likes: number
  comments: number
  /** Name of a friend who liked it, for the "liked by X and others" line. */
  likedBy: string
  /** Explanation shown by the "Why am I seeing this?" action. */
  whyReason: string
  /** True when Diverge added this post to broaden the user's perspective. */
  isOutsideBubble: boolean
}

/** A single bar in the Diversity Score breakdown. */
export interface DiversityBar {
  label: string
  /** 0–100 fill value. */
  value: number
  color: string
}
