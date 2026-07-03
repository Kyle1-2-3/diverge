import type { ReactNode } from 'react'
import { LogoMark } from './Logo'

interface PhoneFrameProps {
  children: ReactNode
}

/**
 * Wraps the app in a phone-shaped mockup so it looks like a mobile app on a
 * laptop, and expands to fill the screen on a real phone. The inner area is a
 * positioned flex column — screens fill it, and overlays (reflection, about,
 * sheets) absolutely position against it so they stay inside the phone.
 */
export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-0 sm:p-8">
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white sm:h-[860px] sm:max-h-[92vh] sm:w-[420px] sm:rounded-none sm:border-4 sm:border-black sm:shadow-hard-lg">
        {/* Status strip — flat black bar instead of a glossy notch. */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 hidden h-7 items-center justify-between border-b-4 border-black bg-black px-3 sm:flex">
          <span className="flex items-center gap-1.5 text-white">
            <LogoMark className="h-3 w-3" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
              DIVERGE
            </span>
          </span>
          <span className="font-mono text-[10px] font-bold tracking-widest text-white">
            ▮▮▮ 100%
          </span>
        </div>

        {/* App surface. */}
        <div className="relative flex h-full w-full flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
