export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  weatherProxy: (process.env.WEATHER_PROXY ?? "true") === "true",
  weatherApiUrl: process.env.WEATHER_API_URL ?? "https://api.open-meteo.com/v1/forecast",
  farmLat: Number(process.env.DEFAULT_FARM_LAT ?? 20.435),
  farmLon: Number(process.env.DEFAULT_FARM_LON ?? 77.091),
}