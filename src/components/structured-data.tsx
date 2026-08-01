import { certifications, education, projects, site, socials } from "@/content";

/**
 * Person + ProfilePage JSON-LD.
 *
 * Only claims already present in the visible page appear here, structured
 * data that contradicts or exceeds on-page content is a search-quality
 * violation as well as a factual one.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        jobTitle: site.role,
        description: site.summary,
        url: site.url,
        email: `mailto:${site.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Seattle",
          addressRegion: "WA",
          addressCountry: "US",
        },
        sameAs: socials
          .filter((social) => social.external)
          .map((social) => social.href),
        alumniOf: education.map((entry) => ({
          "@type": "CollegeOrUniversity",
          name: entry.institution,
        })),
        hasCredential: certifications.map((certification) => ({
          "@type": "EducationalOccupationalCredential",
          name: certification.title,
          credentialCategory: "certificate",
          recognizedBy: {
            "@type": "Organization",
            name: certification.issuer,
          },
        })),
        knowsAbout: [
          "AI Security",
          "LLM-Assisted Threat Analysis",
          "Threat Intelligence",
          "Detection Engineering",
          "Threat Hunting",
          "Cloud Security",
          "Application Security",
          "Security Telemetry",
          "Linux Security",
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profile`,
        url: site.url,
        name: `${site.name} · ${site.roleLong}`,
        about: { "@id": `${site.url}/#person` },
        inLanguage: site.locale,
      },
      ...projects.map((project) => ({
        "@type": "CreativeWork",
        "@id": `${site.url}/work/${project.slug}#project`,
        name: project.title,
        description: project.summary,
        url: `${site.url}/work/${project.slug}`,
        author: { "@id": `${site.url}/#person` },
        keywords: project.stack.join(", "),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Static, self-authored data. `<` is escaped so a future content edit
      // can never terminate the script element early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
