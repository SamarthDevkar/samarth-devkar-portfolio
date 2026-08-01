/**
 * First focusable element on every page. Visually hidden until focused, then
 * pinned to the top-left so keyboard users can jump past the navigation.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-signal text-signal-contrast focus-visible:outline-focus sr-only rounded-sm px-4 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-100 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      Skip to main content
    </a>
  );
}
