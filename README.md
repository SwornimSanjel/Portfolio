# Swornim Sanjel — portfolio

Personal portfolio. Next.js 15 (App Router) · TypeScript · Tailwind · Motion ·
GSAP · Lenis.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint
```

---

## The design system — "Operator's Manual"

The site is built as the working manual of someone who runs things: sectioned,
indexed, annotated, precise. Projects are presented as numbered **plates** —
a figure with a hairline-ruled caption block beneath, the way a technical
manual presents a figure.

**Colour.** Paper-first: a warm ivory ground `#F7F5F0` and a warm near-black
`#12120F`, over a faint fixed paper grain. The accent pair is drawn from
Lalitpur's own materials — burnt sienna `#A03A22` is the only saturated colour
on the site and appears about four times per page; jade `#2F5D4F` is restricted
to system diagrams, so a diagram always reads as a diagram. Text tones run
ink → ink-soft → graphite → muted, and every one of them clears WCAG AA on the
ground it sits on (ratios are in `globals.css`). Case-study heroes and one homepage section invert — the
same tokens with swapped roles, never a second palette.

This is deliberately *not* Avernek's identity. The company site is dark
charcoal with a champagne-bronze accent; if the personal site looked like it,
Swornim would read as an extension of his own marketing.

Tokens live in `app/globals.css :root`. `tailwind.config.ts` only maps utility
names onto them. All text colours clear WCAG AA on their own ground.

**Type.** One family, two cuts. **Geist** carries every heading, paragraph and
control; **Geist Mono** carries metadata. Hierarchy comes from weight, size and
tracking. There is deliberately **no serif and no italic anywhere** — an
earlier draft set headings in Instrument Serif with italic pull quotes, and it
read as generated rather than considered.

**Images are never cropped.** `components/work/Frame.tsx` shows every image
whole, at its own aspect ratio: website screenshots inside restrained browser
chrome, design artefacts matted on the page. Intrinsic width/height on every
image means the browser reserves exact space and the page never shifts. This
replaced a version that cropped everything into a uniform rectangle, which
mangled square itinerary sheets and tall phone screens alike.

Every size comes from the fluid `clamp()` scale in `tailwind.config.ts`. No
arbitrary font sizes.

---

## Motion

Five primitives and one easing, all in `lib/motion/presets.ts`:

| Primitive | Why it moves | Tech |
|---|---|---|
| Rule draw | A section is beginning — replaces fade-up as the default reveal | Motion |
| Mask reveal | Headline arrival; lines wipe from behind a fixed edge, never drift | Motion |
| Image reveal | A print being uncovered, not a page still loading | Motion clip-path |
| Route entrance | The new page arrives rather than snapping in | Motion, `template.tsx` |
| Metadata settle | Detail arrives after its subject | Motion |
| Diagram build | The architecture is explained by the order it appears in | GSAP ScrollTrigger |

**Tool boundaries are strict.** Motion owns everything discrete. GSAP owns
exactly one thing — the scroll-scrubbed diagram in `SystemDiagram`, loaded on
demand — because the sequence *is* the information and that's a timeline. If a
second GSAP use appears, it belongs in Motion instead.

**One source of truth for whether the site animates.** Components call
`useMotionAllowed()` rather than each calling `useReducedMotion()`, so nothing
can forget. Lenis, the cursor and GSAP all hang off the same signal.

**Information never lives in the animation.** Under `prefers-reduced-motion`
every reveal renders its final state, the diagram renders fully labelled, Lenis
is never constructed and the cursor never mounts. `MotionProvider` also marks
the document settled after 1.5s, and CSS forces any masked line still hidden
into place — so no environment where `requestAnimationFrame` is throttled (a
background tab, a prerender) can strand the headline off-screen.

**Nothing important is behind a hover.** Every plate's metadata is permanently
visible; hover only sharpens what is already readable.

---

## Getting the facts right

Two earlier drafts of the content overstated things, and the corrections are
worth recording so they don't creep back:

