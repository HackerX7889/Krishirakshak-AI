import { Router } from "express"
import type { RequestHandler } from "express"
import { db } from "../db.js"
import { ApiError } from "../errors.js"
import { requireAuth, signToken, getUser, type AuthRequest } from "../middleware/auth.js"
import { hashPassword, verifyPassword } from "../services/passwords.js"
import { requireBodyFields } from "../validate.js"

const MOBILE_RE = /^[0-9]{10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const authRouter = Router()

const register: RequestHandler = (req, res) => {
  const b = requireBodyFields(req.body, ["name", "mobile", "password"])
  if (!MOBILE_RE.test(String(b.mobile))) throw new ApiError(400, "Mobile number must be 10 digits")
  if (String(b.password).length < 6) throw new ApiError(400, "Password must be at least 6 characters")

  const email = b.email ? String(b.email).trim().toLowerCase() : null
  if (email && !EMAIL_RE.test(email)) throw new ApiError(400, "Invalid email address")

  const existing = db.prepare("SELECT id FROM users WHERE mobile = ? OR email = ?").get(String(b.mobile), email ?? "") as
    | { id: number }
    | undefined
  if (existing) throw new ApiError(409, "An account with that mobile or email already exists")

  const info = db
    .prepare(
      `INSERT INTO users (name, mobile, email, password_hash, location, state, farm_size, crop_type, language, farm_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      String(b.name).trim(),
      String(b.mobile),
      email,
      hashPassword(String(b.password)),
      "Akola Village",
      "Maharashtra",
      "2",
      "Wheat",
      "en",
      "Loganagri Farm"
    )
  const user = getUser(Number(info.lastInsertRowid))
  res.status(201).json({ token: signToken(Number(info.lastInsertRowid)), user })
}

const login: RequestHandler = (req, res) => {
  const b = requireBodyFields(req.body, ["mobile", "password"])
  const row = db.prepare("SELECT * FROM users WHERE mobile = ?").get(String(b.mobile)) as
    | (Record<string, unknown> & { id: number; password_hash: string })
    | undefined
  if (!row || !verifyPassword(String(b.password), row.password_hash)) {
    throw new ApiError(401, "Invalid mobile or password")
  }
  const { password_hash: _ph, ...safe } = row
  res.json({ token: signToken(row.id), user: safe })
}

const me: RequestHandler = (req, res) => {
  const { userId } = req as AuthRequest
  res.json({ user: getUser(userId!) })
}

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/me", requireAuth, me)