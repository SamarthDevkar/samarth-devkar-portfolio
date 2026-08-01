import type {
  Availability,
  Booking,
  NavItem,
  SiteConfig,
  SocialLink,
} from "./types";

export const site: SiteConfig = {
  name: "Samarth Devkar",
  firstName: "Samarth",
  role: "Security Engineer",
  roleLong: "Security Engineer · AI Security & Threat Intelligence",
  positioning:
    "I build AI-assisted security systems that turn raw attacker behaviour into intelligence an analyst can act on.",
  intro:
    "I'm a security engineer based in Seattle, working across security operations, threat intelligence, cloud security, application security and AI-assisted security analysis.",
  // My own words, from my LinkedIn About section.
  creed: "Security becomes powerful when curiosity turns into systems.",
  summary:
    "Security engineer working at the intersection of cybersecurity, AI and automation. I build AI-assisted security systems: a controlled SSH honeypot demonstrated at IEEE ICDCS 2026 that turns attacker sessions into analyst-facing threat intelligence, Linux telemetry pipelines, and the SOC-style investigation workflows underneath both.",
  location: "Seattle, Washington",
  email: "samarthdevkar1@gmail.com",
  url: "https://samarthdevkar.vercel.app",
  resumePath: "/resume/Samarth-Devkar-Resume.pdf",
  locale: "en-US",
} as const;

/**
 * Phone number is deliberately excluded. Publishing a personal mobile on an
 * indexed page invites scraping and adds nothing email does not already
 * provide.
 */
export const socials: readonly SocialLink[] = [
  {
    platform: "GitHub",
    label: "GitHub",
    href: "https://github.com/SamarthDevkar",
    external: true,
  },
  {
    platform: "LinkedIn",
    label: "LinkedIn",
    href: "https://linkedin.com/in/samarth-devkar",
    external: true,
  },
  {
    platform: "Email",
    label: "Email",
    href: `mailto:${site.email}`,
    external: false,
  },
] as const;

/**
 * Headline achievements for the home hero, the introduction a recruiter
 * reads first. Every entry is verified in my resume.
 */
export const introHighlights: readonly string[] = [
  "M.S. Cybersecurity Engineering, University of Washington (3.93 / 4 GPA)",
  "IEEE ICDCS 2026: AI-Enhanced SSH Honeypot accepted for demonstration, live demo presented",
  "University of Washington Graduate Impact and Innovation 2026 STEM Award",
  "CompTIA Security+ certified",
] as const;

/**
 * Scheduled-call booking, backed by a Google Calendar appointment schedule.
 * Link-out rather than an embedded widget; see the `Booking` type for why.
 */
export const booking: Booking = {
  label: "Book a call",
  description:
    "Grab a time directly in my calendar. No back-and-forth needed.",
  duration: "30 minutes",
  href: "https://calendar.app.google/5hfS5i83VHHcBoRb6",
} as const;

/**
 * Source: my LinkedIn About section.
 * Work authorisation is a screening question for US recruiters, answering it
 * on the page removes a round-trip and a reason to skip the application.
 */
export const availability: Availability = {
  status: "Seeking cybersecurity roles, available from August 2026",
  authorisation:
    "Authorised to work in the U.S. on F1-OPT from August 2026, with STEM OPT eligibility.",
  arrangements:
    "Open to full-time, W2 contract and new-grad opportunities across the U.S.",
  roles: [
    "Penetration Testing",
    "Threat Intelligence",
    "Vulnerability Management",
    "Cloud Security",
    "Application Security",
    "Detection Engineering",
    "GRC",
    "AI Security & Governance",
  ],
} as const;

export const nav: readonly NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Experience", href: "/experience" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * The hero carries credentials only. An earlier stat strip repeating these
 * same figures sat directly beneath the achievement list and was redundant.
 * The "18 remediated findings" figure lives on /experience and /about, where
 * it has the context of the role that produced it.
 */
