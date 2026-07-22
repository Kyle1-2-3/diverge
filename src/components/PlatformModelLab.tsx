import { useLocale } from '../i18n'
import type { TranslationKey } from '../i18n/translations'
import type { TFunc } from '../i18n'
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
}

const ROWS: {
  labelKey: TranslationKey
  get: (s: SessionStats, t: TFunc) => string
}[] = [
  { labelKey: 'lab.row.length', get: (s) => fmt.minutes(s) },
  { labelKey: 'lab.row.posts', get: (s) => fmt.posts(s) },
  { labelKey: 'lab.row.ads', get: (s) => fmt.ads(s) },
  { labelKey: 'lab.row.familiar', get: (s) => fmt.familiar(s) },
  { labelKey: 'lab.row.discovery', get: (s) => fmt.discovery(s) },
  { labelKey: 'lab.row.creators', get: (s) => fmt.creators(s) },
  { labelKey: 'lab.row.choices', get: (s) => fmt.choices(s) },
  {
    labelKey: 'lab.row.ended',
    get: (s, t) => (s.endedNaturally ? t('lab.yes') : t('lab.no')),
  },
  {
    labelKey: 'lab.row.feeling',
    get: (s, t) => (s.feeling ? t(`feeling.${s.feeling}` as TranslationKey) : '—'),
  },
]

export default function PlatformModelLab({
  onClose,
  onSwitchModel,
}: PlatformModelLabProps) {
  const { t } = useLocale()
  const { model } = useModel()
  const { sessions } = usePrefs()
  const sampled = models.filter((m) => sessions[m.id]?.posts)

  return (
    <div className="animate-fade-up absolute inset-0 z-40 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b border-hairline bg-white px-4 py-3 sm:mt-7">
        <div>
          <h2 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
            {t('lab.title')}
          </h2>
          <p className="text-[11px] text-muted">{t('lab.subtitle')}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-hairline bg-white px-3 py-1 text-xs font-medium text-ink transition-transform active:scale-[0.98]"
        >
          {t('common.done')}
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
                    {t(`model.${m.id}.name`)}
                    {active && ` ${t('modelBar.running')}`}
                  </span>
                  <span
                    className={`block truncate text-xs ${
                      active ? 'text-white/70' : 'text-muted'
                    }`}
                  >
                    {t(`model.${m.id}.kpi`)}
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
              {t('lab.observations')}
            </h3>
            <span className="text-[10px] text-faint">{t('lab.local')}</span>
          </div>

          {sampled.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted">
              {t('lab.empty')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="border-b border-hairline px-3 py-2 text-[10px] font-medium text-faint">
                      {t('lab.latest')}
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
                          {t(`model.short.${m.id}`)}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.labelKey} className="border-b border-hairline last:border-b-0">
                      <td className="px-3 py-2 text-[11px] font-medium text-ink">
                        {t(row.labelKey)}
                      </td>
                      {models.map((m) => {
                        const s = sessions[m.id]
                        return (
                          <td
                            key={m.id}
                            className="tnum px-2 py-2 text-center text-[11px] text-ink"
                          >
                            {s?.posts ? row.get(s, t) : '—'}
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
          {t('lab.footnote')}
        </p>
      </div>
    </div>
  )
}
