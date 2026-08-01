import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/ui/section";
import { availability, education, site, skillGroups } from "@/content";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a security engineer in Seattle working across security operations, threat intelligence, cloud security, application security and AI-assisted security analysis.`,
  alternates: { canonical: "/about" },
};

/**
 * Copy on this page is adapted from my LinkedIn About section, tightened for
 * the web and stripped of emoji bullets so it sits inside the design system.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="About"
        title="Security becomes powerful when curiosity turns into systems."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
            <div className="max-w-2xl">
              <div className="text-ink-2 text-lead flex flex-col gap-6">
                <p>
                  I&rsquo;m Samarth, a recent{" "}
                  <span className="text-ink">
                    M.S. Cybersecurity Engineering
                  </span>{" "}
                  graduate from the University of Washington, with a 3.93 GPA
                  and over a year of hands-on experience across security
                  operations, threat intelligence, cloud security, application
                  security and AI-assisted security analysis.
                </p>
                <p>
                  My work sits at the intersection of cybersecurity, AI and
                  automation. I built an AI-enhanced SSH honeypot that converts
                  raw attacker behaviour into IOCs, risk levels, behaviour
                  labels, rationale and analyst-ready summaries. I&rsquo;ve also
                  built Linux telemetry workflows, supported remediation of{" "}
                  <span className="text-ink">
                    18 API and web security findings
                  </span>
                  , and researched malware, phishing, ransomware, botnet and
                  data-breach activity.
                </p>
                <p>
                  That path has been deliberate: six-plus years building around
                  cybersecurity, from an undergraduate specialisation through
                  research, internships, threat analysis and AI-security
                  projects.
                </p>
              </div>

              <section aria-labelledby="focus" className="mt-14">
                <h2 id="focus" className="label">
                  What I focus on
                </h2>
                <dl className="mt-6 flex flex-col">
                  {skillGroups.slice(0, 5).map((group) => (
                    <div
                      key={group.id}
                      className="border-line grid gap-2 border-t py-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6"
                    >
                      <dt className="text-ink text-sm font-medium">
                        {group.title}
                      </dt>
                      <dd className="text-ink-3 text-sm leading-relaxed">
                        {group.skills.slice(0, 5).join(" · ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="seeking" className="mt-14">
                <h2
                  id="seeking"
                  className="font-display text-h2 text-ink font-semibold"
                >
                  What I&rsquo;m looking for
                </h2>
                <p className="text-ink-2 text-lead mt-5">
                  I&rsquo;m seeking cybersecurity roles across penetration
                  testing, threat intelligence, vulnerability management, cloud
                  security, application security, GRC, and AI security and
                  governance.
                </p>
                <p className="text-ink-2 mt-4 leading-relaxed">
                  {availability.authorisation} {availability.arrangements}
                </p>
              </section>

              <div className="mt-12 flex flex-wrap items-center gap-3">
                <Link
                  href="/work"
                  className="bg-signal text-signal-contrast inline-flex h-12 items-center rounded-md px-6 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  See the work
                </Link>
                <Link
                  href="/contact"
                  className="border-line hover:border-line-strong text-ink inline-flex h-12 items-center rounded-md border px-6 text-sm font-medium transition-colors"
                >
                  Get in touch
                </Link>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-signal/40 bg-surface rounded-lg border p-5">
                <h2 className="label text-signal">Availability</h2>
                <p className="text-ink mt-3 text-sm leading-snug">
                  {availability.status}
                </p>
                <p className="text-ink-3 mt-3 text-xs leading-relaxed">
                  F1-OPT from August 2026 · STEM OPT eligible
                </p>
              </div>

              <div className="border-line mt-8 border-t pt-6">
                <h2 className="label">Based in</h2>
                <p className="text-ink mt-3">{site.location}</p>
              </div>

              <div className="border-line mt-8 border-t pt-6">
                <h2 className="label">Education</h2>
                <ul className="mt-4 flex flex-col gap-5">
                  {education.map((entry) => (
                    <li key={entry.degree}>
                      <p className="text-ink text-sm leading-snug">
                        {entry.degree}
                      </p>
                      <p className="text-ink-3 mt-1.5 font-mono text-xs">
                        {entry.institution}
                      </p>
                      <p className="text-ink-3 font-mono text-xs">
                        {entry.period} · {entry.grade}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-line mt-8 border-t pt-6">
                <h2 className="label">Résumé</h2>
                <a
                  href={site.resumePath}
                  download
                  className="text-signal mt-3 inline-block text-sm hover:underline"
                >
                  Download PDF
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
