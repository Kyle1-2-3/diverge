import Avatar from './Avatar'
import { Home, Compass } from './Icons'
import { useModel } from '../state/model'

export type Tab = 'home' | 'explore' | 'you'

/** What the middle tab is *called* is itself a business-model decision. */
const MIDDLE_LABEL = {
  attention: 'For You',
  subscription: 'Search',
  public: 'Outside',
} as const

/** The persistent bottom tab bar that makes Diverge feel like a real app. */
export default function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  const { model } = useModel()

  const label = (text: string, isActive: boolean) => (
    <span
      className={`mt-0.5 block text-center text-[10px] font-medium ${
        isActive ? 'text-ink' : 'text-faint'
      }`}
    >
      {text}
    </span>
  )

  return (
    <nav className="z-30 flex shrink-0 items-start justify-around border-t border-hairline bg-white px-6 pb-2 pt-2">
      <button
        onClick={() => onChange('home')}
        className={`p-1 transition-colors ${active === 'home' ? 'text-ink' : 'text-faint'}`}
        aria-label="Home"
      >
        <Home
          className="mx-auto h-7 w-7"
          strokeWidth={active === 'home' ? 2.6 : 1.9}
        />
        {label('Home', active === 'home')}
      </button>

      <button
        onClick={() => onChange('explore')}
        className={`p-1 transition-colors ${active === 'explore' ? 'text-ink' : 'text-faint'}`}
        aria-label="Explore"
      >
        <Compass
          className="mx-auto h-7 w-7"
          strokeWidth={active === 'explore' ? 2.6 : 1.9}
        />
        {label(MIDDLE_LABEL[model], active === 'explore')}
      </button>

      <button onClick={() => onChange('you')} className="p-1" aria-label="You">
        <Avatar
          name="You"
          dark={active === 'you'}
          className={`mx-auto h-7 w-7 text-[10px] ${
            active === 'you' ? '' : 'opacity-70'
          }`}
        />
        {label('You', active === 'you')}
      </button>
    </nav>
  )
}
