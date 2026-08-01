"use client";

import {
  ArrowUpRight,
  CalendarClock,
  Check,
  Copy,
  CornerDownLeft,
  Download,
  FileText,
  Search,
  SunMoon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { booking, nav, projects, site, socials } from "@/content";

/**
 * What an item does, described as data rather than as a closure.
 *
 * Keeping actions declarative means the item list stays a pure value: nothing
 * in it touches a ref or the DOM during render. Side effects happen only in
 * `runItem`, which is called from event handlers.
 */
type CommandAction =
  | { type: "route"; href: string }
  | { type: "external"; href: string }
  | { type: "download"; href: string }
  | { type: "copy"; value: string }
  | { type: "theme" };

type CommandItem = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Projects" | "Actions";
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  action: CommandAction;
};

const ITEMS: readonly CommandItem[] = [
  {
    id: "home",
    label: "Home",
    hint: "/",
    group: "Navigate",
    keywords: "home start index",
    icon: Search,
    action: { type: "route", href: "/" },
  },
  ...nav.map<CommandItem>((item) => ({
    id: `nav-${item.href}`,
    label: item.label,
    hint: item.href,
    group: "Navigate",
    keywords: item.label.toLowerCase(),
    icon: Search,
    action: { type: "route", href: item.href },
  })),
  ...projects.map<CommandItem>((project) => ({
    id: `project-${project.slug}`,
    label: project.shortTitle,
    hint: "Case study",
    group: "Projects",
    keywords:
      `${project.title} ${project.domains.join(" ")} ${project.stack.join(" ")}`.toLowerCase(),
    icon: FileText,
    action: { type: "route", href: `/work/${project.slug}` },
  })),
  {
    id: "copy-email",
    label: "Copy email address",
    hint: site.email,
    group: "Actions",
    keywords: "copy email contact mail",
    icon: Copy,
    action: { type: "copy", value: site.email },
  },
  // Present only when a real booking link is configured.
  ...(booking.href
    ? [
        {
          id: "booking",
          label: booking.label,
          hint: booking.duration,
          group: "Actions",
          keywords: "book call meeting schedule calendar appointment",
          icon: CalendarClock,
          action: { type: "external", href: booking.href },
        } satisfies CommandItem,
      ]
    : []),
  {
    id: "resume",
    label: "Download résumé",
    hint: "PDF",
    group: "Actions",
    keywords: "resume cv download pdf",
    icon: Download,
    action: { type: "download", href: site.resumePath },
  },
  {
    id: "theme",
    label: "Switch colour theme",
    hint: "Light / dark",
    group: "Actions",
    keywords: "theme dark light appearance",
    icon: SunMoon,
    action: { type: "theme" },
  },
  ...socials
    .filter((social) => social.external)
    .map<CommandItem>((social) => ({
      id: `social-${social.platform}`,
      label: `Open ${social.platform}`,
      hint: "New tab",
      group: "Actions",
      keywords: social.platform.toLowerCase(),
      icon: ArrowUpRight,
      action: { type: "external", href: social.href },
    })),
];

/**
 * Command palette (⌘K / Ctrl+K).
 *
 * Built on native <dialog>, so focus trapping, background inertness, Escape
 * handling and focus restoration to the trigger all come from the platform
 * rather than hand-written key handling. Everything reachable here is also
 * reachable through ordinary links, the palette is an accelerator, never the
 * only path to anything.
 */
