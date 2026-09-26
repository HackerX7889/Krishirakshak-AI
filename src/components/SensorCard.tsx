import { Droplets, Thermometer, CloudRain, Sun, FlaskConical, Warehouse, Leaf } from "lucide-react"
import type { SensorReading } from "../types"
import Badge from "./Badge"

const iconMap: Record<string, typeof Droplets> = {
  droplets: Droplets,
  thermometer: Thermometer,
  cloudRain: CloudRain,
  sun: Sun,
  flaskConical: FlaskConical,
  warehouse: Warehouse,
  leaf: Leaf,
}

const statusToTone = { ok: "green", warning: "yellow", critical: "red" } as const

function formatValue(value: number, unit: string) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K${unit}`
  return `${value}${unit}`
}

export default function SensorCard({ sensor, label }: { sensor: SensorReading; label: string }) {
  const Icon = iconMap[sensor.icon] ?? Leaf
  const tone = statusToTone[sensor.status]

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg[tone]}`}>
          <Icon className={`h-6 w-6 ${iconColor[tone]}`} aria-hidden />
        </div>
        <Badge tone={tone}>{sensor.status === "ok" ? "OK" : sensor.status === "warning" ? "Low" : "Critical"}</Badge>
      </div>
      <p className="mt-3 text-sm font-medium text-navy-500">{label}</p>
      <p className="mt-0.5 font-display text-2xl font-bold text-navy-900">{formatValue(sensor.value, sensor.unit)}</p>
      <p className="mt-1 text-xs text-navy-400">Ideal: {sensor.ideal}</p>
    </div>
  )
}

const iconBg: Record<string, string> = {
  green: "bg-leaf-100",
  yellow: "bg-sun-100",
  red: "bg-red-100",
}

const iconColor: Record<string, string> = {
  green: "text-leaf-700",
  yellow: "text-sun-700",
  red: "text-red-600",
}