import { db } from "./db.js"
import { hashPassword } from "./services/passwords.js"

export const seedSensors = [
  { key: "dash.moisture", value: 24, unit: "%", icon: "droplets", ideal: "45 - 60%", status: "warning", trend: "down" },
  { key: "dash.temperature", value: 34, unit: "°C", icon: "thermometer", ideal: "15 - 30°C", status: "warning", trend: "up" },
  { key: "dash.humidity", value: 62, unit: "%", icon: "cloudRain", ideal: "50 - 80%", status: "ok", trend: "stable" },
  { key: "dash.light", value: 48000, unit: "lux", icon: "sun", ideal: "> 40000 lux", status: "ok", trend: "up" },
  { key: "dash.ph", value: 6.8, unit: "pH", icon: "flaskConical", ideal: "6.0 - 7.5", status: "ok", trend: "stable" },
  { key: "dash.tank", value: 62, unit: "%", icon: "warehouse", ideal: "> 50%", status: "ok", trend: "down" },
  { key: "dash.cropHealth", value: 78, unit: "pts", icon: "leaf", ideal: "Healthy", status: "warning", trend: "stable" },
]

export const seedTelemetry = {
  daily: [
    { time: "06:00", moisture: 38, temperature: 22 },
    { time: "08:00", moisture: 35, temperature: 25 },
    { time: "10:00", moisture: 33, temperature: 28 },
    { time: "12:00", moisture: 30, temperature: 32 },
    { time: "14:00", moisture: 27, temperature: 34 },
    { time: "16:00", moisture: 25, temperature: 35 },
    { time: "18:00", moisture: 24, temperature: 33 },
    { time: "20:00", moisture: 24, temperature: 29 },
    { time: "22:00", moisture: 26, temperature: 26 },
  ],
  weekly: [
    { time: "Mon", moisture: 42, temperature: 28 },
    { time: "Tue", moisture: 38, temperature: 30 },
    { time: "Wed", moisture: 31, temperature: 33 },
    { time: "Thu", moisture: 26, temperature: 34 },
    { time: "Fri", moisture: 33, temperature: 31 },
    { time: "Sat", moisture: 40, temperature: 29 },
    { time: "Sun", moisture: 24, temperature: 34 },
  ],
  monthly: [
    { time: "Jun", moisture: 55, temperature: 30 },
    { time: "Jul", moisture: 48, temperature: 28 },
    { time: "Aug", moisture: 35, temperature: 30 },
    { time: "Sep", moisture: 30, temperature: 32 },
    { time: "Oct", moisture: 26, temperature: 33 },
    { time: "Nov", moisture: 34, temperature: 29 },
  ],
}

export const seedWeather = {
  current: { temperature: 34, condition: "partly", rainChance: 20, wind: 12, humidity: 62, location: "Akola, Maharashtra" },
  forecast: [
    { day: "Mon", dayKey: "mon", tempMax: 35, tempMin: 24, condition: "sunny", rainChance: 10, windSpeed: 9 },
    { day: "Tue", dayKey: "tue", tempMax: 34, tempMin: 24, condition: "partly", rainChance: 20, windSpeed: 12 },
    { day: "Wed", dayKey: "wed", tempMax: 32, tempMin: 23, condition: "rain", rainChance: 75, windSpeed: 18 },
    { day: "Thu", dayKey: "thu", tempMax: 30, tempMin: 22, condition: "rain", rainChance: 65, windSpeed: 15 },
    { day: "Fri", dayKey: "fri", tempMax: 33, tempMin: 23, condition: "cloudy", rainChance: 30, windSpeed: 10 },
    { day: "Sat", dayKey: "sat", tempMax: 36, tempMin: 25, condition: "sunny", rainChance: 5, windSpeed: 8 },
    { day: "Sun", dayKey: "sun", tempMax: 37, tempMin: 26, condition: "sunny", rainChance: 5, windSpeed: 7 },
  ],
  alerts: [
    { id: "a1", type: "heavy-rain", title: "Heavy Rain Expected Tonight", message: "Rainfall ~30 mm expected after 9 PM. Delay irrigation and move equipment under cover.", severity: "warning", time: "Tonight, 9 PM" },
    { id: "a2", type: "heatwave", title: "Heat Wave Warning — 4 Days", message: "Daytime temperatures may cross 40°C. Provide shade and increase watering at night.", severity: "critical", time: "Starts Saturday" },
    { id: "a3", type: "pest", title: "Fall Armyworm Risk High", message: "Risk of fall armyworm in corn. Scout fields and use pheromone traps this week.", severity: "warning", time: "This week" },
    { id: "a4", type: "drought", title: "Low Rainfall This Month", message: "Monthly rainfall is 40% below normal. Save water and follow drip irrigation advice.", severity: "info", time: "This month" },
  ],
}

