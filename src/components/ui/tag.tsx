import type { ReactNode } from "react";

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "signal";
}) {
  const tones = {
    default: "border-line text-ink-3",
    signal: "border-signal/40 text-signal",
  } as const;

  return (
    <span
      className={`rounded-sm border px-2 py-1 font-mono text-[0.7rem] leading-none tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
