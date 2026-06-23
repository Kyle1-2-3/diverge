import type { IntentionId } from '../types'
import { currentUser } from '../data/user'
import { getRecap } from '../lib/feed'
import DiversityScore from './DiversityScore'

interface ProfileScreenProps {
  intentionId: IntentionId
  onReflect: () => void
  onAbout: () => void
  onChangeMood: () => void
}

/**
 * The "You" tab. A normal-looking profile up top, then the payoff: a
 * Spotify-Wrapped-style recap where the diversity mechanics finally surface —
 * framed as personal growth and something worth sharing, not a lecture.
 */
export default function ProfileScreen({
  intentionId,
  onReflect,
  onAbout,
  onChangeMood,
}: ProfileScreenProps) {
  const recap = getRecap(intentionId)
  const u = currentUser

  return (
    <div className="bg-white pb-8">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/5 bg-white/85 px-4 py-3 backdrop-blur-xl">
        <span className="font-display text-lg font-bold text-ink">
          {u.handle}
        </span>
        <button
          onClick={onAbout}
          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-muted active:text-ink"
        >
          About
        </button>
      </header>

      {/* Profile header */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-200 to-pink-200 text-4xl ring-2 ring-white">
            {u.avatar}
          </div>
          <div className="flex flex-1 justify-around text-center">
            {[
              { n: u.posts, l: 'posts' },
              { n: u.followers, l: 'followers' },
              { n: u.following, l: 'following' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-lg font-bold text-ink">{s.n}</p>
                <p className="text-xs text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-ink">{u.name}</p>
        <p className="text-sm text-muted">{u.bio}</p>
        <button
          onClick={onChangeMood}
          className="mt-4 w-full rounded-xl bg-gray-100 py-2 text-sm font-semibold text-ink transition-colors active:bg-gray-200"
        >
          Set today's mood
        </button>
      </div>

      {/* ---- The Wrapped-style recap (hero) ---- */}
      <div className="mt-6 px-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Your week on Diverge
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold leading-tight">
            {recap.headline}
          </h2>

          {/* Stat cards */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {recap.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur"
              >
                <div className="text-xl">{s.emoji}</div>
                <div className="mt-1 font-display text-xl font-extrabold">
                  {s.value}
                </div>
                <div className="text-[10px] leading-tight text-white/80">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full rounded-xl bg-white/20 py-2.5 text-sm font-semibold backdrop-blur transition-colors active:bg-white/30">
            Share your recap
          </button>
        </div>
      </div>

      {/* Diversity breakdown — reused widget, now framed as a personal stat */}
      <div className="mt-4 px-4">
        <DiversityScore score={recap.score} bars={recap.bars} />
      </div>

      {/* Reflect entry */}
      <div className="mt-4 px-4">
        <button
          onClick={onReflect}
          className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-xl">
            🪞
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-ink">
              Reflect on your week
            </span>
            <span className="block text-xs text-muted">
              A quiet moment, just for you
            </span>
          </span>
          <span className="text-muted">→</span>
        </button>
      </div>

      {/* Profile grid */}
      <div className="mt-6 grid grid-cols-3 gap-0.5 px-0.5">
        {u.grid.map((tile, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-3xl"
          >
            {tile}
          </div>
        ))}
      </div>
    </div>
  )
}
