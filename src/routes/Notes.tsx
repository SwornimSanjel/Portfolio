import { SmartLink as Link } from "@/components/ui/SmartLink";
import { visibleNotes } from "@/content/notes";
import { Container } from "@/components/layout/Container";
import { useSeo } from "@/lib/seo";

export default function NotesPage() {
  useSeo({
    title: "Notes",
    description: "Things I'm learning while building. Mostly the mistakes.",
    canonical: "/notes",
  });

  return (
    <>
      <section className="pb-14 pt-36">
        <Container>
          <p className="meta">Notes</p>
          <h1 className="mt-6 max-w-[20ch] text-h1 text-ink">
            Things I&rsquo;m learning while building.
          </h1>
          <p className="mt-6 max-w-measure text-lead text-graphite">
            Mostly the mistakes. They&rsquo;re more useful than the wins, and they&rsquo;re easier
            to be honest about.
          </p>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <ul className="border-t border-rule">
            {visibleNotes.map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="grid gap-x-8 gap-y-2 border-b border-rule py-8 md:grid-cols-12"
                >
                  <p className="meta tnum md:col-span-3">{note.display}</p>
                  <div className="md:col-span-9">
                    <h2 className="max-w-[30ch] text-h2 text-ink">
                      <span className="link-underline">{note.title}</span>
                    </h2>
                    <p className="mt-3 max-w-measure text-body text-graphite">{note.standfirst}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
