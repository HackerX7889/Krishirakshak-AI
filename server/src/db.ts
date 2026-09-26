import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const dbPath =
  process.env.DB_PATH ??
  join(dirname(fileURLToPath(import.meta.url)), "..", "smart-farming.db")

const { DatabaseSync } = await import("node:sqlite")

export const db = new DatabaseSync(dbPath)
db.exec("PRAGMA journal_mode = WAL;")
db.exec("PRAGMA foreign_keys = ON;")

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Akola Village',
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  farm_size TEXT NOT NULL DEFAULT '2',
  crop_type TEXT NOT NULL DEFAULT 'Wheat',
  language TEXT NOT NULL DEFAULT 'en',
  farm_name TEXT NOT NULL DEFAULT 'Loganagri Farm',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS crops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variety TEXT NOT NULL DEFAULT '',
  planting_date TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  soil_type TEXT NOT NULL DEFAULT '',
  growth_stage TEXT NOT NULL DEFAULT 'vegetative',
  stage_progress INTEGER NOT NULL DEFAULT 30,
  water_used INTEGER NOT NULL DEFAULT 0,
  expected_harvest TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crop_id INTEGER NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT (date('now'))
);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crop_id INTEGER NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  date TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  disease TEXT NOT NULL,
  status TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  symptoms TEXT NOT NULL DEFAULT '[]',
  treatment TEXT NOT NULL DEFAULT '',
  prevention TEXT NOT NULL DEFAULT '[]',
  scanned_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS water_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  liters INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS detection_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  crop TEXT NOT NULL,
  result TEXT NOT NULL,
  status TEXT NOT NULL,
  confidence INTEGER NOT NULL
);
`)

export function jsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}