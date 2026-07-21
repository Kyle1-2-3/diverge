import Logo from './Logo'

interface LandingScreenProps {
  onStart: () => void
}

/**
 * A quiet opening screen: paper-calm surface, one heavy headline, one blue
 * pill. Says one thing, then gets out of the way.
 */
export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="no-scrollbar relative h-full overflow-y-auto overflow-x-hidden bg-white text-ink sm:pt-7">
      <div className="animate-fade-up relative flex min-h-full flex-col px-6 pb-8 pt-12">
        {/* Logo mark — the diverging-lines wordmark. */}
        <Logo />

        {/* Big statement */}
        <div className="mt-auto">
          <p className="mb-4 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            Prototype
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em]">
            See beyond
            <br />
            your feed.
          </h1>
          <p className="mt-5 max-w-[20rem] text-[15px] leading-relaxed text-muted">
            A feed that shows you what the algorithm won&rsquo;t.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-9">
          <button
            onClick={onStart}
            className="w-full rounded-full bg-brand py-4 font-display text-base font-semibold text-white transition-transform active:scale-[0.97]"
          >
            Get started
          </button>
          <p className="mt-4 text-center text-xs text-faint">
            No account needed
          </p>
        </div>
      </div>
    </div>
  )
}
