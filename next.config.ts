import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `script-src` includes 'unsafe-inline' deliberately. Removing it requires
 * per-request nonces, which in the App Router means `proxy.ts` must run on
 * every request, turning 14 statically prerendered pages into dynamically
 * rendered ones and giving up CDN caching. For a site with no authentication,
 * no user input, no third-party scripts and no server-side data, that trade is
 * not worth it: there is no injection vector for the policy to contain.
 *
 * If a form, comment system, analytics vendor or CMS is ever added, revisit
 * this and move to nonces, the calculus changes the moment untrusted content
 * can reach the page.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Fail the production build on type errors rather than shipping them.
  typescript: { ignoreBuildErrors: false },

  // Source maps are not emitted for the client bundle in production, so the
  // component tree and comments are not served to visitors.
  productionBrowserSourceMaps: false,

  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
