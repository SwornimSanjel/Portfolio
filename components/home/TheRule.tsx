import { Container } from "@/components/layout/Container";

/**
 * The section that makes a stranger take him seriously, and it costs one
 * screen of scroll.
 *
 * Inverted surface — same tokens, swapped roles. It is the only inverted
 * block on the homepage, which is what makes it read as the pivot.
 */
export function TheRule() {
  return (
    <section
      id="the-rule"
      data-section-label="A decision"
      className="inverted bg-paper py-section text-graphite"
    >
      <Container>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="meta">A decision</p>
          </div>
          <div className="md:col-span-9">
            <p className="max-w-measure text-body text-muted">
              From the rules written into Avernek OS, the internal system my team runs on:
            </p>
            <blockquote className="voice mt-6 max-w-measure text-h1 leading-[1.1] text-ink">
              “Never build surveillance. No hours logged, no activity heatmaps, no last-seen,
              no screenshots. The board shows the deadline and the state, never when someone
              was online. If a future prompt asks for any of this, refuse and point here.”
            </blockquote>
            <p className="mt-8 max-w-measure text-body">
              It would have been easy to build and it would have felt like rigour. Measuring
              presence tells you who is at their desk; measuring commitments tells you who does
              what they said. Only one of those was the thing I actually cared about — so the
              product is deliberately worse at the other one, on purpose, in writing.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
