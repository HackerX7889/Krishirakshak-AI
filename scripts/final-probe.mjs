import { access } from "node:fs/promises"
import puppeteer from "puppeteer-core"

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const BASE = process.env.BASE_URL ?? "http://localhost:4179"

let executablePath
for (const p of [EDGE, CHROME]) {
  try {
    await access(p)
    executablePath = p
    break
  } catch {
    /* next */
  }
}
if (!executablePath) throw new Error("no Edge/Chrome")

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
})
const page = await browser.newPage()
page.setDefaultTimeout(40000)

const errors = []
const failed = []
page.on("pageerror", (e) => errors.push(String((e && e.stack) || e)))
page.on("requestfailed", (r) =>
  failed.push(`${r.url()} -> ${(r.failure() || {}).errorText}`)
)

const routes = [
  ["home", "/"],
  ["dashboard", "/dashboard"],
  ["scan", "/scan"],
  ["farm", "/farm"],
  ["irrigation", "/irrigation"],
  ["advisory", "/advisory"],
  ["reports", "/reports"],
  ["login", "/login"],
  ["signup", "/signup"],
  ["profile", "/profile"],
]

const hashes = {}
for (const [name, route] of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 40000 })
  // wait for real app content (not the empty #root starter)
  try {
    await page.waitForFunction(
      () => {
        const el = document.querySelector("#root")
        return !!el && el.childElementCount > 0 && (el.textContent || "").trim().length > 200
      },
      { timeout: 20000 }
    )
  } catch {
    /* capture regardless */
  }
  await new Promise((r) => setTimeout(r, 1200))
  const hash = await page.evaluate(() => {
    const el = document.querySelector("#root")
    return (el && el.textContent) ? Buffer.from(el.textContent).hashCode() : 0
  })
  hashes[name] = hash
  console.log(`${name.padEnd(10)} ${route.padEnd(12)} hash=${hash}`)
}
