import type { SkillGroup } from "./types";

/**
 * Grouped by professional capability rather than alphabetically.
 *
 * No percentages, ratings or proficiency bars: any number there would be
 * invented. `evidence` links a capability to the work that demonstrates it,
 * and is left empty where no public project evidences it rather than
 * stretching one that does not.
 */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: "ai-security",
    title: "AI Security",
    description:
      "Using models inside security workflows, and treating the model itself as attack surface.",
    skills: [
      "Prompt Hardening",
      "LLM-Assisted Threat Analysis",
      "Output Validation",
      "AI-Assisted Security Workflows",
      "AI Security & Governance",
    ],
    evidence: ["ai-enhanced-ssh-honeypot"],
  },
  {
    id: "security-operations",
    title: "Security Operations",
    description:
      "Triage, investigation and response: turning alerts into decisions.",
    skills: [
      "SOC Triage",
      "Incident Response",
      "IOC Analysis",
      "Threat Intelligence",
      "Alert Triage",
      "SIEM / Log Analysis",
      "Security Triage",
      "Automation",
    ],
    evidence: ["ai-enhanced-ssh-honeypot", "linux-os-telemetry"],
  },
  {
    id: "detection-engineering",
    title: "Detection Engineering & Threat Hunting",
    description:
      "Building the instrumentation that makes attacker behaviour visible in the first place.",
    skills: [
      "Detection Engineering",
      "Threat Hunting",
      "Security Telemetry",
      "Anomaly Review",
      "Log Parsing",
      "Threat Detection",
      "MITRE ATT&CK",
      "Cyber Kill Chain",
      "IDS / IPS Concepts",
    ],
    evidence: ["linux-os-telemetry", "ai-enhanced-ssh-honeypot"],
  },
  {
    id: "cloud-linux",
    title: "Cloud & Linux Security",
    description:
      "The substrate the telemetry comes from: hosts, identity, storage and traffic.",
    skills: [
      "AWS EC2 / S3 / IAM Security",
      "AWS CLI",
      "Linux Security",
      "Network Traffic Analysis",
      "Windows Fundamentals",
      "TCP/IP",
      "DNS",
      "HTTP/S",
      "SSH",
    ],
    evidence: ["linux-os-telemetry"],
  },
  {
    id: "appsec",
    title: "AppSec & Vulnerability Management",
    description:
      "Finding the flaws, then making sure they actually get closed.",
    skills: [
      "Penetration Testing",
      "API Security",
      "Vulnerability Assessment",
      "Remediation Tracking",
      "OWASP",
      "Burp Suite",
      "Nmap",
      "Metasploit",
      "Snort",
    ],
    evidence: [],
  },
  {
    id: "programming-tooling",
    title: "Programming & Tooling",
    description: "Automating collection, analysis and triage.",
    skills: [
      "Python",
      "Bash",
      "SQL",
      "JSON Logging",
      "FastAPI",
      "WebSockets",
      "Wireshark",
      "tshark",
      "auditd",
      "inotifywait",
      "Kali Linux",
    ],
    evidence: ["ai-enhanced-ssh-honeypot", "linux-os-telemetry"],
  },
] as const;
