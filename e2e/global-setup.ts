import { request } from "@playwright/test";

import { ROUTES } from "./routes";

/**
 * Warm every route before the suite starts.
 *
 * `next start` serves prebuilt output, but the first request to each route
 * still pays a cost, and with several workers hitting a cold server at once
 * that was enough to blow the 30s timeout on whichever navigation-heavy test
 * happened to land first. The failure moved between tests run to run, which is
 * the signature of contention rather than a bug in any one test.
 *
 * Warming here makes the suite deterministic without hiding the problem behind
 * retries.
 */
export default async function globalSetup() {
  const baseURL = "http://127.0.0.1:3100";
  const context = await request.newContext({ baseURL });

  await Promise.all(
    ROUTES.map((route) => context.get(route).catch(() => undefined)),
  );

  await context.dispose();
}
