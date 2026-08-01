import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Container, Section } from "@/components/ui/section";
import { WorkIndex } from "@/components/work-index";
import { projectDomains, projects } from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies in AI-assisted security: a controlled SSH honeypot with selective LLM fallback and threat-intelligence enrichment, demonstrated at IEEE ICDCS 2026, and a Linux telemetry pipeline centralising 10+ real-time activity streams.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        kicker="Selected work"
        title="Systems that turn raw activity into evidence."
        lede="Two projects, both built on the same conviction: capturing data is trivial, and making it mean something is the entire job."
      />
      <Section>
        <Container>
          <WorkIndex projects={projects} domains={projectDomains} />
        </Container>
      </Section>
    </>
  );
}
