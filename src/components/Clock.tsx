import { useEffect, useState } from "react"
import { Clock as ClockIcon } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import type { Language } from "../types"

const LOCALES: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  gu: "gu-IN",
  pa: "pa-IN",
}

export default function Clock() {
  const { lang } = useLanguage()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const locale = LOCALES[lang]
  const time = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now)
  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now)

  return (
    <time
      dateTime={now.toISOString()}
      aria-label={`${time}, ${date}`}
      className="inline-flex flex-col items-end gap-0.5 rounded-full border border-gray-200 bg-white px-3 py-1.5"
    >
      <span className="flex items-center gap-1.5 text-sm font-bold text-navy-800">
        <ClockIcon className="h-4 w-4 text-leaf-600" aria-hidden /> {time}
      </span>
      <span className="text-[11px] font-medium text-gray-500">{date}</span>
    </time>
  )
}