// Minimal line icons (inline SVG) so action buttons feel like a real app
// instead of emoji. Each takes standard SVG props (className, etc.).
import type { SVGProps } from 'react'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export const Heart = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7.5-4.6-10-9.4C.5 8.3 2.2 5 5.5 5c2 0 3.3 1.1 4.1 2.3.3.4.8.4 1.1 0C11.5 6.1 12.8 5 14.8 5c3.3 0 5 3.3 3.5 6.6C19.5 16.4 12 21 12 21z" />
  </svg>
)
export const HeartFilled = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M12 21s-7.5-4.6-10-9.4C.5 8.3 2.2 5 5.5 5c2 0 3.3 1.1 4.1 2.3.3.4.8.4 1.1 0C11.5 6.1 12.8 5 14.8 5c3.3 0 5 3.3 3.5 6.6C19.5 16.4 12 21 12 21z" />
  </svg>
)
export const Comment = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5z" />
  </svg>
)
export const Share = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
)
export const Bookmark = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
  </svg>
)
export const BookmarkFilled = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
  </svg>
)
export const More = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </svg>
)
export const Home = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
)
export const Compass = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2z" />
  </svg>
)
export const Verified = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...p}>
    <circle cx="12" cy="12" r="10" fill="#3b9eff" />
    <path
      d="m7.5 12.3 3 3 6-6.6"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
