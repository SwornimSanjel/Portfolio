/**
 * Emits dist/sitemap.xml and dist/robots.txt after the Vite build.
 *
 * Next generated these from `app/sitemap.ts` and `app/robots.ts`. The routes
 * still come from the same content files rather than a hand-kept list, so a
 * new project or note appears in the sitemap the moment it is written.
 *
 * The content files are TypeScript and use the `@/` alias, so they are bundled
 * with esbuild first — about 30ms, which is why this runs as a plain script
 * rather than a plugin.
 */
import { build } from "esbuild";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://swornim.avernek.com").replace(/\/$/, "");

const tmp = await mkdtemp(path.join(tmpdir(), "sitemap-"));
const bundle = path.join(tmp, "content.mjs");

try {
  await build({
    stdin: {
      contents: `
        export { projects } from "@/content/projects";
        export { publishedNotes } from "@/content/notes";
      `,
      resolveDir: root,
      loader: "ts",
    },
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node20",
    outfile: bundle,
    alias: { "@": path.join(root, "src") },
    logLevel: "silent",
  });

  const { projects, publishedNotes } = await import(pathToFileURL(bundle).href);
  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    ...["", "/work", "/about", "/archive", "/notes"].map((p) => ({
      loc: `${siteUrl}${p || "/"}`,
      lastmod: today,
      changefreq: "monthly",
      priority: p === "" ? "1.0" : "0.8",
    })),
    ...projects.map((project) => ({
      loc: `${siteUrl}/work/${project.slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    })),
    ...publishedNotes.map((note) => ({
      loc: `${siteUrl}/notes/${note.slug}`,
      lastmod: new Date(note.date).toISOString().slice(0, 10),
      changefreq: "yearly",
      priority: "0.5",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n` +
      `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

  await writeFile(path.join(dist, "sitemap.xml"), xml);
  await writeFile(
    path.join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );

  console.log(`sitemap.xml — ${urls.length} urls, robots.txt — ${siteUrl}`);
} finally {
  await rm(tmp, { recursive: true, force: true });
}
