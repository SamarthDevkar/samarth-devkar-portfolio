"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { CommandPalette } from "@/components/command-palette";
import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui/section";
import { nav, site } from "@/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  // Native <dialog> gives us focus trapping, Escape-to-close, inertness of the
  // background, and focus restoration to the trigger, all from the platform.
  const openMenu = useCallback(() => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Close the mobile menu when the route changes.
  useEffect(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [pathname]);

  return (
    <header className="border-line bg-canvas/80 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-sm"
            aria-label={`${site.name}, home`}
          >
            <span
              aria-hidden
              className="bg-signal size-1.5 rounded-full transition-transform group-hover:scale-150"
            />
            <span className="text-ink text-sm font-medium tracking-tight">
              {site.name}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative rounded-sm px-3 py-2 text-sm transition-colors ${
                      isActive(item.href)
                        ? "text-ink"
                        : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) ? (
                      <span
                        aria-hidden
                        className="bg-signal absolute inset-x-3 -bottom-px h-px"
                      />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <CommandPalette />
            <ThemeToggle />
            <button
              type="button"
              onClick={openMenu}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="border-line hover:border-line-strong text-ink-2 hover:text-ink grid size-10 cursor-pointer place-items-center rounded-md border transition-colors lg:hidden"
            >
              <Menu aria-hidden className="size-4.5" />
              <span className="sr-only">Open navigation menu</span>
            </button>
          </div>
        </div>
      </Container>

      <ScrollProgress />

      <dialog
        ref={dialogRef}
        onClose={() => setMenuOpen(false)}
        aria-label="Navigation menu"
        className="bg-canvas text-ink open:flex m-0 hidden h-dvh max-h-none w-full max-w-none flex-col backdrop:bg-black/60 lg:hidden"
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            <span className="label">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              className="border-line text-ink-2 hover:text-ink grid size-10 cursor-pointer place-items-center rounded-md border"
            >
              <X aria-hidden className="size-4.5" />
              <span className="sr-only">Close navigation menu</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6">
            <ul className="flex flex-col">
              {nav.map((item, index) => (
                <li key={item.href} className="border-line border-b">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group flex items-center justify-between py-5"
                  >
                    <span className="font-display text-h3 text-ink">
                      {item.label}
                    </span>
                    <span className="label text-signal">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10">
            <a
              href={site.resumePath}
              download
              className="bg-signal text-signal-contrast flex h-12 items-center justify-center rounded-md text-sm font-medium"
            >
              Download résumé
            </a>
          </div>
        </Container>
      </dialog>
    </header>
  );
}
