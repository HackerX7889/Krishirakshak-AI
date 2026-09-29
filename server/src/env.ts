export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  weatherProxy: (process.env.WEATHER_PROXY ?? "true") === "true",
  weatherApiUrl: process.env.WEATHER_API_URL ?? "https://api.open-meteo.com/v1/forecast",
  farmLat: Number(process.env.DEFAULT_FARM_LAT ?? 20.435),
  farmLon: Number(process.env.DEFAULT_FARM_LON ?? 77.091),
  // Any OpenAI-compatible chat-completions endpoint (OpenAI, Groq, Gemini compat
  // endpoint, OpenRouter, or a self-hosted vision model). Leave AI_API_KEY empty
  // to keep the prototype on bundled sample results.
  aiBaseUrl: process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
  aiApiKey: process.env.AI_API_KEY ?? "",
  aiModel: process.env.AI_MODEL ?? "gpt-4o-mini",
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 60000),
  aiMaxTokens: Number(process.env.AI_MAX_TOKENS ?? 900),
  aiMaxImageBytes: Number(process.env.AI_MAX_IMAGE_BYTES ?? 4_000_000),
  aiRateLimit: Number(process.env.AI_RATE_LIMIT ?? 20),
  aiRateWindowMs: Number(process.env.AI_RATE_WINDOW_MS ?? 600_000),
}
