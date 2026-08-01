import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Container, Section, SectionHeading } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import {
  certifications,
  education,
  experience,
  honours,
  publications,
} from "@/content";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Security analyst and security research experience, MS Cybersecurity Engineering at the University of Washington, an IEEE ICDCS 2026 publication, and CompTIA Security+.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        kicker="Experience"
        title="Where the detection work has been done."
        lede="Two security roles, two degrees, and one international conference demonstration, listed with what was actually contributed rather than what the job description said."
      />

      <Section labelledBy="roles-heading">
        <Container>
          <SectionHeading
            id="roles-heading"
            index="01"
            kicker="Professional"
            title="Roles"
          />

          <ol className="mt-14 flex flex-col">
            {experience.map((entry) => (
              <li
                key={entry.slug}
                className="border-line grid gap-6 border-t py-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16"
              >
                <div>
                  <p className="label">{entry.period}</p>
                  <p className="text-ink-3 mt-2 font-mono text-xs">
                    {entry.location}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {entry.focus.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-h3 text-ink">{entry.role}</h3>
                  <p className="text-signal mt-1.5 font-mono text-sm">
                    {entry.organisation}
                  </p>
                  <ul className="mt-6 flex flex-col gap-4">
                    {entry.contributions.map((contribution) => (
                      <li key={contribution} className="flex gap-4">
                        <span
                          aria-hidden
                          className="bg-line-strong mt-2.5 size-1.5 shrink-0 rounded-full"
                        />
                        <span className="text-ink-2 leading-relaxed">
                          {contribution}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="education-heading" className="border-line border-t">
        <Container>
          <SectionHeading
            id="education-heading"
            index="02"
            kicker="Education"
            title="Degrees"
          />

          <ol className="mt-14 flex flex-col">
            {education.map((entry) => (
              <li
                key={entry.degree}
                className="border-line grid gap-6 border-t py-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16"
              >
                <div>
                  <p className="label">{entry.period}</p>
                  <p className="text-ink-3 mt-2 font-mono text-xs">
                    {entry.location}
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-h3 text-ink">
                    {entry.degree}
                  </h3>
                  {entry.specialisation ? (
                    <p className="text-ink-2 mt-1.5 text-sm">
                      {entry.specialisation}
                    </p>
                  ) : null}
                  <p className="text-signal mt-3 font-mono text-sm">
                    {entry.institution}
                  </p>
                  <p className="text-ink-3 mt-1.5 font-mono text-xs">
                    {entry.grade}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="research-heading" className="border-line border-t">
        <Container>
          <SectionHeading
            id="research-heading"
            index="03"
            kicker="Research & credentials"
            title="Internationally published, awarded, certified"
          />

          <div className="mt-14 flex flex-col">
            {publications.map((publication) => (
              <div
                key={publication.title}
                className="border-line grid gap-6 border-t py-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16"
              >
                <p className="label">{publication.kind}</p>
                <div>
                  <h3 className="text-ink text-lg leading-snug">
                    {publication.title}
                  </h3>
                  <p className="text-signal mt-3 font-mono text-sm">
                    {publication.venue}
                  </p>
                  {publication.note ? (
                    <p className="text-ink-3 mt-2 text-sm leading-relaxed">
                      {publication.note}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}

            {honours.map((honour) => (
              <div
                key={honour.title}
                className="border-line grid gap-6 border-t py-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16"
              >
                <p className="label">Honour</p>
                <div>
                  <h3 className="text-ink text-lg leading-snug">
                    {honour.title}
                  </h3>
                  <p className="text-ink-3 mt-3 font-mono text-sm">
                    {honour.issuer} · {honour.year}
                  </p>
                </div>
              </div>
            ))}

            {certifications.map((certification) => (
              <div
                key={certification.title}
                className="border-line grid gap-6 border-t py-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16"
              >
                <p className="label">Certification</p>
                <div>
                  <h3 className="text-ink text-lg leading-snug">
                    {certification.title}
                  </h3>
                  <p className="text-ink-3 mt-3 font-mono text-sm">
                    {certification.issuer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
