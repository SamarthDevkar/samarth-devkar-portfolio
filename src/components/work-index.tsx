"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/project-card";
import type { Project, ProjectDomain } from "@/content";

/**
 * Project index with domain filtering.
 *
 * All projects are rendered server-side and the filter narrows an already
 * present list, so the full set is in the HTML for crawlers and for anyone
 * without JavaScript. Filters are real buttons with `aria-pressed`, and the
 * result count is announced.
 */
export function WorkIndex({
  projects,
  domains,
}: {
  projects: readonly Project[];
  domains: readonly ProjectDomain[];
}) {
  const [active, setActive] = useState<ProjectDomain | null>(null);

  const filtered = useMemo(
    () =>
      active
        ? projects.filter((project) => project.domains.includes(active))
        : projects,
    [active, projects],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by domain">
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={`h-9 cursor-pointer rounded-md border px-3.5 text-sm transition-colors ${
            active === null
              ? "border-signal text-signal"
              : "border-line text-ink-3 hover:text-ink hover:border-line-strong"
          }`}
        >
          All
        </button>
        {domains.map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => setActive(domain)}
            aria-pressed={active === domain}
            className={`h-9 cursor-pointer rounded-md border px-3.5 text-sm transition-colors ${
              active === domain
                ? "border-signal text-signal"
                : "border-line text-ink-3 hover:text-ink hover:border-line-strong"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-ink-3 mt-6 font-mono text-xs">
        {filtered.length} of {projects.length} case stud
        {projects.length === 1 ? "y" : "ies"}
        {active ? ` · ${active}` : ""}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {filtered.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            headingLevel={2}
          />
        ))}
      </div>
    </div>
  );
}
