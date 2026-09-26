import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Droplet,
  Play,
  Square,
  Timer,
  TrendingDown,
  CloudSun,
  Sprout,
  Thermometer,
  Sparkles,
  CalendarClock,
} from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useToast } from "../contexts/ToastContext"
import PageHeader from "../components/PageHeader"
import StatCard from "../components/StatCard"
import Toggle from "../components/Toggle"
import Modal from "../components/Modal"
import Button from "../components/Button"
import Badge from "../components/Badge"

export default function Irrigation() {
  const { t } = useLanguage()
  const { show } = useToast()
  const [running, setRunning] = useState(false)
  const [auto, setAuto] = useState(false)
  const [startModal, setStartModal] = useState(false)

  const moisture = 24
  const required = moisture < 30

  const startIrrigation = () => {
    setStartModal(false)
    setRunning(true)
    show(t("toast.irrigationStarted"), "success")
  }

  const stopIrrigation = () => {
    setRunning(false)
    show(t("toast.irrigationStopped"), "info")
  }

  const toggleAuto = (v: boolean) => {
    setAuto(v)
    show(v ? t("toast.autoOn") : t("toast.autoOff"), v ? "success" : "info")
  }

  const factors = [
    { icon: Droplet, key: "irr.factor.moisture", desc: "irr.factor.moistureDesc", value: "24%" },
    { icon: CloudSun, key: "irr.factor.weather", desc: "irr.factor.weatherDesc", value: "Rain ~20%" },
    { icon: Sprout, key: "irr.factor.crop", desc: "irr.factor.cropDesc", value: "Tomato" },
    { icon: Thermometer, key: "irr.factor.temp", desc: "irr.factor.tempDesc", value: "34°C" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title={t("irr.title")}
        subtitle={t("irr.subtitle")}
        icon={<Droplet className="h-6 w-6" aria-hidden />}
      />

      {/* Status + start */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div
          className={`rounded-3xl border-2 p-6 shadow-sm lg:col-span-2 ${
            required ? "border-sun-300 bg-gradient-to-br from-sun-50 to-white" : "border-leaf-300 bg-gradient-to-br from-leaf-50 to-white"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge tone={required ? "yellow" : "green"}>
                {required ? <Droplet className="h-3.5 w-3.5" aria-hidden /> : <Sparkles className="h-3.5 w-3.5" aria-hidden />}
                {required ? t("irr.required") : t("irr.notRequired")}
              </Badge>
              <div className="mt-4 flex flex-wrap gap-6">
                <div>
                  <p className="font-display text-4xl font-bold text-navy-900">{required ? "45" : "0"}</p>
                  <p className="text-sm font-medium text-navy-500">{t("irr.remaining")}</p>
                </div>
                <div>
                  <p className="font-display text-4xl font-bold text-navy-900">{required ? "1,250" : "0"} L</p>
                  <p className="text-sm font-medium text-navy-500">{t("irr.waterAmount")}</p>
                </div>
              </div>
            </div>

            {/* Moisture gauge */}
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-sm font-semibold text-navy-700">
                <span>{t("irr.moistureBar")}</span>
                <span>{moisture}%</span>
              </div>
              <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-navy-100">
                <div className={`h-full rounded-full ${running ? "bg-leaf-500" : "bg-sun-500"}`} style={{ width: `${moisture}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-xs text-navy-400">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {!running ? (
              <Button size="lg" onClick={() => setStartModal(true)} className="min-w-44">
                <Play className="h-5 w-5" aria-hidden /> {t("irr.startNow")}
              </Button>
            ) : (
              <Button size="lg" variant="danger" onClick={stopIrrigation} className="min-w-44">
                <Square className="h-5 w-5" aria-hidden /> {t("irr.stopNow")}
              </Button>
            )}
            <div className="min-w-64 flex-1">
              <Toggle checked={auto} onChange={toggleAuto} label={t("irr.autoToggle")} description={t("irr.autoHint")} />
            </div>
          </div>

          {running && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-leaf-600/10 p-3 text-sm font-semibold text-leaf-800">
              <Timer className="h-4 w-4 animate-pulse" aria-hidden /> {t("irr.running")} — 00:08:45 / 25:00
            </div>
          )}
        </div>

        {/* Water savings */}
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-navy-900">{t("irr.savedTitle")}</h2>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-leaf-50 p-4">
            <TrendingDown className="h-8 w-8 text-leaf-600" aria-hidden />
            <div>
              <p className="font-display text-2xl font-bold text-leaf-800">12,850 L</p>
              <p className="text-xs font-medium text-leaf-700">{t("irr.savedLiters")}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-navy-600">
              <span>Season target</span>
              <span className="font-semibold text-leaf-700">64%</span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-navy-100">
              <div className="h-full w-[64%] rounded-full bg-leaf-500" />
            </div>
          </div>
          <p className="mt-2 text-xs text-navy-500">{t("irr.savedPerc")}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard icon={<Droplet className="h-5 w-5" aria-hidden />} label={t("dash.tank")} value="62%" sub="2,480 L left" accent="blue" />
            <StatCard icon={<Timer className="h-5 w-5" aria-hidden />} label="Pump hours" value="94 h" sub="this season" />
          </div>
        </div>
      </div>

      {/* Weekly schedule */}
      <div className="mt-8 rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
          <CalendarClock className="h-5 w-5 text-leaf-600" aria-hidden /> {t("irr.scheduleTitle")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { day: "Mon", time: "5:00 PM", liters: "1,200 L" },
            { day: "Thr", time: "6:30 AM", liters: "1,300 L" },
            { day: "Sun", time: "6:00 PM", liters: "1,250 L" },
          ].map((s) => (
            <div key={s.day} className="rounded-2xl border border-navy-100 bg-navy-50/50 p-4">
              <p className="text-sm font-bold text-navy-900">{s.day}</p>
              <p className="mt-1 text-sm text-navy-600">{s.time}</p>
              <p className="mt-1 text-sm font-semibold text-leaf-700">{s.liters}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How AI decides */}
      <div className="mt-8 rounded-3xl bg-navy-950 p-6 text-white">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Sparkles className="h-5 w-5 text-leaf-400" aria-hidden /> {t("irr.howTitle")}
        </h2>
        <p className="mt-1 text-sm text-navy-300">{t("irr.howSubtitle")}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {factors.map((f) => (
            <div key={f.key} className="rounded-2xl bg-navy-900 p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-600/20 text-leaf-400">
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="rounded-full bg-navy-800 px-2.5 py-1 text-xs font-bold text-navy-200">{f.value}</span>
              </div>
              <p className="mt-3 font-semibold text-white">{t(f.key)}</p>
              <p className="mt-0.5 text-xs text-navy-300">{t(f.desc)}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-2xl bg-leaf-600/15 p-3 text-sm text-leaf-200">
          💡 {t("irr.factor.moistureDesc")} {t("irr.factor.weatherDesc")} {t("irr.factor.cropDesc")} {t("irr.factor.tempDesc")}
        </p>
      </div>

      {/* Start modal */}
      <Modal
        open={startModal}
        onClose={() => setStartModal(false)}
        title={t("irr.required")}
        footer={
          <>
            <Button variant="ghost" onClick={() => setStartModal(false)}>{t("common.cancel")}</Button>
            <Button onClick={startIrrigation}><Play className="h-4 w-4" aria-hidden /> {t("irr.startNow")}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-sun-50 p-3 text-sm">
            <span className="text-sun-800">{t("irr.remaining")}</span>
            <span className="font-bold text-navy-900">45 minutes</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-leaf-50 p-3 text-sm">
            <span className="text-leaf-800">{t("irr.waterAmount")}</span>
            <span className="font-bold text-navy-900">1,250 liters</span>
          </div>
          <p className="text-sm text-navy-600">
            {t("irr.autoHint")}
          </p>
          <Link to="/advisory" className="text-sm font-semibold text-leaf-700 underline">
            {t("dash.weatherAlertMsg")}
          </Link>
        </div>
      </Modal>
    </div>
  )
}
