import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNote, notes, visibleNotes } from "@/content/notes";
import { Container } from "@/components/layout/Container";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.standfirst,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: { title: note.title, description: note.standfirst, type: "article" },
  };
}

export default async function NotePage({ params }: Params) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

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
