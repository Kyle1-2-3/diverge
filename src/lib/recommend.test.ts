import { describe, expect, it } from 'vitest'
import { posts } from '../data/posts'
import { topicDistance } from '../data/topics'
import {
  buildInterests,
  composeChapter,
  familiarityOf,
  feedMixOf,
  mixFor,
  reasonFor,
  scorePost,
  type RecCtx,
} from './recommend'

const baseCtx = (over: Partial<RecCtx> = {}): RecCtx => ({
  model: 'subscription',
  intentionId: 'explore',
  diversity: 70,
  interests: buildInterests(posts, new Set()),
  prefs: { topicAdjust: {}, hiddenCreators: [] },
  ...over,
})

const byId = (id: string) => posts.find((p) => p.id === id)!

describe('topic adjacency', () => {
  it('follows the baseball chain one hop at a time', () => {
    expect(topicDistance('baseball', 'stadium-design')).toBe(1)
    expect(topicDistance('baseball', 'sports-analytics')).toBe(1)
    expect(topicDistance('stadium-design', 'architecture')).toBe(1)
  })

  it('keeps unrelated topics far apart', () => {
    expect(topicDistance('baseball', 'beauty')).toBeGreaterThan(2)
  })
})

describe('familiarity', () => {
  const interests = buildInterests(posts, new Set())

  it('marks seeded interests as core', () => {
    expect(familiarityOf(byId('p1'), interests)).toBe('core') // fashion
    expect(familiarityOf(byId('p4'), interests)).toBe('core') // baseball
  })

  it('marks one-hop topics as adjacent, not random', () => {
    // sports-analytics is one hop from baseball
    expect(familiarityOf(byId('p20'), interests)).toBe('adjacent')
  })

  it('learns from engagement', () => {
    // Engaging with the stadium-design post pulls that topic into core.
    const learned = buildInterests(posts, new Set(['p22', 'p22']))
    expect(learned['stadium-design']).toBeGreaterThan(0.3)
    expect(familiarityOf(byId('p22'), learned)).toBe('core')
  })
})

describe('intention changes the feed', () => {
  it('ranks friend posts higher under "Catch up"', () => {
    const friendPost = byId('p14') // sana.days, friend
    const publisherPost = byId('p20') // statline, publisher
    const friendsCtx = baseCtx({ intentionId: 'friends' })
    expect(scorePost(friendPost, friendsCtx)).toBeGreaterThan(
      scorePost(publisherPost, friendsCtx),
    )
  })

  it('gives explore a wider mix than relax', () => {
    const relax = mixFor(baseCtx({ intentionId: 'relax' }))
    const explore = mixFor(baseCtx({ intentionId: 'explore' }))
    expect(explore.adjacent + explore.discovery).toBeGreaterThan(
      relax.adjacent + relax.discovery,
    )
  })

  it('boosts posts with perspective angles under "Another angle"', () => {
    const withPaths = byId('p28') // citybeat, 3 angles
    const ctxP = baseCtx({ intentionId: 'perspective' })
    const ctxR = baseCtx({ intentionId: 'relax' })
    expect(scorePost(withPaths, ctxP)).toBeGreaterThan(
      scorePost(withPaths, ctxR),
    )
  })
})

describe('business models rank differently', () => {
  it('attention chases engagement; subscription does not', () => {
    const viral = byId('p11') // 8800 likes
    const quietFriend = byId('p17') // 77 likes, friend
    const attention = baseCtx({ model: 'attention' })
    const member = baseCtx({ model: 'subscription', intentionId: 'friends' })
    expect(scorePost(viral, attention)).toBeGreaterThan(
      scorePost(quietFriend, attention),
    )
    expect(scorePost(quietFriend, member)).toBeGreaterThan(
      scorePost(viral, member),
    )
  })

  it('attention model mixes in no wider discovery', () => {
    const mix = mixFor(baseCtx({ model: 'attention' }))
    expect(mix.discovery).toBe(0)
    expect(mix.core).toBeGreaterThanOrEqual(0.9)
  })

  it("public model's diversity dial genuinely widens the mix", () => {
    const low = mixFor(baseCtx({ model: 'public', diversity: 0 }))
    const high = mixFor(baseCtx({ model: 'public', diversity: 100 }))
    expect(high.adjacent).toBeGreaterThan(low.adjacent)
    expect(high.discovery).toBeGreaterThan(low.discovery)
  })
})

