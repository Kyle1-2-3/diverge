import { models, type BusinessModel } from '../data/models'
import { useModel } from '../state/model'
import { usePrefs, type SessionStats } from '../state/prefs'

// ---------------------------------------------------------------------------
// Profile → Platform Model Lab: switch the business model and compare what
// each one actually did with your session. All numbers are local prototype
// observations — labeled as such, never claimed as science.
// ---------------------------------------------------------------------------

interface PlatformModelLabProps {
  onClose: () => void
  onSwitchModel: (m: BusinessModel) => void
}

const fmt = {
  minutes: (s: SessionStats) => `${Math.max(1, Math.round(s.seconds / 60))}m`,
  posts: (s: SessionStats) => String(s.posts),
  ads: (s: SessionStats) => String(s.ads),
  familiar: (s: SessionStats) =>
    s.posts ? `${Math.round((s.core / s.posts) * 100)}%` : '0%',
  discovery: (s: SessionStats) =>
    s.posts
      ? `${Math.round(((s.adjacent + s.discovery) / s.posts) * 100)}%`
      : '0%',
  creators: (s: SessionStats) => String(s.creators.length),
  choices: (s: SessionStats) => String(s.choices),
  ended: (s: SessionStats) => (s.endedNaturally ? 'yes' : 'no'),
  feeling: (s: SessionStats) => s.feeling ?? '—',
}

const ROWS: { label: string; get: (s: SessionStats) => string }[] = [
  { label: 'Session length', get: fmt.minutes },
  { label: 'Posts viewed', get: fmt.posts },
  { label: 'Ads seen', get: fmt.ads },
  { label: 'Familiar content', get: fmt.familiar },
  { label: 'Adjacent discovery', get: fmt.discovery },
  { label: 'Distinct creators', get: fmt.creators },
  { label: 'Explicit choices', get: fmt.choices },
  { label: 'Natural ending', get: fmt.ended },
  { label: 'You called it', get: fmt.feeling },
]

export default function PlatformModelLab({
  onClose,
  onSwitchModel,
}: PlatformModelLabProps) {
  const { model } = useModel()
  const { sessions } = usePrefs()
  const sampled = models.filter((m) => sessions[m.id]?.posts)

  return (
    <div className="animate-fade-up absolute inset-0 z-40 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b-4 border-black bg-white px-4 py-3 sm:mt-7">
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-black">
            Platform Model Lab
          </h2>
          <p className="text-[11px] text-muted">
            Same you, same posts — three ways of making money.
          </p>
        </div>
        <button
          onClick={onClose}
          className="border-2 border-black bg-white px-2.5 py-1 font-display text-[11px] font-bold uppercase text-black active:translate-x-0.5 active:translate-y-0.5"
        >
          Done
        </button>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {/* Switcher */}
        <div className="flex flex-col gap-2.5">
          {models.map((m) => {
            const active = m.id === model
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (!active) {
                    onClose()
                    onSwitchModel(m.id)
                  }
                }}
                className={`flex items-center gap-3 border-2 border-black p-3 text-left transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                  active ? 'bg-black text-white' : 'bg-white text-black shadow-hard-sm'
                }`}
              >
                <span
                  className="h-8 w-8 shrink-0 border-2 border-black"
                  style={{ background: m.accent }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-bold uppercase tracking-tight">
                    {m.name}
                    {active && ' — running'}
                  </span>
                  <span
                    className={`block truncate font-mono text-[10px] uppercase tracking-tight ${
                      active ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    {m.kpi}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Comparison */}
        <div className="mt-5 border-2 border-black bg-white shadow-hard-sm">
          <div className="flex items-center justify-between border-b-2 border-black px-3 py-2">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-black">
              Prototype session observations
            </h3>
            <span className="font-mono text-[9px] uppercase text-muted">
              local · simulated
            </span>
          </div>

          {sampled.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted">
              Spend a little time in each model and the comparison fills in.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="border-b-2 border-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
                      Latest session
                    </th>
                    {models.map((m) => (
                      <th
                        key={m.id}
                        className="border-b-2 border-black px-2 py-2 text-center"
                      >
                        <span
                          className="mx-auto block h-2.5 w-2.5 border border-black"
                          style={{ background: m.accent }}
                        />
                        <span className="mt-1 block font-mono text-[9px] font-bold uppercase tracking-tight text-black">
                          {m.short}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-black/15">
                      <td className="px-3 py-2 font-display text-[11px] font-bold text-black">
                        {row.label}
                      </td>
                      {models.map((m) => {
                        const s = sessions[m.id]
                        return (
                          <td
                            key={m.id}
                            className="px-2 py-2 text-center font-mono text-[11px] tabular-nums text-black"
                          >
                            {s?.posts ? row.get(s) : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-3 pb-2 text-[11px] leading-snug text-muted">
          These observations are generated locally by this prototype to make
          incentive structures comparable. They are not scientific
          measurements and don't claim psychological outcomes.
        </p>
      </div>
    </div>
  )
}
