export type Language = "en" | "hi" | "mr" | "bn" | "te" | "ta" | "kn" | "gu" | "pa"

export type SensorStatus = "ok" | "warning" | "critical"

export type Trend = "up" | "down" | "stable"

export interface SensorReading {
  id: string
  key: string
  value: number
  unit: string
  icon: string
  ideal: string
  status: SensorStatus
  trend: Trend
}

export interface TimeSeriesPoint {
  time: string
  moisture: number
  temperature: number
}

export interface WeatherForecast {
  day: string
  dayKey: string
  tempMax: number
  tempMin: number
  condition: "sunny" | "partly" | "rain" | "cloudy" | "storm"
  rainChance: number
  windSpeed: number
}

export type WeatherAlertType = "heavy-rain" | "heatwave" | "frost" | "pest" | "drought"

export interface WeatherAlert {
  id: string
  type: WeatherAlertType
  title: string
  message: string
  severity: "info" | "warning" | "critical"
  time: string
}

export interface DiseaseResult {
  cropName: string
  diseaseName: string
  confidence: number
  status: "healthy" | "diseased" | "warning"
  symptoms: string[]
  treatment: string
  prevention: string[]
  scannedAt: string
  fertilizer?: string
}

export type StageType = "seedling" | "vegetative" | "flowering" | "fruiting" | "maturity"

export interface CropEntry {
  id: string
  name: string
  variety: string
  plantingDate: string
  location: string
  soilType: string
  growthStage: StageType
  stageProgress: number
  notes: { id: string; text: string; date: string }[]
  reminders: { id: string; text: string; date: string; done: boolean }[]
  waterUsed: number
  expectedHarvest: string
}

export interface WaterRecord {
  date: string
  liters: number
}

export interface DetectionRecord {
  id: string
  date: string
  crop: string
  result: string
  status: "healthy" | "diseased" | "warning"
  confidence: number
}

export interface UserProfile {
  name: string
  mobile: string
  email: string
  location: string
  state: string
  farmSize: string
  cropType: string
  language: Language
  farmName: string
  lat?: number
  lon?: number
}

export interface SensorLocation {
  id: string
  name: string
  x: number
  y: number
  moisture: number
  status: SensorStatus
}

export interface Farm {
  name: string
  area: string
  crop: string
  irrigationType: string
  waterSaved: number
  sensorsConnected: number
}