describe('feedback shapes later chapters', () => {
  it('excludes paused topics and hidden creators', () => {
    const ctx = baseCtx({
      prefs: {
        topicAdjust: { fashion: 'paused' },
        hiddenCreators: ['noodle.diaries'],
      },
    })
    const chapter = composeChapter(posts, ctx, new Set(), 16)
    expect(chapter.some((p) => p.primaryTopic === 'fashion')).toBe(false)
    expect(chapter.some((p) => p.handle === 'noodle.diaries')).toBe(false)
  })

  it('brings a topic and creator back after resuming/unhiding', () => {
    // Same as above, but with the preferences cleared again — the pool is
    // large, so ask for a big chapter to make reappearance observable.
    const ctx = baseCtx()
    const chapter = composeChapter(posts, ctx, new Set(), posts.length)
    expect(chapter.some((p) => p.primaryTopic === 'fashion')).toBe(true)
    expect(chapter.some((p) => p.handle === 'noodle.diaries')).toBe(true)
  })

  it('"more like this" lifts a topic in the ranking', () => {
    const post = byId('p59') // textile-design, outside the seed interests
    const neutral = scorePost(post, baseCtx())
    const boosted = scorePost(
      post,
      baseCtx({
        prefs: { topicAdjust: { 'textile-design': 'more' }, hiddenCreators: [] },
      }),
    )
    expect(boosted).toBeGreaterThan(neutral + 0.3)
  })

  it('"less like this" outranks the model preference', () => {
    const post = byId('p1')
    const neutral = scorePost(post, baseCtx())
    const dampened = scorePost(
      post,
      baseCtx({ prefs: { topicAdjust: { fashion: 'less' }, hiddenCreators: [] } }),
    )
    expect(dampened).toBeLessThan(neutral - 0.3)
  })

  it('"Repetitive" reflection biases the next chapter toward novelty', () => {
    const plain = mixFor(baseCtx({ intentionId: 'relax' }))
    const biased = mixFor(baseCtx({ intentionId: 'relax', bias: 'novelty' }))
    expect(biased.core).toBeLessThan(plain.core)
  })
})

describe('chapters end naturally', () => {
  it('respects the chapter size', () => {
    const chapter = composeChapter(posts, baseCtx(), new Set(), 14)
    expect(chapter.length).toBeLessThanOrEqual(14)
    expect(chapter.length).toBeGreaterThan(0)
  })

  it('never repeats shown posts, and runs dry when the pool is spent', () => {
    const ctx = baseCtx()
    const shown = new Set<string>()
    let chapters = 0
    for (;;) {
      const chapter = composeChapter(posts, ctx, shown, 16)
      if (chapter.length === 0) break
      chapter.forEach((p) => {
        expect(shown.has(p.id)).toBe(false)
        shown.add(p.id)
      })
      chapters++
      expect(chapters).toBeLessThan(10) // safety: must terminate
    }
    expect(shown.size).toBe(posts.length)
  })
})

describe('transparency', () => {
  it('explains adjacent picks by naming the connection', () => {
    const interests = buildInterests(posts, new Set())
    const ctx = baseCtx({ interests })
    // Friend posts explain themselves socially, so pick a non-friend one.
    const adjacent = posts.find(
      (p) =>
        familiarityOf(p, interests) === 'adjacent' && p.sourceType !== 'friend',
    )!
    const reason = reasonFor(adjacent, ctx)
    expect(reason.main.kind).toBe('adjacent')
    if (reason.main.kind === 'adjacent') {
      expect(reason.main.near).toBeTruthy()
      expect(reason.main.topic).toBe(adjacent.primaryTopic)
    }
  })

  it('mentions the user asking for more of a topic', () => {
    const post = byId('p1')
    const ctx = baseCtx({
      prefs: { topicAdjust: { fashion: 'more' }, hiddenCreators: [] },
    })
    expect(reasonFor(post, ctx).askedMore).toBe('fashion')
  })

  it('describes the mix without judging it', () => {
    const interests = buildInterests(posts, new Set())
    const mix = feedMixOf(posts.slice(0, 12), interests)
    expect(mix.familiar + mix.discovery).toBe(100)
    expect(mix.counts.total).toBe(12)
  })
})
