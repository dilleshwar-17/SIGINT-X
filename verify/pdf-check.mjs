import { chromium } from "playwright";
import { stat, mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:5173";
const URL_PATH = "/analyze/ANL-0042/report";
const OUT = new URL("./screenshots/report.pdf", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

await mkdir(new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), {
  recursive: true,
});

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(`${BASE}${URL_PATH}`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelectorAll(".report-section").length > 5, null, {
  timeout: 30000,
});
await page.waitForTimeout(800);

const checks = [];
const ok = (name, pass, detail = "") => checks.push({ name, pass, detail });

// 1. Export button is live and no longer advertises the old notice.
const btn = page.locator('button:has-text("Export PDF")').first();
ok("Export PDF button present", (await btn.count()) === 1);
ok("button enabled", await btn.isEnabled());
ok("no 'not implemented' copy", (await page.getByText("not implemented").count()) === 0);
ok("no Lock icon label", (await page.locator('button:has-text("Export PDF") svg.lucide-lock').count()) === 0);

// 2. Screen rendering must be unaffected.
await page.emulateMedia({ media: "screen" });
ok("sidebar visible on screen", await page.locator("aside.app-chrome").first().isVisible());
ok("dark bg on screen", await page.evaluate(() => getComputedStyle(document.body).backgroundColor));

// 3. Switch to print media and assert the stylesheet actually applies.
await page.emulateMedia({ media: "print" });
const print = await page.evaluate(() => {
  const hidden = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return "missing";
    return getComputedStyle(el).display;
  };
  return {
    sidebar: hidden("aside.app-chrome"),
    topbar: hidden("header.app-chrome"),
    actions: hidden(".no-print"),
    atmosphere: hidden(".atmosphere"),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    printOnly: (() => {
      const el = document.querySelector(".print-only");
      return el ? getComputedStyle(el).display : "missing";
    })(),
    token: getComputedStyle(document.documentElement).getPropertyValue("--color-text-primary").trim(),
    sections: document.querySelectorAll(".report-section").length,
  };
});

ok("print: sidebar hidden", print.sidebar === "none", print.sidebar);
ok("print: topbar hidden", print.topbar === "none", print.topbar);
ok("print: header actions hidden", print.actions === "none", print.actions);
ok("print: atmosphere hidden", print.atmosphere === "none", print.atmosphere);
ok("print: white page", print.bodyBg.includes("255, 255, 255"), print.bodyBg);
ok("print: meta line shown", print.printOnly === "block", print.printOnly);
ok("print: light tokens applied", print.token === "#0f172a", print.token);
ok("print: all report sections present", print.sections >= 10, `sections=${print.sections}`);

// 4. Produce a genuine PDF through Chromium's print pipeline.
await page.pdf({ path: OUT, format: "A4", printBackground: true, margin: { top: "14mm", bottom: "16mm", left: "12mm", right: "12mm" } });
const { size } = await stat(OUT);

ok("PDF written", size > 5000, `${size} bytes`);
ok("no runtime errors", errors.length === 0, errors.slice(0, 2).join(" | "));

await browser.close();

let fail = 0;
for (const c of checks) {
  if (!c.pass) fail++;
  console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}${c.detail ? `  (${c.detail})` : ""}`);
}
console.log(`\n${fail === 0 ? "PDF EXPORT OK" : `${fail} CHECK(S) FAILED`}  ->  ${OUT}`);
process.exitCode = fail === 0 ? 0 : 1;