import { currentWeather, farm, initialCrops, sensors, weatherAlerts, weatherForecast, diseaseSamples } from "../data/mockData"
import { translations } from "../i18n/translations"
import type { Language } from "../types"

export interface AssistantReply {
  text: string
  chips: string[]
}

export const COND_KEYS: Record<string, string> = {
  clear: "assistant.cond.clear",
  sunny: "assistant.cond.sunny",
  partly: "assistant.cond.partly",
  cloudy: "assistant.cond.cloudy",
  rain: "assistant.cond.rain",
  storm: "assistant.cond.storm",
}

function tr(lang: Language, key: string, vars?: Record<string, string | number>): string {
  let s = translations[lang][key] ?? translations.en[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
  }
  return s
}

function sensor(suffix: string) {
  return sensors.find((s) => s.key.endsWith(`.${suffix}`))
}

function hasSome(q: string, ...words: string[]) {
  return words.some((w) => q.includes(w))
}

function chips(lang: Language): string[] {
  return [
    tr(lang, "assistant.chip.soil"),
    tr(lang, "assistant.chip.irrigate"),
    tr(lang, "assistant.chip.weather"),
    tr(lang, "assistant.chip.disease"),
  ]
}

export function assistantGreeting(lang: Language, name?: string): AssistantReply {
  return {
    text: tr(lang, "assistant.reply.greeting", { name: name?.trim() || "Farmer" }),
    chips: chips(lang),
  }
}

export function getAssistantReply(raw: string, lang: Language, name?: string): AssistantReply {
  const q = raw.toLowerCase()
  const suggestions = chips(lang)
  const userName = name?.trim() || "Farmer"

  const tokens = q.split(/[^a-z\u0900-\u097f]+/).filter(Boolean)
  const greeted = tokens.some((t) => ["hi", "hello", "hey", "namaste", "hola", "सुप्रभात", "नमस्ते", "नमस्कार", "हैलो"].includes(t))

  if (hasSome(q, "what can you do", "help", "capabilities", "सहायता", "मदद")) {
    return { text: tr(lang, "assistant.reply.help"), chips: suggestions }
  }

  if (greeted) {
    return { text: tr(lang, "assistant.reply.greeting", { name: userName }), chips: suggestions }
  }

  if (hasSome(q, "weather", "rain", "hot", "temperature", "forecast", "मौसम", "हवामान", "बारिश", "पाऊस", "गर्मी", "उष्ण")) {
    const rainDay = weatherForecast.find((d) => d.rainChance >= 50)
    return {
      text: tr(lang, "assistant.reply.weather", {
        temp: currentWeather.temperature,
        condLabel: tr(lang, COND_KEYS[currentWeather.condition] ?? "assistant.cond.clear"),
        humidity: currentWeather.humidity,
        alert: weatherAlerts[0]?.title ?? "",
        rainDay: rainDay ? tr(lang, `assistant.day.${rainDay.dayKey}`) : tr(lang, "assistant.day.none"),
        rainPct: rainDay?.rainChance ?? 0,
      }),
      chips: suggestions,
    }
  }

  if (hasSome(q, "disease", "scan", "leaf", "leaves", "spot", "blight", "रोग", "आजार", "स्कैन", "स्कॅन", "पत्ती", "पान", "बीमारी")) {
    const ex = diseaseSamples.sample2
    return {
      text: tr(lang, "assistant.reply.disease", {
        example: `${ex.cropName} — ${ex.diseaseName} (${ex.confidence}%)`,
      }),
      chips: suggestions,
    }
  }

  if (hasSome(q, "irrigat", "water", "watering", "सिंचाई", "सिंचन", "पानी", "पाणी")) {
    const moist = sensor("moisture")
    return {
      text: tr(lang, "assistant.reply.irrigation", {
        moist: moist?.value ?? "?",
        ideal: moist?.ideal ?? "45 - 60%",
        irrType: farm.irrigationType,
        cropList: initialCrops.map((c) => c.name).join(", "),
      }),
      chips: suggestions,
    }
  }

  if (hasSome(q, "soil", "moisture", "ph", "मिट्टी", "माती", "नमी", "आर्द्रता")) {
    const moist = sensor("moisture")
    const ph = sensor("ph")
    const temp = sensor("temperature")
    const low = (moist?.value ?? 50) < 30
    return {
      text: tr(lang, "assistant.reply.soil", {
        moist: moist?.value ?? "?",
        ideal: moist?.ideal ?? "45 - 60%",
        ph: ph?.value ?? "?",
        temp: temp?.value ?? "?",
        status: tr(lang, low ? "assistant.state.low" : "assistant.state.ok"),
      }),
      chips: suggestions,
    }
  }

  if (hasSome(q, "fertilizer", "urea", "fert", "खाद", "खत", "यूरिया")) {
    const crop = initialCrops[0]
    const reminder = crop.reminders.find((r) => /urea|fertilizer|यूरिया/i.test(r.text)) ?? crop.reminders[0]
    return {
      text: tr(lang, "assistant.reply.fertilizer", {
        crop: crop.name,
        date: reminder?.date ?? "",
      }),
      chips: suggestions,
    }
  }

  if (hasSome(q, "price", "market", "mandi", "cost", "भाव", "बाजार", "मंडई")) {
    return { text: tr(lang, "assistant.reply.price"), chips: suggestions }
  }

  if (hasSome(q, "crop", "wheat", "tomato", "corn", "crops", "फसल", "पीक", "गेहूं", "गहू", "टमाटर", "टोमॅटो")) {
    return {
      text: tr(lang, "assistant.reply.crop", {
        cropList: initialCrops.map((c) => c.name).join(", "),
      }),
      chips: suggestions,
    }
  }

  return { text: tr(lang, "assistant.reply.fallback"), chips: suggestions }
}