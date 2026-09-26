import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { translations } from "../i18n/translations"
import type { Language } from "../types"

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("sfa_lang")
    return (saved as Language) || "en"
  })

  useEffect(() => {
    localStorage.setItem("sfa_lang", lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Language) => setLangState(l), [])

  const t = useCallback(
    (key: string) => {
      const dict = translations[lang]
      return dict[key] ?? translations.en[key] ?? key
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}