- **He does not build the AI automation, and does not run ads.** Avernek's CTO
  builds the automation engine; another team member runs the ad side. Swornim
  runs sales, the team, delivery, requirements and design direction. The
  homepage says this in as many words.
- **He is not a developer and the site never implies it.** He learned HTML, CSS
  and JavaScript in his first year at Herald and built with them, then stopped.
  He designs, and prototypes with AI. The tools list carries that sentence
  directly under it. No React/TypeScript/Docker/Supabase are claimed as his.
- **UI/UX is the deepest skill, not a footnote.** Years of self-taught Figma
  work, most of it never formally documented — a lot of it only ever posted to
  LinkedIn and TikTok. Design is the first capability group for that reason.
- **Scalestro is described by the work, not the exit.** A year of client success
  and organic growth, described as the hard year it was. Nothing about why he
  left, which is nobody's business.

## Content is data

Nothing factual is written in a component. `content/` holds typed modules —
`profile`, `experience`, `education`, `projects`, `capabilities`, `notes`,
`archive`, `social` — and pages import from them.

### The unverified-fact marker

Several biographical fields conflict between the supplied brief and the
LinkedIn record. Rather than guessing, those fields are wrapped:

```ts
role: unverified(
  "Founder & Managing Director",
  'LinkedIn says "Founder & Managing Director"; avernek.com lists "Business Lead".',
)
```

`fact()` renders the best current answer with a `⚑` in development and without
it in production. `collectUnverified()` gathers every open question.

**Open questions, all live in the code:**

1. `+2` institution — the brief says United College, LinkedIn says United Academy.
2. UI/UX internship employer — "Development Platform HCK" (LinkedIn) vs "Herald College Kathmandu" (brief).
3. Degree title and the University of Wolverhampton awarding line, exactly as printed.
4. Avernek job title — "Founder & Managing Director" (LinkedIn) vs "Business Lead" (avernek.com). Both are public right now.
5. Contact email — personal, or the Avernek address?
6. Which of the two Instagram accounts is the professional one.
7. The domain, for canonical URLs and OpenGraph.

### What is deliberately withheld

- **No client names on the inquiry-systems case study.** Avernek's clients gave
  their testimonials to the company, not to a personal portfolio. The page says
  so out loud rather than quietly omitting it. Same for Mountain Routes'
  performance figures.
- **No fabricated anything** — no metrics, no testimonials, no invented dates,
  no "years of experience", no awards.
- **No date of birth or age**, anywhere, including derived from anything.
- **No Scalestro case study.** The year is real and is on the timeline, but the
  surviving artefacts are ad creative made for *Scalestro's* clients.

### ⚠ Founder notes need rewriting before launch

`content/notes.ts` ships four notes marked `status: "draft"`. They are drawn
from decisions and mistakes documented in real project sources, so they're
accurate — but they are not yet in Swornim's own voice, and a founder's notes
have to be. Drafts render in development and are excluded from production and
from the sitemap. Rewrite them (his LinkedIn posts on sales, rejection and
follow-ups are the obvious source), then flip to `"published"`.

---

## Architecture

```
app/                 routes; every page is a Server Component
components/
  layout/            Container, Section, Footer
  navigation/        Nav, MobileMenu, IndexRail
  typography/        MaskReveal, RuleDraw, Settle
  motion/            MotionProvider — the single motion signal + Lenis
  work/              Plate, PlateGrid, Schematic, PlateTransition
  case-study/        Chapters, SystemDiagram
  home/              homepage sections
  ui/                Cursor, ArchiveGrid
content/             typed data, including the unverified-fact marker
lib/                 motion presets, hooks, constants
```

Client components are confined to the pieces that genuinely need the browser:
the motion provider, the hero reveal, the index rail, the nav, the mobile menu,
the plate transition, the cursor, the archive lightbox and the diagram. GSAP is
imported dynamically inside `SystemDiagram` so it never enters the shared bundle.

