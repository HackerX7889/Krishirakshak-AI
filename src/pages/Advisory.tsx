import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  CloudSun,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  AlertTriangle,
  Sun,
  Cloud,
  CloudLightning,
  MapPin,
  BookOpen,
  Loader2,
  Settings2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../contexts/AuthContext"
import { conditionMeta, weatherAlerts } from "../data/mockData"
import type { WeatherAlertType, WeatherForecast } from "../types"
import {
  fetchWeatherSnapshot,
  farmCoordinates,
  mockWeatherSnapshot,
  type FarmCoordinates,
  type WeatherSnapshot,
} from "../services/weatherApi"
import PageHeader from "../components/PageHeader"
import Alert from "../components/Alert"
import Badge from "../components/Badge"

const conditionIcon: Record<WeatherForecast["condition"], LucideIcon> = {
  sunny: Sun,
  partly: CloudSun,
  rain: CloudRain,
  cloudy: Cloud,
  storm: CloudLightning,
}

const alertColors: Record<WeatherAlertType, { icon: LucideIcon; tone: "info" | "warning" | "critical"; label: string }> = {
  "heavy-rain": { icon: CloudRain, tone: "warning", label: "Heavy Rain" },
  heatwave: { icon: Thermometer, tone: "critical", label: "Heat Wave" },
  frost: { icon: Cloud, tone: "warning", label: "Frost" },
  pest: { icon: AlertTriangle, tone: "warning", label: "Pests" },
  drought: { icon: Sun, tone: "info", label: "Drought" },
}

