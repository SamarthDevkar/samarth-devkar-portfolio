"use client";

import { useEffect, useRef } from "react";

/**
 * Reading-progress line under the header.
 *
 * Writes a transform directly to the element inside a rAF-coalesced passive
 * scroll listener, no state, so React never re-renders on scroll, and the
 * only property touched is `transform`, which stays on the compositor.
 *
 * Left active under reduced motion: it reflects scrolling the user is already
 * doing rather than animating on its own.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      node.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ transform: "scaleX(0)" }}
      className="bg-signal absolute inset-x-0 bottom-0 h-px origin-left"
    />
  );
}
