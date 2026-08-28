import type { Project } from "@/content/projects";
import { Plate } from "./Plate";

/**
 * Two columns.
 *
 * Full-width single-column cards made every screenshot enormous — a site
 * capture at 1280px wide reads as a page-sized image rather than a project
 * card. Halving the width puts them at a sensible size and gives the section
 * the shape of an index rather than a slideshow.
 *
 * Only projects with a real screenshot appear here; the rest are in
 * `ProjectIndex`, so nothing in this grid is a placeholder.
 */
export function PlateGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((project, i) => (
        <Plate key={project.slug} project={project} priority={i === 0} />
      ))}
    </div>
  );
}
