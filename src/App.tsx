import { useEffect, useRef, useState } from 'react'
import type { IntentionId } from './types'
import PhoneFrame from './components/PhoneFrame'
import LandingScreen from './components/LandingScreen'
import IntentionalMode from './components/IntentionalMode'
import Feed from './components/Feed'
import ExploreScreen from './components/ExploreScreen'
import ProfileScreen from './components/ProfileScreen'
import ReflectionScreen from './components/ReflectionScreen'
import AboutModal from './components/AboutModal'
import BottomNav, { type Tab } from './components/BottomNav'

// Two layers of state:
//  - `phase` is the high-level flow: opening → mood → the tabbed app.
//  - `tab` is which bottom-nav tab is showing once we're in the app.
type Phase = 'landing' | 'mood' | 'app'

function App() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [tab, setTab] = useState<Tab>('home')
  const [intention, setIntention] = useState<IntentionId>('explore')
  const [reflectOpen, setReflectOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  // Scroll the active tab back to the top whenever the tab changes.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [tab, phase])

  const enterApp = (id: IntentionId) => {
    setIntention(id)
    setTab('home')
    setPhase('app')
  }

  return (
    <PhoneFrame>
      {phase === 'landing' && (
        <LandingScreen onStart={() => setPhase('mood')} />
      )}

      {phase === 'mood' && (
        <IntentionalMode
          onConfirm={enterApp}
          onSkip={() => enterApp('trends')}
        />
      )}

      {phase === 'app' && (
        // `sm:pt-7` keeps the sticky headers clear of the decorative notch on
        // the desktop phone mockup (no effect on real mobile screens).
        <div className="flex h-full w-full flex-col sm:pt-7">
          {/* Scrollable content area for the active tab. */}
          <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto">
            {tab === 'home' && (
              <Feed
                intentionId={intention}
                onReflect={() => setReflectOpen(true)}
                onExplore={() => setTab('explore')}
                onChangeMood={() => setPhase('mood')}
              />
            )}
            {tab === 'explore' && <ExploreScreen />}
            {tab === 'you' && (
              <ProfileScreen
                intentionId={intention}
                onReflect={() => setReflectOpen(true)}
                onAbout={() => setAboutOpen(true)}
                onChangeMood={() => setPhase('mood')}
              />
            )}
          </div>

          <BottomNav active={tab} onChange={setTab} />
        </div>
      )}

      {/* Overlays — positioned against the phone frame. */}
      {reflectOpen && (
        <ReflectionScreen onDone={() => setReflectOpen(false)} />
      )}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </PhoneFrame>
  )
}

export default App
