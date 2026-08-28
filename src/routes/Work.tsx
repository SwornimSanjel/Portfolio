import { projects } from "@/content/projects";
import { PlateGrid } from "@/components/work/PlateGrid";
import { Container } from "@/components/layout/Container";
import { useSeo } from "@/lib/seo";

/** Spelled out, because "8 projects" in a headline reads like a spreadsheet. */
const WORDS = [
  "No", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];

export default function WorkPage() {
  // Derived, not typed. This headline has said the wrong number twice now —
  // once when a project was added and once when they were reordered — because
  // the count lived in prose and the projects lived in a file.
  const count = WORDS[projects.length] ?? String(projects.length);

  useSeo({
    title: "Work",
    description:
      "Seven projects: a company, two client website builds, the product it sells, a UI/UX platform, and two years of brand and content work.",
    canonical: "/work",
  });

  return (
    <>
      <section className="pb-16 pt-36">
        <Container>
          <p className="meta">Index</p>
          <h1 className="mt-6 max-w-[18ch] text-h1 text-ink">
            {count} projects, in the order they explain each other.
          </h1>
          <p className="mt-6 max-w-measure text-lead text-graphite">
            01 is the company and 04 is the product I started it to sell. 02 and 03 are client
            websites, the part of an Avernek engagement I take myself, end to end. 05 to 07
            are what came before: interface design, and the brand and growth work that taught
            me what customers actually complain about.
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
