import { useParams } from "react-router-dom";
import { SmartLink as Link } from "@/components/ui/SmartLink";
import { getProject, projects } from "@/content/projects";
import { Chapters } from "@/components/case-study/Chapters";
import { Frame } from "@/components/work/Frame";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Container } from "@/components/layout/Container";
import { fact, isUnverified } from "@/content/verify";
import { useSeo } from "@/lib/seo";
import NotFound from "@/routes/NotFound";

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  useSeo({
    title: project?.title,
    description: project?.premise,
    canonical: project ? `/work/${project.slug}` : undefined,
    ogType: "article",
  });

  // An unknown slug is a 404, not a crash. The route stays mounted so the
  // hook order above never changes between renders.
  if (!project) return <NotFound />;

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="pt-28">
        <Container>
          {project.cover ? (
            <ImageReveal trigger="mount">
              <Frame cover={project.cover} priority sizes="(min-width: 1280px) 1200px, 100vw" />
            </ImageReveal>
          ) : (
            <div className="plate-grid flex aspect-[16/9] w-full flex-col justify-end rounded-md border border-rule bg-paper-deep p-8 sm:p-12">
              <p className="meta">Plate {project.index}</p>
              <p className="mt-3 max-w-[18ch] text-h1 font-semibold leading-[1] text-ink/80">
                {project.title}
              </p>
            </div>
          )}

          {/* The plate's caption block, reorganised into the metadata table —
              the reader watches the summary become the detail. */}
          <div className="mt-8 grid gap-x-8 gap-y-8 border-t border-rule pt-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="meta tnum">
                Plate {project.index} · {project.discipline}
              </p>
              <h1 className="mt-5 max-w-[20ch] text-h1 text-ink">{project.title}</h1>
              <p className="mt-6 max-w-measure text-lead text-graphite">{project.summary}</p>
            </div>

            <dl className="md:col-span-4 md:border-l md:border-rule md:pl-8">
              <div className="border-b border-rule pb-3">
                <dt className="meta">Role</dt>
                <dd className="mt-1 text-body text-graphite">{project.role.join(", ")}</dd>
              </div>
              <div className="border-b border-rule py-3">
                <dt className="meta">Year</dt>
                <dd className="tnum mt-1 text-body text-graphite">{project.year}</dd>
              </div>
              <div className="border-b border-rule py-3">
                <dt className="meta">Status</dt>
                <dd className="mt-1 text-body text-graphite">{project.status}</dd>
              </div>
              <div className="py-3">
                <dt className="meta">Stack</dt>
                <dd className="mt-1 text-body text-graphite">{project.stack.join(" · ")}</dd>
              </div>
              {project.external && (
                <div className="border-t border-rule pt-3">
                  <a
                    href={project.external.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-body font-semibold text-ink"
                  >
                    {project.external.label} ↗
                  </a>
                </div>
              )}
            </dl>
          </div>

          {/* Anything not cleared for publication is said out loud rather than
              quietly omitted. */}
          {project.clearance && isUnverified(project.clearance) && (
            <p className="mt-8 border-l-2 border-accent pl-4 text-body text-muted">
              {fact(project.clearance)}.
            </p>
          )}
        </Container>
      </header>

      <div className="pb-section pt-4">
        <Container>
          <Chapters chapters={project.chapters} />
        </Container>
      </div>

      <nav className="border-t border-rule py-12" aria-label="Next project">
        <Container>
          <p className="meta">Next</p>
          <Link
            href={`/work/${next.slug}`}
            className="link-underline mt-3 inline-block text-h2 font-semibold text-ink"
          >
            {next.index} · {next.title}
          </Link>
        </Container>
      </nav>
    </article>
  );
}
