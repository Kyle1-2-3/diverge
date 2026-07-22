import { afterEach, describe, expect, it, vi } from 'vitest'
import { translations, type TranslationKey } from './translations'
import { LANG_STORAGE_KEY, loadLang, translate } from './index'

describe('translation completeness', () => {
  const enKeys = Object.keys(translations.en).sort()
  const jaKeys = Object.keys(translations.ja).sort()

  it('has the same keys in English and Japanese', () => {
    expect(jaKeys).toEqual(enKeys)
  })

  it('has no empty strings in either language', () => {
    for (const lang of ['en', 'ja'] as const) {
      for (const [key, value] of Object.entries(translations[lang])) {
        expect(value.trim(), `${lang}:${key}`).not.toBe('')
      }
    }
  })

  it('covers every topic, group, model and intention', () => {
    const need: TranslationKey[] = [
      'topic.baseball',
      'topic.stadium-design',
      'group.sports',
      'group.short.tech',
      'model.attention.name',
      'model.subscription.kpi',
      'model.public.philosophy',
      'intent.relax.title',
      'intent.perspective.subtitle',
      'feeling.repetitive',
    ]
    for (const key of need) {
      expect(translations.en[key]).toBeTruthy()
      expect(translations.ja[key]).toBeTruthy()
    }
  })
})

describe('translate()', () => {
  it('returns the right language', () => {
    expect(translate('en', 'post.moreLikeThis')).toBe('Show me more like this')
    expect(translate('ja', 'post.moreLikeThis')).toBe('このような投稿を増やす')
  })

  it('interpolates parameters in both languages', () => {
    expect(translate('en', 'toast.moreTopic', { topic: 'Baseball' })).toBe(
      'More Baseball coming up',
    )
    expect(translate('ja', 'toast.moreTopic', { topic: '野球' })).toContain(
      '野球',
    )
    expect(translate('ja', 'feed.chapter', { n: 3 })).toBe('チャプター 3')
  })

  it('never leaves placeholders behind when params are provided', () => {
    const out = translate('ja', 'map.postsAround', {
      label: 'スポーツ',
      n: 4,
      engaged: 2,
    })
    expect(out).not.toMatch(/\{[a-z]+\}/i)
  })
})

describe('language persistence', () => {
  afterEach(() => vi.unstubAllGlobals())

  const stub = (store: Record<string, string>) =>
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v
      },
      removeItem: (k: string) => {
        delete store[k]
      },
    })

  it('restores a stored language', () => {
    stub({ [LANG_STORAGE_KEY]: 'ja' })
    expect(loadLang()).toBe('ja')
  })

  it('defaults to English when nothing (or garbage) is stored', () => {
    stub({})
    expect(loadLang()).toBe('en')
    stub({ [LANG_STORAGE_KEY]: 'xx' })
    expect(loadLang()).toBe('en')
  })
})
