/**
 * AI endpoints for crop analysis.
 *
 * Mounted at /api/ai and deliberately *not* behind `requireAuth`: the SPA keeps
 * its own localStorage session, so requiring a JWT here would break the scan
 * page. The API key never leaves the server, and a small in-memory per-IP rate
 * limit keeps the model bill bounded.
 */

import { Router } from "express"
import type { Request, RequestHandler } from "express"
import { asyncHandler } from "../asyncHandler.js"
import { env } from "../env.js"
import { ApiError } from "../errors.js"
import { analyzeCropImage, isAiConfigured } from "../services/ai.js"
import { analyzeScan } from "../services/scan.js"

export const aiRouter = Router()

const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimit(req: Request): void {
  const now = Date.now()
  const key = req.ip ?? "unknown"
  const entry = hits.get(key)
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + env.aiRateWindowMs })
    if (hits.size > 500) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)
    }
    return
  }
  if (entry.count >= env.aiRateLimit) {
    const secs = Math.ceil((entry.resetAt - now) / 1000)
    throw new ApiError(429, `Too many analyses. Try again in ${secs}s.`)
  }
  entry.count += 1
}

const DATA_URL = /^data:(image\/(?:jpeg|png|webp|gif|bmp));base64,(.+)$/i

function parseImage(value: unknown): { imageBase64: string; mimeType: string } {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, "Missing field: image (base64 or data URL)")
  }
  const raw = value.trim()
  const match = raw.match(DATA_URL)
  if (match) return { mimeType: match[1].toLowerCase(), imageBase64: match[2] }
  if (raw.startsWith("data:")) {
    throw new ApiError(415, "Only JPEG, PNG, WebP, GIF or BMP photos are supported")
  }
  return { mimeType: "image/jpeg", imageBase64: raw }
}

const status: RequestHandler = (_req, res) => {
  res.json({ configured: isAiConfigured(), model: isAiConfigured() ? env.aiModel : null })
}

const analyze: RequestHandler = asyncHandler(async (req, res) => {
  rateLimit(req)

  const b = (req.body ?? {}) as Record<string, unknown>
  const image = parseImage(b.image)
  const crop = typeof b.crop === "string" && b.crop.trim() ? b.crop.trim() : undefined
  const language = typeof b.lang === "string" ? b.lang.trim() : undefined
  const location = typeof b.location === "string" && b.location.trim() ? b.location.trim() : undefined

  if (!isAiConfigured()) {
    // Graceful degradation: the SPA still gets a usable result to render.
    res.json({ result: analyzeScan({ crop }), source: "mock", notice: "AI not configured on the server" })
    return
  }

  const result = await analyzeCropImage({ ...image, crop, language, location })
  res.json({ result, source: "ai", model: env.aiModel })
})

aiRouter.get("/status", status)
aiRouter.post("/analyze", analyze)
