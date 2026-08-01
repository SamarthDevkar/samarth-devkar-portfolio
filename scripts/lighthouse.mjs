/**
 * Run Lighthouse against the production build.
 *
 * Chromium is launched by Playwright with a remote-debugging port and
 * Lighthouse attaches to it, chrome-launcher cannot spawn Playwright's
 * Chromium reliably on Windows. Default throttling (the mobile preset) is
 * left untouched: relaxing it to inflate scores would defeat the point.
 */
import lighthouse from "lighthouse";
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3100";
const PORT = 9222;
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

await mkdir("lighthouse", { recursive: true });

const browser = await chromium.launch({
  args: [`--remote-debugging-port=${PORT}`],
});

const summary = [];

try {
  for (const route of routes) {
    const result = await lighthouse(`${BASE}${route}`, {
      port: PORT,
      output: "html",
      logLevel: "error",
    });

    if (!result) continue;

    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, category]) => [
        key,
        Math.round((category.score ?? 0) * 100),
      ]),
    );

    const audits = result.lhr.audits;
    const metrics = {
      LCP: audits["largest-contentful-paint"]?.displayValue,
      CLS: audits["cumulative-layout-shift"]?.displayValue,
      TBT: audits["total-blocking-time"]?.displayValue,
      FCP: audits["first-contentful-paint"]?.displayValue,
      SpeedIndex: audits["speed-index"]?.displayValue,
    };

    const slug = route === "/" ? "home" : route.replace(/\//g, "-").slice(1);
    await writeFile(`lighthouse/${slug}.html`, result.report);

    summary.push({ route, scores, metrics });
    console.log(
      `${route.padEnd(30)} perf=${scores.performance} a11y=${scores.accessibility} bp=${scores["best-practices"]} seo=${scores.seo} | LCP ${metrics.LCP} CLS ${metrics.CLS} TBT ${metrics.TBT}`,
    );
  }

  await writeFile("lighthouse/summary.json", JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
