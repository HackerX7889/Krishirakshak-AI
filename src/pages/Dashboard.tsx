import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Droplet,
  AlertTriangle,
  CloudSun,
  MapPin,
  ArrowRight,
  Thermometer,
  BarChart3,
  Activity,
  PieChart as PieChartIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useLanguage } from "../contexts/LanguageContext"
import {
  chartDaily,
  chartMonthly,
  chartWeekly,
  detectionRecords,
  sensors,
  sensorLocations,
  waterRecords,
  weatherForecast,
} from "../data/mockData"
import type { SensorLocation, TimeSeriesPoint } from "../types"
import PageHeader from "../components/PageHeader"
import SensorCard from "../components/SensorCard"
import Alert from "../components/Alert"
import Badge from "../components/Badge"

type FilterKey = "daily" | "weekly" | "monthly"

const chartData: Record<FilterKey, TimeSeriesPoint[]> = {
  daily: chartDaily,
  weekly: chartWeekly,
  monthly: chartMonthly,
}

export default function Dashboard() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<FilterKey>("daily")
  const [selected, setSelected] = useState<SensorLocation | null>(null)

  const data = useMemo(() => chartData[filter], [filter])

  const cropHealthTrend = [
    { month: "Jun", health: 92 },
    { month: "Jul", health: 88 },
    { month: "Aug", health: 74 },
    { month: "Sep", health: 69 },
    { month: "Oct", health: 78 },
    { month: "Nov", health: 84 },
  ]

  const cropConfidence = detectionRecords.map((d) => ({ name: d.crop, confidence: d.confidence }))

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const d of detectionRecords) counts[d.status] = (counts[d.status] || 0) + 1
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [])

  const statusLabel: Record<string, string> = {
    healthy: "Healthy",
    diseased: "Diseased",
    warning: "At Risk",
  }
  const statusColor: Record<string, string> = {
    healthy: "#379c4f",
    diseased: "#dc2626",
    warning: "#ed900d",
  }

  const filterButtons: { key: FilterKey; label: string }[] = [
    { key: "daily", label: t("dash.filterDaily") },
    { key: "weekly", label: t("dash.filterWeekly") },
    { key: "monthly", label: t("dash.filterMonthly") },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        title={t("dash.title")}
        subtitle={t("dash.subtitle")}
        icon={<LayoutDashboard className="h-6 w-6" aria-hidden />}
        actions={<Badge tone="green" icon={<span className="h-2 w-2 rounded-full bg-leaf-500" aria-hidden />}>Live</Badge>}
      />

      {/* Alerts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Alert
          kind="warning"
          title={t("dash.irrigationAlert")}
          icon={<Droplet className="h-5 w-5 shrink-0 text-sun-700" aria-hidden />}
        >
          <p>{t("dash.irrigationAlertMsg")}</p>
          <Link to="/irrigation" className="mt-2 inline-flex items-center gap-1 font-semibold text-sun-800 underline">
            {t("irr.startNow")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Alert>
        <Alert
          kind="info"
          title={t("dash.weatherAlert")}
          icon={<CloudSun className="h-5 w-5 shrink-0 text-navy-600" aria-hidden />}
        >
          <p>{t("dash.weatherAlertMsg")}</p>
          <Link to="/advisory" className="mt-2 inline-flex items-center gap-1 font-semibold text-navy-700 underline">
            {t("nav.advisory")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Alert>
      </div>

      {/* Sensor cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {sensors.map((s) => (
          <SensorCard key={s.id} sensor={s} label={t(s.key)} />
        ))}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-navy-400">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        {t("dash.lastUpdate")}: 09:14 AM
      </p>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-navy-900">{t("dash.chartMoisture")}</h2>
            <div className="flex gap-1 rounded-xl bg-navy-50 p-1">
              {filterButtons.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => setFilter(b.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    filter === b.key ? "bg-white text-leaf-700 shadow-sm" : "text-navy-500 hover:text-navy-800"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" />
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#2c5373" }} />
                <YAxis domain={[0, 80]} tick={{ fontSize: 12, fill: "#2c5373" }} />
                <Tooltip />
                <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                <Line type="monotone" dataKey="moisture" name="% Moisture" stroke="#379c4f" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
            <Thermometer className="h-5 w-5 text-sun-600" aria-hidden /> {t("dash.chartTemp")}
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" />
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#2c5373" }} />
                <YAxis domain={[0, 45]} tick={{ fontSize: 12, fill: "#2c5373" }} />
                <Tooltip />
                <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                <Line type="monotone" dataKey="temperature" name="°C Temperature" stroke="#ed900d" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full analytics section */}
      <div className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-800 text-white">
            <BarChart3 className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-navy-900">{t("dash.analytics")}</h2>
            <p className="text-sm text-navy-500">{t("dash.analyticsSubtitle")}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {/* Weather outlook */}
          <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
              <CloudSun className="h-5 w-5 text-sun-600" aria-hidden /> {t("dash.weatherChart")}
            </h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weatherForecast} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <YAxis yAxisId="temp" domain={[0, 50]} tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <YAxis yAxisId="rain" orientation="right" domain={[0, 100]} tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <Tooltip />
                  <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                  <Bar yAxisId="temp" dataKey="tempMax" name={t("dash.tempMax")} fill="#ed900d" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar yAxisId="temp" dataKey="tempMin" name={t("dash.tempMin")} fill="#8cc7a0" radius={[4, 4, 0, 0]} barSize={14} />
                  <Line yAxisId="rain" type="monotone" dataKey="rainChance" name={t("dash.rainChance")} stroke="#2c5373" strokeWidth={2.5} dot={{ r: 3, fill: "#2c5373" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop health index */}
          <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
              <Activity className="h-5 w-5 text-leaf-600" aria-hidden /> {t("dash.healthChart")}
            </h3>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cropHealthTrend} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#379c4f" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#379c4f" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <Tooltip />
                  <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                  <Area type="monotone" dataKey="health" name={t("dash.healthIndex")} stroke="#379c4f" strokeWidth={3} fill="url(#healthFill)" activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health breakdown */}
          <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
              <PieChartIcon className="h-5 w-5 text-navy-500" aria-hidden /> {t("dash.healthBreakdown")}
            </h3>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={4} stroke="#ffffff" strokeWidth={2}>
                    {statusBreakdown.map((s) => (
                      <Cell key={s.name} fill={statusColor[s.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, statusLabel[String(name)]]} />
                  <Legend
                    formatter={(v) => (
                      <span className="text-sm font-semibold text-navy-800">{statusLabel[String(v)] ?? v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water usage */}
          <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
              <Droplet className="h-5 w-5 text-sun-600" aria-hidden /> {t("dash.waterChart")}
            </h3>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterRecords} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <Tooltip />
                  <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                  <Bar dataKey="liters" name={t("dash.liters")} fill="#379c4f" radius={[6, 6, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detection confidence */}
          <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
              <LayoutDashboard className="h-5 w-5 text-leaf-600" aria-hidden /> {t("dash.confidenceChart")}
            </h3>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={cropConfidence} margin={{ top: 5, right: 24, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dce8f2" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <YAxis type="category" dataKey="name" width={64} tick={{ fontSize: 12, fill: "#2c5373" }} />
                  <Tooltip />
                  <Legend formatter={(v) => <span className="text-sm font-semibold text-navy-800">{v}</span>} />
                  <Bar dataKey="confidence" name={t("common.confidence")} fill="#379c4f" radius={[0, 6, 6, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Farm map */}
      <div className="mt-6 rounded-3xl border border-navy-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-navy-900">{t("dash.farmMap")}</h2>
          <span className="text-sm text-navy-500">{t("dash.mapHint")}</span>
        </div>
        <FarmMap selected={selected} onSelect={setSelected} />
      </div>
    </div>
  )
}

function FarmMap({
  selected,
  onSelect,
}: {
  selected: SensorLocation | null
  onSelect: (loc: SensorLocation | null) => void
}) {
  const { t } = useLanguage()
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <div className="relative mx-auto w-full max-w-xl lg:col-span-2">
        <svg viewBox="0 0 520 300" className="w-full rounded-2xl border border-navy-100 bg-leaf-50">
          {/* plot sections */}
          <rect x="10" y="14" width="240" height="180" rx="14" fill="#dff3e2" stroke="#379c4f" strokeWidth="2" />
          <rect x="262" y="14" width="248" height="180" rx="14" fill="#bfe6c7" stroke="#379c4f" strokeWidth="2" />
          <rect x="10" y="206" width="500" height="82" rx="14" fill="#8cd29b" stroke="#379c4f" strokeWidth="2" />

          <text x="30" y="36" fontSize="12" fontWeight="700" fill="#287f3e">East Plot</text>
          <text x="282" y="36" fontSize="12" fontWeight="700" fill="#287f3e">North Plot</text>
          <text x="30" y="228" fontSize="12" fontWeight="700" fill="#287f3e">West Plot</text>

          {/* soil row lines */}
          <g stroke="#5cb871" strokeWidth="1.5" opacity="0.5">
            {[100, 155].map((y) => (
              <line key={`l1-${y}`} x1="14" y1={y} x2="246" y2={y} />
            ))}
            {[100, 155].map((y) => (
              <line key={`l2-${y}`} x1="266" y1={y} x2="506" y2={y} />
            ))}
            {[246, 268].map((y) => (
              <line key={`l3-${y}`} x1="14" y1={y} x2="506" y2={y} />
            ))}
          </g>

          {sensorLocations.map((loc) => {
            const px = (loc.x / 100) * 520
            const py = (loc.y / 100) * 300
            const active = selected?.id === loc.id
            const color = loc.status === "ok" ? "#287f3e" : loc.status === "warning" ? "#ed900d" : "#dc2626"
            return (
              <g key={loc.id} onClick={() => onSelect(loc)} className="cursor-pointer">
                <circle cx={px} cy={py} r={active ? 16 : 11} fill={color} opacity="0.2" />
                <circle cx={px} cy={py} r={active ? 9 : 6} fill={color} stroke="#fff" strokeWidth="2" />
              </g>
            )
          })}

          {/* weather station marker */}
          <g transform="translate(30 70)" onClick={() => onSelect(sensorLocations[4])} className="cursor-pointer">
            <rect x="-4" y="0" width="8" height="22" rx="2" fill="#2c5373" />
            <circle cx="0" cy="-4" r="6" fill="#35678e" />
          </g>
        </svg>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-navy-500">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-leaf-600" /> OK</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-sun-600" /> {t("dash.irrigationAlert")}</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-600" /> Critical</span>
        </div>
      </div>

      <div className="rounded-2xl border border-navy-100 bg-white p-4">
        {selected ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{t("dash.farmMap")}</p>
            <h3 className="mt-1 flex items-center gap-1.5 font-semibold text-navy-900">
              <MapPin className="h-4 w-4 text-leaf-600" aria-hidden /> {selected.name}
            </h3>
            {selected.moisture > 0 ? (
              <>
                <div className="mt-3 flex items-end justify-between">
                  <p className="font-display text-3xl font-bold text-navy-900">{selected.moisture}%</p>
                  <Badge tone={selected.status === "ok" ? "green" : "yellow"}>
                    {selected.moisture >= 35 ? "OK" : selected.moisture >= 25 ? "Low" : "Very Low"}
                  </Badge>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                  <div
                    className={`h-full rounded-full ${selected.moisture >= 35 ? "bg-leaf-500" : "bg-sun-500"}`}
                    style={{ width: `${Math.min(100, selected.moisture)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-navy-500">{t("dash.moisture")}</p>
              </>
            ) : (
              <p className="mt-3 text-sm text-navy-600">Weather station — reports temperature, wind and humidity every 5 minutes.</p>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-navy-500">👆 {t("dash.mapHint")}</p>
        )}
        <DropletOffNote />
      </div>
    </div>
  )
}

function DropletOffNote() {
  const { t } = useLanguage()
  return (
    <p className="mt-4 flex items-start gap-1.5 rounded-xl bg-sun-50 p-3 text-xs text-sun-800">
      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
      {t("dash.sensorOffline")}
    </p>
  )
}