`Chapter` in `content/projects.ts` is a discriminated union with an
exhaustiveness guard in `Chapters.tsx` — adding a chapter kind is a compile
error where it needs handling, not a silent gap on the page.

---

## Adapted interactions

Five interactions were adapted from public component libraries. None are
installed as dependencies; each was re-typed against this project's tokens.

| Interaction | Idea from | What was taken |
|---|---|---|
| Mask text reveal | React Bits — Split Text | Line splitting and stagger; the animation is ours (clip, not fade) |
| Magnetic pull | React Bits — Magnet | The pointer-distance math, at much lower strength, fine-pointer only |
| Label cursor | Aceternity — Following Pointer | The RAF-throttled follow loop; styling entirely replaced |
| Expandable figure | Aceternity — Expandable Card | The pattern; written here to get focus handling and Escape |
| Marquee technique | 21st.dev / Magic UI | Duplicate-and-translate (not currently used on any page) |

React Bits is MIT with a Commons Clause — free for personal and commercial use.
Aceternity's free components are copy-paste; nothing from its paid templates is
used.

**Rejected deliberately:** every animated background (Aurora, Meteors, Vortex,
Sparkles, particles), bento grids, 3D tilt cards, typewriter and decrypt
effects, gradient text, and every light-on-dark glow device. They fight a paper
ground, they're the clearest tells of a generated portfolio, and they're the
largest source of jank on a mid-range phone.

---

## ⚠ Archive images: authorship not established

`~/Documents/figma posts/all posted` (144 files) is a mix of Swornim's own work
and saved reference from other designers. Two pieces that had already reached
the page carried another creator's branding — **"Xettri Sreations"** and the
handle **@xettri_sreations** — and nothing in the filenames distinguishes his
work from saved inspiration.

All of it has been pulled. `content/archive.ts` is deliberately empty, the
homepage design section is removed, and `/archive` explains itself. The gallery
components (`ArchiveGallery`, `ArchiveFullGrid`) are still in place, so
re-enabling is only a matter of adding entries back.

**This needs Swornim to identify his own files before anything goes back.**
Publishing another designer's work on his portfolio would be worse than having
no archive at all.

## Images still needed

Four of six projects now carry real screenshots, captured from the real thing:
the live avernek.com (three frames), the Nepal Comfort client running locally,
and Swornim's own Mountain Routes itinerary designs. Two projects render a
typographic plate instead, because inventing a picture is worse than admitting
there isn't one yet.

**1 — Avernek OS** (`/work/avernek-os`). Two or three screenshots of the real
interface: the Board, the Today screen, and a deadline with its change history
if that view exists. The app wouldn't boot here without Supabase credentials.
Blur or rename any real client or teammate data before sending.

**2 — HCK Core** (`/work/hck-core`). Figma exports of the strongest frames —
ideally the student portal and the teacher portal side by side, since the
case study's whole argument is that they are one system with two entry points.
PNG at 2x.

**3 — Roadshow Securities** (optional, would become an archive entry). Its
`node_modules` has broken permissions so it wouldn't run. The stock calculator
is the interesting screen.

**4 — A proper portrait.** The About page currently reuses the team photo from
the Avernek site. One hour with a real camera would lift the site more than any
animation in it: a working portrait, a hands/screen detail, and one Kathmandu
or Lalitpur environment frame.

**5 — Nepal Comfort, additional frames** (optional). Only the homepage was
captured. The fleet and routes/pricing pages would strengthen that case study.

## Still to do

- **Photography.** The About portrait is a reused casual photo. One hour with a
  proper camera — a working portrait, a hands/screen detail, one Lalitpur
  environment frame — would lift the site more than any animation here.
- **Motion archive.** The best material in the design archive is the motion
  studies (button animation, dropdown, card scroll, loader, glow). Sources are
  20–100 MB each and need compressing to muted looping webm/mp4 with poster
  frames before they can ship.
- Rewrite the founder notes (above).
- Answer the seven open questions (above).
- Add a real OpenGraph image once the domain is settled.
