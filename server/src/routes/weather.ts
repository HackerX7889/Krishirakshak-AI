import { Router } from "express"
import type { RequestHandler } from "express"
import { requireAuth } from "../middleware/auth.js"
import { currentWeather, weatherAlerts, weatherForecast } from "../services/weather.js"
import { optionalNumber } from "../validate.js"

export const weatherRouter = Router()
weatherRouter.use(requireAuth)

function coords(req: { query: Record<string, unknown> }): { lat: number; lon: number } {
  const lat = optionalNumber(req.query.lat, NaN)
  const lon = optionalNumber(req.query.lon, NaN)
  return { lat: Number.isNaN(lat) ? undefined : lat, lon: Number.isNaN(lon) ? undefined : lon } as { lat: number; lon: number }
}

const current: RequestHandler = async (req, res) => {
  const c = coords(req)
  res.json({ weather: await currentWeather(c.lat, c.lon) })
}

const forecast: RequestHandler = async (req, res) => {
  const c = coords(req)
  res.json({ forecast: await weatherForecast(c.lat, c.lon) })
}

const alerts: RequestHandler = async (req, res) => {
  const c = coords(req)
  res.json({ alerts: await weatherAlerts(c.lat, c.lon) })
}

weatherRouter.get("/current", current)
weatherRouter.get("/forecast", forecast)
weatherRouter.get("/alerts", alerts)