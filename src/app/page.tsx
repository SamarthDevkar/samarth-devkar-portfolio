import { ArrowRight, ArrowUpRight, CalendarClock, Download } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SignatureVisual } from "@/components/signature-visual";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import {
  booking,
  certifications,
  featuredProjects,
  honours,
  introHighlights,
  publications,
  site,
  skillGroups,
  socials,
} from "@/content";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="grid-field pointer-events-none absolute inset-0 opacity-60"
        />
        <Container className="relative">
          <div className="grid items-center gap-14 pt-32 pb-20 sm:pt-40 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pb-28">
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="label flex items-center gap-3">
                  <span aria-hidden className="bg-signal size-1.5 rounded-full" />
                  {site.location}
                </p>
                <p className="label border-signal/40 text-signal rounded-full border px-2.5 py-1">
                  Available August 2026
                </p>
              </div>

              <h1 className="font-display text-display text-ink mt-7 font-semibold">
                {site.name}
              </h1>

              <p className="text-signal mt-5 font-mono text-sm tracking-wide sm:text-base">
                {site.roleLong}
              </p>

              <p className="text-ink-2 text-lead mt-7 max-w-2xl">
                {site.intro}
              </p>

              <ul className="mt-8 flex flex-col gap-3">
                {introHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="bg-signal mt-2.5 size-1.5 shrink-0 rounded-full"
                    />
                    <span className="text-ink-2 text-sm leading-relaxed sm:text-base">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/work"
                  className="bg-signal text-signal-contrast group inline-flex h-12 items-center gap-2 rounded-md px-6 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  View selected work
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <a
                  href={site.resumePath}
                  download
                  className="border-line hover:border-line-strong text-ink inline-flex h-12 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors"
                >
                  <Download aria-hidden className="size-4" />
                  Résumé
                </a>
              </div>

              <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                {socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.href}
                      {...(social.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-ink-3 hover:text-ink group inline-flex items-center gap-1.5 text-sm transition-colors"
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
              </ul>
            </div>

            {/* Signature visualisation with its text equivalent below. */}
            <figure className="lg:pl-6">
              <SignatureVisual />
              <figcaption className="border-line mt-4 border-t pt-4">
                <p className="text-ink-3 text-xs leading-relaxed">
                  <span className="text-ink-2">Session → Signal.</span> A model
                  of the honeypot triage pipeline: attacker sessions are safely
                  emulated and captured, enriched into behaviour labels, IOCs
                  and risk levels, then streamed to a SOC-style dashboard for
                  triage. This diagram depicts the architecture. It is not a
                  live data feed.
                </p>
              </figcaption>
            </figure>
          </div>
        </Container>
      </div>

      {/* ── Selected work ────────────────────────────────────── */}
      <Section
        id="work"
        labelledBy="work-heading"
        className="border-line border-t"
      >
        <Container>
          <SectionHeading
            id="work-heading"
            index="01"
            kicker="Selected work"
            title="Two systems built to make attacker behaviour readable."
            description="Both start from the same premise: capture is the easy part. Interpretation is the job."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.08} className="h-full">
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>

          <Link
            href="/work"
            className="text-ink-2 hover:text-ink group mt-10 inline-flex items-center gap-2 text-sm transition-colors"
          >
            All work
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Container>
      </Section>

      {/* ── Capabilities ─────────────────────────────────────── */}
      <Section labelledBy="capabilities-heading" className="border-line border-t">
        <Container>
          <SectionHeading
            id="capabilities-heading"
            index="02"
            kicker="Capabilities"
            title="Grouped by what the work actually requires."
          />

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.slice(0, 3).map((group) => (
              <li
                key={group.id}
                className="border-line bg-surface rounded-lg border p-6"
              >
                <h3 className="text-ink text-base font-medium">{group.title}</h3>
                <p className="text-ink-3 mt-2 text-sm leading-relaxed">
                  {group.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {group.skills.slice(0, 5).map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                  {group.skills.length > 5 ? (
                    <Tag tone="signal">+{group.skills.length - 5}</Tag>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/capabilities"
            className="text-ink-2 hover:text-ink group mt-10 inline-flex items-center gap-2 text-sm transition-colors"
          >
            Full capability breakdown
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Container>
      </Section>

      {/* ── Evidence ─────────────────────────────────────────── */}
      <Section labelledBy="evidence-heading" className="border-line border-t">
        <Container>
          <SectionHeading
            id="evidence-heading"
            index="03"
            kicker="Research & credentials"
            title="Internationally published, awarded, certified."
          />

          <dl className="mt-14 grid gap-8 lg:grid-cols-3">
            <div className="border-line border-t pt-6">
              <dt className="label">Publication</dt>
              {publications.map((publication) => (
                <dd key={publication.title} className="mt-4">
                  <p className="text-ink text-base leading-snug">
                    {publication.title}
                  </p>
                  <p className="text-signal mt-2 font-mono text-xs">
                    {publication.venue}
                  </p>
                  {publication.note ? (
                    <p className="text-ink-3 mt-2 text-xs leading-relaxed">
                      {publication.note}
                    </p>
                  ) : null}
                </dd>
              ))}
            </div>

            <div className="border-line border-t pt-6">
              <dt className="label">Honour</dt>
              {honours.map((honour) => (
                <dd key={honour.title} className="mt-4">
                  <p className="text-ink text-base leading-snug">
                    {honour.title}
                  </p>
                  <p className="text-ink-3 mt-2 font-mono text-xs">
                    {honour.issuer} · {honour.year}
                  </p>
                </dd>
              ))}
            </div>

            <div className="border-line border-t pt-6">
              <dt className="label">Certification</dt>
              {certifications.map((certification) => (
                <dd key={certification.title} className="mt-4">
                  <p className="text-ink text-base leading-snug">
                    {certification.title}
                  </p>
                  <p className="text-ink-3 mt-2 font-mono text-xs">
                    {certification.issuer}
                  </p>
                </dd>
              ))}
            </div>
          </dl>
        </Container>
      </Section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <Section labelledBy="contact-heading" className="border-line border-t">
        <Container>
          <div className="max-w-3xl">
            <h2
              id="contact-heading"
              className="font-display text-h1 text-ink font-semibold"
            >
              Looking for someone who turns security data into decisions.
            </h2>
            <p className="text-ink-2 text-lead mt-6">
              I&rsquo;m seeking cybersecurity roles across penetration testing,
              threat intelligence, vulnerability management, cloud security,
              application security, detection engineering, GRC and AI security.
              Authorised to work in the U.S. on F1-OPT from August 2026, with
              STEM OPT eligibility.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="bg-signal text-signal-contrast inline-flex h-12 items-center gap-2 rounded-md px-6 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {site.email}
              </a>
              {booking.href ? (
                <a
                  href={booking.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-line hover:border-line-strong text-ink inline-flex h-12 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors"
                >
                  <CalendarClock aria-hidden className="size-4" />
                  {booking.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
              <Link
                href="/contact"
                className="border-line hover:border-line-strong text-ink inline-flex h-12 items-center gap-2 rounded-md border px-6 text-sm font-medium transition-colors"
              >
                All contact details
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
