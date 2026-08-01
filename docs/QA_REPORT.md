# QA Report

**Stack:** Next.js 16.2, React 19.2, Tailwind 4.3, Node 24.18 LTS
**Scope:** local production build plus verification against live production.

---

## 1. Gates

| Gate | Result |
| --- | --- |
| `tsc --noEmit` | Pass, 0 errors |
| `eslint .` | Pass, 0 errors, 0 warnings |
| `next build` | Pass, 14 routes, all statically prerendered |
| `playwright test` | **93/93 passing** across consecutive cold runs |
| `npm audit --omit=dev` | **0 vulnerabilities** |

## 2. Test coverage

### Viewports

360x800, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080, across all eight routes. Each asserts no horizontal overflow, no console errors, no failed network requests and no broken images.

### Routes

`/` `/work` `/work/ai-enhanced-ssh-honeypot` `/work/linux-os-telemetry` `/experience` `/capabilities` `/about` `/contact`

### Journeys

Primary nav reaches every page; `aria-current` marks the active item; every internal link resolves (crawled from all eight routes); the résumé PDF downloads with the correct MIME type; unknown routes return a real HTTP 404; the mobile menu opens, navigates and closes with focus restored; the command palette opens on `Ctrl+K`, filters, navigates on Enter and closes on Escape with focus restored; arrow keys move the active option; project filters narrow the list and set `aria-pressed`; the theme toggles and persists across a reload; focus is never trapped; and the whole page renders with JavaScript disabled.

### SEO

Every route exposes a title, canonical link and description over 50 characters. JSON-LD parses and contains `Person` and `ProfilePage`. The sitemap lists case-study URLs with absolute production URLs. `robots.txt` declares the sitemap. Security headers are asserted on the response.

### Copy style

`e2e/content.spec.ts` walks rendered text on every route and fails on any em dash, including in titles and meta descriptions.

## 3. Accessibility

**axe-core 4.12, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`. Zero violations across all eight routes.**

The audit waits for `document.fonts.ready` before analysing. axe derives its contrast threshold from computed font size and weight, so auditing mid-swap silently skips elements and can pass a page that actually fails.

Verified beyond axe:

- The skip link is the first tab stop, becomes visible on focus, and moves focus to `#main`.
- Exactly one `<h1>` per page, and no heading level is skipped (asserted programmatically).
- Landmarks: one `header`, one `main#main`, one `footer`.
- Both modals use native `<dialog>`, so focus trapping, Escape and focus restoration are the platform's.
- Every external link carries `rel="noopener noreferrer"` plus a screen-reader note.
- The hero visualisation is `aria-hidden`; everything it depicts also exists as text.
- A dedicated test walks every text node, normalises colours through a canvas, and fails on anything under 1.6:1 against its composited background. This catches text painted in its own background colour, which axe reports as *incomplete* rather than a violation and is therefore easy to miss.

### Issues found and fixed

| # | Issue | Severity | Resolution |
| --- | --- | --- | --- |
| 1 | The selected-work section rendered completely empty. The reveal wrapper server-rendered `opacity: 0` and relied on an IntersectionObserver that never fired, permanently hiding both project cards. | Critical | Rewrote the reveal CSS-first: visible by default, hidden only under `.js`, with a timeout backstop and a reduced-motion opt-out. Regression-tested with JavaScript disabled. |
| 2 | Hydration mismatch from the same component branching on reduced motion. | High | Eliminated by the same rewrite. Markup is now identical on both sides. |
| 3 | Heading-order violation on `/work`, where `h1` was followed directly by `h3` project titles. | Moderate | `ProjectCard` takes a `headingLevel` prop; the work index renders `h2`. |
| 4 | React purity violations in the command palette: refs read during render, and a mutable cursor reassigned inside `map`. | Moderate | Items restructured as declarative data with side effects moved into event handlers. |
| 5 | A design token named `base` made Tailwind emit a colour utility `text-base` that shadowed the built-in font-size utility, so every `sm:text-base` element painted its text in the page background colour and became invisible. Ten elements affected, including the role line under the name. | High | Token renamed to `canvas`, plus the contrast guard described above. |
| 6 | The light theme failed WCAG AA contrast: `--ink-3` at 4.0:1 and `--signal` at 3.98:1 on the white card surface, below the 4.5:1 minimum for the 12px monospace metadata using them. | Serious | Both light tokens darkened. The audit now awaits webfont load, which is what made the failure detectable. |
| 7 | Run-to-run test flake: whichever navigation-heavy test ran first against a cold server could exceed its 30s budget. | Low | A `globalSetup` warms every route, hydration-dependent interactions wait for network idle, and the five-navigation test gets a realistic timeout. Verified across consecutive cold runs rather than assumed. |
| 8 | Uneven project card heights in the grid. | Low | `h-full` on the card and its wrapper. |

