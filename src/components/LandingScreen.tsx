import { useLocale } from '../i18n'
import type { Lang } from '../i18n/translations'
import Logo from './Logo'

interface LandingScreenProps {
  onStart: () => void
}

const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
]

/**
 * A quiet opening screen: brand, one promise, a language choice, one button.
 */
export default function LandingScreen({ onStart }: LandingScreenProps) {
  const { lang, setLang, t } = useLocale()

  return (
    <div className="no-scrollbar relative h-full overflow-y-auto overflow-x-hidden bg-white text-ink sm:pt-7">
      <div className="animate-fade-up relative flex min-h-full flex-col px-6 pb-8 pt-12">
        <Logo />

        {/* Big statement */}
        <div className="mt-auto">
          <p className="mb-4 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {t('landing.prototype')}
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em]">
            {t('landing.title1')}
            <br />
            {t('landing.title2')}
          </h1>
          <p className="mt-5 max-w-[20rem] text-[15px] leading-relaxed text-muted">
            {t('landing.subtitle')}
          </p>
        </div>

        {/* Language choice — also changeable later in You → Language. */}
        <div className="mt-8 flex gap-2" role="group" aria-label={t('landing.language')}>
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              aria-pressed={lang === l.id}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-transform active:scale-[0.98] ${
                lang === l.id
                  ? 'bg-ink text-white'
                  : 'border border-hairline bg-white text-muted'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4">
          <button
            onClick={onStart}
            className="w-full rounded-full bg-brand py-4 font-display text-base font-semibold text-white transition-transform active:scale-[0.97]"
          >
            {t('landing.cta')}
          </button>
          <p className="mt-4 text-center text-xs text-faint">
            {t('landing.noAccount')}
          </p>
        </div>
      </div>
    </div>
  )
}
