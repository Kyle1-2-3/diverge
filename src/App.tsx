import { useEffect, useRef, useState } from 'react'
import type { IntentionId } from './types'
import type { BusinessModel } from './data/models'
import { InteractionsProvider } from './state/interactions'
import { ModelProvider, useModel } from './state/model'
import PhoneFrame from './components/PhoneFrame'
import ToastHost from './components/Toast'
import LandingScreen from './components/LandingScreen'
import ModelSelectScreen from './components/ModelSelectScreen'
import ModelBar from './components/ModelBar'
import IntentionalMode from './components/IntentionalMode'
import Feed from './components/Feed'
import ExploreScreen from './components/ExploreScreen'
import ProfileScreen from './components/ProfileScreen'
import ReflectionScreen from './components/ReflectionScreen'
import AboutModal from './components/AboutModal'
import BottomNav, { type Tab } from './components/BottomNav'

// Three layers of state:
//  - `phase`: opening → choose a business model → (mood, subscription only) → app
//  - `tab`: which bottom-nav tab is showing once we're in the app
//  - the business model itself lives in ModelProvider and reshapes everything
type Phase = 'landing' | 'model' | 'mood' | 'app'

function AppInner() {
  const { model, setModel } = useModel()
  const [phase, setPhase] = useState<Phase>('landing')
  const [tab, setTab] = useState<Tab>('home')
  const [intention, setIntention] = useState<IntentionId>('explore')
  const [reflectOpen, setReflectOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  // Scroll the active tab back to the top whenever the tab changes.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [tab, phase, model])

  // Entering a model is itself part of the experiment:
  //  - attention drops you straight into the feed (no friction, start scrolling)
  //  - subscription asks for your intention first (your time, your terms)
  //  - public goes to the feed, which opens by explaining itself
  const enterModel = (m: BusinessModel) => {
    setModel(m)
    setTab('home')
    setPhase(m === 'subscription' ? 'mood' : 'app')
  }

  const enterApp = (id: IntentionId) => {
    setIntention(id)
    setTab('home')
    setPhase('app')
  }

  return (
    // The model class swaps the brand colour scheme for the whole tree.
    <div className={`model-scope model-${model} flex h-full w-full flex-col`}>
      {phase === 'landing' && (
        <LandingScreen onStart={() => setPhase('model')} />
      )}

      {phase === 'model' && <ModelSelectScreen onSelect={enterModel} />}

      {phase === 'mood' && (
        <IntentionalMode
          onConfirm={enterApp}
          onSkip={() => enterApp('trends')}
        />
      )}

      {phase === 'app' && (
        // `sm:pt-7` keeps the experiment bar clear of the decorative notch on
        // the desktop phone mockup. `key={model}` remounts the app on a model
        // switch so the whole product visibly rebuilds itself.
        <div className="flex h-full w-full flex-col sm:pt-7">
          <ModelBar onSwitch={enterModel} />
          <div
            key={model}
            className="animate-fade-up flex min-h-0 flex-1 flex-col"
          >
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
        </div>
      )}

      {/* Overlays — positioned against the phone frame. */}
      {reflectOpen && <ReflectionScreen onDone={() => setReflectOpen(false)} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      {/* Feedback toasts ("Post hidden · Undo", "Link copied"). */}
      <ToastHost />
    </div>
  )
}

function App() {
  return (
    <ModelProvider>
      <InteractionsProvider>
        <PhoneFrame>
          <AppInner />
        </PhoneFrame>
      </InteractionsProvider>
    </ModelProvider>
  )
}

export default App
