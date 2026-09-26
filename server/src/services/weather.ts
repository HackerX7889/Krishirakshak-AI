import { env } from "../env.js"
import { seedWeather } from "../seed.js"

const CONDITION_MAP: Record<string, string> = {
  0: "clear",
  1: "partly",
  2: "partly",
  3: "cloudy",
  45: "cloudy",
  61: "rain",
  63: "rain",
  80: "rain",
  95: "storm",
}

function mapWeatherCode(code: number): string {
  return CONDITION_MAP[String(code)] ?? "clear"
}

export async function currentWeather(lat?: number, lon?: number) {
  if (!env.weatherProxy) return { ...seedWeather.current }

  const params = new URLSearchParams({
    latitude: String(lat ?? env.farmLat),
    longitude: String(lon ?? env.farmLon),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
    daily: "precipitation_probability_max",
    forecast_days: "1",
  })
  const res = await fetch(`${env.weatherApiUrl}?${params.toString()}`)
  if (!res.ok) return { ...seedWeather.current }
  const data = (await res.json()) as {
    current?: { temperature_2m: number; relative_humidity_2m: number; weather_code: number; wind_speed_10m: number }
    daily?: { precipitation_probability_max: number[] }
  }
  return {
    temperature: Math.round(data.current?.temperature_2m ?? seedWeather.current.temperature),
    condition: mapWeatherCode(data.current?.weather_code ?? 0),
    rainChance: data.daily?.precipitation_probability_max?.[0] ?? seedWeather.current.rainChance,
    wind: Math.round(data.current?.wind_speed_10m ?? seedWeather.current.wind),
    humidity: Math.round(data.current?.relative_humidity_2m ?? seedWeather.current.humidity),
    location: `Lat ${lat ?? env.farmLat}, Lon ${lon ?? env.farmLon}`,
  }
}

export async function weatherForecast(lat?: number, lon?: number) {
  if (!env.weatherProxy) return seedWeather.forecast.map((d) => ({ ...d }))

  const params = new URLSearchParams({
    latitude: String(lat ?? env.farmLat),
    longitude: String(lon ?? env.farmLon),
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto",
    forecast_days: "7",
  })
  const res = await fetch(`${env.weatherApiUrl}?${params.toString()}`)
  if (!res.ok) return seedWeather.forecast.map((d) => ({ ...d }))
  const data = (await res.json()) as {
    daily?: {
      time: string[]
      weather_code: number[]
      temperature_2m_max: number[]
      temperature_2m_min: number[]
      precipitation_probability_max: number[]
      wind_speed_10m_max: number[]
    }
  }
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  if (!data.daily) return seedWeather.forecast.map((d) => ({ ...d }))
  return data.daily.time.map((t, i) => ({
    day: days[i % 7],
    dayKey: dayKeys[i % 7],
    tempMax: Math.round(data.daily!.temperature_2m_max[i]),
    tempMin: Math.round(data.daily!.temperature_2m_min[i]),
    condition: mapWeatherCode(data.daily!.weather_code[i]),
    rainChance: data.daily!.precipitation_probability_max[i] ?? 0,
    windSpeed: Math.round(data.daily!.wind_speed_10m_max[i] ?? 0),
    date: t,
  }))
}

export async function weatherAlerts(lat?: number, lon?: number) {
  if (!env.weatherProxy) return seedWeather.alerts.map((a) => ({ ...a }))
  const fc = await weatherForecast(lat, lon)
  const alerts: Array<Record<string, string>> = []
  const rain = fc.find((d) => d.rainChance >= 70)
  if (rain) {
    alerts.push({
      id: "cfg-rain",
      type: "heavy-rain",
      title: `Heavy Rain Expected ${rain.day}`,
      message: `${rain.rainChance}% chance of rain on ${rain.day}. Delay irrigation and move equipment under cover.`,
      severity: "warning",
      time: rain.day,
    })
  }
  const hot = fc.find((d) => d.tempMax >= 40)
  if (hot) {
    alerts.push({
      id: "cfg-heat",
      type: "heatwave",
      title: "Heat Wave Warning",
      message: `Daytime temperature may reach ${hot.tempMax}°C on ${hot.day}. Provide shade and increase watering at night.`,
      severity: "critical",
      time: hot.day,
    })
  }
  if (alerts.length === 0) {
    alerts.push({
      id: "cfg-ok",
      type: "info",
      title: "No severe weather expected",
      message: "Weather looks clear for the next 7 days. Continue with your normal routine.",
      severity: "info",
      time: "This week",
    })
  }
  return alerts
}