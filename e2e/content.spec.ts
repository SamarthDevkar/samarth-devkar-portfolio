import { expect, test } from "@playwright/test";

import { ROUTES } from "./routes";

/**
 * House style: no em dashes in visitor-facing copy.
 *
 * En dashes remain fine in numeric ranges such as "Sep 2025 to Jun 2026".
 *
 * The character is written as the escape \u2014 rather than literally, so a
 * find-and-replace pass over this repository cannot silently rewrite the thing
 * this test is looking for and turn the assertion into a no-op.
 *
 * Checked against rendered text rather than source, so it also catches copy
 * arriving through metadata, JSON-LD or the content model.
 */
const EM_DASH = "\u2014";

test.describe("copy style", () => {
  for (const route of ROUTES) {
    test(`${route} contains no em dashes in visible text`, async ({ page }) => {
      await page.goto(route);

      const offenders = await page.evaluate((needle) => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
        );
        const found: string[] = [];
        let node = walker.nextNode();
        while (node) {
          const text = node.textContent ?? "";
          if (text.includes(needle)) {
            const parent = node.parentElement?.tagName.toLowerCase() ?? "?";
            found.push(`<${parent}> ${text.trim().slice(0, 80)}`);
          }
          node = walker.nextNode();
        }
        return found;
      }, EM_DASH);

      expect(offenders).toEqual([]);
    });
  }

  test("page title and meta description contain no em dashes", async ({
    page,
  }) => {
    for (const route of ROUTES) {
      await page.goto(route);

      const title = await page.title();
      expect(title, `${route} title`).not.toContain(EM_DASH);

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description ?? "", `${route} description`).not.toContain(EM_DASH);
    }
  });
});
