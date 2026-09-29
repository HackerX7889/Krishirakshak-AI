/**
 * Crop analysis client.
 *
 * Posts the leaf photo to this app's own API (`/api/ai/analyze`), which holds
 * the vision-model key server-side (see server/src/services/ai.ts). If the API
 * is not running, or the server has no AI key configured, the call falls back to
 * the bundled sample results so the prototype still works offline.
 *
 * Configure: VITE_API_BASE_URL (blank = same origin), VITE_AI_MAX_EDGE,
 * VITE_AI_IMAGE_QUALITY — see `.env.example`.
 */

import { diseaseSamples } from "../data/mockData"
import type { DiseaseResult, Language } from "../types"

const BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "").replace(/\/+$/, "")
const MAX_EDGE = Number(import.meta.env.VITE_AI_MAX_EDGE ?? 1024)
const QUALITY = Number(import.meta.env.VITE_AI_IMAGE_QUALITY ?? 0.82)

export type AnalysisSource = "ai" | "mock"

export interface AnalysisOutcome {
  result: DiseaseResult & { severity?: string; advice?: string }
  source: AnalysisSource
  model?: string | null
  notice?: string
}

export interface AiStatus {
  configured: boolean
  model: string | null
}

/** Ask the server whether a real vision model is wired up. */
export async function fetchAiStatus(): Promise<AiStatus> {
  try {
    const res = await fetch(`${BASE}/api/ai/status`)
    if (!res.ok) return { configured: false, model: null }
    const data = (await res.json()) as Partial<AiStatus>
    return { configured: Boolean(data.configured), model: data.model ?? null }
  } catch {
    return { configured: false, model: null }
  }
}

/**
 * Shrink the photo before upload: model APIs bill by tokens and most vision
 * models downscale internally anyway, so this cuts latency and cost.
 */
export async function prepareImage(dataUrl: string): Promise<{ base64: string; mimeType: string }> {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/i)
  if (!match) return { base64: dataUrl, mimeType: "image/jpeg" }

  const img = await loadImage(dataUrl)
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) return { base64: match[2], mimeType: match[1] }
  ctx.drawImage(img, 0, 0, w, h)

  const out = canvas.toDataURL("image/jpeg", QUALITY)
  const outMatch = out.match(/^data:(image\/[a-z+]+);base64,(.+)$/i)
  return outMatch
    ? { base64: outMatch[2], mimeType: outMatch[1] }
    : { base64: match[2], mimeType: match[1] }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Could not read the selected image"))
    img.src = src
  })
}

function localFallback(crop?: string): AnalysisOutcome {
  const sample = diseaseSamples.sample2
  return {
    result: crop ? { ...sample, cropName: crop } : sample,
    source: "mock",
    notice: "AI unavailable — showing sample result",
  }
}

export interface AnalyzeOptions {
  imageDataUrl?: string
  crop?: string
  lang?: Language
  location?: string
  sample?: keyof typeof diseaseSamples
}

/**
 * Analyze a crop photo. `sample` short-circuits to the bundled demo result so
 * the "Try a sample" buttons keep working without any network call.
 */
export async function analyzeCrop(options: AnalyzeOptions): Promise<AnalysisOutcome> {
  if (options.sample && diseaseSamples[options.sample]) {
    return { result: diseaseSamples[options.sample], source: "mock" }
  }
  if (!options.imageDataUrl) return localFallback(options.crop)

  try {
    const { base64, mimeType } = await prepareImage(options.imageDataUrl)
    const res = await fetch(`${BASE}/api/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: `data:${mimeType};base64,${base64}`,
        crop: options.crop,
        lang: options.lang,
        location: options.location,
      }),
    })

    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(detail.error ?? `Analysis failed (${res.status})`)
    }

    const data = (await res.json()) as { result?: AnalysisOutcome["result"]; source?: AnalysisSource; model?: string; notice?: string }
    if (!data.result) throw new Error("Empty response from analysis API")

    return {
      result: data.result,
      source: data.source === "ai" ? "ai" : "mock",
      model: data.model ?? null,
      notice: data.notice,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed"
    return { ...localFallback(options.crop), notice: message }
  }
}