export default function Advisory() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const [metric, setMetric] = useState<"metric" | "customary">("metric")
  const [weather, setWeather] = useState<WeatherSnapshot>(() => mockWeatherSnapshot())
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [live, setLive] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const coords: FarmCoordinates = useMemo(() => {
    if (user?.lat != null && user?.lon != null) {
      const label = [user.location, user.state].filter(Boolean).join(", ") || "Farm"
      return { lat: user.lat, lon: user.lon, label }
    }
    return farmCoordinates()
  }, [user])

  const retry = () => {
    setLoading(true)
    setLoadError(false)
    setAttempt((a) => a + 1)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const snap = await fetchWeatherSnapshot(coords)
        if (!cancelled) {
          setWeather(snap)
          setLive(true)
        }
      } catch {
        if (!cancelled) {
          setWeather(mockWeatherSnapshot(coords.label))
          setLoadError(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [attempt, coords])

  const { current } = weather
  const cond = conditionMeta[current.condition]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title={t("adv.title")}
        subtitle={t("adv.subtitle")}
        icon={<CloudSun className="h-6 w-6" aria-hidden />}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Badge tone={live ? "green" : "yellow"} icon={<CloudSun className="h-3.5 w-3.5" aria-hidden />}>
              {live ? t("adv.live") : t("adv.sample")}
            </Badge>
            <div className="flex gap-1 rounded-xl bg-navy-50 p-1">
              {(["metric", "customary"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetric(m)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                    metric === m ? "bg-white text-leaf-700 shadow-sm" : "text-navy-500"
                  }`}
                >
                  {m === "metric" ? "°C" : "°F"}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {loading ? (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-navy-100 bg-white px-4 py-3 text-sm text-navy-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-leaf-600" aria-hidden />
          {t("adv.loading")}
        </div>
      ) : loadError ? (
        <Alert kind="warning" title={t("adv.weatherUnavailable")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>{t("adv.weatherUnavailableMsg")}</p>
            <button
              type="button"
              onClick={retry}
              className="rounded-lg bg-navy-900 px-3 py-1.5 text-sm font-semibold text-white"
            >
              {t("common.retry")}
            </button>
          </div>
        </Alert>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Current weather */}
        <div className="rounded-3xl bg-gradient-to-br from-navy-950 to-navy-800 p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-navy-300">
            <p className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-leaf-400" aria-hidden /> {current.location}
            </p>
            <Link to="/profile" className="inline-flex items-center gap-1 font-semibold text-leaf-300 hover:text-leaf-200">
              <Settings2 className="h-3.5 w-3.5" aria-hidden /> {t("adv.changeLocation")}
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <CondIcon condition={current.condition} className="h-14 w-14 text-sun-400" />
            <div>
              <p className="font-display text-5xl font-bold">
                {metric === "metric" ? `${current.temperature}°` : `${Math.round(current.temperature * 1.8 + 32)}°`}
              </p>
              <p className="text-navy-200">{cond.label}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <MiniStat icon={<Droplets className="h-5 w-5" aria-hidden />} value={`${current.humidity}%`} label={t("adv.humidityAdv")} />
            <MiniStat icon={<CloudRain className="h-5 w-5" aria-hidden />} value={`${current.rainChance}%`} label={t("adv.rainProb")} />
            <MiniStat icon={<Wind className="h-5 w-5" aria-hidden />} value={`${current.wind} km/h`} label={t("adv.wind")} />
          </div>
        </div>

        {/* Active alerts */}
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
            <AlertTriangle className="h-5 w-5 text-sun-600" aria-hidden /> {t("adv.alertsTitle")}
          </h2>
          <div className="mt-4 space-y-3">
            {weatherAlerts.map((alert) => {
              const meta = alertColors[alert.type]
              const tone = alert.severity === "critical" ? "error" : alert.severity === "warning" ? "warning" : "info"
              const toneBadge = alert.severity === "critical" ? "red" : alert.severity === "warning" ? "yellow" : "blue"
              return (
                <Alert key={alert.id} kind={tone} icon={<meta.icon className={`h-5 w-5 shrink-0 ${meta.tone === "critical" ? "text-red-600" : "text-sun-700"}`} aria-hidden />}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{alert.title}</span>
                    <Badge tone={toneBadge}>{meta.label}</Badge>
                  </div>
                  <p>{alert.message}</p>
                  <p className="mt-1 text-xs opacity-70">🕐 {alert.time}</p>
                </Alert>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 rounded-3xl border border-navy-100 bg-leaf-50/60 p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
          <BookOpen className="h-5 w-5 text-leaf-700" aria-hidden /> {t("adv.recommendTitle")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <RecoCard icon={<SproutLeaf />} text={t("adv.reco.wheat")} />
          <RecoCard icon={<TomatoIcon />} text={t("adv.reco.tomato")} />
          <RecoCard icon={<RiceIcon />} text={t("adv.reco.rice")} />
          <RecoCard icon={<OnionIcon />} text={t("adv.reco.onion")} />
        </div>
      </div>

      {/* 7 day forecast */}
      <h2 className="mt-10 font-display text-xl font-bold text-navy-900">{t("adv.forecast")}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {weather.forecast.map((day) => {
          const Icon = conditionIcon[day.condition]
          return (
            <div key={day.day} className={`rounded-2xl border p-4 text-center shadow-sm ${
              day.rainChance >= 50 ? "border-navy-200 bg-navy-50/60" : "border-navy-100 bg-white"
            }`}>
              <p className="text-sm font-bold text-navy-800">{day.day}</p>
              <Icon className={`mx-auto mt-3 h-8 w-8 ${day.condition === "rain" ? "text-leaf-600" : day.condition === "sunny" ? "text-sun-500" : "text-navy-400"}`} aria-hidden />
              <p className="mt-2 font-display text-xl font-bold text-navy-900">{day.tempMax}°</p>
              <p className="text-xs text-navy-500">{day.tempMin}° / {convertKmh(lang, day.windSpeed)}</p>
              <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                day.rainChance >= 50 ? "bg-leaf-100 text-leaf-800" : "bg-sun-100 text-sun-700"
              }`}>
                <CloudRain className="h-3 w-3" aria-hidden /> {day.rainChance}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function convertKmh(lang: string, kmh: number) {
  if (lang === "en" || lang === "hi" || lang === "mr") return `${kmh} km/h`
  return `${Math.round(kmh * 0.62)} mph`
}

function CondIcon({ condition, className }: { condition: string; className?: string }) {
  const iconMap: Record<string, LucideIcon> = conditionIcon
  const Icon = iconMap[condition as WeatherForecast["condition"]] ?? CloudSun
  return <Icon className={className} aria-hidden />
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-2.5">
      <div className="mx-auto flex justify-center text-sun-400">{icon}</div>
      <p className="mt-1 text-sm font-bold">{value}</p>
      <p className="text-[11px] text-navy-300">{label}</p>
    </div>
  )
}

function SproutLeaf() {
  return <Leaf2 />
}
function Leaf2() {
  return <span className="text-lg">🌾</span>
}
function TomatoIcon() {
  return <span className="text-lg">🍅</span>
}
function RiceIcon() {
  return <span className="text-lg">🌾</span>
}
function OnionIcon() {
  return <span className="text-lg">🧅</span>
}

function RecoCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-leaf-200 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-100">{icon}</span>
      <p className="text-sm text-navy-700">{text}</p>
    </div>
  )
}