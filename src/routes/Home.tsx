import { Hero } from "@/components/home/Hero";
import { Capabilities } from "@/components/home/Capabilities";
import { Contact } from "@/components/home/Contact";
import { Section } from "@/components/layout/Section";
import { PlateGrid } from "@/components/work/PlateGrid";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { IndexRail } from "@/components/navigation/IndexRail";
import { featuredProjects, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { useSeo } from "@/lib/seo";

/**
 * Running order: hero, the work, what he can be hired for, one way to get in
 * touch. Nothing else.
 *
 * Experience and the background narrative used to sit between the capability
 * cards and the contact block, and both were duplicates: the timeline renders
 * identically on About from the same data, and `origin` and `method` covered
 * the same ground `profile.story` covers there, less well. A visitor who read
 * Home and then clicked About read the story twice and the timeline twice,
 * which made About feel like padding rather than the longer version.
 *
 * The split now: Home is short and fast and about the work. About is the
 * person, the story, the record.
 *
 * Original note follows.
 *
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
  useSeo({ canonical: "/", topGround: "dark" });

  const rest = projects.filter((p) => !p.featured);
  // Same reason as the Work page headline: these two counts kept drifting out
  // of step with the content file every time a project was added.
  const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
  const shown = WORDS[featuredProjects.length] ?? String(featuredProjects.length);
  const more = WORDS[rest.length]?.toLowerCase() ?? String(rest.length);

  return (
    <>
      <IndexRail />
      <Hero />

      <Section
        id="work"
        label="Selected work"
        heading="What I've built."
        standfirst={`${shown} featured, ${more} more below. The company, the client websites I build inside it, and the interface work underneath.`}
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



      <Contact />
    </>
  );
}
