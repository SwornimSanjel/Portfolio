import type { Chapter } from "@/content/projects";
import { SystemDiagram } from "./SystemDiagram";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Frame } from "@/components/work/Frame";
import { RuleDraw } from "@/components/typography/RuleDraw";

/**
 * Renders any chapter shape. Because `Chapter` is a discriminated union, a new
 * chapter kind is a compile error here rather than a silent gap on the page —
 * `never` in the default branch is doing that work.
 */
export function Chapters({ chapters }: { chapters: Chapter[] }) {
  return (
    <>
      {chapters.map((chapter, i) => (
        <ChapterBlock key={i} chapter={chapter} />
      ))}
    </>
  );
}

function ChapterBlock({ chapter }: { chapter: Chapter }) {
  switch (chapter.kind) {
    case "prose":
      return (
        <section className="mt-14 grid gap-x-8 gap-y-4 md:grid-cols-12">
          {chapter.heading && (
            <h3 className="text-h3 font-semibold text-ink md:col-span-4">{chapter.heading}</h3>
          )}
          <div className={chapter.heading ? "md:col-span-8" : "md:col-span-8 md:col-start-5"}>
            {chapter.body.map((p) => (
              <p key={p.slice(0, 24)} className="mb-5 max-w-measure text-body last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </section>
      );

    case "voice":
      // Italic serif is reserved for Swornim's own words. It never appears
      // anywhere else on the site, so a reader learns the signal.
      return (
        <aside className="my-16">
          <RuleDraw className="mb-8" />
          <blockquote className="voice max-w-measure text-h2 leading-[1.18]">
            “{chapter.text}”
          </blockquote>
          {chapter.attribution && <p className="meta mt-4">{chapter.attribution}</p>}
        </aside>
      );

    case "figure":
      // Intrinsic sizing rather than a forced ratio: these are finished
      // artefacts — an itinerary sheet, a phone screenshot — and cropping one
      // to fit a grid would destroy the thing being shown.
      return (
        <figure className={chapter.wide ? "my-16" : "my-16 md:mx-auto md:max-w-2xl"}>
          <ImageReveal>
            <Frame
              cover={{
                src: chapter.src,
                alt: chapter.alt,
                width: chapter.width,
                height: chapter.height,
                kind: chapter.frame ?? "artifact",
                label: chapter.label,
              }}
              sizes={chapter.wide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 672px, 100vw"}
            />
          </ImageReveal>
          <figcaption className="mt-4 max-w-measure border-t border-rule pt-3 text-body text-muted">
            {chapter.caption}
          </figcaption>
        </figure>
      );

    case "decisions":
      return (
        <section className="mt-16">
          <RuleDraw className="mb-8" />
          <h3 className="mb-8 text-h2 font-semibold text-ink">{chapter.heading}</h3>
          <ol className="grid gap-px bg-rule md:grid-cols-2">
            {chapter.items.map((item, i) => (
              <li key={item.title} className="bg-paper p-6 md:p-8">
                <p className="meta tnum mb-3">{String(i + 1).padStart(2, "0")}</p>
                <h4 className="text-h3 font-semibold text-ink">{item.title}</h4>
                <p className="mt-3 text-body text-graphite">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>
      );

    case "diagram":
      return <SystemDiagram heading={chapter.heading} intro={chapter.intro} steps={chapter.steps} />;

    case "spec":
      return (
        <section className="mt-14">
          <h3 className="meta mb-4">{chapter.heading}</h3>
          <dl className="border-t border-rule">
            {chapter.rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-1 border-b border-rule py-4 sm:grid-cols-12 sm:gap-6"
              >
                <dt className="meta sm:col-span-3">{row.label}</dt>
                <dd className="text-body text-graphite sm:col-span-9">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );

    default: {
      // Exhaustiveness guard — adding a chapter kind breaks the build here.
      const _exhaustive: never = chapter;
      return _exhaustive;
    }
  }
}
