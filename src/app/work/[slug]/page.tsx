import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PipelineDiagram } from "@/components/pipeline-diagram";
import { Container, Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { getProject, projects, publications, site } from "@/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.shortTitle,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} · ${site.name}`,
      description: project.summary,
      url: `${site.url}/work/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((entry) => entry.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const relatedPublication = publications.find(
    (publication) => publication.relatedProjectSlug === project.slug,
  );

  return (
    <article>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="border-line relative overflow-hidden border-b">
        <div
          aria-hidden
          className="grid-field pointer-events-none absolute inset-0 opacity-50"
        />
        <Container className="relative">
          <div className="pt-32 pb-16 sm:pt-40 sm:pb-20">
            <Link
              href="/work"
              className="text-ink-3 hover:text-ink group inline-flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft
                aria-hidden
                className="size-4 transition-transform group-hover:-translate-x-1"
              />
              All work
            </Link>

            <p className="label mt-10">{project.period}</p>
            <h1 className="font-display text-h1 text-ink mt-4 max-w-4xl font-semibold">
              {project.title}
            </h1>
            <p className="text-ink-2 text-lead mt-6 max-w-2xl">
              {project.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {project.domains.map((domain) => (
                <Tag key={domain} tone="signal">
                  {domain}
                </Tag>
              ))}
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {project.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-signal group inline-flex items-center gap-1.5 text-sm hover:underline"
                    >
                      {link.label}
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="text-ink-2 text-sm">{link.label}</span>
                  )}
                  {link.caveat ? (
                    <span className="text-ink-3 mt-1 block max-w-xs text-xs">
                      {link.caveat}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      {/* ── Narrative ────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="label">Stack</h2>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>

              <h2 className="label mt-10">Role</h2>
              <p className="text-ink-2 mt-4 text-sm leading-relaxed">
                {project.role}
              </p>

              {relatedPublication ? (
                <>
                  <h2 className="label mt-10">Published as</h2>
                  <p className="text-ink mt-4 text-sm leading-snug">
                    {relatedPublication.title}
                  </p>
                  <p className="text-signal mt-2 font-mono text-xs">
                    {relatedPublication.venue}
                  </p>
                  {relatedPublication.note ? (
                    <p className="text-ink-3 mt-2 text-xs leading-relaxed">
                      {relatedPublication.note}
                    </p>
                  ) : null}
                </>
              ) : null}
            </aside>

            <div className="max-w-2xl">
              <section aria-labelledby="problem">
                <h2 id="problem" className="font-display text-h2 text-ink font-semibold">
                  The problem
                </h2>
                <p className="text-ink-2 text-lead mt-5">{project.problem}</p>
              </section>

              <section aria-labelledby="built" className="mt-16">
                <h2 id="built" className="font-display text-h2 text-ink font-semibold">
                  What I built
                </h2>
                <ul className="mt-6 flex flex-col gap-4">
                  {project.built.map((item) => (
                    <li key={item} className="flex gap-4">
                      <span
                        aria-hidden
                        className="bg-signal mt-2.5 size-1.5 shrink-0 rounded-full"
                      />
                      <span className="text-ink-2 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="challenge" className="mt-16">
                <h2
                  id="challenge"
                  className="font-display text-h2 text-ink font-semibold"
                >
                  The hard part
                </h2>
                <p className="text-ink-2 text-lead mt-5">{project.challenge}</p>
              </section>

              <section aria-labelledby="relevance" className="mt-16">
                <h2
                  id="relevance"
                  className="font-display text-h2 text-ink font-semibold"
                >
                  Why it matters
                </h2>
                <p className="text-ink-2 text-lead mt-5">{project.relevance}</p>
              </section>

              {/* Measured results, shown in full. A portfolio that publishes
                  only the flattering numbers is not reporting an evaluation. */}
              {project.evaluation ? (
                <section aria-labelledby="evaluation" className="mt-16">
                  <h2
                    id="evaluation"
                    className="font-display text-h2 text-ink font-semibold"
                  >
                    Evaluation
                  </h2>
                  {project.evaluationBasis ? (
                    <p className="text-ink-2 text-lead mt-5">
                      {project.evaluationBasis}
                    </p>
                  ) : null}
                  <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                    {project.evaluation.map((result) => (
                      <div
                        key={result.metric}
                        className="border-line bg-surface rounded-lg border p-5"
                      >
                        <dt className="label">{result.metric}</dt>
                        <dd className="mt-3">
                          <span className="font-display text-h2 text-ink font-semibold">
                            {result.value}
                          </span>
                          {result.note ? (
                            <span className="text-ink-3 mt-3 block text-sm leading-relaxed">
                              {result.note}
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Architecture ─────────────────────────────────────── */}
      <Section labelledBy="architecture" className="border-line border-t">
        <Container>
          <h2
            id="architecture"
            className="font-display text-h2 text-ink max-w-2xl font-semibold"
          >
            How it fits together
          </h2>
          <div className="mt-10">
            <PipelineDiagram
              stages={project.stages}
              caption={`${project.diagramAlt} This diagram is drawn from the project's documented architecture. It is not a screenshot of a running interface.`}
            />
          </div>
        </Container>
      </Section>

      {/* ── Next ─────────────────────────────────────────────── */}
      {next.slug !== project.slug ? (
        <Section className="border-line border-t">
          <Container>
            <p className="label">Next case study</p>
            <Link
              href={`/work/${next.slug}`}
              className="group mt-5 flex flex-wrap items-baseline justify-between gap-4"
            >
              <span className="font-display text-h2 text-ink font-semibold">
                {next.title}
              </span>
              <span className="text-signal inline-flex items-center gap-2 text-sm">
                Read
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Container>
        </Section>
      ) : null}
    </article>
  );
}
