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
      <div className="sm:shadow-soft-lg relative flex h-screen w-full flex-col overflow-hidden bg-white sm:h-[860px] sm:max-h-[92vh] sm:w-[420px] sm:rounded-[2rem] sm:border sm:border-hairline">
        {/* Status strip — a quiet white band standing in for the notch. */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 hidden h-7 items-center justify-between bg-white px-5 sm:flex">
          <span className="flex items-center gap-1.5 text-ink">
            <LogoMark className="h-3 w-3" />
            <span className="text-[10px] font-semibold tracking-tight">
              Diverge
            </span>
          </span>
          <span className="tnum text-[10px] font-medium text-faint">100%</span>
        </div>

        {/* App surface. */}
        <div className="relative flex h-full w-full flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
