"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";

/**
 * Theme switch.
 *
 * Both icons are always rendered and CSS on the root class decides which is
 * visible. That means the correct icon shows before hydration and there is no
 * server/client mismatch to suppress, no mount-gate, no flash, no layout
 * shift.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.classList.contains("light") ? "dark" : "light";
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The theme
      // still applies for this page view; it just will not persist.
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      className={`border-line hover:border-line-strong hover:text-ink text-ink-2 grid size-10 cursor-pointer place-items-center rounded-md border transition-colors ${className}`}
    >
      <Sun aria-hidden className="hidden size-4.5 [:where(.light)_&]:block" />
      <Moon aria-hidden className="size-4.5 [:where(.light)_&]:hidden" />
    </button>
  );
}
