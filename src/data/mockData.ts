import type {
  CropEntry,
  DetectionRecord,
  DiseaseResult,
  Farm,
  SensorLocation,
  SensorReading,
  TimeSeriesPoint,
  WaterRecord,
  WeatherAlert,
  WeatherForecast,
} from "../types"

export const sensors: SensorReading[] = [
  { id: "s1", key: "dash.moisture", value: 24, unit: "%", icon: "droplets", ideal: "45 - 60%", status: "warning", trend: "down" },
  { id: "s2", key: "dash.temperature", value: 34, unit: "°C", icon: "thermometer", ideal: "15 - 30°C", status: "warning", trend: "up" },
  { id: "s3", key: "dash.humidity", value: 62, unit: "%", icon: "cloudRain", ideal: "50 - 80%", status: "ok", trend: "stable" },
  { id: "s4", key: "dash.light", value: 48000, unit: "lux", icon: "sun", ideal: "> 40000 lux", status: "ok", trend: "up" },
  { id: "s5", key: "dash.ph", value: 6.8, unit: "pH", icon: "flaskConical", ideal: "6.0 - 7.5", status: "ok", trend: "stable" },
  { id: "s6", key: "dash.tank", value: 62, unit: "%", icon: "warehouse", ideal: "> 50%", status: "ok", trend: "down" },
  { id: "s7", key: "dash.cropHealth", value: 78, unit: "pts", icon: "leaf", ideal: "Healthy", status: "warning", trend: "stable" },
]

export const chartDaily: TimeSeriesPoint[] = [
  { time: "06:00", moisture: 38, temperature: 22 },
  { time: "08:00", moisture: 35, temperature: 25 },
  { time: "10:00", moisture: 33, temperature: 28 },
  { time: "12:00", moisture: 30, temperature: 32 },
  { time: "14:00", moisture: 27, temperature: 34 },
  { time: "16:00", moisture: 25, temperature: 35 },
  { time: "18:00", moisture: 24, temperature: 33 },
  { time: "20:00", moisture: 24, temperature: 29 },
  { time: "22:00", moisture: 26, temperature: 26 },
]

export const chartWeekly: TimeSeriesPoint[] = [
  { time: "Mon", moisture: 42, temperature: 28 },
  { time: "Tue", moisture: 38, temperature: 30 },
  { time: "Wed", moisture: 31, temperature: 33 },
  { time: "Thu", moisture: 26, temperature: 34 },
  { time: "Fri", moisture: 33, temperature: 31 },
  { time: "Sat", moisture: 40, temperature: 29 },
  { time: "Sun", moisture: 24, temperature: 34 },
]

export const chartMonthly: TimeSeriesPoint[] = [
  { time: "Jun", moisture: 55, temperature: 30 },
  { time: "Jul", moisture: 48, temperature: 28 },
  { time: "Aug", moisture: 35, temperature: 30 },
  { time: "Sep", moisture: 30, temperature: 32 },
  { time: "Oct", moisture: 26, temperature: 33 },
  { time: "Nov", moisture: 34, temperature: 29 },
]

export const weatherForecast: WeatherForecast[] = [
  { day: "Mon", dayKey: "mon", tempMax: 35, tempMin: 24, condition: "sunny", rainChance: 10, windSpeed: 9 },
  { day: "Tue", dayKey: "tue", tempMax: 34, tempMin: 24, condition: "partly", rainChance: 20, windSpeed: 12 },
  { day: "Wed", dayKey: "wed", tempMax: 32, tempMin: 23, condition: "rain", rainChance: 75, windSpeed: 18 },
  { day: "Thu", dayKey: "thu", tempMax: 30, tempMin: 22, condition: "rain", rainChance: 65, windSpeed: 15 },
  { day: "Fri", dayKey: "fri", tempMax: 33, tempMin: 23, condition: "cloudy", rainChance: 30, windSpeed: 10 },
  { day: "Sat", dayKey: "sat", tempMax: 36, tempMin: 25, condition: "sunny", rainChance: 5, windSpeed: 8 },
  { day: "Sun", dayKey: "sun", tempMax: 37, tempMin: 26, condition: "sunny", rainChance: 5, windSpeed: 7 },
]

export const weatherAlerts: WeatherAlert[] = [
  {
    id: "a1",
    type: "heavy-rain",
    title: "Heavy Rain Expected Tonight",
    message: "Rainfall ~30 mm expected after 9 PM. Delay irrigation and move equipment under cover.",
    severity: "warning",
    time: "Tonight, 9 PM",
  },
  {
    id: "a2",
    type: "heatwave",
    title: "Heat Wave Warning — 4 Days",
    message: "Daytime temperatures may cross 40°C. Provide shade and increase watering at night.",
    severity: "critical",
    time: "Starts Saturday",
  },
  {
    id: "a3",
    type: "pest",
    title: "Fall Armyworm Risk High",
    message: "Risk of fall armyworm in corn. Scout fields and use pheromone traps this week.",
    severity: "warning",
    time: "This week",
  },
  {
    id: "a4",
    type: "drought",
    title: "Low Rainfall This Month",
    message: "Monthly rainfall is 40% below normal. Save water and follow drip irrigation advice.",
    severity: "info",
    time: "This month",
  },
]

