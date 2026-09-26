import { mkdirSync, readFileSync } from "node:fs"
import { access } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer-core"

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT = join(ROOT, "public", "icons")
const SIZES = [192, 512]

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

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
  const svg = readFileSync(join(OUT, "icon.svg"), "utf8")
  const html = `<!doctype html><html><body style="margin:0">${svg}</body></html>`

  const browser = await puppeteer.launch({
    executablePath: await chooseBrowser(),
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "load" })
    for (const size of SIZES) {
      await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
      const file = join(OUT, `icon-${size}.png`)
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: size, height: size }, type: "png" })
      console.log(`wrote ${file}`)
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})