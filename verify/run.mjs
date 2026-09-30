import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:5173";
const SHOTS = process.argv.includes("--shots");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1];
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 5);

const ROUTES = [
  ["/", "01-dashboard"],
  ["/signals", "02-signal-library"],
  ["/analyze", "03-new-analysis"],
  ["/analyze/ANL-0042", "04-analysis-workspace"],
  ["/analyze/ANL-0042/pipelines", "05-pipeline-explorer"],
  ["/analyze/ANL-0042/bits", "06-bitstream"],
  ["/analyze/ANL-0042/report", "07-report"],
  ["/experiments", "08-experiments"],
  ["/models", "09-models"],
  ["/settings", "10-settings"],
].filter(([p]) => !ONLY || p.includes(ONLY));

const OUT = new URL("./screenshots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const IGNORE = [/favicon/i, /fonts\.googleapis/i, /fonts\.gstatic/i, /DevTools/i];

if (SHOTS) await mkdir(OUT, { recursive: true });

/* ── in-page audit ────────────────────────────────────────────── */
const AUDIT = () => {
  const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
  const parse = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map(parseFloat);
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (f, b) => f.rgb.map((c, i) => c * f.a + b[i] * (1 - f.a));
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const backdrop = (el) => {
    const stack = [];
    let image = false;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none") image = true;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) {
        stack.push(c);
        if (c.a >= 0.999) break;
      }
    }
    // A gradient/background-image between the text and the nearest opaque layer
    // means there is no single backdrop colour to measure against.
    const indeterminate = image;
    let base = [10, 13, 18];
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return { base, indeterminate };
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const contrast = [];
  for (const el of document.querySelectorAll(
    "p,span,div,td,th,h1,h2,h3,h4,label,a,button,li,dt,dd,legend,input,textarea",
  )) {
    if (!visible(el)) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    if (el.classList.contains("text-gradient")) continue;
    const cs = getComputedStyle(el);
    if (cs.backgroundImage !== "none") continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const bd = backdrop(el);
    if (bd.indeterminate) continue;
    const r = ratio(fg.a < 1 ? over(fg, bd.base) : fg.rgb, bd.base);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && (parseInt(cs.fontWeight, 10) || 400) >= 700);
    const need = large ? 3 : 4.5;
    if (r < need) contrast.push({ t: (el.textContent || "").trim().slice(0, 30), r: +r.toFixed(2), need, c: cs.color });
  }

  const small = [];
  for (const el of document.querySelectorAll("a,button,[role=tab],input,select")) {
    if (!visible(el) || el.closest("table")) continue;
    const r = el.getBoundingClientRect();
    if (r.height > 0 && (r.height < 24 || r.width < 24))
      small.push({ t: (el.textContent || el.tagName).trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) });
  }

  const fonts = new Set();
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue;
    // Only count fonts that actually paint text; Plotly's <defs>/<clippath>
    // scaffolding inherits font-family but renders nothing.
    const paintsText =
      el instanceof SVGElement
        ? el.tagName === "text" || el.tagName === "tspan"
        : [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!paintsText) continue;
    fonts.add(getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, ""));
  }

  return {
    contrast: contrast.slice(0, 10),
    contrastN: contrast.length,
    small: small.slice(0, 8),
    smallN: small.length,
    h1: document.querySelectorAll("main h1").length,
    panels: document.querySelectorAll(".panel-surface").length,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    fonts: [...fonts],
    rootEmpty: !document.getElementById("root")?.children.length,
    // Guard against mock/demo wording leaking back into rendered UI.
    // Word boundaries keep legitimate DSP terms like "Demodulation" intact.
    banned: (document.body.innerText.match(/\b(mock|demo|fake|simulated)\b/gi) || []).slice(0, 5),
  };
};

/* ── runner: one warm context, parallel routes ────────────────── */
const t0 = Date.now();
const browser = await chromium.launch({ channel: "chrome", headless: true });
const warm = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const wp = await warm.newPage();
await wp.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
await wp.waitForTimeout(2500); // pay the Plotly + font cost once
await warm.close();

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route("**/*", (r) => (r.request().url().includes("/api/") ? r.abort() : r.continue()));

let cursor = 0;
const results = new Array(ROUTES.length);

async function worker() {
  while (cursor < ROUTES.length) {
    const i = cursor++;
    const [path, name] = ROUTES[i];
    const page = await ctx.newPage();
    const errors = [];
    const failed = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !IGNORE.some((re) => re.test(m.text()))) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(`UNCAUGHT: ${e.message}`));
    page.on("requestfailed", (r) => {
      if (!IGNORE.some((re) => re.test(r.url()))) failed.push(r.url());
    });

    let navErr = "";
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForFunction(
        () => {
          const r = document.getElementById("root");
          return r && r.children.length && document.querySelector("main h1") && r.innerText.length > 400;
        },
        null,
        { timeout: 30000 },
      );
    } catch (e) {
      navErr = e.message.split("\n")[0];
    }

    const a = await page.evaluate(AUDIT);
    if (SHOTS) await page.screenshot({ path: `${OUT}${name}.png`, fullPage: true }).catch(() => {});
    await page.close();

    const issues = [];
    if (navErr) issues.push(`NAV: ${navErr}`);
    if (a.rootEmpty) issues.push("React root empty");
    errors.forEach((e) => issues.push(`CONSOLE: ${e.slice(0, 160)}`));
    failed.forEach((f) => issues.push(`REQ: ${f.slice(0, 120)}`));
    if (a.contrastN) issues.push(`CONTRAST x${a.contrastN}: ` + a.contrast.map((c) => `"${c.t}" ${c.r}<${c.need}`).join(" | "));
    if (a.smallN) issues.push(`SMALL x${a.smallN}: ` + a.small.map((s) => `"${s.t}" ${s.w}x${s.h}`).join(" | "));
    if (a.h1 !== 1) issues.push(`h1=${a.h1} (want 1)`);
    if (a.overflow > 2) issues.push(`H-OVERFLOW ${a.overflow}px`);
    if (a.fonts.length > 2) issues.push(`FONTS: ${a.fonts.join(", ")}`);
if (a.banned.length) issues.push(`BANNED WORDS: ${a.banned.join(", ")}`);

    results[i] = { path, issues };
  }
}

await Promise.all(Array.from({ length: Math.min(CONCURRENCY, ROUTES.length) }, worker));
await browser.close();

const secs = ((Date.now() - t0) / 1000).toFixed(1);
const lines = results.flatMap((r) => [
  `${r.issues.length ? "FAIL" : "PASS"}  ${r.path.padEnd(30)}`,
  ...r.issues.map((i) => `        - ${i}`),
]);
const total = results.reduce((n, r) => n + r.issues.length, 0);
const out = [`SIGINT-X verify  ${secs}s  shots=${SHOTS}`, "", ...lines, "", `PROBLEMS: ${total}`].join("\n");
console.log(out);
if (SHOTS) await writeFile(`${OUT}report.txt`, out, "utf8");
process.exitCode = total === 0 ? 0 : 1;