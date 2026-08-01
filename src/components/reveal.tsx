"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll-reveal wrapper, CSS-driven by design.
 *
 * The failure mode this avoids: if the reveal starts at `opacity: 0` in the
 * server HTML and JavaScript then fails, never hydrates, or the observer never
 * fires, the content is permanently invisible. A portfolio cannot risk that.
 *
 * So the default state is *visible*. The hidden state is applied only under
 * `.js`, a class the pre-paint inline script adds to <html>, meaning content
 * is hidden only once we know something is able to reveal it again. Reduced
 * motion opts out entirely (see globals.css), and a timeout reveals anything
 * the observer somehow missed.
 *
 * Markup is identical on server and client, so there is no hydration mismatch.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => element.setAttribute("data-revealed", "true");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -64px 0px" },
    );
    observer.observe(element);

    // Safety net: never leave content hidden because an observer misbehaved
    // (headless capture, odd scroll containers, bfcache restores).
    const timer = window.setTimeout(show, 1600);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
