import type { Project } from "./types";

/**
 * Case-study data. Everything here traces to my resume or to the project's
 * own documentation; nothing is inferred or embellished.
 *
 * Where a public repository contains less than the case study describes, the
 * source link carries a visible caveat rather than quietly overstating it.
 */
export const projects: readonly Project[] = [
  {
    slug: "ai-enhanced-ssh-honeypot",
    title: "AI-Enhanced SSH Honeypot for Real-Time Threat Intelligence",
    shortTitle: "AI-Enhanced SSH Honeypot",
    period: "Sep 2025 – Jun 2026",
    tagline:
      "Controlled SSH honeypot with selective LLM fallback, threat-intelligence enrichment, and SOC-style dashboard analytics.",
    domains: ["AI Security", "Threat Intelligence", "Detection Engineering"],
    summary:
      "A controlled medium-interaction SSH honeypot that safely emulates a Linux shell, captures attacker commands, and enriches them into analyst-facing threat intelligence: behaviour labels, rationale, risk levels, IOCs, source context and session summaries, streamed live to a SOC-style dashboard. Accepted for demonstration at IEEE ICDCS 2026.",
    problem:
      "A conventional SSH honeypot logs what an attacker types and stops there, which leaves two problems. The output is raw command history: sessions an analyst has to read line by line before any of it means anything. And the moment an attacker runs something the emulation does not support, the session hits a dead end, ending the engagement early and yielding nothing further. Capture was never the hard part; sustaining the interaction and interpreting it were.",
    role: "Designed and built the system end to end: shell emulation and containment, the enrichment pipeline, and the analyst-facing dashboard.",
    built: [
      "A controlled medium-interaction SSH honeypot on Python and AsyncSSH, in which attacker commands are emulated and never executed on the real host.",
      "Deterministic command handlers over a session-isolated virtual filesystem, so every session gets a consistent and fully contained shell.",
      "Selective LLM fallback for unsupported or context-dependent commands, reducing interaction dead ends for plausible missing configuration files while preserving ordinary missing-file behaviour for implausible paths.",
      "An enrichment pipeline that turns structured JSON session logs into analyst-facing intelligence: ATT&CK-oriented behaviour labels, human-readable rationale, risk levels, extracted IOCs, source context and session summaries.",
      "A FastAPI and WebSocket backend streaming enriched events to a React and Next.js SOC-style dashboard for live monitoring, IOC inspection, risk triage and source-centric investigation.",
    ],
    challenge:
      "Two requirements pull against each other. The emulation has to be convincing enough that an attacker keeps typing, and contained enough that nothing they type ever executes on the host. Deterministic handlers give safety and repeatability but dead-end on anything unanticipated; a language model closes that gap but cannot be trusted to invent filesystem state on demand. The resolution is selective fallback: the model is consulted only for plausible, context-dependent cases, while implausible paths still return an ordinary missing-file response.",
    relevance:
      "Detection work applied to an adversary you have deliberately invited in. The output is not an alert count but structured intelligence (indicators, behaviour, rationale and risk) in the form an analyst actually triages from.",
    stack: [
      "Python",
      "AsyncSSH",
      "LLM API",
      "FastAPI",
      "WebSockets",
      "React",
      "Next.js",
      "TypeScript",
      "JSON/JSONL logging",
    ],
    stages: [
      {
        id: "emulate",
        label: "Emulate",
        detail:
          "Deterministic handlers over a session-isolated virtual filesystem",
        tools: ["Python", "AsyncSSH"],
      },
      {
        id: "fallback",
        label: "Fallback",
        detail: "Selective LLM assist for context-dependent commands",
        tools: ["LLM API"],
      },
      {
        id: "log",
        label: "Log",
        detail: "Session activity written as structured JSON/JSONL",
        tools: ["JSON/JSONL"],
      },
      {
        id: "enrich",
        label: "Enrich",
        detail:
          "Behaviour labels, rationale, risk levels, IOCs, source context, summaries",
        tools: ["Enrichment pipeline", "MITRE ATT&CK"],
      },
      {
        id: "stream",
        label: "Stream",
        detail: "Live events to the dashboard for triage and investigation",
        tools: ["FastAPI", "WebSocket", "Next.js"],
      },
    ],
    evaluationBasis:
      "Enrichment quality was measured against a manually labelled 50-event set, and interaction quality was compared with Cowrie as a baseline. Cowrie remains the more mature scripted honeypot; the comparison showed comparable scripted interaction quality with enrichment and dashboard analysis built in.",
    evaluation: [
      {
        metric: "IOC recall",
        value: "100%",
        note: "Every indicator in the labelled set was extracted.",
      },
      {
        metric: "IOC precision",
        value: "15.8%",
        note: "The trade-off for total recall. Over-extraction is the clearest limitation and the obvious next target.",
      },
      {
        metric: "Exact behaviour-label agreement",
        value: "62.5%",
      },
      {
        metric: "Risk-level agreement",
        value: "66.7%",
      },
    ],
    links: [
      {
        kind: "source",
        label: "Source",
        href: "https://github.com/SamarthDevkar/adaptive-honeypot",
        caveat:
          "Early prototype snapshot, last updated October 2025. Predates the AsyncSSH emulation, LLM fallback and dashboard described here.",
      },
      {
        kind: "paper",
        label: "IEEE ICDCS 2026, accepted for demonstration",
        caveat: "Live demo presented at the conference. No DOI supplied yet.",
      },
    ],
    featured: true,
    diagramAlt:
      "Five-stage pipeline: a contained SSH session emulates a Linux shell using deterministic handlers over a session-isolated virtual filesystem, selective LLM fallback covers unsupported commands, activity is written as structured JSON, an enrichment stage adds behaviour labels, rationale, risk levels and IOCs, and a FastAPI WebSocket backend streams the results to a SOC-style dashboard for triage.",
  },
  {
    slug: "linux-os-telemetry",
    title: "Linux OS Telemetry",
    shortTitle: "Linux OS Telemetry",
    period: "Jan 2024 – May 2024",
    tagline:
      "Ten-plus live Linux subsystems, centralised into one detection surface.",
    domains: ["Security Telemetry", "Detection Engineering", "Linux Security"],
    summary:
      "A reusable Linux telemetry pipeline centralising 10+ real-time activity streams (network, kernel, filesystem, memory, disk I/O and process) for detection engineering, anomaly review, threat hunting and incident investigation.",
    problem:
      "You cannot hunt for what you cannot see. A Linux host emits signals from a dozen separate subsystems, each behind a different tool with a different output format, none of which agree on what a record looks like. Investigating a single suspicious host means SSHing in and running six commands by hand, which does not scale and, worse, changes the box you are investigating.",
    role: "Built the collection pipeline, the normalisation layer, and the transport off-host.",
    built: [
      "Collectors for 10+ real-time subsystem streams, each using the instrumentation native to that subsystem rather than a single lossy agent.",
      "A normalisation layer converting process, network, filesystem, disk I/O, memory and kernel activity into consistent security telemetry.",
      "Off-host transport shipping telemetry to cloud storage over SSL, leaving nothing on the monitored machine.",
      "Behavioural analysis over SSH command activity, generating behaviour labels, risk levels, IOCs, source context and session summaries.",
    ],
    challenge:
      "Monitoring a host changes it. Every collector costs CPU, disk and I/O on the machine you are trying to observe, and a security tool that degrades the host it protects gets switched off. Keeping ten concurrent streams cheap enough to leave running, and shipping them off-box so the evidence survives the host, was the real design constraint.",
    relevance:
      "This is the layer detection depends on. Without normalised host telemetry there is no threat hunting, no anomaly review, and no incident timeline, only guesswork. It is also the foundation the honeypot's triage layer was later built on.",
    stack: [
      "tshark",
      "auditd",
      "inotify",
      "sar",
      "iostat",
      "iotop",
      "AWS S3",
      "Bash",
      "Python",
    ],
    stages: [
      {
        id: "collect",
        label: "Collect",
        detail: "10+ subsystem streams, each natively instrumented",
        tools: ["tshark", "auditd", "inotify", "sar", "iostat", "top"],
      },
      {
        id: "normalise",
        label: "Normalise",
        detail: "Heterogeneous output unified into consistent telemetry",
        tools: ["Bash", "Python", "JSON logging"],
      },
      {
        id: "ship",
        label: "Ship",
        detail: "Encrypted transport off-host, nothing stored locally",
        tools: ["AWS S3", "SSL"],
      },
      {
        id: "hunt",
        label: "Hunt",
        detail: "Anomaly review, threat hunting, incident investigation",
        tools: ["Detection workflows"],
      },
    ],
    links: [
      {
        kind: "source",
        label: "Source",
        href: "https://github.com/SamarthDevkar/Sentinel-OS-Linux",
      },
    ],
    featured: true,
    diagramAlt:
      "Four-stage pipeline: native Linux instrumentation collects network, kernel, filesystem, memory, disk I/O and process streams; a normalisation layer unifies them into consistent telemetry; the data is shipped over SSL to AWS S3 with nothing retained on the host; analysts use it for anomaly review, threat hunting and incident investigation.",
  },
] as const;

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Every domain present across projects, for the work-index filter. */
export const projectDomains = [
  ...new Set(projects.flatMap((project) => project.domains)),
].sort();
