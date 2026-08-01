import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { projects } from "../src/content/projects";
import { ROUTES } from "./routes";

test.describe("accessibility", () => {
  for (const route of ROUTES) {
    test(`${route} has no axe violations (WCAG 2.2 A/AA)`, async ({ page }) => {
      await page.goto(route);
      // Wait for webfonts before auditing. axe derives the contrast threshold
      // from computed font size and weight, so auditing mid-swap silently
      // skips elements, which is how a genuine light-theme contrast failure
      // went undetected for several runs.
      await page.evaluate(() => document.fonts.ready);

      const results = await new AxeBuilder({ page })
        .withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ])
        .analyze();

      // Print details so failures are actionable rather than just a count.
      if (results.violations.length) {
        console.log(
          JSON.stringify(
            results.violations.map((violation) => ({
              id: violation.id,
              impact: violation.impact,
              help: violation.help,
              nodes: violation.nodes.map((node) => node.html).slice(0, 3),
            })),
            null,
            2,
          ),
        );
      }

      expect(results.violations).toEqual([]);
    });
  }

  test("landmarks and heading order are correct on the home page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);

    // Exactly one h1, and no heading level is skipped.
    await expect(page.locator("h1")).toHaveCount(1);

    const levels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));

    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test("skip link is the first tab stop and moves focus to main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: /skip to main content/i });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("every external link is safely rel-annotated", async ({ page }) => {
    await page.goto("/");
    const externals = page.locator('a[target="_blank"]');
    const count = await externals.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const rel = await externals.nth(i).getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  /**
   * Regression guard for a real bug: the design token named `base` made
   * Tailwind emit a *colour* utility `text-base`, which shadowed the built-in
   * font-size utility of the same name. Every `sm:text-base` element painted
   * its text in the page background colour and became invisible.
   *
   * axe did not catch it, colour-contrast findings it cannot resolve land in
   * `incomplete`, not `violations`, and the original assertion only checked
   * `violations`. This walks the real text and fails on anything that matches
   * its own background.
   */
  for (const route of ROUTES) {
    test(`${route} has no text painted in its own background colour`, async ({
      page,
    }) => {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);

      const invisible = await page.evaluate(() => {
        // Computed colours arrive in whatever space the author used, Chrome
        // returns lab() for some and oklab() for others, on different numeric
        // scales. Comparing those numbers directly is meaningless, so every
        // colour is normalised to sRGB by painting it to a canvas.
        const context = document
          .createElement("canvas")
          .getContext("2d", { willReadFrequently: true })!;

        const toRgba = (css: string): [number, number, number, number] => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = "#000000";
          context.fillStyle = css;
          context.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
          return [r, g, b, a / 255];
        };

        const over = (
          fg: [number, number, number, number],
          bg: [number, number, number, number],
        ): [number, number, number, number] => [
          fg[0] * fg[3] + bg[0] * (1 - fg[3]),
          fg[1] * fg[3] + bg[1] * (1 - fg[3]),
          fg[2] * fg[3] + bg[2] * (1 - fg[3]),
          1,
        ];

        const luminance = ([r, g, b]: number[]) => {
          const channel = (value: number) => {
            const v = value / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          };
          return (
            0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
          );
        };

        const contrast = (a: number[], b: number[]) => {
          const [lighter, darker] = [luminance(a), luminance(b)].sort(
            (x, y) => y - x,
          );
          return (lighter + 0.05) / (darker + 0.05);
        };

        /** Composite ancestor backgrounds until the stack is opaque. */
        const effectiveBackground = (
          element: Element,
        ): [number, number, number, number] => {
          const layers: [number, number, number, number][] = [];
          let node: Element | null = element;
          while (node) {
            const colour = toRgba(getComputedStyle(node).backgroundColor);
            if (colour[3] > 0) layers.push(colour);
            if (colour[3] >= 0.999) break;
            node = node.parentElement;
          }
          let result: [number, number, number, number] = [255, 255, 255, 1];
          for (let i = layers.length - 1; i >= 0; i -= 1) {
            result = over(layers[i], result);
          }
          return result;
        };

        const offenders: string[] = [];
        for (const element of Array.from(document.querySelectorAll("*"))) {
          const ownText = Array.from(element.childNodes)
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent?.trim() ?? "")
            .join("");
          if (!ownText) continue;

          const style = getComputedStyle(element);
          if (style.visibility === "hidden" || style.display === "none") continue;
          if (Number(style.opacity) === 0) continue;

          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;

          const fg = toRgba(style.color);
          if (fg[3] === 0) continue; // deliberately transparent text
          const bg = effectiveBackground(element);
          const composited = over(fg, bg);

          // 1.6:1 is far below any legibility standard, this only catches
          // text that is effectively painted in its own background colour.
          if (contrast(composited, bg) < 1.6) {
            offenders.push(
              `<${element.tagName.toLowerCase()} class="${element.className}"> "${ownText.slice(0, 50)}" fg=${style.color}`,
            );
          }
        }
        return offenders;
      });

      expect(invisible).toEqual([]);
    });
  }

  test("content is fully visible with JavaScript disabled", async ({
    browser,
  }) => {
    // The reveal animation must never be able to hide content permanently.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    // Derived from the content model rather than hardcoded, so renaming a
    // project cannot silently turn this assertion into a no-op.
    for (const project of projects.filter((entry) => entry.featured)) {
      await expect(
        page.getByRole("heading", { name: project.title, exact: true }),
      ).toBeVisible();
    }

    await context.close();
  });
});
