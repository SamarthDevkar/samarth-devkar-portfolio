import { expect, test } from "@playwright/test";

import { ROUTES } from "./routes";

test.describe("navigation", () => {
  test("primary nav reaches every page", async ({ page }) => {
    // Five full page loads plus assertions in one test. The default 30s budget
    // is tight against a cold server sharing CPU with other workers, and this
    // was the last remaining source of run-to-run flake.
    test.setTimeout(75_000);

    for (const label of [
      "Work",
      "Experience",
      "Capabilities",
      "About",
      "Contact",
    ]) {
      // Navigating fresh each time rather than goBack(): history restoration
      // races with hydration and made this assert flakily.
      await page.goto("/");
      await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: label, exact: true })
        .click();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}$`));
    }
  });

  test("active nav item is marked aria-current", async ({ page }) => {
    await page.goto("/work");
    const current = page
      .getByRole("navigation", { name: "Primary" })
      .locator('[aria-current="page"]');
    await expect(current).toHaveText("Work");
  });

  test("every internal link resolves", async ({ page, request }) => {
    const seen = new Set<string>();

    for (const route of ROUTES) {
      await page.goto(route);
      const hrefs = await page
        .locator('a[href^="/"]:not([href^="//"])')
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute("href") ?? ""),
        );
      for (const href of hrefs) seen.add(href.split("#")[0]);
    }

    for (const href of seen) {
      if (!href) continue;
      const response = await request.get(href);
      expect(response.status(), `${href} should resolve`).toBeLessThan(400);
    }
  });

  test("résumé PDF is downloadable", async ({ request }) => {
    const response = await request.get("/resume/Samarth-Devkar-Resume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });

  test("unknown routes render the 404 page", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /No signal at this address/i }),
    ).toBeVisible();
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, navigates and closes, restoring focus", async ({ page }) => {
    await page.goto("/");
    // The menu opens via an onClick that calls dialog.showModal(), so the
    // click must land after hydration. Without this the test races on a cold
    // server.
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: /open navigation menu/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(dialog).toBeVisible();

    // Escape is handled natively by <dialog>.
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();

    // And it can actually navigate.
    await trigger.click();
    await dialog.getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("command palette", () => {
  test("opens with the keyboard, filters, navigates, and closes", async ({
    page,
  }) => {
    await page.goto("/");
    // The ⌘K listener is attached in an effect, so on a cold server the
    // keypress can land before hydration. Wait for the network to settle
    // first, otherwise this races and fails intermittently.
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();

    const input = dialog.getByRole("combobox");
    await expect(input).toBeFocused();

    await input.fill("honeypot");
    await expect(dialog.getByRole("option")).toHaveCount(1);

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work\/ai-enhanced-ssh-honeypot$/);
    await expect(dialog).not.toBeVisible();
  });

  test("Escape closes it and returns focus to the trigger", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open command palette/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("arrow keys move the active option", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Command palette" });

    const first = dialog.getByRole("option").first();
    await expect(first).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowDown");
    await expect(first).toHaveAttribute("aria-selected", "false");
    await expect(dialog.getByRole("option").nth(1)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

test.describe("project filtering", () => {
  test("filters narrow the list and announce the count", async ({ page }) => {
    await page.goto("/work");

    await expect(page.getByRole("article")).toHaveCount(2);

    await page.getByRole("button", { name: "Linux Security" }).click();
    await expect(page.getByRole("article")).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Linux Security" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page.getByRole("article")).toHaveCount(2);
  });
});

test.describe("theme", () => {
  test("toggles and persists across a reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    const before = await html.getAttribute("class");
    await page.getByRole("button", { name: /switch colour theme/i }).click();
    const after = await html.getAttribute("class");
    expect(after).not.toBe(before);

    const isLight = (after ?? "").includes("light");
    await page.reload();
    await expect(html).toHaveClass(isLight ? /light/ : /dark/);
  });
});

test.describe("keyboard operability", () => {
  test("all header controls are reachable and focus is never trapped", async ({
    page,
  }) => {
    await page.goto("/");

    const reached: string[] = [];
    for (let i = 0; i < 24; i += 1) {
      await page.keyboard.press("Tab");
      const description = await page.evaluate(() => {
        const element = document.activeElement;
        if (!element || element === document.body) return "body";
        return `${element.tagName}:${element.textContent?.trim().slice(0, 24) ?? ""}`;
      });
      reached.push(description);
    }

    // Focus must move, never stick on one element (a trap).
    expect(new Set(reached).size).toBeGreaterThan(6);
    // And it must eventually leave the header into page content.
    expect(reached.join("|")).toMatch(/A:|BUTTON:/);
  });
});

test.describe("seo", () => {
  test("every route exposes canonical, title and description", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page).toHaveTitle(/Samarth Devkar/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);
    }
  });

  test("Person structured data is present and valid JSON", async ({ page }) => {
    await page.goto("/");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const data = JSON.parse(raw ?? "{}");
    const types = data["@graph"].map((node: { "@type": string }) => node["@type"]);
    expect(types).toContain("Person");
    expect(types).toContain("ProfilePage");
  });

  test("sitemap and robots are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/work/ai-enhanced-ssh-honeypot");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");
  });

  test("security headers are applied", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
