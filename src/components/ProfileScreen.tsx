import { useState } from 'react'
import type { BusinessModel } from '../data/models'
import { currentUser } from '../data/user'
import { posts } from '../data/posts'
import { useInteractions } from '../state/interactions'
import { useModel } from '../state/model'
import { usePrefs } from '../state/prefs'
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

/**
 * The "You" tab — where each business model tells you who you are:
 *  - attention:    a creator dashboard. You are a channel; keep the numbers up.
 *  - subscription: usage insights. You are a customer; here's your time back.
 *  - public:       a perspective report. You are a citizen; here's your range.
 * The Interest Map and the Platform Model Lab live here, behind one tap.
 */
export default function ProfileScreen({
  onReflect,
  onAbout,
  onChangeMood,
  onSwitchModel,
}: ProfileScreenProps) {
  const { model, diversity, sessionMinutes } = useModel()
  const { sessions } = usePrefs()
  const u = currentUser
  const { saved, liked } = useInteractions()
  const [gridTab, setGridTab] = useState<'posts' | 'saved'>('posts')
  const [mapOpen, setMapOpen] = useState(false)
  const [labOpen, setLabOpen] = useState(false)
  const savedPosts = posts.filter((p) => saved.has(p.id))
  const publicScore = 40 + Math.round(diversity * 0.55)
  const minutes = sessionMinutes()
  const session = sessions[model]

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
          About
        </button>
      </header>

      {/* Profile header */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-5">
          <Avatar name={u.name} className="shadow-soft-sm h-20 w-20 text-2xl" />
          <div className="flex flex-1 justify-around text-center">
            {[
              { n: u.posts, l: 'posts' },
              { n: u.followers, l: 'followers' },
              { n: u.following, l: 'following' },
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
            Set today's vibe
          </button>
        )}
      </div>

      {/* ---- Attention: the creator dashboard --------------------------- */}
      {model === 'attention' && (
        <div className="mt-6 px-4">
          <div className="shadow-soft rounded-xl bg-brand p-5 text-white">
            <p className="text-xs font-medium text-white/80">Creator studio</p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight tracking-[-0.01em]">
              Your reach is growing — don't stop now
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { value: '🔥 12', label: 'day streak' },
                { value: '+124', label: 'followers this week' },
                { value: `${Math.max(minutes, 47)}m`, label: 'in app today' },
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
              Post now — 231 followers online
            </button>
            <p className="mt-2.5 text-center text-[11px] text-white/80">
              Miss a day and the streak resets 🔥
            </p>
          </div>
        </div>
      )}

      {/* ---- Subscription: your time, accounted for --------------------- */}
      {model === 'subscription' && (
        <div className="mt-6 px-4">
          <div className="shadow-soft rounded-xl border border-hairline bg-white p-5">
            <p className="text-xs font-semibold text-brand">Your time today</p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight tracking-[-0.01em] text-ink">
              {minutes < 5
                ? 'A light day. The app agrees.'
                : 'Maybe that’s enough for today?'}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { value: `${minutes}m`, label: 'this session' },
                { value: String(session?.posts ?? 0), label: 'posts seen' },
                { value: String(session?.choices ?? 0), label: 'choices made' },
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
              You pay, so the app reports to you. No streaks — closing it costs
              nothing.
            </p>
          </div>
        </div>
      )}

      {/* ---- Public: the perspective report ------------------------------ */}
      {model === 'public' && (
        <div className="mt-6 px-4">
          <div className="shadow-soft rounded-xl bg-brand p-5 text-white">
            <p className="text-xs font-medium text-white/80">
              Perspective report
            </p>
            <h2 className="mt-1 font-display text-xl font-bold leading-tight tracking-[-0.01em]">
              {((session?.adjacent ?? 0) + (session?.discovery ?? 0)) > 2
                ? 'You wandered well this session'
                : 'Room to roam — your call'}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { value: String(session?.posts ?? 0), label: 'posts seen' },
                {
                  value: String(
                    (session?.adjacent ?? 0) + (session?.discovery ?? 0),
                  ),
                  label: 'discoveries',
                },
                { value: String(publicScore), label: 'mix width' },
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
              A description, not a grade. There is no perfect mix.
            </p>
          </div>
        </div>
      )}

      {/* ---- Your feed: the map and the lab ------------------------------ */}
      <div className="mt-4 flex flex-col gap-3 px-4">
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
                Interest map
              </span>
              <span className="block text-xs text-muted">
                What shaped your feed — and the dials to tune it
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
              Platform model lab
            </span>
            <span className="block text-xs text-muted">
              Compare how each business model treated you
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
                Reflect on your week
              </span>
              <span className="block text-xs text-muted">
                A quiet moment, just for you
              </span>
            </span>
            <span className="text-faint">→</span>
          </button>
        )}

        {model === 'attention' && (
          <div className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3">
            <p className="text-xs font-semibold text-ink">
              You liked {liked.size} posts today — your taste profile is
              {liked.size > 3 ? ' excellent' : ' still warming up'}.
            </p>
          </div>
        )}
      </div>

      {/* Grid tabs — your posts vs. everything you've bookmarked. */}
      <div className="mt-6 flex border-b border-t border-hairline">
        {(['posts', 'saved'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setGridTab(t)}
            className={`-mb-px flex-1 border-b-2 py-2.5 text-xs font-medium transition-colors ${
              gridTab === t
                ? 'border-ink text-ink'
                : 'border-transparent text-faint'
            }`}
          >
            {t === 'posts' ? 'Posts' : `Saved (${savedPosts.length})`}
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
            Nothing saved yet
          </p>
          <p className="mt-1 text-xs text-muted">
            Bookmark any post and it shows up here.
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
