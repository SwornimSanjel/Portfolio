import { Hero } from "@/components/home/Hero";
import { Capabilities } from "@/components/home/Capabilities";
import { Timeline } from "@/components/home/Timeline";
import { Contact } from "@/components/home/Contact";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { PlateGrid } from "@/components/work/PlateGrid";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { IndexRail } from "@/components/navigation/IndexRail";
import { featuredProjects, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { useSeo } from "@/lib/seo";

/**
 * Running order.
 *
 * A portfolio is read by someone deciding whether to contact you, usually in
 * well under a minute, and almost never in the order you wrote it. So: who he
 * is and what to do next (hero), then the work, then what he can be hired for,
 * then the record that backs it, then the long version for the few who want
 * it, then one way to get in touch.
 *
 * The three narrative blocks — how it started, the work behind it, how he
 * works — used to be three separate full-width sections between the work and
 * the contact, which made the middle of the page an essay and pushed the
 * timeline most of a screen further down. They are one section now, set as an
 * indexed list. Same words, a fifth of the height, and they read as an
 * appendix rather than as the argument.
 */
export default function HomePage() {
  useSeo({ canonical: "/" });

  const rest = projects.filter((p) => !p.featured);
  // Same reason as the Work page headline: these two counts kept drifting out
  // of step with the content file every time a project was added.
  const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
  const shown = WORDS[featuredProjects.length] ?? String(featuredProjects.length);
  const more = WORDS[rest.length]?.toLowerCase() ?? String(rest.length);
  const background = [profile.origin, profile.effort, profile.method];

  return (
    <>
      <IndexRail />
      <Hero />

      <Section
        id="work"
        label="Selected work"
        heading="What I've built."
        standfirst={`${shown} I can show properly, ${more} more in the index below. The company, the client websites I build inside it, and the interface work underneath.`}
      >
        <PlateGrid projects={featuredProjects} />
        <div className="mt-20">
          <h3 className="meta mb-6">Also</h3>
          <ProjectIndex projects={rest} />
        </div>
      </Section>

      <Section
        id="capability"
        label="Capability"
        heading="What I do."
        standfirst="Design and business, mostly at the same time. The list is what I actually spend the week on."
      >
        <Capabilities />
      </Section>

      <Section
        id="experience"
        label="Experience"
        heading="Where I've worked."
        standfirst="Five roles since 2025, mostly overlapping. Titles and dates as recorded on LinkedIn."
      >
        <Timeline />
        <div className="mt-12">
          <Button href="/about" variant="ghost">
            The longer version
          </Button>
        </div>
      </Section>

      <Section
        id="background"
        label="Background"
        heading="How it started, and how I work."
      >
        <ol className="border-t border-rule">
          {background.map((block, i) => (
            <li
              key={block.label}
              className="grid gap-x-8 gap-y-3 border-b border-rule py-10 md:grid-cols-12 md:py-12"
            >
              <div className="md:col-span-3">
                <p className="meta tnum">
                  {String(i + 1).padStart(2, "0")} · {block.label}
                </p>
              </div>
              <div className="md:col-span-8">
                <h3 className="max-w-[30ch] text-h3 font-semibold text-ink">{block.heading}</h3>
                {block.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 20)} className="mt-4 max-w-measure text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Contact />
    </>
  );
}
