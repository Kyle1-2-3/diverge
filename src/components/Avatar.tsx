interface AvatarProps {
  /** Handle or name — used to derive initials and a stable tone. */
  name: string
  /** Size + text utilities, e.g. "h-9 w-9 text-xs". */
  className?: string
  /** Force a tone; otherwise it's derived deterministically from `name`. */
  dark?: boolean
}

/** First two meaningful letters of a handle: "mira.styles" → "MI". */
function initials(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]+/g, ' ').trim()
  const parts = clean.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return clean.slice(0, 2).toUpperCase() || '??'
}

/** Tiny stable hash so the same handle always gets the same tone. */
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * A generated monogram avatar — the identity system that replaces emoji faces.
 * A circle in a deterministic ink/paper tone from the handle, with quiet
 * initials. Reads as "designed", not "an emoji someone picked".
 */
export default function Avatar({ name, className = '', dark }: AvatarProps) {
  const isDark = dark ?? hash(name) % 2 === 0
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold leading-none ${
        isDark
          ? 'bg-ink text-white'
          : 'border border-hairline bg-canvas text-ink'
      } ${className}`}
    >
      {initials(name)}
    </span>
  )
}
