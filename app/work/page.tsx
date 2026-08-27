import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { PlateGrid } from "@/components/work/PlateGrid";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Six projects — a company, an internal product, an AI automation architecture, a full-stack rebuild, a UI/UX platform, and a content system.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <section className="pb-16 pt-36">
        <Container>
          <p className="meta">Index</p>
          <h1 className="mt-6 max-w-[18ch] text-h1 text-ink">
            Six projects, in the order they explain each other.
          </h1>
          <p className="mt-6 max-w-measure text-lead text-graphite">
            Plates 01 and 02 are the company and the product it runs on. 03 is the system we sell.
            04 to 06 are the range underneath — full-stack delivery, interface design, and the
            growth work that taught me what customers actually complain about.
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
