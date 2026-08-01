import type {
  Certification,
  EducationEntry,
  ExperienceEntry,
  Honour,
  Publication,
} from "./types";

export const experience: readonly ExperienceEntry[] = [
  {
    slug: "securethings",
    role: "Security Analyst Intern",
    organisation: "SecureThings",
    period: "Jun 2023 – May 2024",
    location: "Pune, India",
    contributions: [
      "Improved detection visibility by converting Linux process, network, filesystem, disk I/O, memory and kernel activity into real-time security telemetry for investigation and threat hunting.",
      "Helped remediate 18 API and web security findings across a threat-intelligence platform, including missing rate limits, injection flaws, IDOR, session hijacking and cookie manipulation.",
      "Analysed host activity, network traffic, filesystem changes and system behaviour to identify suspicious patterns, supporting alert triage, anomaly review and remediation prioritisation.",
    ],
    focus: ["Detection visibility", "Vulnerability remediation", "Alert triage"],
  },
  {
    slug: "cybersage",
    role: "Security Researcher Intern",
    organisation: "Cybersage",
    period: "Aug 2021 – Sep 2021",
    location: "Remote",
    contributions: [
      "Researched malware, botnet, phishing, ransomware and data-breach incidents to identify IOCs, attacker patterns, affected assets and security tool gaps.",
    ],
    focus: ["Threat research", "IOC identification"],
  },
] as const;

export const education: readonly EducationEntry[] = [
  {
    degree: "Master of Science in Cybersecurity Engineering",
    institution: "University of Washington",
    grade: "GPA 3.93 / 4",
    period: "Sep 2024 – Jun 2026",
    location: "Bothell, WA",
  },
  {
    degree: "B.Tech in Computer Science & IT",
    specialisation: "Specialisation in Cybersecurity",
    institution: "Symbiosis Skills & Professional University",
    grade: "GPA 9.27 / 10",
    period: "Aug 2020 – Aug 2024",
    location: "Pune, India",
  },
] as const;

export const publications: readonly Publication[] = [
  {
    title:
      "An AI-Enhanced SSH Honeypot for Real-Time Threat Intelligence and Interactive Security Analytics",
    venue: "IEEE ICDCS 2026",
    year: "2026",
    kind: "Conference demonstration",
    note: "IEEE International Conference on Distributed Computing Systems. Accepted for demonstration; the live demo was presented at the conference.",
    relatedProjectSlug: "ai-enhanced-ssh-honeypot",
    // href intentionally absent – no DOI or Xplore link has been supplied.
  },
] as const;

export const honours: readonly Honour[] = [
  {
    title: "Graduate Impact and Innovation STEM Award",
    issuer: "University of Washington",
    year: "2026",
  },
] as const;

export const certifications: readonly Certification[] = [
  {
    title: "CompTIA Security+",
    issuer: "CompTIA",
    // credentialId intentionally absent – the résumé lists none.
  },
] as const;
