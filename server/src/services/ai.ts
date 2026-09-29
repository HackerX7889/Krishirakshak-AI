/**
 * Crop analysis via any OpenAI-compatible vision model.
 *
 * The API key lives only in `server/.env` (AI_API_KEY) and is never sent to the
 * browser — the SPA posts the leaf photo to `POST /api/ai/analyze` and this
 * service talks to the model.
 *
 * Provider examples (set AI_BASE_URL / AI_MODEL to match):
 *   OpenAI      https://api.openai.com/v1                gpt-4o-mini
 *   Groq        https://api.open-groq.com/openai/v1      llama-3.2-11b-vision-preview
 *   OpenRouter  https://openrouter.ai/api/v1             google/gemini-2.0-flash-001
 *   Gemini compat https://generativelanguage.googleapis.com/v1beta/openai
 *
 * When AI_API_KEY is empty the service reports `configured: false` and callers
 * fall back to the bundled sample results, so the app keeps working offline.
 */

import { env } from "../env.js"
import { ApiError } from "../errors.js"
import type { ScanResult } from "./scan.js"

export interface AnalyzeInput {
  /** Raw base64 (no data: prefix). */
  imageBase64: string
  mimeType: string
  crop?: string
  language?: string
  location?: string
}

export function isAiConfigured(): boolean {
  return env.aiApiKey.trim().length > 0
}

const SYSTEM_PROMPT = [
  "You are a plant pathologist and agronomist advising smallholder farmers in India.",
  "Look at the uploaded leaf/crop photo and reply with ONE JSON object, no markdown fences, no prose.",
  "Schema:",
  '{',
  '  "cropName": string,        // crop + local name, e.g. "Tomato (Tamatar)"',
  '  "diseaseName": string,     // disease + local name, or "No Disease Found"',
  '  "status": "healthy" | "diseased" | "warning",',
  '  "confidence": number,      // 0-100 integer',
  '  "severity": "low" | "medium" | "high",',
  '  "symptoms": string[],      // 2-5 short visible signs, in the requested language',
  '  "treatment": string,       // concrete chemical/organic action with dosage per litre',
  '  "prevention": string[],    // 2-4 preventive steps',
  '  "fertilizer": string,      // one nutrient/fertilizer recommendation',
  '  "advice": string           // 1-2 sentence farmer-friendly summary',
  "}",
  "Rules: only claim what the photo supports. If the photo is not a plant, blurry or too dark,",
  'set status "warning", diseaseName "Image not clear enough to diagnose" and confidence 0.',
  "Never invent a chemical brand that does not exist; use generic active ingredients.",
].join("\n")

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  bn: "Bengali",
  te: "Telugu",
  ta: "Tamil",
  kn: "Kannada",
  gu: "Gujarati",
  pa: "Punjabi",
}

function buildUserPrompt(input: AnalyzeInput): string {
  const lang = LANGUAGE_NAMES[input.language ?? "en"] ?? "English"
  const bits = [`Write every human-readable field in ${lang}.`]
  if (input.crop) bits.push(`The farmer says this is ${input.crop} — confirm or correct it.`)
  if (input.location) bits.push(`Farm location: ${input.location}.`)
  return bits.join(" ")
}

interface ModelReply {
  cropName?: unknown
  diseaseName?: unknown
  status?: unknown
  confidence?: unknown
  severity?: unknown
  symptoms?: unknown
  treatment?: unknown
  prevention?: unknown
  fertilizer?: unknown
  advice?: unknown
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback
}

function strList(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return []
  return v
    .map((x) => str(x))
    .filter(Boolean)
    .slice(0, max)
}

function clampConfidence(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

function normalizeStatus(v: unknown, confidence: number): ScanResult["status"] {
  const s = str(v).toLowerCase()
  if (s === "healthy" || s === "diseased" || s === "warning") return s
  if (confidence <= 0) return "warning"
  return confidence >= 80 ? "diseased" : "warning"
}

/** Pull the JSON object out of a model reply that may be wrapped in fences/prose. */
export function extractJson(raw: string): ModelReply | null {
  const text = raw.trim()
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1] : text
  const start = body.indexOf("{")
  const end = body.lastIndexOf("}")
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(body.slice(start, end + 1)) as ModelReply
  } catch {
    return null
  }
}

function assertImageSize(input: AnalyzeInput): void {
  const approxBytes = Math.floor((input.imageBase64.length * 3) / 4)
  if (approxBytes > env.aiMaxImageBytes) {
    throw new ApiError(413, `Image too large (${Math.round(approxBytes / 1024)} KB). Use a smaller photo.`)
  }
  if (!/^image\/(jpeg|png|webp|gif|bmp)$/i.test(input.mimeType)) {
    throw new ApiError(415, `Unsupported image type: ${input.mimeType}`)
  }
}

export async function analyzeCropImage(input: AnalyzeInput): Promise<ScanResult> {
  if (!isAiConfigured()) {
    throw new ApiError(503, "AI is not configured on the server (set AI_API_KEY in server/.env)")
  }
  assertImageSize(input)

  const endpoint = `${env.aiBaseUrl.replace(/\/+$/, "")}/chat/completions`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), env.aiTimeoutMs)

  let res: Response
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: env.aiModel,
        max_tokens: env.aiMaxTokens,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: buildUserPrompt(input) },
              { type: "image_url", image_url: { url: `data:${input.mimeType};base64,${input.imageBase64}` } },
            ],
          },
        ],
      }),
    })
  } catch (err) {
    const reason = err instanceof Error && err.name === "AbortError" ? "timed out" : "could not be reached"
    throw new ApiError(504, `AI provider ${reason} (${endpoint})`)
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300)
    throw new ApiError(502, `AI provider error ${res.status}: ${detail}`)
  }

  const payload = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content ?? ""
  const parsed = extractJson(content)
  if (!parsed) throw new ApiError(502, "AI reply was not valid JSON")

  const confidence = clampConfidence(parsed.confidence)
  const status = normalizeStatus(parsed.status, confidence)
  const healthy = status === "healthy"

  return {
    cropName: str(parsed.cropName, "Unknown crop"),
    diseaseName: str(parsed.diseaseName, healthy ? "No Disease Found" : "Unidentified issue"),
    status,
    confidence,
    severity: str(parsed.severity, healthy ? "low" : "medium").toLowerCase(),
    symptoms: strList(parsed.symptoms, 5),
    treatment: str(parsed.treatment, "No treatment required."),
    prevention: strList(parsed.prevention, 4),
    fertilizer: str(parsed.fertilizer),
    advice: str(parsed.advice),
    scannedAt: new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date()),
  }
}
