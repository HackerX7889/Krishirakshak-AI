import { createHash } from "node:crypto"
import { mkdirSync, readdirSync, rmSync } from "node:fs"
import { access } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer-core"

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT = join(ROOT, "screenshots")
const BASE = process.env.BASE_URL ?? "http://localhost:4174"

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const ROUTES = [
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function chooseBrowser() {
  for (const p of [EDGE, CHROME]) {
    try {
      await access(p)
      return p
    } catch {
      /* try next */
    }
  }
  throw new Error("No Edge or Chrome executable found.")
}

async function main() {
  mkdirSync(OUT, { recursive: true })

  // clear stale captures
  for (const f of readdirSync(OUT)) {
    if (f.endsWith(".png")) rmSync(join(OUT, f), { force: true })
  }

  const executablePath = await chooseBrowser()
  console.log("Using browser:", executablePath)

  const browser = await puppeteer.launch({
    executablePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--window-size=1440,1000"],
  })

  const hashes = {}

  try {
    for (const [name, route] of ROUTES) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
      page.setDefaultTimeout(45000)

      // App uses HashRouter + localStorage-backed auth. Seed a signed-in user so
      // protected routes render instead of redirecting to /#/login.
      await page.evaluateOnNewDocument(() => {
        try {
          localStorage.setItem(
            "sfa_auth_user",
            JSON.stringify({
              name: "Ramesh Pawar",
              mobile: "9876543210",
              email: "ramesh@farmer.in",
              location: "Akola Village",
              state: "Maharashtra",
              farmSize: "2",
              cropType: "Wheat",
              language: "en",
              farmName: "Loganagri Farm",
            })
          )
          localStorage.setItem("sfa_lang", "en")
        } catch {
          /* ignore */
        }
      })

      const url = BASE + "/#" + route
      try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 })
      } catch (err) {
        console.log(`${name.padEnd(10)} ${route.padEnd(12)} goto-error: ${String(err).slice(0, 90)}`)
        await page.close()
        continue
      }

      // Wait for React to mount actual content into #root (not the empty shell).
      try {
        await page.waitForFunction(
          () => {
            const root = document.querySelector("#root")
            if (!root || root.childElementCount === 0) return false
            const text = root.textContent || ""
            if (text.trim().length < 80) return false
            return true
          },
          { timeout: 25000 }
        )
      } catch {
        console.log(`${name.padEnd(10)} ${route.padEnd(12)} WARN: root may not be hydrated`)
      }

      // Let recharts/async health data settle and fonts load.
      await sleep(1600)
      await page.evaluate(() =>
        document.fonts ? document.fonts.ready : Promise.resolve()
      )

      // Scroll through the page so lazy images / charts paint, then settle.
      await page.evaluate(async () => {
        const step = 450
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 120))
        }
        window.scrollTo(0, 0)
        await new Promise((r) => setTimeout(r, 350))
      })

      const file = join(OUT, `${name}.png`)
      await page.screenshot({ path: file, fullPage: true, type: "png" })

      const hash = createHash("md5")
        .update(await page.content())
        .digest("hex")
        .slice(0, 12)
      hashes[name] = hash
      console.log(`${name.padEnd(10)} ${route.padEnd(12)} hash=${hash}`)

      await page.close()
    }
  } finally {
    await browser.close()
  }

  const unique = new Set(Object.values(hashes))
  console.log("=== unique content-hashes:", unique.size, "/", ROUTES.length)
  if (hashes.home && (unique.size < ROUTES.length || unique.has(null))) {
    console.warn("WARNING: some routes share the same HTML — check hydration.")
  } else {
    console.log("OK — all routes rendered distinct hydrated content.")
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
