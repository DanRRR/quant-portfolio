# Minimal theme for quant-portfolio

Date: 2026-10-22
Status: approved in principle by Dan via mockup v6 (`.superpowers/brainstorm/86441-1792624341/content/hybrid-v6.html`). That file is the visual reference for everything below and takes precedence where this document is vague.

## Intent

Make the site read like a research notebook rather than a product page, in the spirit of Gregory Gundersen's blog (gregorygundersen.com, repo gwgundersen/blog-theme), while keeping the parts of the current site that give it its identity. Dan's words: "keep what I have, implement what he has, make it more minimal but keep the core of the site."

The current site spends attention on itself: a green accent everywhere, cards with radii and shadows, hover transforms, three different column widths, display type up to 8.8rem. His site spends none: one ink colour, one 700px column, hairline rules, 15px body, no motion. The target is his discipline applied to Dan's structure.

## Goals

- Every page sits in one 700px column with a sticky "On this page" rail in the left gutter, driven by the scroll-spy that the CV page already has.
- The palette collapses to background, ink at three strengths, hairline rules, and one accent colour used only for interactive state.
- Hairlines replace cards, surfaces, pills, shadows and radii everywhere except the portrait.
- Nav bar, Inter headings, the animated hover underline, the sun/moon theme toggle and dark mode all survive unchanged in behaviour.
- The old implementation stays in the repo, commented out or parked, never deleted. Dan asked for this explicitly.
- `npm run build` and `npx tsc --noEmit` pass at the end, as they do today.

## Non-goals

- Content changes. Dan will cut copy himself afterwards. The mockup shows full-length lists on purpose so he can see where it piles up.
- Changing the connectome case-study page (`/projects/connectome`). It stays exactly as it is, including its film component and its own CSS.
- RSS feed, sitemap, BibTeX citations. Gundersen has them; they are cheap in Next.js but are a separate piece of work.
- Deploying. The live domain still serves the old GitHub Pages CV. That is a separate task.
- Flipping `published:` flags on posts.

## Anti-goals

- A theme switch between "old look" and "new look". The old CSS is kept for recovery, not as a runtime option.
- A rewrite into Tailwind utility classes. The site is styled with plain CSS in `globals.css` and that continues.
- New dependencies. Everything in the mockup is CSS plus one small client component that already exists.

## Constraints

- Next.js 15 App Router, React 19, TypeScript. Styling lives in `src/app/globals.css` (about 1,100 lines of plain CSS). That file also imports Tailwind 4 and the typography plugin, which only the two `/blog` routes use (utility classes on the index, `.prose` on the post page). See "Reviewer questions, settled" for what happens to them.
- Content comes from `content/posts/*.mdx` via `src/lib/posts.ts` and from `src/data/site.ts`. Posts render through `next-mdx-remote` with remark-math, rehype-katex and rehype-pretty-code.
- The repo has uncommitted work from September (connectome page and assets, homepage membership links, rewritten Timmermann post). The builder should not touch that work beyond restyling, and should see the "Preservation" section before moving any file.
- There is no ESLint config, so `next lint` cannot be used as a check. Build and typecheck are the gates.

## Decisions, as decided

### Layout

- Content column: 700px. Rail: 180px. Gap between them: 48px. The nav bar, rail and column are centred together as one 928px unit so the wordmark lines up with the rail's left edge. Reference CSS in the mockup: `.shell`, `.layout`.
- Below 1000px viewport: single column of 700px max, rail becomes a horizontal strip (see Rail).
- Side gutter: 16px on phones, no horizontal page scroll.
- The connectome page keeps its own layout and is excluded from the shell.

### Palette and tokens

Light:
- background `#ffffff`
- ink `rgba(0,0,0,0.8)`, muted `rgba(0,0,0,0.55)`, faint `rgba(0,0,0,0.4)`
- rule `rgba(0,0,0,0.12)`, strong rule `rgba(0,0,0,0.22)`
- accent `#087f5b` (the existing green)

Dark:
- background `#0f1114`
- ink `rgba(255,255,255,0.84)`, muted `.58`, faint `.4`
- rule `rgba(255,255,255,0.14)`, strong rule `.26`
- accent `#5ee0a0` (the existing dark green)

The accent appears in exactly these places: rail active label and indicator, the hover underline, the theme-toggle hover colour, focus rings, and the CV "Download PDF" link. Links at rest are ink. There are no surface colours, no `--accent-soft`, no `--code` background.

Dark mode keeps the existing mechanism: `data-theme` on `<html>`, set by the inline script in `layout.tsx` and toggled by `ThemeToggle`. The portrait gets `filter: saturate(0.7) brightness(0.92)` in dark mode.

### Typography

- Headings: the existing Inter stack, weight 650, tight tracking. Sizes stay as today: h1 `clamp(2.15rem, 6vw, 3.65rem)` with `-0.045em`, h2 `1.25rem` with `-0.018em`, h3 `1rem`. The post title is the exception at `clamp(1.8rem, 4vw, 2.5rem)`.
- Body: system sans (`-apple-system, "Helvetica Neue", Helvetica, Arial`), 15px, line-height 1.6. This is Gundersen's body and is already Dan's `--font-label`.
- Eyebrow: 11px, uppercase, bold, `.02em` tracking, muted. Used for dates, categories, and the rail heading.
- Mono: existing `--font-mono`, 13px in code blocks.
- No `scroll-behavior: smooth` change; keep what exists.

