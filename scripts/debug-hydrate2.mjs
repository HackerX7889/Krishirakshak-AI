import { access } from "node:fs/promises"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL ?? "http://localhost:4174"
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

let executablePath
for (const p of [EDGE, CHROME]) {
  try {
    await access(p)
    executablePath = p
    break
  } catch {
    /* try next */
  }
}
if (!executablePath) throw new Error("no browser found")

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
})

const page = await browser.newPage()
page.setDefaultTimeout(30000)

const consoleLines = []
const pageErrors = []
const failedRequests = []
page.on("console", (m) => consoleLines.push(`[${m.type()}] ${m.text()}`))
page.on("pageerror", (e) => pageErrors.push(String((e && e.stack) || e)))
page.on("requestfailed", (r) =>
  failedRequests.push(`${r.method()} ${r.url()} -> ${(r.failure() || {}).errorText}`)
)

await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 })
await new Promise((r) => setTimeout(r, 3000))

const probe = await page.evaluate(() => {
  const root = document.querySelector("#root")
  return {
    childCount: root ? root.childElementCount : -1,
    rootText: root ? (root.textContent || "").slice(0, 160) : null,
    hasNav: !!document.querySelector("nav"),
    hasH1: !!document.querySelector("h1"),
    readyState: document.readyState,
  }
})

console.log("=== probe ===")
console.log(JSON.stringify(probe, null, 2))
console.log("=== page errors ===")
console.log(pageErrors.length ? pageErrors.join("\n---\n") : "(none)")
console.log("=== failed requests ===")
console.log(failedRequests.length ? failedRequests.join("\n") : "(none)")
console.log("=== console (filtered) ===")
console.log(
  consoleLines.filter((l) => !l.includes("Download the React DevTools")).slice(0, 40).join("\n") || "(none)"
)

await browser.close()
