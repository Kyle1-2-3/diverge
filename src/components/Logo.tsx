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
      strokeLinecap="round"
      strokeLinejoin="round"
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

/** The mark in a soft rounded tile, optionally with the wordmark — the one
 *  place Space Grotesk survives, so Diverge keeps its own voice. */
export default function Logo({ word = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="shadow-soft-sm flex h-9 w-9 items-center justify-center rounded-[10px] bg-ink text-white">
        <LogoMark className="h-5 w-5" />
      </span>
      {word && (
        <span className="font-logo text-lg font-bold tracking-tight">
          Diverge
        </span>
      )}
    </div>
  )
}
