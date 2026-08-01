import { ArrowUpRight, CalendarClock, Download } from "lucide-react";
import type { Metadata } from "next";

import { CopyEmail } from "@/components/copy-email";
import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { availability, booking, site, socials } from "@/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about security engineering, detection engineering and threat intelligence roles, or research collaboration.`,
  alternates: { canonical: "/contact" },
};

/**
 * No contact form, deliberately.
 *
 * A form would need a transactional email provider, a server action, secret
 * management, spam protection and rate limiting: real infrastructure and a
 * real attack surface, to deliver a message that `mailto:` already delivers
 * from the visitor's own client, with a copy in their sent folder.
 */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title="Available from August 2026."
        lede="Open to cybersecurity roles across offensive security, threat intelligence, cloud and application security, detection engineering, GRC and AI security, or a research collaboration. Email is the fastest route."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="label">Email</h2>
              <CopyEmail email={site.email} />
              <p className="text-ink-3 mt-4 text-sm">
                Based in {site.location}.
              </p>

              {/* Renders only once a real booking link exists, a scheduling
                  button that goes nowhere is worse than no button. */}
              {booking.href ? (
                <div className="border-line bg-surface mt-10 rounded-lg border p-5">
                  <h2 className="label">Prefer to talk?</h2>
                  <p className="text-ink-2 mt-3 text-sm leading-relaxed">
                    {booking.description}
                  </p>
                  <a
                    href={booking.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-signal text-signal-contrast mt-5 inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium transition-opacity hover:opacity-90"
                  >
                    <CalendarClock aria-hidden className="size-4" />
                    {booking.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <p className="text-ink-3 mt-3 text-xs">
                    {booking.duration} · times shown in your local timezone
                  </p>
                </div>
              ) : null}

              <div className="border-signal/40 bg-surface mt-10 rounded-lg border p-5">
                <h2 className="label text-signal">Work authorisation</h2>
                <p className="text-ink-2 mt-3 text-sm leading-relaxed">
                  {availability.authorisation}
                </p>
                <p className="text-ink-2 mt-3 text-sm leading-relaxed">
                  {availability.arrangements}
                </p>
              </div>

              <div className="mt-10">
                <h2 className="label">Roles of interest</h2>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {availability.roles.map((role) => (
                    <li key={role}>
                      <Tag>{role}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="label">Elsewhere</h2>
              <ul className="mt-5 flex flex-col">
                {socials
                  .filter((social) => social.external)
                  .map((social) => (
                    <li key={social.platform} className="border-line border-t">
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between py-5"
                      >
                        <span className="text-ink text-base">
                          {social.label}
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="text-ink-3 group-hover:text-signal size-4 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                <li className="border-line border-y">
                  <a
                    href={site.resumePath}
                    download
                    className="group flex items-center justify-between py-5"
                  >
                    <span className="text-ink text-base">Résumé (PDF)</span>
                    <Download
                      aria-hidden
                      className="text-ink-3 group-hover:text-signal size-4 transition-colors"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
