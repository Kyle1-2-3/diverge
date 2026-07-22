import { describe, expect, it } from 'vitest'
import { ads } from './ads'
import { posts } from './posts'
import { topicMeta } from './topics'
import { translations } from '../i18n/translations'
import { buildInterests, familiarityOf } from '../lib/recommend'

// ---------------------------------------------------------------------------
// Guards that the mock world stays believable: enough posts, enough voices,
// mostly ordinary content, and every topic label translatable.
// ---------------------------------------------------------------------------

describe('content volume', () => {
  it('has at least 60 posts with unique ids', () => {
    expect(posts.length).toBeGreaterThanOrEqual(60)
    expect(new Set(posts.map((p) => p.id)).size).toBe(posts.length)
  })

  it('has at least 20 distinct creators', () => {
    expect(new Set(posts.map((p) => p.handle)).size).toBeGreaterThanOrEqual(20)
  })

  it('has at least 10 friend-style accounts', () => {
    const friendHandles = new Set(
      posts.filter((p) => p.sourceType === 'friend').map((p) => p.handle),
    )
    expect(friendHandles.size).toBeGreaterThanOrEqual(10)
  })

  it('touches all 8 topic groups', () => {
    const groups = new Set(posts.map((p) => topicMeta[p.primaryTopic].group))
    expect(groups.size).toBe(8)
  })

  it('has at least 8 ads', () => {
    expect(ads.length).toBeGreaterThanOrEqual(8)
    expect(new Set(ads.map((a) => a.id)).size).toBe(ads.length)
  })
})

describe('content texture', () => {
  it('most posts are ordinary — no perspective features at all', () => {
    const plain = posts.filter((p) => !p.paths && !p.perspective)
    expect(plain.length / posts.length).toBeGreaterThan(0.6)
  })

  it('still keeps at least 6 posts with More Angles', () => {
    expect(posts.filter((p) => (p.paths?.length ?? 0) > 0).length,
    ).toBeGreaterThanOrEqual(6)
  })

  it('offers at least 10 posts suitable for adjacent discovery', () => {
    const interests = buildInterests(posts, new Set())
    const adjacent = posts.filter(
      (p) => familiarityOf(p, interests) === 'adjacent',
    )
    expect(adjacent.length).toBeGreaterThanOrEqual(10)
  })

  it('keeps verified badges rare', () => {
    expect(posts.filter((p) => p.verified).length).toBeLessThanOrEqual(8)
  })

  it('varies engagement across small and large accounts', () => {
    const likes = posts.map((p) => p.likes)
    expect(Math.min(...likes)).toBeLessThan(50)
    expect(Math.max(...likes)).toBeGreaterThan(5000)
  })

  it('includes captionless posts and media variety', () => {
    expect(posts.some((p) => p.caption === '')).toBe(true)
    const aspects = new Set(posts.map((p) => p.aspect ?? 'portrait'))
    expect(aspects.has('square')).toBe(true)
    expect(aspects.has('landscape')).toBe(true)
    expect(posts.some((p) => (p.extraImages?.length ?? 0) > 0)).toBe(true)
  })

  it('mixes languages', () => {
    const japanese = posts.filter((p) => p.lang === 'ja')
    expect(japanese.length).toBeGreaterThanOrEqual(4)
  })

  it('every captioned post is readable in both languages', () => {
    // Captions auto-display in the UI language when it differs from the
    // post's language, so every non-empty caption needs a translation.
    for (const p of posts) {
      if (p.caption) expect(p.translation, p.id).toBeTruthy()
    }
  })
})

describe('topic labels are translatable', () => {
  it('every topic used by a post has en + ja labels', () => {
    for (const p of posts) {
      for (const topic of [p.primaryTopic, ...p.secondaryTopics]) {
        const key = `topic.${topic}` as keyof typeof translations.en
        expect(translations.en[key], `en ${key}`).toBeTruthy()
        expect(translations.ja[key], `ja ${key}`).toBeTruthy()
      }
    }
  })
})
