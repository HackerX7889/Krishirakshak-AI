import { Router } from "express"
import type { RequestHandler } from "express"
import { db } from "../db.js"
import { requireAuth, type AuthRequest } from "../middleware/auth.js"

export const reportsRouter = Router()
reportsRouter.use(requireAuth)

const reports: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const water = db
    .prepare("SELECT month, liters FROM water_records WHERE user_id = ? ORDER BY id ASC")
    .all(userId!) as Array<{ month: string; liters: number }>
  const detections = db
    .prepare("SELECT date, crop, result, status, confidence FROM detection_records WHERE user_id = ? ORDER BY date DESC")
    .all(userId!) as Array<{ date: string; crop: string; result: string; status: string; confidence: number }>
  const { totalWater } = db
    .prepare("SELECT COALESCE(SUM(liters), 0) AS totalWater FROM water_records WHERE user_id = ?")
    .get(userId!) as { totalWater: number }

  const healthy = detections.filter((d) => d.status === "healthy").length
  const diseased = detections.filter((d) => d.status === "diseased").length

  res.json({
    water,
    detections,
    summary: {
      totalWater,
      healthyScans: healthy,
      diseasedScans: diseased,
      totalScans: detections.length,
    },
  })
}

reportsRouter.get("/", reports)