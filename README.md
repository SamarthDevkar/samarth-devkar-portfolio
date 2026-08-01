# Samarth Devkar, Portfolio

My personal portfolio. I'm a security engineer working in AI security, threat intelligence and detection engineering.

**Live:** https://samarthdevkar.vercel.app

---

## Technology

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Static prerendering for all 14 routes, first-class metadata and OG image generation |
| UI | React 19 | Server Components by default; client code only where there is real interaction |
| Language | TypeScript (strict) | The content model is typed, so missing data is a compile error rather than a blank page |
| Styling | Tailwind CSS v4 | Design tokens defined once in `@theme`, consumed semantically |
| Icons | lucide-react | One consistent icon set |
| Testing | Playwright + axe-core | 93 tests covering accessibility, responsive layout, keyboard operation, SEO and headers |
| Auditing | Lighthouse | Run against the production build with default throttling |

**No animation library.** The two animations that genuinely needed JavaScript, a scroll progress bar and one count-up, are about fifteen lines each of `requestAnimationFrame` and `IntersectionObserver`. Everything else is CSS. Removing the library dropped 28 KiB of unused JavaScript.

**No backend.** No API routes, no server actions, no database, no runtime environment variables, no secrets.

## Results

Measured against live production:

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 96 | 100 | 100 | 100 | 1.8s | 0 |
| `/work/ai-enhanced-ssh-honeypot` | 100 | 100 | 100 | 100 | 1.5s | 0 |
| `/contact` | 100 | 100 | 100 | 100 | 1.2s | 0 |

axe reports zero WCAG 2.2 A/AA violations across all eight routes, in both light and dark themes. `npm audit --omit=dev` reports zero production vulnerabilities.

## Local setup

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Commands

```bash
npm run dev         # dev server (Turbopack)
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run verify      # typecheck + lint + build
npm test            # Playwright suite (builds, serves on :3100)
npm run test:report # open the last HTML test report
npm run shots       # screenshots at three breakpoints
```

Lighthouse, against a running production server:

```bash
node scripts/lighthouse.mjs / /work /about
```

## Environment variables

None. The site is fully static.

## Content

All written content lives in `src/content/`, never in JSX.

| File | Contains |
| --- | --- |
| `site.ts` | Name, role, positioning, intro, achievement list, availability, booking, contact, nav |
| `projects.ts` | Case studies: problem, what was built, the hard part, stack, pipeline stages, evaluation, links |
| `career.ts` | Experience, education, publications, honours, certifications |
| `skills.ts` | Capability groups and the projects that evidence them |
| `types.ts` | The typed contract for all of the above |

To add a project, append to `projects.ts`. The work index, filters, command palette, sitemap, static params and JSON-LD all derive from that array.

To replace the résumé, overwrite `public/resume/Samarth-Devkar-Resume.pdf`, keeping the filename so existing links and the download test keep working.

## Documentation

| Document | Contents |
| --- | --- |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens, type scale, motion, components, accessibility rules |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel workflow, domain preservation, rollback |
| [docs/QA_REPORT.md](docs/QA_REPORT.md) | Test, accessibility, performance and security results |
