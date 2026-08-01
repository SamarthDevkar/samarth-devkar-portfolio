import type { PipelineStage } from "@/content";

/**
 * Architecture diagram for a project, drawn from its real pipeline stages.
 *
 * Deliberately not a screenshot: neither project has public UI captures, and
 * inventing one would imply a product interface that has not been verified.
 * This renders the system's actual shape from typed data instead, truthful,
 * responsive, zero image weight, and readable as an ordered list by a screen
 * reader.
 */
export function PipelineDiagram({
  stages,
  caption,
}: {
  stages: readonly PipelineStage[];
  caption: string;
}) {
  return (
    <figure>
      <ol className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            className="border-line bg-surface relative border p-5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="label text-signal">
                {String(index + 1).padStart(2, "0")}
              </span>
              {index < stages.length - 1 ? (
                <span aria-hidden className="text-ink-3 font-mono text-xs">
                  →
                </span>
              ) : null}
            </div>
            <h3 className="text-ink mt-4 font-mono text-sm tracking-wide uppercase">
              {stage.label}
            </h3>
            <p className="text-ink-2 mt-2 text-sm leading-relaxed">
              {stage.detail}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {stage.tools.map((tool) => (
                <li
                  key={tool}
                  className="border-line text-ink-3 rounded-xs border px-1.5 py-0.5 font-mono text-[0.65rem]"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <figcaption className="text-ink-3 mt-4 text-xs leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
