import type { ReactNode } from 'react'

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
    <div className="flex min-h-screen w-full items-center justify-center p-0 sm:p-6">
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 sm:h-[860px] sm:max-h-[92vh] sm:w-[420px] sm:rounded-[2.75rem] sm:ring-8 sm:ring-black/80">
        {/* Notch — decorative, hidden on real mobile screens. */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-40 hidden h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-black/80 sm:block" />

        {/* App surface. */}
        <div className="relative flex h-full w-full flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
