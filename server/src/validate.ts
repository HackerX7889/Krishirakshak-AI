import { ApiError } from "./errors.js"

export function requireBodyFields(body: unknown, fields: string[]): Record<string, unknown> {
  if (!body || typeof body !== "object") throw new ApiError(400, "JSON body required")
  const b = body as Record<string, unknown>
  for (const f of fields) {
    const v = b[f]
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      throw new ApiError(400, `Missing required field: ${f}`)
    }
  }
  return b
}

export function optionalString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

export function optionalNumber(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}