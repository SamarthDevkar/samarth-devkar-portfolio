"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Signature visualisation, "Session → Signal".
 *
 * The honeypot triage pipeline drawn as a diagram:
 * concurrent attacker sessions on the left, the enrichment stage in the
 * middle, risk lanes on the right. It is a *model of the architecture*,
 * not a data feed, there are no counts, no fabricated events, and nothing
 * that implies live traffic. The caption says so explicitly.
 *
 * Cost control:
 *  - Pure SVG + CSS. No canvas, no WebGL, no particle system, no RAF loop.
 *  - Motion is `stroke-dashoffset` only, which the compositor handles.
 *  - Animation pauses when scrolled out of view or when the tab is hidden.
 *  - `prefers-reduced-motion` stops it via the global rule in globals.css,
 *    leaving a complete, readable static diagram.
 *  - Marked aria-hidden: every fact it depicts is also rendered as text
 *    beside it, so assistive technology loses nothing.
 */

const SOURCES = [64, 122, 180, 238, 296, 354, 412];

const LANES = [
  { y: 96, label: "INFO", colour: "var(--sev-info)" },
  { y: 168, label: "LOW", colour: "var(--sev-low)" },
  { y: 240, label: "MEDIUM", colour: "var(--sev-medium)" },
  { y: 312, label: "HIGH", colour: "var(--sev-high)" },
  { y: 384, label: "CRITICAL", colour: "var(--sev-critical)" },
];

const HUB_Y = 240;

export function SignatureVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let offscreen = false;
    let hidden = document.visibilityState === "hidden";
    const sync = () => setPaused(offscreen || hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        offscreen = !entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    observer.observe(element);

    const onVisibility = () => {
      hidden = document.visibilityState === "hidden";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={ref} data-paused={paused} className="signature-visual w-full">
      <svg
        viewBox="0 0 560 480"
        role="presentation"
        aria-hidden
        className="h-auto w-full"
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ingress rails */}
        {SOURCES.map((y, index) => {
          const d = `M 52 ${y} C 140 ${y}, 168 ${HUB_Y}, 232 ${HUB_Y}`;
          return (
            <g key={`in-${y}`}>
              <path d={d} fill="none" stroke="var(--line)" strokeWidth="1" />
              <path
                d={d}
                fill="none"
                stroke="var(--signal)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="3 77"
                style={{
                  animation: `flow-in 3.2s linear infinite`,
                  animationDelay: `${index * 0.42}s`,
                }}
              />
              <circle cx="52" cy={y} r="2.5" fill="var(--ink-3)" />
              <line
                x1="24"
                y1={y}
                x2="44"
                y2={y}
                stroke="var(--line-strong)"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Classification hub */}
        <circle cx="268" cy={HUB_Y} r="76" fill="url(#hub-glow)" />
        <rect
          x="232"
          y={HUB_Y - 34}
          width="76"
          height="68"
          rx="6"
          fill="var(--surface)"
          stroke="var(--signal)"
          strokeWidth="1"
        />
        <text
          x="270"
          y={HUB_Y - 8}
          textAnchor="middle"
          className="fill-[var(--ink)] font-mono text-[10px] tracking-wider"
        >
          ENRICH
        </text>
        <text
          x="270"
          y={HUB_Y + 8}
          textAnchor="middle"
          className="fill-[var(--ink-3)] font-mono text-[8px] tracking-wider"
        >
          BEHAVIOUR
        </text>
        <text
          x="270"
          y={HUB_Y + 20}
          textAnchor="middle"
          className="fill-[var(--ink-3)] font-mono text-[8px] tracking-wider"
        >
          IOC · RISK
        </text>

        {/* Severity egress */}
        {LANES.map((lane, index) => {
          const d = `M 308 ${HUB_Y} C 372 ${HUB_Y}, 396 ${lane.y}, 468 ${lane.y}`;
          return (
            <g key={lane.label}>
              <path d={d} fill="none" stroke="var(--line)" strokeWidth="1" />
              <path
                d={d}
                fill="none"
                stroke={lane.colour}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="3 77"
                style={{
                  animation: `flow-out 3.2s linear infinite`,
                  animationDelay: `${1.1 + index * 0.36}s`,
                }}
              />
              <rect
                x="468"
                y={lane.y - 9}
                width="18"
                height="18"
                rx="3"
                fill="none"
                stroke={lane.colour}
                strokeWidth="1"
              />
              <rect
                x="473"
                y={lane.y - 4}
                width="8"
                height="8"
                rx="1.5"
                fill={lane.colour}
              />
              <text
                x="496"
                y={lane.y + 3.5}
                className="fill-[var(--ink-3)] font-mono text-[8.5px] tracking-wider"
              >
                {lane.label}
              </text>
            </g>
          );
        })}

        {/* Stage captions */}
        <text
          x="24"
          y="34"
          className="fill-[var(--ink-3)] font-mono text-[9px] tracking-[0.16em]"
        >
          SESSIONS
        </text>
        <text
          x="232"
          y="34"
          className="fill-[var(--ink-3)] font-mono text-[9px] tracking-[0.16em]"
        >
          DETECTION
        </text>
        <text
          x="440"
          y="34"
          className="fill-[var(--ink-3)] font-mono text-[9px] tracking-[0.16em]"
        >
          TRIAGE
        </text>
        <line
          x1="24"
          y1="44"
          x2="536"
          y2="44"
          stroke="var(--line)"
          strokeWidth="1"
        />
      </svg>

      <style>{`
        @keyframes flow-in { from { stroke-dashoffset: 80; } to { stroke-dashoffset: 0; } }
        @keyframes flow-out { from { stroke-dashoffset: 80; } to { stroke-dashoffset: 0; } }
        .signature-visual[data-paused="true"] path { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
