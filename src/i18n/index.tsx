import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  translations,
  type Lang,
  type TranslationKey,
} from './translations'

// ---------------------------------------------------------------------------
// One centralized bilingual system. Components call useLocale().t('key') —
// no duplicated page trees, no per-component dictionaries. The chosen
// language persists locally and also sets <html lang> for correct wrapping
// and font fallback.
// ---------------------------------------------------------------------------

export const LANG_STORAGE_KEY = 'diverge-lang'

export type TFunc = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string

/** Pure translate — also used by tests and non-React code. */
// eslint-disable-next-line react-refresh/only-export-components
export function translate(
  lang: Lang,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  let out = translations[lang][key] ?? translations.en[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      out = out.split(`{${k}}`).join(String(v))
    }
  }
  return out
}

// eslint-disable-next-line react-refresh/only-export-components
export function loadLang(): Lang {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY)
    if (raw === 'en' || raw === 'ja') return raw
  } catch {
    // storage unavailable — default below
  }
  return 'en'
}

interface LocaleValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: TFunc
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(loadLang)

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {
      // storage unavailable — the app still works, it just won't remember
    }
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<LocaleValue>(
    () => ({
      lang,
      setLang,
      t: (key, params) => translate(lang, key, params),
    }),
    [lang],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

/** Hook for any component that renders user-facing text. */
// eslint-disable-next-line react-refresh/only-export-components
export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
