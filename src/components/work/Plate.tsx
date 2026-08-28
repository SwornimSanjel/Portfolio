import { SmartLink as Link } from "@/components/ui/SmartLink";
import { motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { Frame } from "./Frame";
import { EASE } from "@/lib/motion/presets";
import { useMotionAllowed } from "@/components/motion/MotionProvider";

/**
 * How every project is listed.
 *
 * The image is never cropped — `Frame` shows it whole, at its own ratio, so
 * the plates in a row are different heights. That is correct: these are
 * different artefacts, and forcing them into one rectangle is what made the
 * earlier version look generated.
 *
 * Everything readable is readable without hovering, so touch loses nothing.
 */
export function Plate({ project, priority }: { project: Project; priority?: boolean }) {
  const animate = useMotionAllowed();

  return (
    <motion.article
      className="group"
      initial={animate ? { opacity: 0, y: 16 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -4% 0px" }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="block rounded-md focus-visible:outline-offset-4"
        aria-label={`${project.title}, open case study`}
      >
        {project.cover ? (
          <Frame
            cover={project.cover}
            priority={priority}
            boxed
            zoomOnHover
            sizes="(min-width: 1280px) 620px, (min-width: 768px) 46vw, 100vw"
          />
        ) : (
          <PendingPlate project={project} />
        )}

        <div className="mt-5 border-t border-rule pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="meta tnum">
              <span className="text-accent">{project.index}</span>
              <span className="mx-2 text-muted/50">·</span>
              {project.discipline}
            </p>
            <p className="meta tnum">{project.year}</p>
          </div>

          <h3 className="mt-3 text-h3 font-semibold text-ink">
            <span className="link-underline">{project.title}</span>
          </h3>
          <p className="mt-3 max-w-[46ch] text-body text-graphite">{project.premise}</p>

          <p className="mt-5 inline-flex items-center gap-2 font-mono text-meta uppercase text-muted transition-colors group-hover:text-accent">
            Open case
            <span aria-hidden="true" className="transition-transform duration-500 ease-rule group-hover:translate-x-1">
              →
            </span>
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

/**
 * No screenshot yet. Says so, rather than filling the space with a drawing.
 * Sized to roughly the same footprint as a framed screenshot so a row of
 * plates still holds together.
 */
function PendingPlate({ project }: { project: Project }) {
  return (
    <div className="plate-grid flex aspect-[16/10] flex-col justify-between rounded-md border border-rule bg-paper-deep p-6 sm:p-8">
      {/* This used to draw the plate number at 6rem in 10% ink.
      
          Only the plates *without* a screenshot did, because only they had
          the empty space for it — which meant the biggest number on the work
          page was whichever project happened to be missing its image. On the
          index that is 02, sitting next to plate 01, and the page appeared to
          start counting at two. The numbering already lives in the caption
          under every plate, consistently, and one place is enough.

          The space says what is actually true about it instead. */}
      <p className="meta">No screenshot yet</p>
      <div>
        <p className="meta">{project.discipline}</p>
        <p className="mt-2 max-w-[30ch] text-body text-muted">{project.role.join(" · ")}</p>
      </div>
    </div>
  );
}
