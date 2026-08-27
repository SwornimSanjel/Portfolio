import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Capabilities } from "@/components/home/Capabilities";
import { Timeline } from "@/components/home/Timeline";
import { Contact } from "@/components/home/Contact";
import { Credentials } from "@/components/home/Credentials";
import { Section } from "@/components/layout/Section";
import { PlateGrid } from "@/components/work/PlateGrid";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { IndexRail } from "@/components/navigation/IndexRail";
import { featuredProjects, projects } from "@/content/projects";
import { profile } from "@/content/profile";

/**
 * Running order: who he is, then what he built, then the design work that
 * underpins it, then how he got here, then the detail. Proof before
 * explanation — everything that argues rather than shows comes after the work.
 */
export default function HomePage() {
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      <IndexRail />
      <Hero />

      <Section
        id="work"
        label="Selected work"
        heading="What I've built and sold."
        standfirst="Two I can show properly, four more in the index below. Each one started as a business problem, not a design brief."
      >
        <PlateGrid projects={featuredProjects} />
        <div className="mt-20">
          <h3 className="meta mb-6">Also</h3>
          <ProjectIndex projects={rest} />
        </div>
      </Section>


      <Section
        id="origin"
        label={profile.origin.label}
        heading={profile.origin.heading}
      >
        <div className="grid gap-x-10 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-5">
            {profile.origin.body.map((paragraph) => (
              <p key={paragraph.slice(0, 20)} className="mb-6 max-w-measure text-lead text-ink last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <section
        id="effort"
        data-section-label={profile.effort.label}
        className="inverted bg-paper py-section text-graphite"
      >
        <div className="container-page">
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="meta">{profile.effort.label}</p>
              <h2 className="mt-5 max-w-[12ch] text-h1 font-semibold text-ink">
                {profile.effort.heading}
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {profile.effort.body.map((paragraph) => (
                <p key={paragraph.slice(0, 20)} className="mb-6 max-w-measure text-lead last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        id="capability"
        label="Capability"
        heading="What I do."
        standfirst="Design and business, mostly at the same time. The list is what I actually spend the week on."
      >
        <Capabilities />
        <div className="mt-16">
          <Credentials />
        </div>
      </Section>

      <Section
        id="method"
        label={profile.method.label}
        heading={profile.method.heading}
      >
        <div className="grid gap-x-10 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-5">
            {profile.method.body.map((paragraph) => (
              <p key={paragraph.slice(0, 20)} className="mb-6 max-w-measure text-lead text-ink last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="experience"
        label="Experience"
        heading="Where I've worked."
        standfirst="Five roles since 2025, mostly overlapping. Titles and dates as recorded on LinkedIn."
      >
        <Timeline />
        <div className="mt-12">
          <Link href="/about" className="link-underline text-body font-semibold text-ink">
            The longer version →
          </Link>
        </div>
      </Section>

      <Contact />
    </>
  );
}
