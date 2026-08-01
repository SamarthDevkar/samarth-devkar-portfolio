import Link from "next/link";

import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[70svh] flex-col justify-center py-32">
        <p className="label text-signal">Error 404</p>
        <h1 className="font-display text-h1 text-ink mt-5 font-semibold">
          No signal at this address.
        </h1>
        <p className="text-ink-2 text-lead mt-5 max-w-lg">
          The page you asked for does not exist. It may have been moved, or the
          link may be wrong.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="bg-signal text-signal-contrast inline-flex h-12 items-center rounded-md px-6 text-sm font-medium transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/work"
            className="border-line hover:border-line-strong text-ink inline-flex h-12 items-center rounded-md border px-6 text-sm font-medium transition-colors"
          >
            View work
          </Link>
        </div>
      </div>
    </Container>
  );
}
