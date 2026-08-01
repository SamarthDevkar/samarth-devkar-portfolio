import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/section";
import { nav, projects, site, socials } from "@/content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-line border-t">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-h3 text-ink max-w-sm leading-snug">
              Seeking cybersecurity roles across offensive security, threat
              intelligence, cloud and application security, and AI security.
            </p>
            <p className="text-ink-3 mt-3 text-sm">
              Available from August 2026 · F1-OPT with STEM OPT eligibility
            </p>
            <a
              href={`mailto:${site.email}`}
              className="text-signal mt-5 inline-flex items-center gap-2 text-sm hover:underline"
            >
              {site.email}
            </a>
            <p className="text-ink-3 mt-2 text-sm">{site.location}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="label">Pages</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-2 hover:text-ink text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label">Elsewhere</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    {...(social.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-ink-2 hover:text-ink group inline-flex items-center gap-1.5 text-sm transition-colors"
                  >
                    {social.label}
                    {social.external ? (
                      <>
                        <ArrowUpRight
                          aria-hidden
                          className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </>
                    ) : null}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.resumePath}
                  download
                  className="text-ink-2 hover:text-ink text-sm transition-colors"
                >
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-line text-ink-3 flex flex-col gap-3 border-t py-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p className="font-mono">
            {projects.length} case studies · Built with Next.js
          </p>
        </div>
      </Container>
    </footer>
  );
}
