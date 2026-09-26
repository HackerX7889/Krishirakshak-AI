import { seedSensors, seedTelemetry } from "../seed.js"

interface SensorReading {
  key: string
  value: number
  unit: string
  icon: string
  ideal: string
  status: string
  trend: string
}

export function listSensors(): SensorReading[] {
  return seedSensors.map((s) => ({ ...s }))
}

export function telemetry(period: "daily" | "weekly" | "monthly") {
  return (seedTelemetry[period] ?? seedTelemetry.daily).map((p) => ({ ...p }))
}