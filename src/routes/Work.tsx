import { projects } from "@/content/projects";
import { PlateGrid } from "@/components/work/PlateGrid";
import { Container } from "@/components/layout/Container";
import { useSeo } from "@/lib/seo";

export default function WorkPage() {
  useSeo({
    title: "Work",
    description:
      "Seven projects — a company, two client website builds, an internal product, an AI automation architecture, a UI/UX platform, and a content system.",
    canonical: "/work",
  });

  return (
    <>
      <section className="pb-16 pt-36">
        <Container>
          <p className="meta">Index</p>
          <h1 className="mt-6 max-w-[18ch] text-h1 text-ink">
            Seven projects, in the order they explain each other.
          </h1>
          <p className="mt-6 max-w-measure text-lead text-graphite">
            01 is the company. 02 and 03 are client websites — the part of an Avernek
            engagement I take myself, end to end. 04 and 05 are what the company runs on
            internally and what it sells. 06 and 07 are what came before: interface design, and
            the growth work that taught me what customers actually complain about.
          </p>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <PlateGrid projects={projects} />
        </Container>
      </section>
    </>
  );
}
