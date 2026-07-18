import type { GroupId } from '../types'
import { posts } from '../data/posts'
import { groupMeta, topicMeta } from '../data/topics'

// ---------------------------------------------------------------------------
// Aggregations for the Interest Map. Ranking, chapters and reasons live in
// lib/recommend.ts — this file only answers "what shaped my feed lately?"
// ---------------------------------------------------------------------------

export interface BubbleStat {
  group: GroupId
  label: string
  color: string
  /** How many catalog posts fall in this group. */
  feedCount: number
  /** How many of those the user liked, saved or commented on. */
  engaged: number
  /** feedCount + 2×engaged — engagement counts double so the map visibly
   *  reacts when the user interacts with a topic. */
  weight: number
}

/**
 * One stat per topic group. `engagedIds` is the union of liked/saved/
 * commented post ids.
 */
export function getBubbleStats(engagedIds: Set<string>): BubbleStat[] {
  return (Object.keys(groupMeta) as GroupId[]).map((group) => {
    const inGroup = posts.filter(
      (p) => topicMeta[p.primaryTopic].group === group,
    )
    const engaged = inGroup.filter((p) => engagedIds.has(p.id)).length
    return {
      group,
      label: groupMeta[group].label,
      color: groupMeta[group].color,
      feedCount: inGroup.length,
      engaged,
      weight: inGroup.length + engaged * 2,
    }
  })
}
