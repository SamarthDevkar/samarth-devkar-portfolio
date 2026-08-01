import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { StructuredData } from "@/components/structured-data";
import { site } from "@/content";

import "./globals.css";

/**
 * Two families, one super-family: Geist Sans carries display and body, Geist
 * Mono carries technical metadata. Chosen over Inter (ubiquitous) and a serif
 * display (too literary for security work), Geist is purpose-built for
 * technical brands and reads as current.
 *
 * Two families instead of three also cuts font payload, which was the single
 * biggest contributor to LCP.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.summary,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "AI security",
    "AI security engineer",
    "LLM security",
    "threat intelligence",
    "security engineer",
    "detection engineering",
    "threat hunting",
    "cloud security",
    "application security",
    "honeypot",
    "security telemetry",
    "cybersecurity",
    site.name,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: site.locale,
    url: site.url,
    siteName: `${site.name} · ${site.role}`,
    title: `${site.name} · ${site.roleLong}`,
    description: site.summary,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.roleLong}`,
    description: site.summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#14161d" },
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
  ],
  colorScheme: "dark light",
};

/**
 * Applies the stored theme before first paint so there is no flash of the
 * wrong theme. Dark is the default; the light theme is opt-in or matched from
 * the OS. Static string, no interpolation of external input.
 */
const themeScript = `(function(){var r=document.documentElement;r.classList.add("js");try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}r.classList.add(t)}catch(e){r.classList.add("dark")}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-canvas text-ink flex min-h-full flex-col">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <StructuredData />
      </body>
    </html>
  );
}