## 4. Performance

Lighthouse against **live production**:

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 96 | 100 | 100 | 100 | 1.8s | 0 | 60ms |
| `/work/ai-enhanced-ssh-honeypot` | 100 | 100 | 100 | 100 | 1.5s | 0 | 10ms |
| `/contact` | 100 | 100 | 100 | 100 | 1.2s | 0 | 10ms |

The same build measures LCP around 2.8s locally under Lighthouse's simulated slow-4G with 4x CPU throttling. The gap is the CDN, and it is the reason local throttled figures should not be treated as user-facing numbers.

Two changes drove the improvement: dropping the animation library after Lighthouse flagged 28 KiB of unused JavaScript, and reducing from three font families to two.

## 5. Security

### Dependencies

- **Production: 0 vulnerabilities** (`npm audit --omit=dev`).
- Fixed via overrides: `sharp` to 0.35.3 and `postcss` to 8.5.25, both for advisories in transitive copies.
- Remaining findings are dev-only and unfixable upstream: a `brace-expansion` denial-of-service reachable through `minimatch` in the ESLint toolchain. Both installed versions are already the newest published, so no patch exists. These never enter the production bundle and only execute when linting locally. Accepted risk.
- `npm audit fix --force` proposes downgrading Next.js to 9.3.3. It must not be run.

### Headers

Asserted in tests and verified on production: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera, microphone, geolocation, payment and USB, `Strict-Transport-Security` with a two-year max-age, and no `X-Powered-By`.

**CSP note:** `script-src` includes `'unsafe-inline'`. Removing it requires per-request nonces, which would force all 14 static routes to render dynamically and give up CDN caching. With no authentication, no user input reaching a server, no third-party scripts and no dynamic data, there is no injection vector for the policy to contain. Revisit the moment a form, CMS, comment system or analytics vendor is added.

### Code review

- No API routes, no server actions, no database, no environment variables, no secrets. Verified by search.
- Two `dangerouslySetInnerHTML` uses, both static and self-authored: the pre-paint theme script, which interpolates nothing, and the JSON-LD block, where `<` is escaped so a future content edit cannot break out of the script element.
- The only user-controlled string is the command-palette query, used solely for client-side filtering and rendered as text. No `innerHTML`, no `eval`, no dynamic URL construction.
- No open redirects. Every link target is a compile-time constant.
- Client source maps are not emitted in production.

### Booking integration

The contact page links to a Google Calendar appointment schedule.

**This site's side is clean.** Every booking anchor carries `rel="noopener noreferrer"` and `target="_blank"`. The CSP was not modified to accommodate a vendor. No third-party JavaScript, CSS, fonts or pixels are loaded; external hosts appear only as `href` targets the user must click. The URL is a compile-time constant. This is the payoff for choosing a link over an embedded widget: the feature adds no attack surface and no tracking.

**Google's booking page** provides HTTPS with HSTS, `nosniff`, `Cross-Origin-Opener-Policy: same-origin`, `object-src 'none'`, `base-uri 'self'` and Trusted Types. It does **not** send `frame-ancestors` or `X-Frame-Options`, so the page can be framed by any origin. That is Google's choice and not fixable here. No personal data beyond the display name appears in its HTML.

**Residual operational risks**, inherent to publishing a booking endpoint: anyone can book, since Google offers no CAPTCHA or email verification, so buffer time and a daily cap are worth setting; the page discloses free and busy windows; enabling guest invitations lets a booker add attendees to the call; and a booked call is a social-engineering opportunity, so verify identity before discussing anything sensitive.

### Personal data

- Email is published, since it is the résumé's stated contact channel.
- The phone number is excluded from the site's HTML, verified absent from every rendered page. It remains present inside the downloadable résumé PDF, which is served as a static file, so it is publicly reachable and indexable. Removing it from HTML reduces casual scraping but does not make it private. Publishing a phone-free résumé variant is the fix if that matters.
- Location is city-level only.

## 6. Not tested

- Chromium only. No Firefox or WebKit run, and no real iOS or Android device.
- No screen-reader pass. axe and keyboard testing are automated proxies, not a substitute for NVDA or VoiceOver.
- No visual-regression baseline. Screenshots are captured for review, not diffed.
- Social preview cards render correctly as images but have not been round-tripped through LinkedIn or X.
