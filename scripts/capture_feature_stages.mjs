import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "app/static/home/frames");
const htmlDir = join(outDir, "html");
const base = process.env.CAPTURE_BASE_URL || "http://127.0.0.1:8000";

mkdirSync(outDir, { recursive: true });

const hideChrome = `
  header, footer, .skip-link { display: none !important; }
  body { padding-top: 0 !important; }
`;

async function shot(page, selector, name) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: "visible", timeout: 20000 });
  await page.waitForTimeout(400);
  const path = join(outDir, `${name}.png`);
  await locator.screenshot({ path, animations: "disabled" });
  console.log("saved", path);
}

async function openHtml(page, name) {
  const html = readFileSync(join(htmlDir, `${name}.html`), "utf8");
  await page.goto(`${base}/health`, { waitUntil: "domcontentloaded" });
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: hideChrome });
}

async function captureCalculate(page) {
  await openHtml(page, "calculate");
  await page.fill("#calculationDate", "2025-06-15");
  await page.selectOption('select[name="injury_type"]', "손가락 절단");
  await shot(page, "#calculatorShell", "calculate-01");

  await page.getByRole("button", { name: "다음 ›" }).click();
  await page.waitForTimeout(300);
  await page.fill("#wageAmount", "3500000");
  await page.locator("#wageAmount").evaluate((el) => el.dispatchEvent(new Event("input", { bubbles: true })));
  await shot(page, "#calculatorShell", "calculate-02");

  await page.getByRole("button", { name: "다음 ›" }).click();
  await page.waitForTimeout(300);
  await page.selectOption('select[name="disability_grade"]', "10급");
  await shot(page, "#calculatorShell", "calculate-03");

  await page.getByRole("button", { name: "다음 ›" }).click();
  await page.waitForTimeout(300);
  await shot(page, "#calculatorShell", "calculate-04");
}

async function captureDisability(page) {
  await openHtml(page, "disability");
  await shot(page, "main", "disability-01");

  await page.selectOption("#accident_type", "4");
  await page.selectOption("#body_part", "7");
  await page.selectOption("#injury_type", "1");
  await page.fill(
    "#장해_내용",
    "작업 중 프레스 기계에 손가락이 끼여 절단되었습니다.",
  );
  await page.waitForTimeout(400);
  await shot(page, "main", "disability-02");

  await openHtml(page, "disability-result");
  await shot(page, "main", "disability-03");
}

async function captureAnalyze(page) {
  await openHtml(page, "precedent");
  await shot(page, "main, body", "analyze-01");

  const chip = page.getByRole("button", { name: "프레스 손가락 끼임" });
  if (await chip.count()) {
    await chip.click();
    await page.waitForTimeout(400);
  }
  await shot(page, "main, body", "analyze-02");
  await shot(page, "main, body", "analyze-03");
}

async function captureApply(page) {
  await openHtml(page, "apply");
  await shot(page, "main, .container", "apply-01");

  const date = page.locator('input[name="incident_date"]');
  if (await date.count()) {
    await date.fill("2025-06-15");
  }
  const injury = page.locator('select[name="injury_type"], input[name="injury_type"]').first();
  if (await injury.count()) {
    const tag = await injury.evaluate((el) => el.tagName);
    if (tag === "SELECT") await injury.selectOption({ index: 1 }).catch(() => {});
    else await injury.fill("손가락 절단");
  }
  await page.waitForTimeout(300);
  await shot(page, "main, .container", "apply-02");

  await openHtml(page, "status");
  await shot(page, "main, .max-w-4xl, main", "apply-03");
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 960 },
  deviceScaleFactor: 1,
});

try {
  await captureCalculate(page);
  await captureDisability(page);
  await captureAnalyze(page);
  await captureApply(page);
} finally {
  await browser.close();
}
