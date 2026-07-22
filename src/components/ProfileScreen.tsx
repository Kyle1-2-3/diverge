import { useState } from 'react'
import type { BusinessModel } from '../data/models'
import { useLocale } from '../i18n'
import type { Lang } from '../i18n/translations'
import { currentUser } from '../data/user'
import { posts } from '../data/posts'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import { usePrefs, type FeedChoice } from '../state/prefs'
import InterestMapScreen from './InterestMapScreen'
import PlatformModelLab from './PlatformModelLab'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import { Bookmark } from './Icons'

interface ProfileScreenProps {
  onReflect: () => void
  onAbout: () => void
  onChangeMood: () => void
  onSwitchModel: (m: BusinessModel) => void
}

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
]

/**
 * The "You" tab — where each business model tells you who you are:
 *  - attention:    a creator dashboard. You are a channel; keep the numbers up.
 *  - subscription: usage insights. You are a customer; here's your time back.
 *  - public:       a perspective report. You are a citizen; here's your range.
 * The Interest Map, the Platform Model Lab, the language setting, and the
 * user's recent feed choices all live here, behind one tap.
 */
export default function ProfileScreen({
  onReflect,
  onAbout,
  onChangeMood,
  onSwitchModel,
}: ProfileScreenProps) {
  const { t, lang, setLang } = useLocale()
  const { model, diversity, setDiversity, sessionMinutes } = useModel()
  const { sessions, choices, removeChoice, adjustTopic, unhideCreator } =
    usePrefs()
  const u = currentUser
  const { saved, liked, showToast } = useInteractions()
  const [gridTab, setGridTab] = useState<'posts' | 'saved'>('posts')
  const [mapOpen, setMapOpen] = useState(false)
  const [labOpen, setLabOpen] = useState(false)
  const savedPosts = posts.filter((p) => saved.has(p.id))
  const publicScore = 40 + Math.round(diversity * 0.55)
  const minutes = sessionMinutes()
  const session = sessions[model]

  const choiceLabel = (c: FeedChoice): string => {
    if (c.kind === 'creator') {
      return t('choice.hidCreator', { handle: c.handle ?? '' })
    }
    if (c.kind === 'diversity') {
      return t('choice.diversity', { n: c.to ?? diversity })
    }
    const topic = c.topic ? t(`topic.${c.topic}`) : ''
    if (c.level === 'more') return t('choice.more', { topic })
    if (c.level === 'less') return t('choice.less', { topic })
    return t('choice.paused', { topic })
  }

  const reverseChoice = (c: FeedChoice) => {
    if (c.kind === 'creator' && c.handle) unhideCreator(c.handle)
    else if (c.kind === 'diversity') setDiversity(c.from ?? 70)
    else if (c.topic) adjustTopic(c.topic, null)
    removeChoice(c.id)
    showToast({ message: t('toast.choiceReversed') })
  }

  return (
    <div className="bg-white pb-8">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-white px-4 py-3">
        <span className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
          {u.handle}
        </span>
        <button
          onClick={onAbout}
          className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
        >
          {t('profile.about')}
        </button>
      </header>

      {/* Profile header */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-5">
          <Avatar name={u.name} className="shadow-soft-sm h-20 w-20 text-2xl" />
          <div className="flex flex-1 justify-around text-center">
            {[
              { n: u.posts, l: t('profile.posts') },
              { n: u.followers, l: t('profile.followers') },
              { n: u.following, l: t('profile.followingCount') },
            ].map((s) => (
              <div key={s.l}>
                <p className="tnum text-lg font-bold text-ink">{s.n}</p>
                <p className="text-xs text-faint">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 font-display text-sm font-semibold text-ink">
          {u.name}
        </p>
        <p className="text-sm text-muted">{u.bio}</p>
        {model === 'subscription' && (
          <button
            onClick={onChangeMood}
            className="mt-4 w-full rounded-lg border border-hairline bg-white py-2 text-sm font-semibold text-ink transition-transform active:scale-[0.98]"
          >
            {t('profile.setVibe')}
          </button>
        )}
      </div>

      {/* ---- Attention: the creator dashboard --------------------------- */}
      {model === 'attention' && (
        <div className="mt-6 px-4">
          <div className="shadow-soft rounded-xl bg-brand p-5 text-white">
            <p className="text-xs font-medium text-white/80">
              {t('profile.creatorStudio')}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight tracking-[-0.01em]">
              {t('profile.attention.title')}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { value: '🔥 12', label: t('profile.attention.streak') },
                { value: '+124', label: t('profile.attention.newFollowers') },
                {
                  value: `${Math.max(minutes, 47)}m`,
                  label: t('profile.attention.inApp'),
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-white/15 p-3 text-center"
                >
                  <div className="tnum text-2xl font-bold leading-none">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[10px] leading-tight text-white/80">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-full bg-white py-2.5 text-sm font-semibold text-brand transition-transform active:scale-[0.98]">
              {t('profile.attention.postNow')}
            </button>
            <p className="mt-2.5 text-center text-[11px] text-white/80">
              {t('profile.attention.streakWarn')}
            </p>
          </div>
        </div>
      )}

      {/* ---- Subscription: your time, accounted for --------------------- */}
      {model === 'subscription' && (
        <div className="mt-6 px-4">
          <div className="shadow-soft rounded-xl border border-hairline bg-white p-5">
            <p className="text-xs font-semibold text-brand">
              {t('profile.subscription.kicker')}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight tracking-[-0.01em] text-ink">
              {minutes < 5
                ? t('profile.subscription.light')
                : t('profile.subscription.enough')}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { value: `${minutes}m`, label: t('profile.subscription.session') },
                {
                  value: String(session?.posts ?? 0),
                  label: t('profile.subscription.postsSeen'),
                },
                {
                  value: String(session?.choices ?? 0),
                  label: t('profile.subscription.choices'),
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-hairline bg-white p-3 text-center"
                >
                  <div className="tnum text-2xl font-bold leading-none text-ink">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[10px] leading-tight text-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {t('profile.subscription.note')}
            </p>
          </div>
        </div>
      )}

      {/* ---- Public: the perspective report ------------------------------ */}
      {model === 'public' && (
        <div className="mt-6 px-4">
          <div className="shadow-soft rounded-xl bg-brand p-5 text-white">
            <p className="text-xs font-medium text-white/80">
              {t('profile.public.kicker')}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight tracking-[-0.01em]">
              {((session?.adjacent ?? 0) + (session?.discovery ?? 0)) > 2
                ? t('profile.public.wandered')
                : t('profile.public.room')}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                {
                  value: String(session?.posts ?? 0),
                  label: t('profile.subscription.postsSeen'),
                },
                {
                  value: String(
                    (session?.adjacent ?? 0) + (session?.discovery ?? 0),
                  ),
                  label: t('profile.public.discoveries'),
                },
                { value: String(publicScore), label: t('profile.public.mixWidth') },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-white/15 p-3 text-center"
                >
                  <div className="tnum text-3xl font-bold leading-none">
                    {s.value}
                  </div>
                  <div className="mt-2 text-[10px] leading-tight text-white/80">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/85">
              {t('profile.public.note')}
            </p>
          </div>
        </div>
      )}

      {/* ---- Your feed: recent choices, the map and the lab -------------- */}
      <div className="mt-4 flex flex-col gap-3 px-4">
        {/* You changed your feed — recent choices, each reversible. */}
        {choices.length > 0 && (
          <div className="shadow-soft-sm rounded-xl border border-hairline bg-white p-4">
            <p className="font-display text-sm font-semibold text-ink">
              {t('profile.recentChoices')}
            </p>
            <p className="text-xs text-muted">{t('profile.recentChoicesSub')}</p>
            <div className="mt-2.5 flex flex-col">
              {choices.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between border-t border-hairline py-2 first:border-t-0"
                >
                  <span className="text-xs font-medium text-ink">
                    {choiceLabel(c)}
                  </span>
                  <button
                    onClick={() => reverseChoice(c)}
                    className="rounded-full border border-hairline bg-white px-2.5 py-0.5 text-[11px] font-semibold text-muted transition-transform active:scale-[0.98]"
                  >
                    {t('common.reverse')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {model !== 'attention' && (
          <button
            onClick={() => setMapOpen(true)}
            className="shadow-soft-sm flex w-full items-center gap-3 rounded-xl border border-hairline bg-white p-4 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-lg font-bold text-brand">
              ◉
            </span>
            <span className="flex-1">
              <span className="block font-display text-sm font-semibold text-ink">
                {t('profile.interestMap')}
              </span>
              <span className="block text-xs text-muted">
                {t('profile.interestMapSub')}
              </span>
            </span>
            <span className="text-faint">→</span>
          </button>
        )}

        <button
          onClick={() => setLabOpen(true)}
          className="shadow-soft-sm flex w-full items-center gap-3 rounded-xl border border-hairline bg-white p-4 text-left transition-transform active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-lg font-bold text-white">
            ⚗
          </span>
          <span className="flex-1">
            <span className="block font-display text-sm font-semibold text-ink">
              {t('profile.lab')}
            </span>
            <span className="block text-xs text-muted">
              {t('profile.labSub')}
            </span>
          </span>
          <span className="text-faint">→</span>
        </button>

        {model !== 'attention' && (
          <button
            onClick={onReflect}
            className="shadow-soft-sm flex w-full items-center gap-3 rounded-xl border border-hairline bg-white p-4 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-hairline bg-white text-lg font-bold text-ink">
              ❯
            </span>
            <span className="flex-1">
              <span className="block font-display text-sm font-semibold text-ink">
                {t('profile.reflect')}
              </span>
              <span className="block text-xs text-muted">
                {t('profile.reflectSub')}
              </span>
            </span>
            <span className="text-faint">→</span>
          </button>
        )}

        {/* Settings → Language */}
        <div className="shadow-soft-sm flex items-center gap-3 rounded-xl border border-hairline bg-white p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-hairline bg-white text-base">
            🌐
          </span>
          <span className="flex-1 font-display text-sm font-semibold text-ink">
            {t('profile.language')}
          </span>
          <div className="flex gap-1.5">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-transform active:scale-[0.98] ${
                  lang === l.id
                    ? 'bg-ink text-white'
                    : 'border border-hairline bg-white text-muted'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {model === 'attention' && (
          <div className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3">
            <p className="text-xs font-semibold text-ink">
              {t('profile.attention.taste', {
                n: liked.size,
                quality:
                  liked.size > 3
                    ? t('profile.attention.tasteGood')
                    : t('profile.attention.tasteWarming'),
              })}
            </p>
          </div>
        )}
      </div>

      {/* Grid tabs — your posts vs. everything you've bookmarked. */}
      <div className="mt-6 flex border-b border-t border-hairline">
        {(['posts', 'saved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setGridTab(tab)}
            className={`-mb-px flex-1 border-b-2 py-2.5 text-xs font-medium transition-colors ${
              gridTab === tab
                ? 'border-ink text-ink'
                : 'border-transparent text-faint'
            }`}
          >
            {tab === 'posts'
              ? t('profile.tab.posts')
              : t('profile.tab.saved', { n: savedPosts.length })}
          </button>
        ))}
      </div>

      {gridTab === 'posts' ? (
        <div className="grid grid-cols-3 gap-1 px-1 pt-1">
          {u.grid.map((_, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-md">
              <img
                src={`https://picsum.photos/seed/divgrid${i}/400/400`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : savedPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 px-1 pt-1">
          {savedPosts.map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden rounded-md">
              <SmartImage src={p.image} alt={p.caption} className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-faint" />
          <p className="mt-2 font-display text-sm font-semibold text-ink">
            {t('profile.emptySaved.title')}
          </p>
          <p className="mt-1 text-xs text-muted">
            {t('profile.emptySaved.body')}
          </p>
        </div>
      )}

      {/* Overlays */}
      {mapOpen && <InterestMapScreen onClose={() => setMapOpen(false)} />}
      {labOpen && (
        <PlatformModelLab
          onClose={() => setLabOpen(false)}
          onSwitchModel={onSwitchModel}
        />
      )}
    </div>
  )
}
