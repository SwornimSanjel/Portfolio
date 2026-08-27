import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { publishedNotes } from "@/content/notes";
import { siteUrl } from "@/lib/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/work", "/about", "/archive", "/notes"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const noteRoutes = publishedNotes.map((note) => ({
    url: `${siteUrl}/notes/${note.slug}`,
    lastModified: new Date(note.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes];
}
