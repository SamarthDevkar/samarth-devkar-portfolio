import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/ui/section";
import { getProject, skillGroups } from "@/content";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Security engineering, detection and analysis, systems and networking, tooling, and programming, grouped by capability and tied to the projects that evidence them.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHeader
        kicker="Capabilities"
        title="Grouped by the work, not by the alphabet."
        lede="No proficiency percentages, because they would be invented. Each group instead links to the project that demonstrates it."
      />

      <Section>
        <Container>
          <div className="flex flex-col">
            {skillGroups.map((group, index) => (
              <section
                key={group.id}
                aria-labelledby={`${group.id}-heading`}
                className="border-line grid gap-6 border-t py-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16"
              >
                <div>
                  <p className="label text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2
                    id={`${group.id}-heading`}
                    className="font-display text-h3 text-ink mt-4"
                  >
                    {group.title}
                  </h2>
                  <p className="text-ink-3 mt-3 text-sm leading-relaxed">
                    {group.description}
                  </p>
                </div>

                <div>
                  <ul className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="border-line bg-surface text-ink-2 rounded-md border px-3 py-1.5 font-mono text-xs"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7">
                    <p className="label">Evidenced by</p>
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {group.evidence.map((slug) => {
                        const project = getProject(slug);
                        if (!project) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/work/${project.slug}`}
                              className="text-signal text-sm hover:underline"
                            >
                              {project.shortTitle}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