export function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const open = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    dialogRef.current?.showModal();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.keywords.includes(q),
    );
  }, [query]);

  const runItem = useCallback(
    (item: CommandItem) => {
      switch (item.action.type) {
        case "route":
          close();
          router.push(item.action.href);
          break;
        case "external":
          close();
          window.open(item.action.href, "_blank", "noopener,noreferrer");
          break;
        case "download":
          close();
          window.location.href = item.action.href;
          break;
        case "copy": {
          const value = item.action.value;
          navigator.clipboard
            ?.writeText(value)
            .then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2400);
            })
            .catch(() => {
              // Clipboard may be blocked by permissions; the address is
              // visible on the contact page regardless.
            });
          break;
        }
        case "theme": {
          const root = document.documentElement;
          const next = root.classList.contains("light") ? "dark" : "light";
          root.classList.remove("light", "dark");
          root.classList.add(next);
          try {
            localStorage.setItem("theme", next);
          } catch {
            // Non-persistent theming is acceptable.
          }
          break;
        }
      }
    },
    [close, router],
  );

  // Global shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (dialogRef.current?.open) {
          dialogRef.current.close();
        } else {
          open();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const count = filtered.length;
    if (count === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % count);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + count) % count);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) runItem(item);
    }
  };

  const activeId = filtered[activeIndex]
    ? `${listId}-${filtered[activeIndex].id}`
    : undefined;

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="border-line hover:border-line-strong text-ink-3 hover:text-ink flex h-10 cursor-pointer items-center gap-2 rounded-md border px-2.5 transition-colors sm:px-3"
      >
        <Search aria-hidden className="size-4" />
        <span className="hidden text-sm sm:inline">Search</span>
        <kbd
          aria-hidden
          className="border-line text-ink-3 ml-1 hidden rounded-xs border px-1.5 py-0.5 font-mono text-[0.65rem] sm:inline"
        >
          ⌘K
        </kbd>
        <span className="sr-only">Open command palette</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Command palette"
        onClose={() => setQuery("")}
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="bg-surface border-line text-ink m-0 w-full max-w-none rounded-none border-0 p-0 backdrop:bg-black/70 sm:mx-auto sm:mt-[12vh] sm:max-w-xl sm:rounded-xl sm:border"
      >
        <div className="border-line flex items-center gap-3 border-b px-4">
          <Search aria-hidden className="text-ink-3 size-4 shrink-0" />
          <input
            type="text"
            role="combobox"
            aria-expanded
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            placeholder="Search pages, projects and actions"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            className="text-ink placeholder:text-ink-3 h-14 w-full bg-transparent text-sm outline-none"
          />
          <kbd className="border-line text-ink-3 hidden rounded-xs border px-1.5 py-0.5 font-mono text-[0.65rem] sm:inline">
            Esc
          </kbd>
        </div>

        <ul
          id={listId}
          role="listbox"
          aria-label="Commands"
          className="max-h-[min(60vh,26rem)] overflow-y-auto p-2"
        >
          {filtered.map((item, index) => {
            // Derived from the list itself rather than a mutable cursor, so
            // render stays pure across re-renders.
            const showGroup =
              index === 0 || filtered[index - 1].group !== item.group;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                {showGroup ? (
                  <p className="label px-2 pt-3 pb-1.5">{item.group}</p>
                ) : null}
                <button
                  type="button"
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runItem(item)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 text-left text-sm transition-colors ${
                    index === activeIndex ? "bg-surface-2 text-ink" : "text-ink-2"
                  }`}
                >
                  <Icon aria-hidden className="text-ink-3 size-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  <span className="text-ink-3 truncate font-mono text-xs">
                    {item.hint}
                  </span>
                  {index === activeIndex ? (
                    <CornerDownLeft aria-hidden className="text-ink-3 size-3.5" />
                  ) : null}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="text-ink-3 px-2 py-8 text-center text-sm">
              No matches for &ldquo;{query}&rdquo;
            </li>
          ) : null}
        </ul>

        <p aria-live="polite" className="sr-only">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </p>
      </dialog>

      {/* Confirmation for the copy action, announced politely. */}
      <div
        aria-live="polite"
        className={`border-line bg-surface text-ink fixed bottom-5 left-1/2 z-100 flex -translate-x-1/2 items-center gap-2 rounded-md border px-3.5 py-2.5 text-sm shadow-lg transition-opacity ${
          copied ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {copied ? (
          <>
            <Check aria-hidden className="text-signal size-4" />
            Email address copied
          </>
        ) : null}
      </div>
    </>
  );
}