### Nav bar

Unchanged component (`Nav.tsx`, `ThemeToggle.tsx`) and unchanged behaviour: sticky, 68px, frosted blur background, hairline bottom border, wordmark 1.5rem/650, four links at 1.125rem muted turning ink on hover, sun/moon toggle with its existing scale-on-press. The existing rule that stacks the nav into two rows below 680px is kept too, so on phones the header is taller than 68px. The only change is the inner width, which becomes the shell width instead of 1040px.

### Hover underline

The existing animation, verbatim: a 1px accent line positioned at `bottom: -0.18rem`, `scaleX(0)` with `transform-origin: right`, growing to `scaleX(1)` from the left on hover and focus, 220ms `cubic-bezier(0.2,0.7,0.2,1)`. It applies to anchors only, never to their containers (v2 of the mockup got this wrong and whole rows underlined). Title links that can wrap are `display: inline-block` so the line spans both lines.

In running prose inside a post, links use a plain static underline in the strong-rule colour instead, so the text does not flicker while reading.

### Section rail ("On this page")

Generalise `CvSectionNav` into a `SectionNav` used by every page except connectome.

- Sections are any element with an `id` and a label. The builder chooses how a page declares them (a prop array as today, or `data-` attributes scanned on mount).
- Labels only, no index numbers. 13px, muted, turning ink on hover with the existing 2px `translateX`. Active label is accent. Rows 2.2rem tall.
- A 2px accent indicator on the list's left hairline slides to the active row with the existing 320ms easing.
- Scroll-spy logic is the existing one, kept exactly: active section is the last one whose top is at or above `min(innerHeight * 0.32, 240)`, and when the page is scrolled to within 8px of the bottom the last section is active.
- Section reveal is kept: each section animates once from `opacity .35, translateY(12px)` to rest over 420ms when it first intersects at 12%, skipped under `prefers-reduced-motion`.
- The rail sticks below the nav bar with about 28px clearance. Sections get `scroll-margin-top` so anchor jumps land below the sticky bars. Because the nav bar stacks and grows on phones, the header height must be measured at runtime (a `ResizeObserver` on the header writing a CSS variable is the obvious way) rather than hard-coded as in the mockup.
- Below 1000px: the rail becomes a horizontal, sticky, frosted strip under the nav bar. Labels in a row, no wrapping, scrollable, scrollbar hidden, hairline underneath, and the indicator becomes a 2px bar under the active label whose x-offset and width come from that label's `offsetLeft` and `offsetWidth`. The CV page's "Download PDF" is hidden in the strip.

Per page the rail lists:
- Home: Introduction, Current, Research, Projects.
- Research: one entry per year group.
- Projects: one entry per year group.
- Post: the post's h2 headings, in order, plus an "Introduction" entry for the text before the first h2.
- Experience: the four sections the page has today: Professional experience, Education, Professional Groups & Memberships, Selected activities. No Skills section is added (the mockup showed one; content changes are a non-goal).
- CV: Profile, Experience, Education, Memberships, Projects, Activities, Skills, and the Download PDF link stays in the rail.

### Home

- Intro grid: portrait column 160px, text column, 2rem gap. Below 560px it stacks.
- Portrait: 160px square, `object-fit: cover`, `border-radius: 14px`, `filter: saturate(0.7)`. Caption "London, UK" under it in the 11px eyebrow style. No dot before it. (Mockup v5 added the dot; Dan rejected it; v6 removed it.)
- Order on the right: eyebrow, h1 name, link row (GitHub, LinkedIn, Email, Curriculum vitae) with the hover underline, memberships line (London Quant Group, The Thalesians) at 13px muted.
- The two description paragraphs (`profile.summary`, `profile.interests`) are commented out in the JSX, not deleted.
- Sections Current, Selected research, Selected projects: an h2 with a "Full experience →" style link on the same baseline, a strong hairline under the row, then flat rows of eyebrow, h3, one-line text. No arrows, no backgrounds on hover.

### Research and Projects pages

Both use the same list idiom.

- Eyebrow, h1, an italic 14px muted intro note.
- Items grouped by year. Each year is a section for the rail. The year label is Inter 18px faint with a hairline under it inside the column. (Gundersen hangs the year in the left gutter; the rail now lives there, so the year moves into the column. Builder may not move it back.)
- Each item: uppercase 12px bold date and category, Inter 18px/650 title as a link with the hover underline, 14px summary, then a 12px faint line. For research the faint line is the tags joined with `·`. For projects it is the methods joined with `·`, then `Case study` (when `detailHref` exists) and `GitHub` links.
- No cards, no `ProjectCard`, no cursor-following preview image, no pills, no note paragraph.

### Post page

