# Deployment

Live at **https://samarthdevkar.vercel.app**, hosted on Vercel.

## Project

| Field | Value |
| --- | --- |
| Vercel project | `portfolio` |
| Framework preset | Next.js, pinned in `vercel.json` |
| Build command | `npm run build` |
| Install command | `npm install` |
| Node version | 22.x |
| Environment variables | none |
| Custom domains | none |

`samarthdevkar.vercel.app` is the auto-assigned production alias rather than a custom domain, so deploying to this project's production target keeps the URL automatically. There is no DNS record to manage.

The framework preset is declared in `vercel.json` rather than only in the dashboard, so it travels with the code and cannot silently drift.

## Routine deployment

```bash
npm run verify        # typecheck, lint, build
npm test              # 93 Playwright tests
vercel deploy         # preview
```

Preview deployments sit behind Vercel's Deployment Protection, so an unauthenticated request returns Vercel's sign-in page rather than the site. Verify a preview with `vercel curl <url>`, which authenticates, or in a browser signed in to the Vercel account. Production is not affected by this; the production alias is publicly reachable.

## Going to production

Two steps, deliberately:

```bash
vercel deploy --prod --skip-domain    # publish, but do not move the domain
# verify the immutable URL that comes back
vercel promote <deployment-url>       # move the domain onto the verified build
```

`--skip-domain` publishes to the production target without repointing the alias. That leaves a window to verify the real production build before visitors see it, so a broken build is never briefly live. Only promote once the checks below pass.

## Pre-production checklist

- [ ] `npm run verify` clean
- [ ] `npm test` green
- [ ] `npm audit --omit=dev` reports no vulnerabilities
- [ ] Working tree clean and pushed

## Post-production checklist

- [ ] All eight routes return 200
- [ ] `sitemap.xml`, `robots.txt`, `opengraph-image` and the résumé PDF return 200 with correct content types
- [ ] An unknown route returns a real 404
- [ ] The sitemap contains absolute production URLs
- [ ] The site's own security headers are present, not Vercel's sign-in page headers
- [ ] Lighthouse run against the live URL

## Rollback

Previous production deployments stay reachable at their immutable URLs after the alias moves, which is what makes rollback instant.

1. **Fastest:** Vercel dashboard, Deployments, select the previous production deployment, then **Promote to Production**. Seconds, no rebuild.
2. **From the CLI:** `vercel promote <previous-deployment-url>`.

Verify the live URL serves the expected build before investigating anything further.

## Notes

- Vercel sets HSTS at the edge. The application also sets it, along with CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` via `next.config.ts`. Confirm these are not stripped or duplicated after a deploy.
- `poweredByHeader` is disabled and client source maps are not emitted in production.
- Analytics is not configured. If Vercel Analytics is added later, install `@vercel/analytics` and extend the CSP `connect-src` accordingly.
- `.vercelignore` keeps test output, screenshots and Lighthouse reports out of the upload, which keeps deployments fast.
