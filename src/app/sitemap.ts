import { getSiteUrl, PAGE_SEO } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const paths = Object.values(PAGE_SEO).map((page) => ({
    url: `${base}${page.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: page.path === "/" ? 1 : 0.8,
  }));

  return paths;
}
