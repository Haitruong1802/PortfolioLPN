import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/content/case-studies";

const BASE_URL = "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const cases = caseStudies.map((cs) => ({
    url: `${BASE_URL}/work/${cs.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...cases,
  ];
}
