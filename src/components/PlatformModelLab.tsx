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
      <header className="flex items-center justify-between border-b border-hairline bg-white px-4 py-3 sm:mt-7">
        <div>
          <h2 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
            Platform model lab
          </h2>
          <p className="text-[11px] text-muted">
            Same you, same posts — three ways of making money.
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
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
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-transform active:scale-[0.98] ${
                  active
                    ? 'border-transparent bg-ink text-white'
                    : 'shadow-soft-sm border-hairline bg-white text-ink'
                }`}
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-lg"
                  style={{ background: m.accent }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-semibold">
                    {m.name}
                    {active && ' · running'}
                  </span>
                  <span
                    className={`block truncate text-xs ${
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
        <div className="shadow-soft mt-5 overflow-hidden rounded-xl border border-hairline bg-white">
          <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
            <h3 className="text-xs font-semibold text-ink">
              Session observations
            </h3>
            <span className="text-[10px] text-faint">local · simulated</span>
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
                    <th className="border-b border-hairline px-3 py-2 text-[10px] font-medium text-faint">
                      Latest session
                    </th>
                    {models.map((m) => (
                      <th
                        key={m.id}
                        className="border-b border-hairline px-2 py-2 text-center"
                      >
                        <span
                          className="mx-auto block h-2.5 w-2.5 rounded-full"
                          style={{ background: m.accent }}
                        />
                        <span className="mt-1 block text-[10px] font-medium text-muted">
                          {m.short}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-hairline last:border-b-0">
                      <td className="px-3 py-2 text-[11px] font-medium text-ink">
                        {row.label}
                      </td>
                      {models.map((m) => {
                        const s = sessions[m.id]
                        return (
                          <td
                            key={m.id}
                            className="tnum px-2 py-2 text-center text-[11px] text-ink"
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

        <p className="mt-3 pb-2 text-[11px] leading-snug text-faint">
          Generated locally by this prototype to make incentives comparable —
          not scientific measurements.
        </p>
      </div>
    </div>
  )
}
