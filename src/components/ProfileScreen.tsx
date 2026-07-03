import { useState } from 'react'
import type { IntentionId } from '../types'
import { currentUser } from '../data/user'
import { posts } from '../data/posts'
import { getRecap } from '../lib/feed'
import { useInteractions } from '../state/interactions'
import DiversityScore from './DiversityScore'
import SmartImage from './SmartImage'
import Avatar from './Avatar'
import { Bookmark } from './Icons'

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
  const { saved } = useInteractions()
  const [gridTab, setGridTab] = useState<'posts' | 'saved'>('posts')
  const savedPosts = posts.filter((p) => saved.has(p.id))

  return (
    <div className="bg-white pb-8">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-4 border-black bg-white px-4 py-3">
        <span className="font-display text-lg font-bold uppercase tracking-tight text-black">
          {u.handle}
        </span>
        <button
          onClick={onAbout}
          className="border-2 border-black bg-white px-3 py-1 font-display text-[11px] font-bold uppercase tracking-tight text-black transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          About
        </button>
      </header>

      {/* Profile header */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-5">
          <Avatar name={u.name} className="h-20 w-20 text-2xl shadow-hard-sm" />
          <div className="flex flex-1 justify-around text-center">
            {[
              { n: u.posts, l: 'posts' },
              { n: u.followers, l: 'followers' },
              { n: u.following, l: 'following' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-mono text-lg font-bold tabular-nums text-black">
                  {s.n}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-tight text-muted">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 font-display text-sm font-bold text-black">{u.name}</p>
        <p className="text-sm text-muted">{u.bio}</p>
        <button
          onClick={onChangeMood}
          className="mt-4 w-full border-2 border-black bg-white py-2 font-display text-sm font-bold uppercase tracking-tight text-black shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Set today's mood
        </button>
      </div>

      {/* ---- The Wrapped-style recap (hero) ---- */}
      <div className="mt-6 px-4">
        <div className="border-2 border-black bg-brand p-5 text-white shadow-hard">
          <p className="font-display text-[11px] font-bold uppercase tracking-widest text-white/80">
            Your week on Diverge
          </p>
          <h2 className="mt-1 font-display text-xl font-bold uppercase leading-tight tracking-tight">
            {recap.headline}
          </h2>

          {/* Stat cards — numbers are the hero, no emoji. */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {recap.stats.map((s) => (
              <div
                key={s.label}
                className="border-2 border-white bg-brand p-3 text-center"
              >
                <div className="font-mono text-3xl font-bold tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase leading-tight tracking-tight text-white/90">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full border-2 border-white bg-white py-2.5 font-display text-sm font-bold uppercase tracking-widest text-black transition-transform active:translate-x-0.5 active:translate-y-0.5">
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
          className="flex w-full items-center gap-3 border-2 border-black bg-white p-4 text-left shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <span className="flex h-11 w-11 items-center justify-center border-2 border-black bg-white font-mono text-lg font-bold text-black">
            ❯
          </span>
          <span className="flex-1">
            <span className="block font-display text-sm font-bold uppercase tracking-tight text-black">
              Reflect on your week
            </span>
            <span className="block text-xs text-muted">
              A quiet moment, just for you
            </span>
          </span>
          <span className="font-display text-lg font-bold text-black">→</span>
        </button>
      </div>

      {/* Grid tabs — your posts vs. everything you've bookmarked. */}
      <div className="mt-6 flex border-t-4 border-black">
        {(['posts', 'saved'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setGridTab(t)}
            className={`flex-1 border-b-2 border-black py-2.5 font-display text-[11px] font-bold uppercase tracking-widest transition-colors ${
              gridTab === t ? 'bg-black text-white' : 'bg-white text-muted'
            }`}
          >
            {t === 'posts' ? 'Posts' : `Saved (${savedPosts.length})`}
          </button>
        ))}
      </div>

      {gridTab === 'posts' ? (
        // Profile grid — real photos, not emoji tiles.
        <div className="grid grid-cols-3 gap-1 px-1 pt-1">
          {u.grid.map((_, i) => (
            <div key={i} className="aspect-square border-2 border-black">
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
        // Everything the user bookmarked, pulled live from the store.
        <div className="grid grid-cols-3 gap-1 px-1 pt-1">
          {savedPosts.map((p) => (
            <div key={p.id} className="aspect-square border-2 border-black">
              <SmartImage src={p.image} alt={p.caption} className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-2 font-display text-sm font-bold uppercase tracking-tight text-black">
            Nothing saved yet
          </p>
          <p className="mt-1 text-xs text-muted">
            Tap the bookmark on any post and it'll show up here.
          </p>
        </div>
      )}
    </div>
  )
}
