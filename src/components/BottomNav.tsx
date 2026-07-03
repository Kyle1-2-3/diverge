import Avatar from './Avatar'
import { Home, Compass } from './Icons'

export type Tab = 'home' | 'explore' | 'you'

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

/** The persistent bottom tab bar that makes Diverge feel like a real app. */
export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="z-30 flex shrink-0 items-center justify-around border-t-4 border-black bg-white px-6 pb-2 pt-2.5">
      <button
        onClick={() => onChange('home')}
        className={`p-1.5 transition-colors ${active === 'home' ? 'text-black' : 'text-gray-400'}`}
        aria-label="Home"
      >
        <Home className="h-7 w-7" strokeWidth={active === 'home' ? 2.6 : 1.9} />
      </button>

      <button
        onClick={() => onChange('explore')}
        className={`p-1.5 transition-colors ${active === 'explore' ? 'text-black' : 'text-gray-400'}`}
        aria-label="Explore"
      >
        <Compass
          className="h-7 w-7"
          strokeWidth={active === 'explore' ? 2.6 : 1.9}
        />
      </button>

      <button onClick={() => onChange('you')} className="p-1" aria-label="You">
        <Avatar
          name="You"
          dark={active === 'you'}
          className={`h-8 w-8 text-[10px] ${
            active === 'you' ? 'shadow-hard-sm' : 'opacity-70'
          }`}
        />
      </button>
    </nav>
  )
}
