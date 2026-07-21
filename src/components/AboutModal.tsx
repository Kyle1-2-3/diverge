import { LogoMark } from './Logo'

interface AboutModalProps {
  onClose: () => void
}

/** A centered modal explaining the research/design concept behind Diverge. */
export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="animate-pop-in shadow-soft-lg max-h-[88%] w-full overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">
              <LogoMark className="h-4.5 w-4.5" />
            </span>
            <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-ink">
              About Diverge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-semibold text-ink transition-transform active:scale-[0.98]"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>
            Most platforms optimize for{' '}
            <strong className="text-ink">attention</strong> — creating filter
            bubbles and steering choices while feeling like free choice.
          </p>
          <p>
            <strong className="text-ink">Diverge</strong> asks whether an
            interface can support intentional use, transparency, and diverse
            viewpoints instead.
          </p>

          <div className="rounded-xl bg-brand-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">
              Three ideas this prototype tests
            </p>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-ink">
                  → Intentional use
                </span>{' '}
                — choose what you want before you scroll.
              </li>
              <li>
                <span className="font-semibold text-ink">→ Transparency</span> —
                every post can explain why it appeared.
              </li>
              <li>
                <span className="font-semibold text-ink">→ Diversity</span> —
                the feed widens your bubble and ends instead of scrolling
                forever.
              </li>
            </ul>
          </div>

          <p className="text-xs text-faint">
            Non-functional prototype for a school research project. All posts,
            users, and scores are fictional.
          </p>
        </div>
      </div>
    </div>
  )
}
