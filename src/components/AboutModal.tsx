interface AboutModalProps {
  onClose: () => void
}

/** A modal explaining the research/design concept behind Diverge. */
export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[88%] w-full overflow-y-auto border-2 border-black bg-white p-6 shadow-hard-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between border-b-4 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center border-2 border-black bg-brand font-display text-sm font-bold text-white">
              D
            </span>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-black">
              About Diverge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-black bg-white px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-tight text-black active:translate-x-0.5 active:translate-y-0.5"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-black">
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

          <div className="border-2 border-black bg-brand-soft p-4">
            <p className="mb-2 font-display text-sm font-bold uppercase tracking-tight text-black">
              Three ideas this prototype tests:
            </p>
            <ul className="space-y-2 text-muted">
              <li>
                <span className="font-bold text-black">→ Intentional use</span> —
                you choose what you want before you scroll.
              </li>
              <li>
                <span className="font-bold text-black">→ Transparency</span> —
                every post can explain why it appeared.
              </li>
              <li>
                <span className="font-bold text-black">→ Diversity</span> — the
                feed actively widens your bubble and stops before it becomes
                endless.
              </li>
            </ul>
          </div>

          <p className="font-display text-[11px] uppercase tracking-tight text-muted">
            Non-functional prototype for a school research project. All posts,
            users, and scores are fictional.
          </p>
        </div>
      </div>
    </div>
  )
}
