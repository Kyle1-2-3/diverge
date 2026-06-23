import { currentUser } from '../data/user'
import { Home, Compass } from './Icons'

export type Tab = 'home' | 'explore' | 'you'

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

/** The persistent bottom tab bar that makes Diverge feel like a real app. */
export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="z-30 flex shrink-0 items-center justify-around border-t border-black/5 bg-white/90 px-6 pb-2 pt-2.5 backdrop-blur-xl">
      <button
        onClick={() => onChange('home')}
        className={`p-1.5 transition-colors ${active === 'home' ? 'text-ink' : 'text-gray-400'}`}
        aria-label="Home"
      >
        <Home className="h-7 w-7" strokeWidth={active === 'home' ? 2.4 : 1.9} />
      </button>

      <button
        onClick={() => onChange('explore')}
        className={`p-1.5 transition-colors ${active === 'explore' ? 'text-ink' : 'text-gray-400'}`}
        aria-label="Explore"
      >
        <Compass
          className="h-7 w-7"
          strokeWidth={active === 'explore' ? 2.4 : 1.9}
        />
      </button>

      <button
        onClick={() => onChange('you')}
        className="p-1"
        aria-label="You"
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-200 to-pink-200 text-base transition-all ${
            active === 'you' ? 'ring-2 ring-ink ring-offset-2' : ''
          }`}
        >
          {currentUser.avatar}
        </span>
      </button>
    </nav>
  )
}
