import type { MetadataRoute } from "next";

import { nav, projects, site } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...nav.map((item) => ({
      url: `${site.url}${item.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: item.href === "/work" ? 0.9 : 0.7,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
