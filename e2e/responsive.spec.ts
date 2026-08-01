import { expect, test } from "@playwright/test";

import { ROUTES, VIEWPORTS } from "./routes";

for (const viewport of VIEWPORTS) {
  test.describe(`viewport ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of ROUTES) {
      test(`${route} renders cleanly`, async ({ page }) => {
        const consoleErrors: string[] = [];
        const failedRequests: string[] = [];

        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("requestfailed", (request) => {
          failedRequests.push(`${request.url()}, ${request.failure()?.errorText}`);
        });
        page.on("response", (response) => {
          if (response.status() >= 400) {
            failedRequests.push(`${response.url()}, HTTP ${response.status()}`);
          }
        });

        await page.goto(route, { waitUntil: "networkidle" });

        // No horizontal overflow: the document must never be wider than the
        // viewport, at any breakpoint.
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);

        // Every image that exists must actually have loaded.
        const brokenImages = await page.evaluate(() =>
          Array.from(document.images)
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
        );
        expect(brokenImages).toEqual([]);

        expect(consoleErrors).toEqual([]);
        expect(failedRequests).toEqual([]);
      });
    }
  });
}
