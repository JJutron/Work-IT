import { chromium } from "playwright-core";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const drawio = resolve(root, "docs/readme/architecture.drawio");
const raw = resolve(root, "docs/readme/architecture.raw.png");
const encoder = `${process.env.HOME}/.cursor/skills/drawio-skill/skills/drawio-skill/scripts/encode_drawio_url.py`;
const encoded = spawnSync("python3", [encoder, drawio], { encoding: "utf8" });
if (encoded.status !== 0) {
  process.stderr.write(encoded.stderr);
  process.exit(encoded.status ?? 1);
}
const url = encoded.stdout.trim();
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1680, height: 1300 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: raw, fullPage: true });
await browser.close();
console.log("wrote", raw);
