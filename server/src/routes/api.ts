import { Router } from "express"
import type { RequestHandler } from "express"
import { asyncHandler } from "../asyncHandler.js"
import { ApiError } from "../errors.js"
import { requireAuth, type AuthRequest } from "../middleware/auth.js"
import { listSensors, telemetry } from "../services/sensors.js"
import { analyzeScan, getScans, saveScan } from "../services/scan.js"
import { analyzeCropImage, isAiConfigured } from "../services/ai.js"
import { reply } from "../services/assistant.js"

export const apiRouter = Router()

const scanHandler: RequestHandler = asyncHandler(async (req, res) => {
  const { userId } = req as AuthRequest
  const b = (req.body ?? {}) as Record<string, unknown>
  const sample = b.sample === "sample1" || b.sample === "sample2" || b.sample === "sample3" ? b.sample : undefined
  const crop = typeof b.crop === "string" && b.crop.trim() ? b.crop.trim() : undefined
  const image = typeof b.image === "string" && b.image.trim() ? b.image.trim() : undefined

  if (image && isAiConfigured()) {
    const match = image.match(/^data:(image\/(?:jpeg|png|webp|gif|bmp));base64,(.+)$/i)
    const result = await analyzeCropImage({
      imageBase64: match ? match[2] : image,
      mimeType: match ? match[1].toLowerCase() : "image/jpeg",
      crop,
      language: typeof b.lang === "string" ? b.lang : undefined,
    })
    saveScan(userId!, result)
    res.json({ result, source: "ai" })
    return
  }

  const result = analyzeScan({ sample, crop })
  saveScan(userId!, result)
  res.json({ result, source: "mock" })
})

const scanHistory: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  res.json({ scans: getScans(userId!) })
}

const sensorsHandler: RequestHandler = (_req, res) => {
  res.json({ sensors: listSensors() })
}

const telemetryHandler: RequestHandler = (req, res) => {
  const period = req.query.period === "weekly" || req.query.period === "monthly" ? req.query.period : "daily"
  res.json({ period, points: telemetry(period) })
}

const assistantHandler: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const q = typeof req.query.q === "string" ? req.query.q : ""
  if (!q.trim()) throw new ApiError(400, "Missing query param: q")
  res.json({ reply: reply(userId!, q) })
}

apiRouter.use(requireAuth)
apiRouter.get("/sensors", sensorsHandler)
apiRouter.get("/telemetry", telemetryHandler)
apiRouter.post("/scan", scanHandler)
apiRouter.get("/scans", scanHistory)
apiRouter.get("/assistant", assistantHandler)