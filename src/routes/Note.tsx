import { useParams } from "react-router-dom";
import { SmartLink as Link } from "@/components/ui/SmartLink";
import { getNote, visibleNotes } from "@/content/notes";
import { Container } from "@/components/layout/Container";
import { useSeo } from "@/lib/seo";
import NotFound from "@/routes/NotFound";

export default function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const note = slug ? getNote(slug) : undefined;

  useSeo({
    title: note?.title,
    description: note?.standfirst,
    canonical: note ? `/notes/${note.slug}` : undefined,
    ogType: "article",
  });

  if (!note) return <NotFound />;

  const index = visibleNotes.findIndex((n) => n.slug === note.slug);
  const next = visibleNotes[index + 1];

  return (
    <article className="pb-section pt-36">
      <Container>
        <div className="grid gap-x-8 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-3">
            <p className="meta tnum">{note.display}</p>
            <h1 className="mt-5 max-w-[24ch] text-h1 text-ink">{note.title}</h1>
            <p className="voice mt-8 max-w-measure text-lead">{note.standfirst}</p>

            <div className="mt-12 border-t border-rule pt-10">
              {note.body.map((paragraph) => (
                <p key={paragraph.slice(0, 20)} className="mb-6 max-w-measure text-body last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            <nav className="mt-16 border-t border-rule pt-6" aria-label="Notes">
              {next ? (
                <Link href={`/notes/${next.slug}`} className="link-underline text-h3 font-semibold text-ink">
                  {next.title} →
                </Link>
              ) : (
                <Link href="/notes" className="link-underline text-h3 font-semibold text-ink">
                  All notes →
                </Link>
              )}
            </nav>
          </div>
        </div>
      </Container>
    </article>
  );
}
