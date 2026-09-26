/**
 * Dry-run API client for sensors, weather and AI analysis.
 *
 * Swap the bodies below with real REST / IoT calls later:
 *   - SENSOR_FEED_URL  -> WebSocket/SSE stream of soil sensors
 *   - DISEASE_API_URL  -> image-recognition inference endpoint
 *   - WEATHER_API_URL  -> weather service (lat/lon based)
 * Configuration lives in `.env` (see `.env.example`).
 */

const DELAY_MS = Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 1400)

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface SensorPayload {
  moisture: number
  temperature: number
  humidity: number
  light: number
  ph: number
  tankLevel: number
  timestamp: string
}

/** Fake live feed — replace with a real IoT fetch. */
export async function fetchLiveSensors(): Promise<SensorPayload> {
  await sleep(DELAY_MS)
  const now = new Date()
  return {
    moisture: 24 + Math.round(Math.random() * 4),
    temperature: 31 + Math.round(Math.random() * 3),
    humidity: 55 + Math.round(Math.random() * 8),
    light: 42000 + Math.round(Math.random() * 5000),
    ph: Number((6.4 + Math.random() * 0.4).toFixed(1)),
    tankLevel: 60 + Math.round(Math.random() * 9),
    timestamp: now.toLocaleTimeString("en-IN"),
  }
}

export interface DiseasePayload {
  cropName: string
  diseaseName: string
  confidence: number
  status: "healthy" | "diseased"
  symptoms: string[]
  treatment: string
  prevention: string[]
}

/** Simulated AI result — replace with a real model POST. */
export async function analyzeLeafImage(_imageDataUrl: string): Promise<DiseasePayload> {
  await sleep(DELAY_MS + 600)
  const healthy = Math.random() > 0.55
  return {
    cropName: "Tomato",
    diseaseName: healthy ? "Healthy Plant" : "Early Blight (Alternaria)",
    confidence: healthy ? 94 : 87,
    status: healthy ? "healthy" : "diseased",
    symptoms: healthy
      ? ["Uniform green leaves", "No spots or discoloration"]
      : ["Brown spots on older leaves", "Yellowing around leaf veins", "Cracking on stems"],
    treatment: healthy
      ? "Keep up your current care schedule."
      : "Spray chlorothalonil 0.2% (Protect) at first sign; repeat once after 10 days.",
    prevention: healthy
      ? ["Water at the base, not on leaves."]
      : ["Use resistant varieties.", "Space plants for air flow."],
  }
}

export interface WeatherPayload {
  temperature: number
  condition: string
  rainChance: number
  windSpeed: number
  humidity: number
  forecast: { day: string; tempMax: number; tempMin: number; condition: string; rainChance: number }[]
}

/** Mock weather service — replace with a real lat/lon API. */
export async function fetchWeather(_lat: number, _lon: number): Promise<WeatherPayload> {
  await sleep(DELAY_MS)
  return {
    temperature: 33,
    condition: "partly-cloudy",
    rainChance: 22,
    windSpeed: 9,
    humidity: 58,
    forecast: [
      { day: "Thu", tempMax: 33, tempMin: 24, condition: "sunny", rainChance: 8 },
      { day: "Fri", tempMax: 32, tempMin: 23, condition: "rain", rainChance: 75 },
      { day: "Sat", tempMax: 30, tempMin: 22, condition: "rain", rainChance: 62 },
      { day: "Sun", tempMax: 34, tempMin: 24, condition: "partly-cloudy", rainChance: 20 },
      { day: "Mon", tempMax: 36, tempMin: 25, condition: "sunny", rainChance: 5 },
      { day: "Tue", tempMax: 35, tempMin: 25, condition: "cloudy", rainChance: 14 },
      { day: "Wed", tempMax: 31, tempMin: 23, condition: "rain", rainChance: 80 },
    ],
  }
}