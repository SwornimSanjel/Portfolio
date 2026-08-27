import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { education, certifications } from "@/content/education";
import { capabilities, tools, toolGroups, toolsNote } from "@/content/capabilities";
import { fact } from "@/content/verify";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Timeline } from "@/components/home/Timeline";
import { IndexRail } from "@/components/navigation/IndexRail";

export const metadata: Metadata = {
  title: "About",
  description:
    "Design curiosity to UI/UX to Computer Science to customer success to AI to founding a company — the actual progression.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <IndexRail />

      <section id="opening" data-section-label="Opening" className="pb-16 pt-36">
        <Container>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="meta">About</p>
              <h1 className="mt-6 max-w-[16ch] text-h1 text-ink">
                How I got here.
              </h1>
              <p className="mt-8 max-w-measure text-lead text-graphite">{profile.claim}</p>
            </div>
            <div className="md:col-span-4">
              {/* TODO: portrait. Drop a file at public/images/portrait.jpg and
                  restore the figure here — see README "Images still needed". */}
              <dl className="border-t border-rule pt-5">
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
        <div className="grid gap-x-8 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-4">
            {profile.story.map((chapter, i) => (
              <div key={chapter.heading} className="mb-14 last:mb-0">
                <p className="meta tnum mb-3">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="max-w-[24ch] text-h2 text-ink">{chapter.heading}</h2>
                {chapter.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 20)} className="mt-5 max-w-measure text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
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
                        <span className="ml-2 text-muted">— {t.note}</span>
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
