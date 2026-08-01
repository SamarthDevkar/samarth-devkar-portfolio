/**
 * Capture screenshots of the running dev server for visual QA.
 * Usage: node scripts/screenshot.mjs [route ...]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "screenshots";

const TARGETS = [
  { name: "desktop-dark", width: 1440, height: 900, colorScheme: "dark" },
  { name: "desktop-light", width: 1440, height: 900, colorScheme: "light" },
  { name: "mobile-dark", width: 390, height: 844, colorScheme: "dark" },
];

const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const target of TARGETS) {
  const context = await browser.newContext({
    viewport: { width: target.width, height: target.height },
    deviceScaleFactor: 2,
    colorScheme: target.colorScheme,
    // Reveals resolve immediately under reduced motion, so captures are
    // deterministic and never catch a half-finished transition.
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const route of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);
    const slug =
      route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
    const file = `${OUT}/${slug}-${target.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`captured ${file}`);
  }

  await context.close();
}

await browser.close();
