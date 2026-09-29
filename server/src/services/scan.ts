import { db } from "../db.js"

export interface ScanInput {
  sample?: "sample1" | "sample2" | "sample3"
  crop?: string
}

export interface ScanResult {
  cropName: string
  diseaseName: string
  confidence: number
  status: "healthy" | "diseased" | "warning"
  symptoms: string[]
  treatment: string
  prevention: string[]
  scannedAt: string
  fertilizer?: string
  severity?: string
  advice?: string
}

const samples: ScanResult[] = [
  {
    cropName: "Tomato (Tamatar)",
    diseaseName: "Late Blight (Fitoftora)",
    confidence: 88,
    status: "diseased",
    symptoms: ["Dark brown spots on older leaves", "White cotton-like growth under leaves in humid weather", "Rapid spread after rain"],
    treatment: "Apply Mancozeb 75% WP at 2 g per litre of water, every 7 days for 3 rounds. Remove and destroy infected leaves.",
    prevention: ["Avoid overhead watering in the evening", "Keep proper plant spacing for air flow", "Use resistant tomato varieties next season"],
    scannedAt: "",
  },
  {
    cropName: "Rice (Dhan)",
    diseaseName: "Leaf Blast (Pyricularia)",
    confidence: 91,
    status: "diseased",
    symptoms: ["Eye-shaped grey or brown spots on leaves", "Spots spread to leaf stems in humid weather", "Decreased grain filling if untreated"],
    treatment: "Spray Tricyclazole 75% WP at 1 g per litre at first sign. Repeat after 15 days if needed.",
    prevention: ["Use blast-resistant rice varieties", "Do not over-fertilize with nitrogen", "Keep field water level at 3 - 5 cm"],
    scannedAt: "",
  },
  {
    cropName: "Wheat (Gehu)",
    diseaseName: "No Disease Found — Healthy Crop",
    confidence: 96,
    status: "healthy",
    symptoms: ["Leaves are green and uniform", "No spots, mildew, or yellowing", "Normal growth pattern"],
    treatment: "No treatment required. Continue your normal care routine.",
    prevention: ["Keep soil moisture at 45 - 60%", "Spray organic compost tea monthly"],
    scannedAt: "",
  },
]

const sampleOrder: ScanInput["sample"][] = ["sample1", "sample2", "sample3"]

let cursor = 0

export function analyzeScan(input: ScanInput): ScanResult {
  let idx = sampleOrder.indexOf(input.sample ?? "sample1")
  if (idx < 0) {
    idx = cursor % samples.length
    cursor += 1
  }
  const base = samples[idx]
  return {
    ...base,
    cropName: input.crop ? `${input.crop}` : base.cropName,
    scannedAt: new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date()),
  }
}

export function saveScan(userId: number, result: ScanResult): void {
  db.prepare(
    `INSERT INTO scans (user_id, crop, disease, status, confidence, symptoms, treatment, prevention)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    userId,
    result.cropName,
    result.diseaseName,
    result.status,
    result.confidence,
    JSON.stringify(result.symptoms),
    result.treatment,
    JSON.stringify(result.prevention)
  )
}

export function getScans(userId: number): ScanResult[] {
  const rows = db
    .prepare("SELECT * FROM scans WHERE user_id = ? ORDER BY id DESC LIMIT 20")
    .all(userId) as Array<Record<string, unknown>>
  return rows.map((r) => ({
    cropName: String(r.crop),
    diseaseName: String(r.disease),
    confidence: Number(r.confidence),
    status: String(r.status) as ScanResult["status"],
    symptoms: JSON.parse(String(r.symptoms ?? "[]")),
    treatment: String(r.treatment ?? ""),
    prevention: JSON.parse(String(r.prevention ?? "[]")),
    scannedAt: String(r.scanned_at),
  }))
}