"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be denied. The address is a visible link
      // regardless, so there is nothing to recover from.
    }
  };

  return (
    <div className="mt-5">
      <a
        href={`mailto:${email}`}
        className="font-display text-h2 text-ink hover:text-signal block leading-tight break-all transition-colors"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="border-line hover:border-line-strong text-ink-2 hover:text-ink mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm transition-colors"
      >
        {copied ? (
          <Check aria-hidden className="text-signal size-4" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
        {copied ? "Copied" : "Copy address"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
