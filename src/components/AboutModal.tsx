interface AboutModalProps {
  onClose: () => void
}

/** A modal explaining the research/design concept behind Diverge. */
export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[88%] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <h2 className="font-display text-xl font-bold text-ink">
              About Diverge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-muted hover:text-ink"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-ink">
          <p>
            Social media platforms often optimize for{' '}
            <strong>attention and engagement</strong>. This can create filter
            bubbles, reduce exposure to diverse perspectives, and make users
            feel like they are choosing freely when the platform design is
            actually shaping their choices.
          </p>
          <p>
            <strong>Diverge</strong> explores whether a social media interface
            can support intentional use, transparency, and exposure to diverse
            viewpoints instead.
          </p>

          <div className="rounded-2xl bg-brand-soft p-4">
            <p className="mb-2 font-semibold text-brand">
              Three ideas this prototype tests:
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-muted">
              <li>
                <span className="text-ink">Intentional use</span> — you choose
                what you want before you scroll.
              </li>
              <li>
                <span className="text-ink">Transparency</span> — every post can
                explain why it appeared.
              </li>
              <li>
                <span className="text-ink">Diversity</span> — the feed actively
                widens your bubble and stops before it becomes endless.
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted">
            This is a non-functional prototype built for a school research and
            design project. All posts, users, and scores are fictional.
          </p>
        </div>
      </div>
    </div>
  )
}
