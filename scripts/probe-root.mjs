import { access } from "node:fs/promises"
import puppeteer from "puppeteer-core"
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const BASE = process.env.BASE_URL ?? "http://localhost:4174"
let executablePath
for (const p of [EDGE, CHROME]) { try { await access(p); executablePath = p; break } catch {} }
if (!executablePath) throw new Error("no browser")
const browser = await puppeteer.launch({ executablePath, headless: "new", args: ["--no-sandbox", "--disable-gpu"] })
const page = await browser.newPage()
page.setDefaultTimeout(40000)
const errs = []
const logs = []
page.on("pageerror", (e) => errs.push(String((e && e.stack) || e)))
page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`))
await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 45000 })
await new Promise((r) => setTimeout(r, 1800))
const probe = await page.evaluate(() => {
  const root = document.querySelector("#root")
  return {
    childCount: root ? root.childElementCount : -1,
    rootText: root ? (root.textContent || "").slice(0, 120) : null,
    hasNav: !!document.querySelector("nav"),
    hasH1: !!document.querySelector("h1"),
  }
})
console.log("=== probe ===")
console.log(JSON.stringify(probe, null, 2))
console.log("=== page errors ===")
console.log(errs.length ? errs.join("\n---\n") : "(none)")
console.log("=== console ===")
console.log(logs.filter((l) => !l.includes("DevTools")).slice(0, 20).join("\n") || "(none)")
await browser.close()
