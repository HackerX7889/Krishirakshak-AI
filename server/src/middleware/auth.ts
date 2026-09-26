import jwt, { type SignOptions } from "jsonwebtoken"
import type { NextFunction, Request, Response } from "express"
import { env } from "../env.js"
import { ApiError } from "../errors.js"
import { db } from "../db.js"

export interface AuthRequest extends Request {
  userId?: number
}

export function signToken(userId: number): string {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] }
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, options)
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) throw new ApiError(401, "Missing bearer token")
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as { sub?: string }
    if (!payload.sub) throw new Error("no sub")
    req.userId = Number(payload.sub)
    next()
  } catch {
    throw new ApiError(401, "Invalid or expired token")
  }
}

export function getUser(userId: number): Record<string, unknown> {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as
    | (Record<string, unknown> & { password_hash: string })
    | undefined
  if (!row) throw new ApiError(404, "User not found")
  const { password_hash: _ph, ...safe } = row
  return safe
}