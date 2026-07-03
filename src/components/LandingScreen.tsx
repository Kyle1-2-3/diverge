import Logo from './Logo'

interface LandingScreenProps {
  onStart: () => void
}

/**
 * A stark opening screen. Raw and declarative — black field, one accent slab,
 * a blunt statement. It states a stance, it doesn't sell a vibe.
 */
export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="no-scrollbar relative h-full overflow-y-auto overflow-x-hidden bg-white text-black sm:pt-7">
      <div className="animate-fade-up relative flex min-h-full flex-col px-6 pb-8 pt-12">
        {/* Logo mark — the diverging-lines wordmark. */}
        <Logo />

        {/* Big statement */}
        <div className="mt-auto">
          <p className="mb-3 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-white">
            v0.1 — prototype
          </p>
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.98] tracking-tighter">
            See
            <br />
            beyond
            <br />
            your
            <br />
            feed.
          </h1>
          <p className="mt-6 max-w-[20rem] border-l-4 border-black pl-3 text-sm leading-relaxed">
            A feed that works against your habits, not for them. Same scroll —
            a world the algorithm keeps from you.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-9">
          <button
            onClick={onStart}
            className="w-full border-2 border-black bg-black py-4 font-display text-base font-bold uppercase tracking-widest text-white shadow-hard transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Enter Diverge →
          </button>
          <p className="mt-4 font-display text-[11px] uppercase tracking-wider text-muted">
            No account · design prototype
          </p>
        </div>
      </div>
    </div>
  )
}
