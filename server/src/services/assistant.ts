import { db } from "../db.js"
import { seedWeather } from "../seed.js"

export interface AssistantReply {
  text: string
  chips: string[]
}

const chips = ["How is my soil today?", "Should I water today?", "What's today's weather?", "Any disease alerts?"]

function cropSummary(userId: number): string {
  const rows = db.prepare("SELECT name FROM crops WHERE user_id = ?").all(userId) as Array<{ name: string }>
  return rows.map((r) => r.name).join(", ") || "no crops added yet"
}

export function reply(userId: number, raw: string): AssistantReply {
  const q = raw.toLowerCase()
  const crops = cropSummary(userId)

  if (["what can you do", "help", "capabilities", "सहायता", "मदद"].some((w) => q.includes(w))) {
    return {
      text: "I can help with: soil moisture and pH, when to irrigate, weather and alerts, disease signs on leaves, crops on your farm and fertilizer tips. Pick one below.",
      chips,
    }
  }

  if (["weather", "rain", "hot", "temperature", "forecast", "मौसम", "हवामान", "बारिश", "पाऊस"].some((w) => q.includes(w))) {
    const rainDay = seedWeather.forecast.find((d) => d.rainChance >= 50)
    return {
      text: `Right now: ${seedWeather.current.temperature}°C, ${seedWeather.current.condition}, humidity ${seedWeather.current.humidity}%. Top alert: ${seedWeather.alerts[0].title}. Rain expected ${rainDay ? rainDay.day : "not in the next 7 days"} (${rainDay?.rainChance ?? 0}% chance) - avoid watering that day.`,
      chips,
    }
  }

  if (["disease", "scan", "leaf", "leaves", "spot", "blight", "रोग", "आजार", "स्कैन"].some((w) => q.includes(w))) {
    return {
      text: "I check every scan for disease. Latest example: Tomato — Late Blight (Fitoftora) (88%). Take a fresh leaf photo in Scan Crop and I'll analyse symptoms, confidence and treatment.",
      chips,
    }
  }

  if (["irrigat", "water", "watering", "सिंचाई", "सिंचन", "पानी", "पाणी"].some((w) => q.includes(w))) {
    return {
      text: `Soil moisture is 24% (ideal 45 - 60%). Best time to water: today at 6 PM. Your farm uses Drip + Sprinkler; main crops: ${crops}.`,
      chips,
    }
  }

  if (["soil", "moisture", "ph", "मिट्टी", "माती", "नमी"].some((w) => q.includes(w))) {
    return {
      text: "Your soil today: moisture 24% (ideal 45 - 60%), pH 6.8, temperature 34°C. Moisture is running low.",
      chips,
    }
  }

  if (["fertilizer", "urea", "fert", "खाद", "खत", "यूरिया"].some((w) => q.includes(w))) {
    const row = db.prepare("SELECT text, date FROM reminders WHERE text LIKE '%urea%' OR text LIKE '%fertilizer%' LIMIT 1").get() as
      | { text: string; date: string }
      | undefined
    return {
      text: row
        ? `Reminder: ${row.text} on ${row.date}. Follow the dosage on the bag and irrigate right after applying.`
        : "No fertilizer reminders yet. Add one from My Farm and I'll remind you.",
      chips,
    }
  }

  if (["price", "market", "mandi", "cost", "भाव", "बाजार"].some((w) => q.includes(w))) {
    return {
      text: "Live mandi prices aren't connected to this prototype yet. Your Reports page keeps farm history ready while I learn the market feed.",
      chips,
    }
  }

  if (["crop", "wheat", "tomato", "rice", "corn", "फसल", "पीक", "गेहूं"].some((w) => q.includes(w))) {
    return {
      text: `On your farm right now: ${crops}. I track growth stage, soil and reminders for each crop. Ask 'is my crop healthy?' or open My Farm.`,
      chips,
    }
  }

  return {
    text: "For now I specialise in soil, irrigation, weather, disease scans and your crops. Try one of the questions below, or rephrase and ask again.",
    chips,
  }
}