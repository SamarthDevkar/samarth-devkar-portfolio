import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/ui/tag";
import type { Project } from "@/content";

/**
 * `headingLevel` exists because the correct level depends on the surrounding
 * page. On the home page these cards sit under a section h2, so h3 is right.
 * On the work index there is no intervening h2, so they must be h2 or the
 * document skips a level, a real WCAG 2.2 heading-order failure, caught by
 * axe in e2e/a11y.spec.ts.
 */
export function ProjectCard({
  project,
  index,
  headingLevel = 3,
}: {
  project: Project;
  index: number;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="border-line bg-surface hover:border-line-strong group relative flex h-full flex-col rounded-lg border p-6 transition-colors sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="label text-signal">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="label">{project.period}</span>
      </div>

      <Heading className="font-display text-h3 text-ink mt-6 leading-snug">
        {/* Stretched link: the whole card is the target, but the accessible
            name stays the project title and there is only one tab stop. */}
        <Link href={`/work/${project.slug}`} className="before:absolute before:inset-0">
          {project.title}
        </Link>
      </Heading>

      <p className="text-ink-2 mt-3 text-sm leading-relaxed">{project.tagline}</p>

      {/* Pipeline stage strip, the shape of the system at a glance. */}
      <ol className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {project.stages.map((stage, stageIndex) => (
          <li key={stage.id} className="flex items-center gap-1.5">
            <span className="border-line text-ink-3 rounded-xs border px-1.5 py-0.5 font-mono text-[0.65rem]">
              {stage.label}
            </span>
            {stageIndex < project.stages.length - 1 ? (
              <span aria-hidden className="bg-line h-px w-2.5" />
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-auto pt-8">
        <div className="flex flex-wrap gap-1.5">
          {project.domains.map((domain) => (
            <Tag key={domain}>{domain}</Tag>
          ))}
        </div>
        <p className="text-signal mt-6 inline-flex items-center gap-2 text-sm">
          Read case study
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </p>
      </div>
    </article>
  );
}
