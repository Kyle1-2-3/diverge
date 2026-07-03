import type { SVGProps } from 'react'

/**
 * The Diverge mark: one stem that splits into two branches — the idea of a
 * single path diverging. Stroke-based so it stays crisp at any size and
 * inherits `currentColor`.
 */
export function LogoMark(p: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="square"
      strokeLinejoin="miter"
      {...p}
    >
      <path d="M2 12h9" />
      <path d="M11 12 22 4" />
      <path d="M11 12 22 20" />
    </svg>
  )
}

interface LogoProps {
  /** Show the wordmark next to the mark. */
  word?: boolean
  className?: string
}

/** The mark locked up in a hard-bordered box, optionally with the wordmark. */
export default function Logo({ word = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-white text-black">
        <LogoMark className="h-5 w-5" />
      </span>
      {word && (
        <span className="font-display text-base font-bold uppercase tracking-[0.2em]">
          Diverge
        </span>
      )}
    </div>
  )
}
