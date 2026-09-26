import { Link } from "react-router-dom"
import { MapPin, Sun, Menu } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../contexts/AuthContext"
import { currentWeather } from "../data/mockData"
import { COND_KEYS } from "../services/aiAssistant"
import { LANGUAGES } from "../i18n/languages"
import Clock from "./Clock"
import type { Language } from "../types"

export default function Header({ onMenu }: { onMenu: () => void }) {
  const { t, lang, setLang } = useLanguage()
  const { isAuthenticated, user } = useAuth()

  const hour = new Date().getHours()
  const greetKey =
    hour < 12 ? "home.greet.morning" : hour < 17 ? "home.greet.afternoon" : "home.greet.evening"
  const name = user?.name || "Karthik"
  const location =
    user?.location && user?.state ? `${user.location}, ${user.state}` : "Nashik, Maharashtra"

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#f9f9f6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6 lg:px-10">
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-bold text-navy-950">
            {t(greetKey)}, {name}
          </h1>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-leaf-600" aria-hidden /> {location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Clock */}
          <Clock />

          {/* Weather */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-800">
            <Sun className="h-4 w-4 text-sun-500" aria-hidden /> {currentWeather.temperature}° ·{" "}
            {t(COND_KEYS[currentWeather.condition] ?? "assistant.cond.clear")}
          </span>

          {/* Language control */}
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              aria-label="Language"
              className="max-w-36 cursor-pointer rounded-full bg-transparent px-2 py-1 text-xs font-semibold text-navy-700 focus:outline-none"
            >
              {LANGUAGES.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.native}
                </option>
              ))}
            </select>
          </div>

          {/* User */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 sm:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white">
                {(user?.name || "F").charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-28 truncate text-sm font-bold text-navy-900 lg:block">
                {user?.name || "Farmer"}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-leaf-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-leaf-700 sm:block"
            >
              {t("nav.login")}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={onMenu}
            className="rounded-lg border border-gray-200 bg-white p-2 text-navy-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}