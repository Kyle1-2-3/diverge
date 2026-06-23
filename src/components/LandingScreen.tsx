interface LandingScreenProps {
  onStart: () => void
}

/**
 * A cinematic opening screen. Aspirational and emotional — it sells a feeling
 * ("see more, feel more"), not a research project.
 */
export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="no-scrollbar relative h-full overflow-y-auto overflow-x-hidden bg-ink text-white">
      {/* Ambient colour blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-fuchsia-500/40 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-32 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />

      <div className="animate-fade-up relative flex min-h-full flex-col px-7 pb-9 pt-20">
        {/* Logo mark */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
            🧭
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Diverge
          </span>
        </div>

        {/* Big statement */}
        <div className="mt-auto">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight">
            See beyond
            <br />
            your feed.
          </h1>
          <p className="mt-5 max-w-[18rem] text-base leading-relaxed text-white/70">
            A social app that feeds your curiosity, not just your habits. Same
            scroll you love — a world you haven't seen yet.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-9">
          <button
            onClick={onStart}
            className="w-full rounded-2xl bg-white py-4 text-base font-bold text-ink transition-transform active:scale-[0.98]"
          >
            Enter Diverge
          </button>
          <p className="mt-4 text-center text-xs text-white/40">
            No account needed · A design prototype
          </p>
        </div>
      </div>
    </div>
  )
}
