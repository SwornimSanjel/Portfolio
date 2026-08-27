import Link from "next/link";
import type { Project } from "@/content/projects";

/**
 * The projects with no screenshot yet.
 *
 * A typographic index rather than empty image cards. Four half-blank
 * rectangles in a grid look like a broken layout; four rows of properly set
 * type look like an index, which is what they are.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t border-rule">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/work/${project.slug}`}
            className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-rule py-7 sm:grid-cols-12"
          >
            <span className="meta tnum sm:col-span-1">{project.index}</span>
            <span className="sm:col-span-6">
              <span className="block text-h3 font-semibold text-ink">
                <span className="link-underline">{project.title}</span>
              </span>
              <span className="mt-1.5 block max-w-[42ch] text-body text-graphite">
                {project.premise}
              </span>
            </span>
            <span className="meta sm:col-span-3 sm:text-right">{project.discipline}</span>
            <span className="meta tnum sm:col-span-2 sm:text-right">{project.year}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
