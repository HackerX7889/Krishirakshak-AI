import express from "express"
import type { NextFunction, Request, Response } from "express"
import { env } from "./env.js"
import { ApiError } from "./errors.js"
import { seedDatabaseIfEmpty } from "./seed.js"
import { authRouter } from "./routes/auth.js"
import { farmRouter } from "./routes/farm.js"
import { apiRouter } from "./routes/api.js"
import { weatherRouter } from "./routes/weather.js"
import { reportsRouter } from "./routes/reports.js"

const app = express()
app.disable("x-powered-by")
app.use(express.json({ limit: "5mb" }))

// CORS — open for the prototype (frontend runs on a different port).
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    res.sendStatus(204)
    return
  }
  next()
})

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "smart-farming-ai-server", time: new Date().toISOString() })
})

app.use("/api/auth", authRouter)
app.use("/api/farm", farmRouter)
app.use("/api/weather", weatherRouter)
app.use("/api/reports", reportsRouter)
app.use("/api", apiRouter)

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Invalid JSON body" })
    return
  }
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

const seeded = seedDatabaseIfEmpty()

app.listen(env.port, () => {
  console.log(`[smart-farming-ai-server] listening on http://localhost:${env.port}`)
  console.log(seeded ? "  seeded database with demo data (demo user: 9876543210 / demo1234)" : "  database already initialised")
})