- Front-matter block boxed by two hairlines: h1 title, the summary as a normal-weight muted h4, then bylines. Each byline is a 9px uppercase faint label over a 10px value, laid out in a row: Author, Published (long form, e.g. "1 September 2026"), Category, Tags (comma-joined), Code (only when `reference` exists, linking to it).
- Article: 15px/1.6 body. h2 at 1.55rem with a strong hairline under it and extra space above. Lists padded 15px. Blockquote with a `.25em` strong-rule left border.
- Figures: bracketed above and below by strong hairlines, 20px padding, image at 60% width centred, caption 13px with a bold "Figure N." label. Builder provides a `<Figure>` MDX component or equivalent; the current posts have no figures yet, so this can be a component ready for use.
- Code blocks: bracketed by strong hairlines, 13px, no background. Keep rehype-pretty-code; choose a shiki theme pair that is near-monochrome, or override token colours to ink and muted. Gundersen's own choice is bold keywords and italic comments and strings.
- Footnotes: 100px below the article, 12px, muted, a hairline above.
- The post's h2s feed the rail. How the headings are extracted is left to the builder. Body-level h1s in MDX (one published post, the Timmermann notes, uses `#` for its sections) are demoted to h2 at render time by a small remark step, so they size correctly and appear in the rail; the markdown is not edited. The reveal animation on posts applies to the heading element itself, not to a wrapped section, so no sectionizing plugin is needed.

### Experience and CV pages

- Timeline entries become a two-column text table: 150px uppercase bold 12px period on the left, title / organisation / details on the right, each entry separated by a hairline, the whole list topped by a strong hairline. Below 560px the columns stack.
- Section headings use the same h2-with-hairline row as the home page.
- CV keeps its Profile `dl` and Skills `dl`, restyled as a 120px label column.

### Footer

Hairline above, 12px faint, copyright left, GitHub · LinkedIn · Email right. Width matches the shell.

### Preservation of the old implementation

- Move the current `src/app/globals.css` to `src/styles/legacy/globals.legacy.css` unchanged, with a one-paragraph header comment saying what it is and when it was parked. Write the new `src/app/globals.css` from scratch. In `layout.tsx` leave a commented import line pointing at the legacy file.
- The connectome CSS section inside the old file must still apply to the connectome page. The builder extracts that section into `src/app/projects/connectome/connectome.css` (or imports it another way) so that page keeps working.
- `ProjectCard.tsx` and the old `CvSectionNav.tsx` stay in place. Where they were imported, the import is commented out with a one-line note, and the new component is imported beside it.
- The home-page description paragraphs are commented out in JSX with a one-line note.
- No file is deleted.

### Verification

- `npx tsc --noEmit` passes.
- `npm run build` passes and still prerenders the three published posts plus all static routes.
- Visual check against mockup v6 in both themes at roughly 1280px and 390px widths, on Home, Research, a post, Projects, Experience, CV, and the connectome page unchanged.

## Left to the builder

- File organisation of the new CSS: one file or several, imported from `globals.css`.
- Whether `SectionNav` takes a sections prop or discovers `[data-section]` elements.
- How to extract h2 headings from MDX for the post rail (scan the raw markdown in `getPost`, or a small remark plugin that collects headings and adds ids).
- The exact shiki theme or token overrides for near-monochrome code.
- The `<Figure>` component API.
- Whether to replace `page-stack` and `home-section` class names or keep them with new rules.
- Order of work and commit boundaries.

## Reviewer questions, settled

A builder-check review raised six questions. They are settled here as the author's calls; Dan should read them when checking the document.

1. **Tailwind and the `/blog` routes.** The new `globals.css` does not import Tailwind or the typography plugin. The `katex` CSS import stays. The two `/blog` routes are the only users of utility classes and `.prose`. `/blog/[slug]` is restyled by hand per "Post page" above (it is the post page). `/blog` (the index) becomes a permanent redirect to `/research` in `next.config.mjs`; the old `blog/page.tsx` stays in the tree with its body commented out and a note, per the preservation rule. Tailwind packages stay in `package.json`; nothing is uninstalled.

2. **Connectome page.** It keeps its own layout, components and CSS, extracted unchanged into `src/app/projects/connectome/connectome.css`, and is excluded from the shell. It is not pixel-frozen: it inherits the new tokens, so its background goes from `#f5f7f9` to white and its ink and rules take the new alphas. If Dan prefers the old look there, the fix is a scoped copy of the legacy token block in that file, which is a five-minute change later.

3. **Experience page sections.** No content added or removed. The rail lists the four existing sections. Headings keep their current wording.

4. **Narrow nav.** The two-row stacking below 680px stays. `SectionNav` and the mobile strip measure the header instead of assuming 68px.

5. **Post rail and body h1s.** Demote body h1 to h2 at render time; ids on headings; reveal animates the heading only. One remark/rehype step, not two.

6. **Copy.** The current site's strings win everywhere. Mockup copy (eyebrows such as "Record" and "Building", the merged Research intro, "Community member of…") is placeholder and is not applied. The only JSX string change is commenting out the two hero paragraphs, which Dan asked for.
