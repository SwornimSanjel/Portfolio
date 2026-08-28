import { SmartLink as Link } from "@/components/ui/SmartLink";
import { archive } from "@/content/archive";
import { Container } from "@/components/layout/Container";
import { ArchiveFullGrid } from "@/components/ui/ArchiveFullGrid";
import { useSeo } from "@/lib/seo";

export default function ArchivePage() {
  useSeo({
    title: "Archive",
    description: "Curated interface and visual studies.",
    canonical: "/archive",
  });

  return (
    <>
      <section className="pb-14 pt-36">
        <Container>
          <p className="meta">Archive</p>
          <h1 className="mt-6 max-w-[18ch] text-h1 text-ink">Interface work.</h1>
          <p className="mt-6 max-w-measure text-lead text-graphite">
            About two years of self-directed UI work. Screens picked, designed and posted,
            mostly unbriefed. Most of it still only exists on LinkedIn and TikTok.
          </p>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          {archive.length > 0 ? (
            <ArchiveFullGrid />
          ) : (
            <div className="max-w-measure border-t border-rule pt-8">
              <p className="text-body text-graphite">
                This section is being rebuilt from source files. It will hold the interface work
                referenced above.
              </p>
              <Link
                href="/work"
                className="link-underline mt-6 inline-block text-body font-semibold text-ink"
              >
                See the project work instead →
              </Link>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
