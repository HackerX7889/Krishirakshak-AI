import { Router } from "express"
import type { RequestHandler } from "express"
import { db } from "../db.js"
import { ApiError } from "../errors.js"
import { requireAuth, type AuthRequest } from "../middleware/auth.js"
import { optionalNumber, optionalString, requireBodyFields } from "../validate.js"

export const farmRouter = Router()
farmRouter.use(requireAuth)

const farmInfo: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const user = db.prepare("SELECT farm_name, area FROM users WHERE id = ?").get(userId!) as
    | { farm_name: string; area: string | null }
    | undefined
  const { crops } = db.prepare("SELECT COUNT(*) AS crops FROM crops WHERE user_id = ?").get(userId!) as { crops: number }
  res.json({
    name: user?.farm_name ?? "My Farm",
    area: user?.area ?? "3.5 acres",
    crops,
    irrigationType: "Drip + Sprinkler",
    sensorsConnected: 14,
    waterSaved: 12850,
  })
}

const listCrops: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const crops = db.prepare("SELECT * FROM crops WHERE user_id = ? ORDER BY id ASC").all(userId!) as Array<Record<string, unknown>>
  const notes = db.prepare("SELECT id, crop_id, text, date FROM notes").all() as Array<Record<string, unknown>>
  const reminders = db.prepare("SELECT id, crop_id, text, date, done FROM reminders").all() as Array<Record<string, unknown>>
  res.json(
    crops.map((c) => ({
      id: c.id,
      name: c.name,
      variety: c.variety,
      plantingDate: c.planting_date,
      location: c.location,
      soilType: c.soil_type,
      growthStage: c.growth_stage,
      stageProgress: c.stage_progress,
      waterUsed: c.water_used,
      expectedHarvest: c.expected_harvest,
      notes: notes.filter((n) => n.crop_id === c.id).map(({ crop_id, ...n }) => n),
      reminders: reminders
        .filter((r) => r.crop_id === c.id)
        .map(({ crop_id, ...r }) => ({ ...r, done: Boolean(r.done) })),
    }))
  )
}

const createCrop: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const b = requireBodyFields(req.body, ["name"])
  const info = db
    .prepare(
      `INSERT INTO crops (user_id, name, variety, planting_date, location, soil_type, growth_stage, stage_progress, water_used, expected_harvest)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      userId!,
      optionalString(b.name),
      optionalString(b.variety),
      optionalString(b.plantingDate),
      optionalString(b.location),
      optionalString(b.soilType),
      optionalString(b.growthStage, "vegetative"),
      optionalNumber(b.stageProgress, 30),
      optionalNumber(b.waterUsed, 0),
      optionalString(b.expectedHarvest)
    )
  const row = db.prepare("SELECT * FROM crops WHERE id = ?").get(Number(info.lastInsertRowid))
  res.status(201).json({ crop: row })
}

function getOwnedCrop(userId: number, cropId: number): { id: number } {
  const row = db.prepare("SELECT id FROM crops WHERE id = ? AND user_id = ?").get(cropId, userId) as { id: number } | undefined
  if (!row) throw new ApiError(404, "Crop not found")
  return row
}

const updateCrop: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const cropId = Number(req.params.id)
  getOwnedCrop(userId!, cropId)
  const b = requireBodyFields(req.body, [])
  const sets: string[] = []
  const values: (string | number)[] = []
  const fields: Array<[string, string]> = [
    ["name", "name"],
    ["variety", "variety"],
    ["plantingDate", "planting_date"],
    ["location", "location"],
    ["soilType", "soil_type"],
    ["growthStage", "growth_stage"],
    ["expectedHarvest", "expected_harvest"],
  ]
  for (const [key, col] of fields) {
    if (b[key] !== undefined) {
      sets.push(`${col} = ?`)
      values.push(optionalString(b[key]))
    }
  }
  for (const [key, col] of [["stageProgress", "stage_progress"], ["waterUsed", "water_used"]] as Array<[string, string]>) {
    if (b[key] !== undefined) {
      sets.push(`${col} = ?`)
      values.push(optionalNumber(b[key], 0))
    }
  }
  if (sets.length === 0) throw new ApiError(400, "No fields to update")
  db.prepare(`UPDATE crops SET ${sets.join(", ")} WHERE id = ?`).run(...values, cropId)
  const row = db.prepare("SELECT * FROM crops WHERE id = ?").get(cropId)
  res.json({ crop: row })
}

const deleteCrop: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const cropId = Number(req.params.id)
  getOwnedCrop(userId!, cropId)
  db.prepare("DELETE FROM crops WHERE id = ?").run(cropId)
  res.json({ ok: true })
}

const addNote: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const cropId = Number(req.params.id)
  getOwnedCrop(userId!, cropId)
  const b = requireBodyFields(req.body, ["text"])
  const info = db.prepare("INSERT INTO notes (crop_id, text, date) VALUES (?, ?, date('now'))").run(cropId, optionalString(b.text))
  const row = db.prepare("SELECT id, crop_id, text, date FROM notes WHERE id = ?").get(Number(info.lastInsertRowid))
  res.status(201).json({ note: row })
}

const deleteNote: RequestHandler = (req, res) => {
  const noteId = Number(req.params.id)
  db.prepare("DELETE FROM notes WHERE id = ?").run(noteId)
  res.json({ ok: true })
}

const addReminder: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  const cropId = Number(req.params.id)
  getOwnedCrop(userId!, cropId)
  const b = requireBodyFields(req.body, ["text", "date"])
  const info = db
    .prepare("INSERT INTO reminders (crop_id, text, date, done) VALUES (?, ?, ?, 0)")
    .run(cropId, optionalString(b.text), optionalString(b.date))
  const row = db.prepare("SELECT id, crop_id, text, date, done FROM reminders WHERE id = ?").get(Number(info.lastInsertRowid))
  res.status(201).json({ reminder: row })
}

const patchReminder: RequestHandler = (req, res) => {
  const reminderId = Number(req.params.id)
  const b = requireBodyFields(req.body, [])
  const existing = db.prepare("SELECT done FROM reminders WHERE id = ?").get(reminderId) as { done: number } | undefined
  if (!existing) throw new ApiError(404, "Reminder not found")
  const done = typeof b.done === "boolean" ? (b.done ? 1 : 0) : existing.done
  const text = typeof b.text === "string" ? b.text : null
  db.prepare("UPDATE reminders SET done = ?, text = COALESCE(?, text) WHERE id = ?").run(done, text, reminderId)
  const row = db.prepare("SELECT id, crop_id, text, date, done FROM reminders WHERE id = ?").get(reminderId)
  res.json({ reminder: row })
}

const deleteReminder: RequestHandler = (req, res) => {
  const reminderId = Number(req.params.id)
  db.prepare("DELETE FROM reminders WHERE id = ?").run(reminderId)
  res.json({ ok: true })
}

farmRouter.get("/", farmInfo)
farmRouter.get("/crops", listCrops)
farmRouter.post("/crops", createCrop)
farmRouter.patch("/crops/:id", updateCrop)
farmRouter.delete("/crops/:id", deleteCrop)
farmRouter.post("/crops/:id/notes", addNote)
farmRouter.delete("/notes/:id", deleteNote)
farmRouter.post("/crops/:id/reminders", addReminder)
farmRouter.patch("/reminders/:id", patchReminder)
farmRouter.delete("/reminders/:id", deleteReminder)