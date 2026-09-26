import type { Language } from "../types"

export interface LanguageMeta {
  code: Language
  en: string
  native: string
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", en: "English", native: "English" },
  { code: "hi", en: "Hindi", native: "हिन्दी" },
  { code: "mr", en: "Marathi", native: "मराठी" },
  { code: "bn", en: "Bengali", native: "বাংলা" },
  { code: "te", en: "Telugu", native: "తెలుగు" },
  { code: "ta", en: "Tamil", native: "தமிழ்" },
  { code: "kn", en: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", en: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", en: "Punjabi", native: "ਪੰਜਾਬੀ" },
]

export const LANG_NAME: Record<Language, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l.native]),
) as Record<Language, string>