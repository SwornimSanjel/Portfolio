import { profile } from "@/content/profile";
import { education, certifications } from "@/content/education";
import { capabilities, tools, toolGroups, toolsNote } from "@/content/capabilities";
import { fact } from "@/content/verify";
import { Container } from "@/components/layout/Container";
import { Img } from "@/components/ui/Img";
import { Section } from "@/components/layout/Section";
import { Timeline } from "@/components/home/Timeline";
import { IndexRail } from "@/components/navigation/IndexRail";
import { useSeo } from "@/lib/seo";

export default function AboutPage() {
  useSeo({
    title: "About",
    description:
      "Design curiosity to UI/UX to Computer Science to customer success to AI to founding a company. The actual progression.",
    canonical: "/about",
  });

  return (
    <>
      <IndexRail />

      <section id="opening" data-section-label="Opening" className="pb-16 pt-36">
        <Container>
          {/* Centred against the portrait: the intro is three lines and the
              portrait is tall, so aligning both to the top left a quarter of
              the page empty under the text. */}
          <div className="grid items-center gap-x-8 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="meta">About</p>
              <h1 className="mt-6 max-w-[16ch] text-h1 text-ink">
                How I got here.
              </h1>
              <p className="mt-8 max-w-measure text-lead text-graphite">{profile.claim}</p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              {/* The one page that is about a person should have the person on
                  it.

                  width/height are the file's real pixels (960x1280), so the
                  browser reserves exactly the right box and the column cannot
                  reflow as it loads. The aspect class matches that same 3:4,
                  which means object-cover has nothing to crop: the photo is
                  shown whole, the way the project screenshots are. */}
              <figure className="overflow-hidden rounded-md border border-rule bg-paper-deep">
                <Img
                  src="/images/swornim-lounge.jpg"
                  alt={`${profile.name}, ${profile.roleShort}, in Lalitpur`}
                  width={960}
                  height={1280}
                  priority
                  className="aspect-[3/4] h-auto w-full object-cover"
                />
              </figure>
              <dl className="mt-6 border-t border-rule pt-5">
                <dt className="meta">Based in</dt>
                <dd className="mt-1 text-body text-graphite">{profile.locationShort}</dd>
                <dt className="meta mt-5">Role</dt>
                <dd className="mt-1 text-body text-graphite">{profile.roleShort}</dd>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <Section id="story" label="The progression" bare>
        {/* The chapter number sits in the margin rather than above the
            heading. It reads as an index, it puts the three empty columns to
            work, and it stops every chapter opening at page-title size. */}
        <ol className="border-t border-rule">
          {profile.story.map((chapter, i) => (
            <li
              key={chapter.heading}
              className="grid gap-x-8 gap-y-3 border-b border-rule py-10 md:grid-cols-12 md:py-12"
            >
              <p className="meta tnum md:col-span-2">{String(i + 1).padStart(2, "0")}</p>
              <div className="md:col-span-9">
                <h2 className="max-w-[28ch] text-h3 font-semibold text-ink">{chapter.heading}</h2>
                {chapter.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 20)} className="mt-4 max-w-measure text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="experience"
        label="Experience"
        heading="Experience"
        standfirst="Titles and dates as recorded on LinkedIn."
      >
        <Timeline />
      </Section>

      <Section id="education" label="Education" heading="Education">
        <dl className="border-t border-rule">
          {education.map((entry) => (
            <div
              key={entry.id}
              className="grid gap-x-8 gap-y-1 border-b border-rule py-6 md:grid-cols-12"
            >
              <dt className="meta tnum md:col-span-3">{entry.display}</dt>
              <dd className="md:col-span-9">
                <p
                  className={
                    entry.emphasis === "primary"
                      ? "text-h3 font-semibold text-ink"
                      : "text-body font-semibold text-ink"
                  }
                >
                  {fact(entry.qualification)}
                </p>
                <p className="mt-1 text-body text-graphite">
                  {fact(entry.institution)}
                  {entry.awardingBody && <> · {fact(entry.awardingBody)}</>}
                </p>
                {entry.result && <p className="meta mt-2 tnum">{entry.result}</p>}
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="meta mb-4 mt-12">Certifications</h3>
        <ul className="border-t border-rule">
          {certifications.map((cert) => (
            <li key={cert.credentialId} className="grid gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-12">
              <span className="meta tnum md:col-span-3">{cert.issued}</span>
              <span className="md:col-span-6 text-body text-ink">{cert.title}</span>
              <span className="meta md:col-span-3 md:text-right">{cert.credentialId}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="capability"
        label="Capability"
        heading="What I can actually do"
        standfirst="No percentages. If a claim needs a bar chart to be believable, it isn't."
      >
        <div className="grid gap-px bg-rule sm:grid-cols-2">
          {capabilities.map((group) => (
            <div key={group.id} className="bg-paper p-6 lg:p-8">
              <h3 className="text-h3 font-semibold text-ink">{group.title}</h3>
              <p className="mt-2 text-body text-muted">{group.premise}</p>
              <ul className="mt-5 flex flex-col gap-1.5 border-t border-rule pt-5">
                {group.items.map((item) => (
                  <li key={item} className="text-body text-graphite">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="meta mb-5 mt-16">Tools</h3>
        <div className="grid gap-10 border-t border-rule pt-7 sm:grid-cols-3">
          {toolGroups.map((group) => (
            <div key={group}>
              <p className="meta mb-3">{group}</p>
              <ul className="flex flex-col gap-1.5">
                {tools
                  .filter((t) => t.group === group)
                  .map((t) => (
                    <li key={t.name} className="text-body text-graphite">
                      {t.name}
                      {"note" in t && t.note && (
                        <span className="ml-2 text-muted">· {t.note}</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-measure border-l-2 border-accent pl-5 text-body text-graphite">
          {toolsNote}
        </p>
      </Section>
    </>
  );
}
