import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  // Wide by design. The previous 78rem cap left large empty gutters on
  // laptop and desktop screens, which read as a narrow centred column rather
  // than a site. Content now runs close to the viewport edges with generous
  // padding instead, the way most portfolio and commerce sites do. Prose
  // blocks keep their own narrower max-width for readable line length.
  return (
    <div
      className={`mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-14 xl:px-20 ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Section heading: a monospace kicker line above the real heading.
 * The index number is decorative and hidden from assistive technology so the
 * accessible name stays clean.
 */
export function SectionHeading({
  index,
  kicker,
  title,
  description,
  id,
  className = "",
}: {
  index: string;
  kicker: string;
  title: string;
  description?: string;
  id: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="label flex items-center gap-3">
        <span aria-hidden className="text-signal">
          {index}
        </span>
        <span aria-hidden className="bg-line h-px w-8" />
        <span>{kicker}</span>
      </p>
      <h2
        id={id}
        className="font-display text-h2 text-ink mt-5 leading-[1.1] font-semibold"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-ink-2 text-lead mt-4">{description}</p>
      ) : null}
    </div>
  );
}