export const diseaseSamples: Record<string, DiseaseResult> = {
  sample1: {
    cropName: "Wheat (Gehu)",
    diseaseName: "No Disease Found — Healthy Crop",
    confidence: 96,
    status: "healthy",
    symptoms: ["Leaves are green and uniform", "No spots, mildew, or yellowing", "Normal growth pattern"],
    treatment: "No treatment required. Continue your normal care routine.",
    prevention: ["Keep soil moisture at 45 - 60%", "Spray organic compost tea monthly"],
    scannedAt: "Today, 09:14 AM",
  },
  sample2: {
    cropName: "Tomato (Tamatar)",
    diseaseName: "Late Blight (Fitoftora)",
    confidence: 88,
    status: "diseased",
    symptoms: [
      "Dark brown spots on older leaves",
      "White cotton-like growth under leaves in humid weather",
      "Rapid spread after rain",
    ],
    treatment:
      "Apply Mancozeb 75% WP at 2 g per litre of water, every 7 days for 3 rounds. Remove and destroy infected leaves.",
    prevention: [
      "Avoid overhead watering in the evening",
      "Keep proper plant spacing for air flow",
      "Use resistant tomato varieties next season",
    ],
    scannedAt: "Today, 08:47 AM",
  },
  sample3: {
    cropName: "Rice (Dhan)",
    diseaseName: "Leaf Blast (Pyricularia)",
    confidence: 91,
    status: "diseased",
    symptoms: [
      "Eye-shaped grey or brown spots on leaves",
      "Spots spread to leaf stems in humid weather",
      "Decreased grain filling if untreated",
    ],
    treatment:
      "Spray Tricyclazole 75% WP at 1 g per litre at first sign. Repeat after 15 days if needed.",
    prevention: [
      "Use blast-resistant rice varieties",
      "Do not over-fertilize with nitrogen",
      "Keep field water level at 3 - 5 cm",
    ],
    scannedAt: "Yesterday, 05:32 PM",
  },
}

export const detectionRecords: DetectionRecord[] = [
  { id: "d1", date: "2026-09-12", crop: "Tomato", result: "Late Blight", status: "diseased", confidence: 88 },
  { id: "d2", date: "2026-09-05", crop: "Rice", result: "Leaf Blast", status: "diseased", confidence: 91 },
  { id: "d3", date: "2026-08-28", crop: "Wheat", result: "Healthy", status: "healthy", confidence: 96 },
  { id: "d4", date: "2026-08-19", crop: "Tomato", result: "Healthy", status: "healthy", confidence: 94 },
  { id: "d5", date: "2026-08-10", crop: "Corn", result: "Fall Armyworm", status: "warning", confidence: 79 },
  { id: "d6", date: "2026-07-29", crop: "Onion", result: "Purple Blotch", status: "diseased", confidence: 84 },
]

export const waterRecords: WaterRecord[] = [
  { date: "Jun", liters: 1200 },
  { date: "Jul", liters: 1100 },
  { date: "Aug", liters: 850 },
  { date: "Sep", liters: 620 },
  { date: "Oct", liters: 760 },
  { date: "Nov", liters: 540 },
]

export const sensorLocations: SensorLocation[] = [
  { id: "m1", name: "Moisture A-1 (East Plot)", x: 22, y: 26, moisture: 22, status: "warning" },
  { id: "m2", name: "Moisture A-2 (North Plot)", x: 62, y: 30, moisture: 58, status: "ok" },
  { id: "m3", name: "Moisture A-3 (Center)", x: 42, y: 55, moisture: 19, status: "critical" },
  { id: "m4", name: "Moisture A-4 (West Plot)", x: 78, y: 62, moisture: 47, status: "ok" },
  { id: "m5", name: "Weather Station", x: 30, y: 70, moisture: 0, status: "ok" },
]

export const initialCrops: CropEntry[] = [
  {
    id: "c1",
    name: "Wheat",
    variety: "HD-2967",
    plantingDate: "2026-10-12",
    location: "East Plot",
    soilType: "Loam",
    growthStage: "vegetative",
    stageProgress: 55,
    notes: [
      { id: "n1", text: "Leaves slightly yellow on the north side. Plan a test soil reading.", date: "2026-11-08" },
      { id: "n2", text: "First irrigation done after fertilizer application.", date: "2026-11-02" },
    ],
    reminders: [
      { id: "r1", text: "Apply urea top dressing", date: "2026-11-20", done: false },
      { id: "r2", text: "Check for rust on lower leaves", date: "2026-11-15", done: true },
    ],
    waterUsed: 3400,
    expectedHarvest: "2027-03-20",
  },
  {
    id: "c2",
    name: "Tomato",
    variety: "Arka Rakshak",
    plantingDate: "2026-08-20",
    location: "North Plot",
    soilType: "Sandy Loam",
    growthStage: "flowering",
    stageProgress: 70,
    notes: [{ id: "n3", text: "Installed pheromone traps after pest alert.", date: "2026-11-05" }],
    reminders: [
      { id: "r3", text: "Spray bio-fungicide (Late blight protection)", date: "2026-11-18", done: false },
    ],
    waterUsed: 5200,
    expectedHarvest: "2026-12-15",
  },
]

export const farm: Farm = {
  name: "Loganagri Farm",
  area: "3.5 acres",
  crop: "Wheat + Tomato",
  irrigationType: "Drip + Sprinkler",
  waterSaved: 12850,
  sensorsConnected: 14,
}

export const currentWeather = {
  temperature: 34,
  condition: "partly",
  rainChance: 20,
  wind: 12,
  humidity: 62,
  location: "Akola, Maharashtra",
}

export interface WeatherConditionLabel {
  icon: string
  label: string
}

export const conditionMeta: Record<string, WeatherConditionLabel> = {
  sunny: { icon: "sun", label: "Sunny" },
  partly: { icon: "cloudSun", label: "Partly Cloudy" },
  rain: { icon: "cloudRain", label: "Rainy" },
  cloudy: { icon: "cloud", label: "Cloudy" },
  storm: { icon: "cloudLightning", label: "Storm" },
}