export const seedScans = [
  {
    crop: "Tomato", disease: "Late Blight (Fitoftora)", status: "diseased", confidence: 88,
    symptoms: ["Dark brown spots on older leaves", "White cotton-like growth under leaves in humid weather", "Rapid spread after rain"],
    treatment: "Apply Mancozeb 75% WP at 2 g per litre of water, every 7 days for 3 rounds. Remove and destroy infected leaves.",
    prevention: ["Avoid overhead watering in the evening", "Keep proper plant spacing for air flow", "Use resistant tomato varieties next season"],
  },
  {
    crop: "Rice", disease: "Leaf Blast (Pyricularia)", status: "diseased", confidence: 91,
    symptoms: ["Eye-shaped grey or brown spots on leaves", "Spots spread to leaf stems in humid weather", "Decreased grain filling if untreated"],
    treatment: "Spray Tricyclazole 75% WP at 1 g per litre at first sign. Repeat after 15 days if needed.",
    prevention: ["Use blast-resistant rice varieties", "Do not over-fertilize with nitrogen", "Keep field water level at 3 - 5 cm"],
  },
  {
    crop: "Wheat", disease: "No Disease Found — Healthy Crop", status: "healthy", confidence: 96,
    symptoms: ["Leaves are green and uniform", "No spots, mildew, or yellowing", "Normal growth pattern"],
    treatment: "No treatment required. Continue your normal care routine.",
    prevention: ["Keep soil moisture at 45 - 60%", "Spray organic compost tea monthly"],
  },
]

export const seedWaterRecords = [
  { month: "Jun", liters: 1200 },
  { month: "Jul", liters: 1100 },
  { month: "Aug", liters: 850 },
  { month: "Sep", liters: 620 },
  { month: "Oct", liters: 760 },
  { month: "Nov", liters: 540 },
]

export const seedDetectionRecords = [
  { date: "2026-09-12", crop: "Tomato", result: "Late Blight", status: "diseased", confidence: 88 },
  { date: "2026-09-05", crop: "Rice", result: "Leaf Blast", status: "diseased", confidence: 91 },
  { date: "2026-08-28", crop: "Wheat", result: "Healthy", status: "healthy", confidence: 96 },
  { date: "2026-08-19", crop: "Tomato", result: "Healthy", status: "healthy", confidence: 94 },
  { date: "2026-08-10", crop: "Corn", result: "Fall Armyworm", status: "warning", confidence: 79 },
  { date: "2026-07-29", crop: "Onion", result: "Purple Blotch", status: "diseased", confidence: 84 },
]

export function seedDatabaseIfEmpty(): boolean {
  const { u } = db.prepare("SELECT COUNT(*) AS u FROM users").get() as { u: number }
  if (u > 0) return false

  const passwordHash = hashPassword("demo1234")
  const info = db
    .prepare(
      `INSERT INTO users (name, mobile, email, password_hash, location, state, farm_size, crop_type, language, farm_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run("Ramesh Pawar", "9876543210", "ramesh@farmer.in", passwordHash, "Akola Village", "Maharashtra", "2", "Wheat", "en", "Loganagri Farm")

  const userId = Number(info.lastInsertRowid)

  const cropInsert = db.prepare(
    `INSERT INTO crops (user_id, name, variety, planting_date, location, soil_type, growth_stage, stage_progress, water_used, expected_harvest)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const wheatId = Number(
    cropInsert.run(userId, "Wheat", "HD-2967", "2026-10-12", "East Plot", "Loam", "vegetative", 55, 3400, "2027-03-20").lastInsertRowid
  )
  const tomatoId = Number(
    cropInsert.run(userId, "Tomato", "Arka Rakshak", "2026-08-20", "North Plot", "Sandy Loam", "flowering", 70, 5200, "2026-12-15").lastInsertRowid
  )

  const noteInsert = db.prepare("INSERT INTO notes (crop_id, text, date) VALUES (?, ?, ?)")
  noteInsert.run(wheatId, "Leaves slightly yellow on the north side. Plan a test soil reading.", "2026-11-08")
  noteInsert.run(wheatId, "First irrigation done after fertilizer application.", "2026-11-02")
  noteInsert.run(tomatoId, "Installed pheromone traps after pest alert.", "2026-11-05")

  const reminderInsert = db.prepare("INSERT INTO reminders (crop_id, text, date, done) VALUES (?, ?, ?, ?)")
  reminderInsert.run(wheatId, "Apply urea top dressing", "2026-11-20", 0)
  reminderInsert.run(wheatId, "Check for rust on lower leaves", "2026-11-15", 1)
  reminderInsert.run(tomatoId, "Spray bio-fungicide (Late blight protection)", "2026-11-18", 0)

  const scanInsert = db.prepare(
    `INSERT INTO scans (user_id, crop, disease, status, confidence, symptoms, treatment, prevention)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
  for (const s of seedScans) {
    scanInsert.run(userId, s.crop, s.disease, s.status, s.confidence, JSON.stringify(s.symptoms), s.treatment, JSON.stringify(s.prevention))
  }

  const waterInsert = db.prepare("INSERT INTO water_records (user_id, month, liters) VALUES (?, ?, ?)")
  for (const w of seedWaterRecords) waterInsert.run(userId, w.month, w.liters)

  const detInsert = db.prepare("INSERT INTO detection_records (user_id, date, crop, result, status, confidence) VALUES (?, ?, ?, ?, ?, ?)")
  for (const d of seedDetectionRecords) detInsert.run(userId, d.date, d.crop, d.result, d.status, d.confidence)

  return true
}