import { SmartLink as Link } from "@/components/ui/SmartLink";
import { Container } from "@/components/layout/Container";
import { useSeo } from "@/lib/seo";

export default function NotFound() {
  useSeo({
    title: "Not found",
    description: "That page isn’t in this manual.",
  });

  return (
    <section className="flex min-h-[70svh] items-center pt-32">
      <Container>
        <p className="meta">Error 404</p>
        <h1 className="mt-6 max-w-[16ch] text-h1 text-ink">
          That page isn&rsquo;t in this manual.
        </h1>
        <p className="mt-5 max-w-narrow text-lead text-graphite">
          It may have moved, or it may never have existed. Both happen.
        </p>
        <Link href="/" className="link-underline mt-8 inline-block text-h3 font-semibold text-ink">
          Back to the start →
        </Link>
      </Container>
    </section>
  );
}
