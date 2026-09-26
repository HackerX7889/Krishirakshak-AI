import { Link } from "react-router-dom"
import {
  ArrowRight,
  Bug,
  Droplet,
  FlaskConical,
  CloudSun,
  Leaf,
  TrendingUp,
  ScanLine,
  Sprout,
  HeartPulse,
  Sun,
  CalendarClock,
  AlertTriangle,
  Camera,
  CheckCircle2,
  ScanSearch,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { currentWeather, sensors } from "../data/mockData"
import { COND_KEYS } from "../services/aiAssistant"
import Button from "../components/Button"
import SectionHeading from "../components/SectionHeading"
import Badge from "../components/Badge"

const benefits = [
  { icon: Bug, titleKey: "benefit.disease.title", descKey: "benefit.disease.desc" },
  { icon: Droplet, titleKey: "benefit.irrigation.title", descKey: "benefit.irrigation.desc" },
  { icon: FlaskConical, titleKey: "benefit.soil.title", descKey: "benefit.soil.desc" },
  { icon: CloudSun, titleKey: "benefit.weather.title", descKey: "benefit.weather.desc" },
  { icon: Leaf, titleKey: "benefit.health.title", descKey: "benefit.health.desc" },
  { icon: TrendingUp, titleKey: "benefit.productivity.title", descKey: "benefit.productivity.desc" },
]

const howSteps: { labelKey: string; textKey: string; icon: LucideIcon }[] = [
  { labelKey: "home.howStep1Label", textKey: "home.howStep1", icon: Camera },
  { labelKey: "home.howStep2Label", textKey: "home.howStep2", icon: ScanSearch },
  { labelKey: "home.howStep3Label", textKey: "home.howStep3", icon: CheckCircle2 },
]

const fieldPlots: ("good" | "fair" | "low")[] = [
  "good", "good", "good", "good", "good", "fair",
  "good", "good", "good", "good", "good", "good",
  "fair", "good", "good", "good", "good", "good",
  "good", "good", "low", "good", "good", "good",
  "good", "good", "good", "good", "good", "low",
  "good", "good", "fair", "good", "good", "good",
]

const plotColor = { good: "bg-leaf-300", fair: "bg-sun-300", low: "bg-red-300" } as const

function HealthStat({
  icon,
  title,
  badge,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode
  title: string
  badge?: string
  value: string
  sub: string
  tone: "leaf" | "sun" | "navy" | "neutral"
}) {
  const tints = {
    leaf: "bg-leaf-100 text-leaf-700",
    sun: "bg-sun-100 text-sun-700",
    navy: "bg-navy-100 text-navy-700",
    neutral: "bg-gray-100 text-gray-600",
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tints[tone]}`}>
          {icon}
        </span>
        {badge && <Badge tone="green"><span className="h-1.5 w-1.5 rounded-full bg-leaf-500" aria-hidden /> {badge}</Badge>}
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-500">{title}</p>
      <p className="mt-0.5 font-display text-2xl font-bold text-navy-950">{value}</p>
      <p className="text-xs font-medium text-gray-500">{sub}</p>
    </div>
  )
}

export default function Home() {
  const { t } = useLanguage()

  const cropHealth = sensors.find((s) => s.key.endsWith(".cropHealth"))?.value ?? 78
  const moisture = sensors.find((s) => s.key.endsWith(".moisture"))
  const moistureValue = moisture?.value ?? 34
  const moistureLow = moistureValue < 45
  const weatherLabel = t(COND_KEYS[currentWeather.condition] ?? "assistant.cond.clear")

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-72 bg-gradient-to-b from-leaf-100/70 to-transparent" aria-hidden />
        <div className="py-8 sm:py-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white px-4 py-1.5 text-sm font-semibold text-leaf-800 shadow-sm">
            <Sprout className="h-4 w-4" aria-hidden /> {t("home.heroBadge")}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">{t("home.heroSubtitle")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/scan">
              <Button size="lg" className="w-full sm:w-auto">
                <ScanLine className="h-5 w-5" aria-hidden /> {t("home.scanCrop")}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {t("home.viewDashboard")} <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Farm health statistics */}
      <section className="mt-2" aria-label="Farm health">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <HealthStat
            icon={<HeartPulse className="h-5 w-5" aria-hidden />}
            title={t("home.stat.cropHealth")}
            badge={t("home.stat.live")}
            value={`${cropHealth}%`}
            sub={t("home.stat.healthy")}
            tone="leaf"
          />
          <HealthStat
            icon={<Droplet className="h-5 w-5" aria-hidden />}
            title={t("home.stat.soilMoisture")}
            value={`${moistureValue}%`}
            sub={`· ${t(moistureLow ? "home.stat.low" : "home.stat.healthy")}`}
            tone="sun"
          />
          <HealthStat
            icon={<CalendarClock className="h-5 w-5" aria-hidden />}
            title={t("home.stat.nextIrrigation")}
            value={t("common.today")}
            sub={t("home.irrigateTime")}
            tone="navy"
          />
          <HealthStat
            icon={<Sun className="h-5 w-5" aria-hidden />}
            title={t("home.stat.weather")}
            value={`${currentWeather.temperature}°`}
            sub={weatherLabel}
            tone="neutral"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-sun-200 bg-sun-50 px-4 py-3">
          <span className="flex items-center gap-1.5 text-sm font-bold text-sun-900">
            <AlertTriangle className="h-4 w-4" aria-hidden /> {t("home.actionNeeded")}:
          </span>
          <span className="text-sm font-medium text-navy-800">{t("home.actionIrrigate")}</span>
        </div>
      </section>

      {/* Features */}
      <section className="mt-14">
        <SectionHeading
          center
          title={t("home.benefitsTitle")}
          subtitle={t("home.benefitsSubtitle")}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.titleKey}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-leaf-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 transition-colors group-hover:bg-leaf-600 group-hover:text-white">
                <b.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-950">{t(b.titleKey)}</h3>
              <p className="mt-1.5 text-gray-600">{t(b.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-14">
        <SectionHeading center title={t("home.howTitle")} subtitle={t("home.howSubtitle")} />
        <ol className="grid gap-5 sm:grid-cols-3">
          {howSteps.map((s, i) => (
            <li
              key={s.labelKey}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="font-display text-4xl font-bold tracking-tight text-leaf-200">
                0{i + 1}
              </span>
              <div className="mt-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-leaf-700">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-bold text-navy-950">{t(s.labelKey)}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">{t(s.textKey)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Sample scan / field view */}
      <section className="mt-14">
        <SectionHeading center title={t("home.sampleTitle")} subtitle={t("home.sampleSubtitle")} />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Field view */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-navy-950">{t("home.fieldView")}</h3>
              <Badge tone="green" icon={<span className="h-1.5 w-1.5 rounded-full bg-leaf-500" aria-hidden />}>
                {cropHealth}% {t("home.fieldHealthy")}
              </Badge>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-leaf-200 via-leaf-300 to-leaf-400 p-3">
                <div className="grid grid-cols-6 gap-1.5">
                  {fieldPlots.map((p, i) => (
                    <span
                      key={i}
                      className={`aspect-square rounded-lg ${plotColor[p]} shadow-sm ring-1 ring-white/40`}
                      title={p}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-leaf-400" aria-hidden /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-sun-400" aria-hidden /> Needs attention</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-red-400" aria-hidden /> Low moisture</span>
            </div>
          </div>

          {/* Sample scan CTA */}
          <div className="flex flex-col justify-center rounded-3xl border border-leaf-200 bg-gradient-to-br from-leaf-50 to-white p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-600 text-white shadow-sm shadow-leaf-600/40">
              <ScanLine className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-navy-950">{t("home.sampleCta")}</h3>
            <p className="mt-2 text-gray-600">{t("home.sampleCtaDesc")}</p>
            <Link to="/scan" className="mt-5 inline-flex">
              <Button>
                <ScanLine className="h-4 w-4" aria-hidden /> {t("home.scanCrop")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}