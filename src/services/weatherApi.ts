/**
 * Open-Meteo integration — free weather API, no key required.
 * Docs: https://open-meteo.com/en/docs
 *
 * Falls back to the bundled mock data whenever the network request fails,
 * so the prototype keeps working offline (see Advisory page).
 *
 * Configure the farm location in `.env` (VITE_FARM_LAT / VITE_FARM_LON)
 * or the URL via VITE_WEATHER_API_URL — see `.env.example`.
 */

import { currentWeather as mockCurrent, weatherForecast as mockForecast } from "../data/mockData"
import type { WeatherForecast } from "../types"

const FORECAST_URL =
  (import.meta.env.VITE_WEATHER_API_URL as string | undefined) ?? "https://api.open-meteo.com/v1/forecast"

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search"

export interface PlaceHit {
  name: string
  state?: string
  country?: string
  lat: number
  lon: number
}

export interface WeatherSnapshot {
  current: {
    temperature: number
    condition: WeatherForecast["condition"]
    rainChance: number
    wind: number
    humidity: number
    location: string
  }
  forecast: WeatherForecast[]
}

export interface FarmCoordinates {
  lat: number
  lon: number
  label: string
}

/** Farm position from env vars (defaults to Akola, Maharashtra). */
export function farmCoordinates(): FarmCoordinates {
  const lat = Number(import.meta.env.VITE_FARM_LAT ?? 20.435)
  const lon = Number(import.meta.env.VITE_FARM_LON ?? 77.091)
  return { lat, lon, label: "Akola, Maharashtra" }
}

/** Resolve a place name to coordinates via the Open-Meteo geocoding API. */
export async function searchLocation(query: string): Promise<PlaceHit | null> {
  const params = new URLSearchParams({ name: query, count: "1", language: "en", format: "json" })
  const res = await fetch(`${GEO_URL}?${params.toString()}`)
  if (!res.ok) throw new Error(`Open-Meteo geocoding failed (${res.status})`)
  const data = await res.json()
  const hit = data.results?.[0]
  return hit
    ? { name: hit.name, state: hit.admin1, country: hit.country, lat: hit.latitude, lon: hit.longitude }
    : null
}

/** Map WMO weather codes to the app's compact condition set. */
export function wmoToCondition(code: number): WeatherForecast["condition"] {
  if (code === 0) return "sunny" // clear sky
  if (code === 1 || code === 2) return "partly" // mainly clear / partly cloudy
  if (code === 3) return "cloudy" // overcast
  if (code >= 45 && code <= 48) return "cloudy" // fog
  if (code >= 51 && code <= 67) return "rain" // drizzle + rain
  if (code >= 71 && code <= 77) return "rain" // snow (rare for this region)
  if (code >= 80 && code <= 82) return "rain" // rain showers
  if (code >= 85 && code <= 86) return "rain" // snow showers
  if (code >= 95) return "storm" // thunderstorm / hail
  return "partly"
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** Fetch a live weather snapshot for a location from Open-Meteo. */
export async function fetchWeatherSnapshot(coords: FarmCoordinates): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto",
    forecast_days: "7",
  })

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!res.ok) throw new Error(`Open-Meteo request failed (${res.status})`)

  const data = await res.json()
  const current = data.current ?? {}
  const daily = data.daily ?? { time: [] }

  const forecast: WeatherForecast[] = (daily.time as string[]).map((date: string, i: number) => {
    const d = new Date(date + "T00:00:00")
    return {
      day: WEEKDAYS[d.getUTCDay() % 7],
      dayKey: DAY_KEYS[d.getUTCDay() % 7],
      tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 0),
      condition: wmoToCondition(daily.weather_code?.[i] ?? 0),
      rainChance: daily.precipitation_probability_max?.[i] ?? 0,
      windSpeed: Math.round(daily.wind_speed_10m_max?.[i] ?? 0),
    }
  })

  return {
    current: {
      temperature: Math.round(current.temperature_2m ?? 0),
      condition: wmoToCondition(current.weather_code ?? 0),
      rainChance: daily.precipitation_probability_max?.[0] ?? 0,
      wind: Math.round(current.wind_speed_10m ?? 0),
      humidity: Math.round(current.relative_humidity_2m ?? 0),
      location: coords.label,
    },
    forecast,
  }
}

/** Static snapshot built from mock data — used as an offline fallback. */
export function mockWeatherSnapshot(location?: string): WeatherSnapshot {
  return {
    current: {
      temperature: mockCurrent.temperature,
      condition: mockCurrent.condition as WeatherForecast["condition"],
      rainChance: mockCurrent.rainChance,
      wind: mockCurrent.wind,
      humidity: mockCurrent.humidity,
      location: location || mockCurrent.location,
    },
    forecast: mockForecast,
  }
}