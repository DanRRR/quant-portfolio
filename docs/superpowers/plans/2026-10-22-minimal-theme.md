# Minimal Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the quant-portfolio Next.js site into a single 700px column with a scroll-spy section rail on every page, Gundersen's hairline-and-ink discipline, and Dan's nav bar, Inter headings, hover underline and theme toggle kept, while parking (never deleting) the old implementation.

**Architecture:** The old `globals.css` moves to `src/styles/legacy/` and a new `globals.css` imports six small stylesheets. A server `PageShell` component lays out rail + column per page and hosts a client `SectionNav` (a generalised `CvSectionNav`). Two pure libraries, `listing.ts` (dates, year grouping) and `headings.ts` (slugs, heading extraction, a remark plugin), carry the only logic worth unit-testing; UI tasks are verified by typecheck, build, and grepping the prerendered HTML.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.7, plain CSS, next-mdx-remote 6 with remark-math / rehype-katex / rehype-pretty-code, `node:test` via `node --experimental-strip-types` (Node 23.4 installed). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-22-minimal-theme-design.md`. Visual reference: `.superpowers/brainstorm/86441-1792624341/content/hybrid-v6.html` (gitignored, local only).

## Global Constraints

- No new npm dependencies. Tailwind packages stay installed but are no longer imported.
- No file is deleted. Replaced files move or stay in place with imports commented out and a one-line note.
- No content strings change in JSX or `site.ts`, except commenting out the two hero paragraphs on the home page.
- The connectome page (`src/app/projects/connectome/`) keeps its layout, components and CSS, extracted unchanged; it inherits the new tokens.
- Column 700px, rail 180px, gap 48px, shell `min(100% - 2rem, 928px)`. Single column below 1000px viewport. 16px side gutters on phones, no horizontal scroll.
- Tokens, exactly: light `--bg #ffffff`, `--fg rgba(0,0,0,0.8)`, `--muted rgba(0,0,0,0.55)`, `--faint rgba(0,0,0,0.4)`, `--border rgba(0,0,0,0.12)`, `--border-strong rgba(0,0,0,0.22)`, `--accent #087f5b`; dark `--bg #0f1114`, `--fg rgba(255,255,255,0.84)`, `--muted .58`, `--faint .4`, `--border rgba(255,255,255,0.14)`, `--border-strong .26`, `--accent #5ee0a0`.
- Accent appears only in: rail active label + indicator, hover underline, theme-toggle hover, focus rings, CV download link.
- Body: `-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`, 15px, line-height 1.6. Headings: existing `--font-sans` Inter stack, weight 650; h1 `clamp(2.15rem, 6vw, 3.65rem)` / `-0.045em`; h2 `1.25rem` / `-0.018em`; h3 `1rem`. Eyebrow 11px uppercase bold `.02em` muted.
- Hover underline: anchors only; 1px accent at `bottom:-0.18rem`, `scaleX(0)` origin right → `scaleX(1)` origin left, 220ms `cubic-bezier(0.2,0.7,0.2,1)`.
- Scroll-spy: active = last section whose top ≤ `min(innerHeight*0.32, 240)`; within 8px of document bottom → last section. Reveal: once, `opacity .35 → 1`, `translateY(12px) → 0`, 420ms `cubic-bezier(.2,.7,.2,1)`, threshold 0.12, skipped under `prefers-reduced-motion`.
- Gates: `npm run typecheck`, `npm run build`, `npm test` all pass at the end of every task.

## Review Focus

Inputs the spec implies but does not spell out, each pinned to a test in the owning task:

1. A post whose body has a `#` heading inside a fenced code block (e.g. a Python comment) must not gain a rail entry. → Task 2 `extractHeadings` test.
2. Two body headings with identical text must get distinct ids so anchors and the rail do not collide. → Task 2 `extractHeadings` and plugin tests.
3. A heading containing inline markdown or math (`**bold**`, `` `code` ``, `$x$`) must produce a clean rail label and a stable slug. → Task 2 `slugify`/`extractHeadings` test.
4. A project whose `period` has no month ("2026") or a post with an empty `date` must still land in a year group without throwing. → Task 1 `yearOf` / `groupByYear` tests.
5. A post with fewer than two sections must not render an almost-empty rail. → Task 4 `SectionNav` returns `null` for `sections.length < 2`, verified by grep in Task 7.

---

### Task 1: Test harness and listing helpers

**Files:**
- Create: `src/lib/listing.ts`
- Create: `tests/listing.test.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces:
  - `formatDateShort(iso: string): string` — `"2026-09-10"` → `"10 Sep 2026"`; empty or unparseable input → `""`.
  - `formatDateLong(iso: string): string` — `"2026-09-01"` → `"1 September 2026"`; empty → `""`.
  - `yearOf(text: string): string` — first 4-digit run in the string, or `"Undated"` if none. Works for `"2026-09-10"`, `"September 2026"`, `"2026"`, `""`.
  - `groupByYear<T>(items: T[], key: (item: T) => string): { year: string; items: T[] }[]` — groups preserve input order within a year; years ordered descending with `"Undated"` last.

- [ ] **Step 1: Add the test script**

In `package.json` scripts add `"test": "node --experimental-strip-types --test tests/*.test.ts"`.

- [ ] **Step 2: Write the failing tests** in `tests/listing.test.ts` using `node:test` and `node:assert/strict`, importing from `../src/lib/listing.ts`:

```ts
test("formatDateShort", () => { assert.equal(formatDateShort("2026-09-10"), "10 Sep 2026"); assert.equal(formatDateShort(""), ""); });
test("formatDateLong", () => { assert.equal(formatDateLong("2026-09-01"), "1 September 2026"); });
test("yearOf", () => { assert.equal(yearOf("September 2026"), "2026"); assert.equal(yearOf("2026-11-11"), "2026"); assert.equal(yearOf("2026"), "2026"); assert.equal(yearOf(""), "Undated"); });
test("groupByYear orders years desc, Undated last, keeps item order", () => {
  const g = groupByYear([{p:"May 2024"},{p:"Sep 2026"},{p:""},{p:"Feb 2026"}], x => yearOf(x.p));
  assert.deepEqual(g.map(x => x.year), ["2026","2024","Undated"]);
  assert.deepEqual(g[0].items.map(x => x.p), ["Sep 2026","Feb 2026"]);
});
```

- [ ] **Step 3: Run `npm test`** — expected: FAIL, module not found.
- [ ] **Step 4: Implement `src/lib/listing.ts`** with the four exports. Use `new Date(iso + "T00:00:00Z")` and `toLocaleDateString("en-GB", …)` with `timeZone: "UTC"`; return `""` when `Number.isNaN(date.getTime())`.
- [ ] **Step 5: Run `npm test`** — expected: PASS (4 tests).
- [ ] **Step 6: Run `npm run typecheck`** — expected: no errors (tests are included by `**/*.ts`).
- [ ] **Step 7: Commit** — `git add package.json src/lib/listing.ts tests/listing.test.ts && git commit -m "feat: listing helpers (dates, year grouping) with node:test harness"`

---

### Task 2: Heading utilities and remark plugin

**Files:**
- Create: `src/lib/headings.ts`
- Create: `tests/headings.test.ts`

**Interfaces:**
- Produces:
  - `slugify(text: string): string` — lowercase, strip markdown emphasis/code/math markers, non-alphanumerics → `-`, trimmed of dashes.
  - `extractHeadings(markdown: string): { id: string; label: string }[]` — top-level `#` and `##` lines outside fenced code blocks, in order. `#` is treated as `##` (demotion). Labels have markdown markers stripped. Duplicate slugs get `-2`, `-3`… suffixes in order of appearance.
  - `remarkSectionHeadings` — a remark plugin (`() => (tree) => void`) that, for every top-level `heading` node: sets `depth = 2` when `depth === 1`; for depth-2 headings sets `node.data.hProperties.id` using the same `slugify` and the same duplicate-suffix rule, so ids match `extractHeadings` output for the same source.

- [ ] **Step 1: Write the failing tests** in `tests/headings.test.ts`:

```ts
test("slugify strips markdown and math", () => { assert.equal(slugify("What **breaks** the `conclusion` $x$"), "what-breaks-the-conclusion-x"); });
test("extractHeadings demotes h1, skips h3+, skips code fences, dedupes", () => {
  const md = "# Summary\n\ntext\n\n```python\n# not a heading\n```\n\n## Core idea\n\n### sub\n\n## Core idea\n";
  assert.deepEqual(extractHeadings(md), [
    { id: "summary", label: "Summary" },
    { id: "core-idea", label: "Core idea" },
    { id: "core-idea-2", label: "Core idea" },
  ]);
});
test("remarkSectionHeadings demotes and ids match extractHeadings", () => {
  const tree = { type: "root", children: [
    { type: "heading", depth: 1, children: [{ type: "text", value: "Summary" }] },
    { type: "heading", depth: 2, children: [{ type: "text", value: "Core idea" }] },
    { type: "heading", depth: 2, children: [{ type: "text", value: "Core idea" }] },
  ]};
  remarkSectionHeadings()(tree as never);
  assert.deepEqual(tree.children.map((h: any) => [h.depth, h.data.hProperties.id]), [[2,"summary"],[2,"core-idea"],[2,"core-idea-2"]]);
});
```

- [ ] **Step 2: Run `npm test`** — expected: FAIL, module not found.
- [ ] **Step 3: Implement `src/lib/headings.ts`.** For the plugin, walk `tree.children` only (headings are top-level in mdast; no `unist-util-visit`). Heading text for slugging is the concatenation of descendant `text`/`inlineCode`/`inlineMath` node values. Type the tree loosely (`{ type: string; children?: any[] }`) to avoid importing mdast types.
- [ ] **Step 4: Run `npm test`** — expected: PASS (7 tests total).
- [ ] **Step 5: Run `npm run typecheck`** — expected: no errors.
- [ ] **Step 6: Commit** — `git commit -am "feat: heading slugs, extraction and remark demotion plugin"` (after `git add src/lib/headings.ts tests/headings.test.ts`).

---

### Task 3: Park the legacy stylesheet, write the new base, extract connectome CSS

**Files:**
- Move: `src/app/globals.css` → `src/styles/legacy/globals.legacy.css` (via `git mv`)
- Create: `src/app/globals.css` (imports only)
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/nav.css`, `src/styles/footer.css`
- Create: `src/app/projects/connectome/connectome.css`
- Modify: `src/app/projects/connectome/page.tsx` (add `import "./connectome.css";`)
- Modify: `src/app/layout.tsx` (add commented legacy import line)

**Interfaces:**
- Produces CSS classes later tasks rely on: `.shell`, `.layout`, `.layout > .col`, `.eyebrow`, `.u` (underline scope: `.u a` and `a.u` animate), `.section-title-row`, `.row`, `.sub`, `.page`, `.page-heading`, `.lede` (used by the existing `SectionHeading` component: `.lede` is styled like `.sub`).

- [ ] **Step 1: `git mv src/app/globals.css src/styles/legacy/globals.legacy.css`.** Prepend a comment block: what it is, parked 2026-10-22 for the minimal theme, not imported anywhere, see the spec path.
- [ ] **Step 2: Extract connectome CSS.** In the legacy file, the connectome rules are the contiguous section from `.connectome-story {` (currently line 599) through the end of the `@media (prefers-reduced-motion: reduce)` block that follows the `@media (max-width: 620px)` connectome block (currently ends around line 835). Confirm with `grep -n connectome`. Copy that section verbatim into `src/app/projects/connectome/connectome.css`. Also copy the two `:root[data-theme="light"] .project-preview-*` rules only if the connectome page uses them (it does not; skip). Leave the legacy file unchanged apart from the header comment.
- [ ] **Step 3: Write `src/styles/tokens.css`** with `:root` and `:root[data-theme="dark"]` blocks containing exactly the Global Constraints tokens plus `--font-sans` (existing Inter stack), `--font-body`, `--font-mono` (existing), `--col: 700px`, `--rail: 180px`, `--gap: 48px`, `--header-h: 68px`. Include `color-scheme` per theme and the existing `:root[data-theme="light"] { color-scheme: light; }`.
- [ ] **Step 4: Write `src/styles/base.css`**: `html`/`body` (body font/size/line-height, `-webkit-font-smoothing`, `background: var(--bg)`, `color: var(--fg)`, body is a flex column with `min-height: 100vh` as today so the footer stays at the bottom), headings per constraints, `.eyebrow`, `a` at rest (ink, no decoration), `.u` underline rules exactly as in the spec, `a:focus-visible` accent outline, `.shell`, `.layout`, `.layout > .col { min-width: 0 }`, the `@media (max-width: 1000px)` single-column rule, `.page { padding-top: clamp(3rem, 6vw, 4.5rem); padding-bottom: 35vh }`, `.sub`, `.section`, `.section-title-row` (flex, baseline, strong hairline bottom, `.8rem` muted link on the right), `.row`, `.site-main { flex: 1 }`. Portrait dark filter `:root[data-theme="dark"] .portrait { filter: saturate(0.7) brightness(0.92) }`.
- [ ] **Step 5: Write `src/styles/nav.css`**: copy the `.site-header`, `.site-nav`, `.wordmark`, `.nav-links`, `.nav-actions`, `.theme-toggle*` rules and the `@media (max-width: 680px)` nav stacking rules verbatim from the legacy file, then change `.site-nav` width to `width: min(100% - 2rem, calc(var(--rail) + var(--gap) + var(--col)))` and replace `var(--surface)`/`--accent-soft` usages with tokens that exist. Keep `.theme-toggle:hover { color: var(--accent) }`.
- [ ] **Step 6: Write `src/styles/footer.css`**: `.site-footer` hairline top, 12px faint; `.footer-inner` same width formula as `.site-nav`, flex space-between, `.footer-links` gap 1rem.
- [ ] **Step 7: Write the new `src/app/globals.css`**:

```css
@import "katex/dist/katex.min.css";
@import "../styles/tokens.css";
@import "../styles/base.css";
@import "../styles/nav.css";
@import "../styles/footer.css";
/* Legacy theme, parked 2026-10-22: src/styles/legacy/globals.legacy.css (not imported). */
```

(Tailwind and `@plugin` lines are intentionally absent.)

- [ ] **Step 8: In `layout.tsx`** add above the existing import: `// import "../styles/legacy/globals.legacy.css"; // parked 2026-10-22, see docs/superpowers/specs/2026-10-22-minimal-theme-design.md`.
- [ ] **Step 9: `npm run build`** — expected: success, same 13 routes as before. The connectome page CSS classes are present in `.next/server/app/projects/connectome.html` (`grep -c connectome-hero` ≥ 1).
- [ ] **Step 10: Start `npm run dev`, open `/projects/connectome`** and confirm the film plays and layout is intact (it inherits new tokens, background white). Stop dev server.
- [ ] **Step 11: Commit** — `git add -A src docs && git commit -m "refactor: park legacy stylesheet, new token/base/nav/footer CSS, extract connectome CSS"`.

---

### Task 4: SectionNav, PageShell, rail CSS; apply to the CV page

**Files:**
- Create: `src/components/SectionNav.tsx` ("use client")
- Create: `src/components/PageShell.tsx` (server)
- Create: `src/styles/rail.css`, `src/styles/timeline.css`
- Modify: `src/app/globals.css` (import rail.css, timeline.css)
- Modify: `src/app/cv/page.tsx`
- Modify: `src/components/CvSectionNav.tsx` (header comment only: superseded by SectionNav, kept for reference)

**Interfaces:**
- Produces:
  - `type Section = { id: string; label: string }` exported from `SectionNav.tsx`.
  - `SectionNav({ sections, download }: { sections: Section[]; download?: { href: string; label: string } })` — returns `null` when `sections.length < 2`. Renders `<nav class="rail-nav" aria-label="On this page">` with `<p class="eyebrow">On this page</p>`, `<div class="rail-list">` containing `<span class="rail-indicator">` and one `<a href="#id">` per section (label text only, `is-active` class and `aria-current="location"` on the active one), then the optional `<a class="download-link">`.
  - `PageShell({ sections, download, children })` — renders `<div class="shell layout"><aside class="rail"><SectionNav … /></aside><div class="col">{children}</div></div>`.
  - CSS: `.rail`, `.rail-list`, `.rail-list a`, `.rail-indicator` (desktop: `--active-index` × `--row` 2.2rem translateY; mobile strip: `--x`/`--w` translateX + width), `.timeline`, `.timeline-entry` (2-col text table, 150px period column, hairlines), `.basics-grid` (120px label column).

- [ ] **Step 1: Write `SectionNav.tsx`** by copying `CvSectionNav.tsx` and changing: props per interface; early `return null` when `sections.length < 2`; no index `<span>`; indicator style sets `--active-index`, and additionally `--x` / `--w` from the active link's `offsetLeft - list.scrollLeft` / `offsetWidth` (read via refs in the same scroll handler); header height measured with a `ResizeObserver` on `document.querySelector(".site-header")` writing `--header-h` (px) to `document.documentElement.style`; the list's own `scroll` event also triggers the update. Keep the scroll-spy constants and the reveal animation exactly as in `CvSectionNav`.
- [ ] **Step 2: Write `PageShell.tsx`** per interface.
- [ ] **Step 3: Write `src/styles/rail.css`**: `.rail { position: sticky; top: calc(var(--header-h) + 28px); padding-top: clamp(3rem, 6vw, 4.5rem) }`, list/link/indicator rules from the spec (13px, muted → ink on hover with `translateX(2px)`, accent when active, `--row: 2.2rem`, 2px indicator on the left hairline, 320ms easing), `.download-link` accent 13px, `[id] { scroll-margin-top: calc(var(--header-h) + 2rem) }` scoped as `.col [id]`, and the `@media (max-width: 1000px)` strip: sticky at `top: var(--header-h)`, frosted background, horizontal `grid-auto-flow: column`, `overflow-x: auto`, hidden scrollbar, hairline bottom, labels `white-space: nowrap`, eyebrow and download link hidden, indicator `bottom: -1px; height: 2px; width: var(--w); transform: translateX(var(--x))`.
- [ ] **Step 4: Write `src/styles/timeline.css`**: `.timeline` strong hairline top; `.timeline-entry` grid `150px 1fr`, 20px gap, 16px vertical padding, hairline bottom; `.date-label` 12px uppercase bold muted; `.entry-meta` 14px muted; `.detail-list` 14px, `padding-left: 15px`, no margin; `@media (max-width: 560px)` stacks; `.basics-grid` as `grid-template-columns: 120px 1fr`, `dt` eyebrow style, `dd { margin: 0 }`, `.contents { display: contents }`.
- [ ] **Step 5: Add the two imports to `globals.css`.**
- [ ] **Step 6: Rewrite `cv/page.tsx`**: comment out the `CvSectionNav` import with `// superseded by SectionNav (minimal theme, 2026-10-22)`; import `PageShell`; wrap the existing content in `<PageShell sections={sections} download={{ href: links.cv, label: "Download PDF ↗" }}>` and give the inner div `className="page"`; remove the `<aside className="cv-nav">` block by commenting it out (JSX comment). Change each `<h2 className="section-heading">` to sit inside `<div className="section-title-row">`. Keep every string.
- [ ] **Step 7: `npm run typecheck && npm run build`** — expected: pass. Then `grep -c 'rail-list' .next/server/app/cv.html` → `1`, `grep -o 'Download PDF' .next/server/app/cv.html | wc -l` → `1`, `grep -c 'cv-nav-list' .next/server/app/cv.html` → `0`.
- [ ] **Step 8: Dev server, open `/cv`** at ~1280px and ~390px in both themes: rail follows scroll, indicator slides, strip appears on narrow with the bar under the active label, no horizontal page scroll. Stop server.
- [ ] **Step 9: Commit** — `git add -A src && git commit -m "feat: SectionNav + PageShell rail on every page; CV restyled"`.

---

### Task 5: Home page

**Files:**
- Create: `src/styles/home.css`
- Modify: `src/app/globals.css` (import)
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `PageShell`, `.u`, `.row`, `.section-title-row`, `.eyebrow` from Tasks 3–4.
- Produces: `.intro`, `.portrait`, `.portrait-caption`, `.text-links`, `.hero-memberships`.

- [ ] **Step 1: Write `home.css`**: `.intro { display: grid; grid-template-columns: 160px 1fr; gap: 2rem; align-items: start }` stacking below 560px; `.portrait { width: 160px; height: 160px; object-fit: cover; display: block; border-radius: 14px; filter: saturate(0.7) }`; `.portrait-caption` eyebrow style, `margin-top: 6px`, no `::before`; `.text-links` flex wrap, gap `.55rem 1.2rem`, `margin-top: 1.25rem`, `.9rem`; `.hero-memberships` 13px muted `margin-top: 1rem` with `.hero-memberships-label { display: inline }` followed by a space.
- [ ] **Step 2: Rewrite `page.tsx`**: sections `[{id:"intro",label:"Introduction"},{id:"current",label:"Current"},{id:"research",label:"Research"},{id:"projects",label:"Projects"}]`; wrap in `<PageShell sections={…}>` with inner `<div className="page">`; intro `<section id="intro" className="intro">` with the `Image` at `width={160} height={160}`; comment out the two `<p>` elements (`profile.summary`, `profile.interests`) with `{/* hero description, parked 2026-10-22 */}`; keep eyebrow, h1, `.text-links` (add `className="text-links u"`), memberships (`className="hero-memberships u"`). Each of the three sections becomes `<section id="…" className="section">` with `<div className="section-title-row u"><h2>…</h2><Link …>…</Link></div>` and items as `<div className="row u">` (eyebrow, h3 or h3 > Link, p). Remove `work-row-arrow` spans by commenting out. All strings unchanged.
- [ ] **Step 3: `npm run typecheck && npm run build`** — pass; `grep -c 'hero-memberships' .next/server/app/index.html` → `1`; `grep -c 'Mathematical Trading and Finance student' .next/server/app/index.html` → `0`.
- [ ] **Step 4: Dev server, open `/`** both themes, both widths; hover a link to see the underline wipe; rail follows the four sections. Stop server.
- [ ] **Step 5: Commit** — `git add -A src && git commit -m "feat: home page in minimal theme (portrait kept, hero copy parked)"`.

---

### Task 6: Research and Projects list pages, `/blog` redirect

**Files:**
- Create: `src/styles/lists.css`
- Create: `src/components/YearList.tsx` (server)
- Modify: `src/app/globals.css` (import)
- Modify: `src/app/research/page.tsx`, `src/app/projects/page.tsx`
- Modify: `src/app/blog/page.tsx` (body commented out, returns `null`), `next.config.mjs` (redirect)
- Modify: `src/components/ProjectCard.tsx` (header comment: superseded, kept)

**Interfaces:**
- Consumes: `groupByYear`, `yearOf`, `formatDateShort` (Task 1); `PageShell` (Task 4).
- Produces:
  - `YearGroup({ year, children })` rendering `<section id={"y-"+year} className="year-group"><h2 className="year">{year}</h2>{children}</section>`.
  - `ListItem({ id?, meta, title, href, external?, summary, foot })` rendering `<div className="post-row u" id={id}><p className="post-date">{meta}</p><p className="post-title"><Link/a href>{title}</p><p className="post-subtitle">{summary}</p><p className="tags">{foot}</p></div>`.
  - Sections for the rail: `groups.map(g => ({ id: "y-" + g.year, label: g.year }))`.

- [ ] **Step 1: Write `lists.css`**: `.intro-note` 14px italic muted `margin-bottom: 40px`; `.year` Inter 18px faint, hairline bottom, `padding-bottom: .3rem`, `margin: 2.2rem 0 .6rem` (first group `margin-top: 0`); `.post-date` 12px uppercase bold muted; `.post-title` Inter 18px/650 `-0.01em`, its `a` inline-block; `.post-subtitle` 14px `margin: 4px 0 6px`; `.tags` 12px faint `margin-bottom: 25px`, its `a` underlined via `.u`.
- [ ] **Step 2: Write `YearGroup` and `ListItem`** in `src/components/YearList.tsx` per interface (internal links use `next/link`, external get `target="_blank" rel="noreferrer"`).
- [ ] **Step 3: Rewrite `research/page.tsx`**: `const groups = groupByYear(posts, p => yearOf(p.date))`; `PageShell` with year sections; keep `SectionHeading` with its current strings; the existing `.notice` paragraph becomes `<p className="intro-note">` with the same text; items: meta `${formatDateShort(post.date)} · ${post.category}`, title → `/blog/${slug}`, summary, foot = `tags.join(" · ")`.
- [ ] **Step 4: Rewrite `projects/page.tsx`**: comment out the `ProjectCard` import (`// superseded by YearList items (minimal theme, 2026-10-22)`); `groupByYear(projects, p => yearOf(p.period))`; items with `id={project.slug}` (so `/projects#slug` links from Home still land), meta `${project.period} · ${project.type}`, title → `project.detailHref ?? project.github` (external when no `detailHref`), summary, foot = methods joined with `" · "` followed by ` · ` and `Case study` (when `detailHref`) and `GitHub` links.
- [ ] **Step 5: `/blog` redirect.** In `next.config.mjs` add `async redirects() { return [{ source: "/blog", destination: "/research", permanent: true }]; }` to `nextConfig`. In `src/app/blog/page.tsx` comment out the whole component body and export a default function returning `null`, with a note that `/blog` now redirects to `/research`; keep the `metadata` export.
- [ ] **Step 6: `npm run typecheck && npm run build`** — pass. `grep -c 'y-2026' .next/server/app/research.html` → `≥ 1`; `grep -c 'id="connectome-' .next/server/app/projects.html` → `≥ 1` (slug ids survive); `grep -c 'project-card' .next/server/app/projects.html` → `0`.
- [ ] **Step 7: Dev server**: `/research`, `/projects` both widths/themes; `curl -sI localhost:3000/blog | head -1` shows `308`. Stop server.
- [ ] **Step 8: Commit** — `git add -A src next.config.mjs && git commit -m "feat: research and projects as year-grouped lists; /blog redirects to /research"`.

---

### Task 7: Post page

**Files:**
- Create: `src/styles/article.css`
- Create: `src/components/Figure.tsx`
- Modify: `src/app/globals.css` (import)
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/lib/posts.ts` (optional: expose `headings` on `Post`; or compute in page — builder's call)

**Interfaces:**
- Consumes: `extractHeadings`, `remarkSectionHeadings` (Task 2); `formatDateLong` (Task 1); `PageShell` (Task 4).
- Produces:
  - `Figure({ src, alt, caption, label }: { src: string; alt: string; caption: string; label?: string })` → `<figure class="figure"><img …/><figcaption class="caption"><span class="caption-label">{label ?? "Figure."}</span> {caption}</figcaption></figure>`; passed to `MDXRemote` via `components={{ Figure }}`.
  - Rail sections: `[{ id: "introduction", label: "Introduction" }, ...extractHeadings(post.content)]`, with the intro anchor `<div id="introduction">` wrapping the first child of the article (builder may wrap the whole `MDXRemote` output in a div with that id; the scroll-spy only needs the element's top).

- [ ] **Step 1: Write `article.css`**: `.front-matter` (24px vertical padding, hairline top and bottom, `margin-top: clamp(2rem,5vw,3rem)`), `.front-matter h1 { font-size: clamp(1.8rem, 4vw, 2.5rem) }`, `.front-matter h4` body font normal muted 15px, `.bylines` flex wrap gap `0 20px`, `.byline h3` 9px uppercase faint bold `.04em`, `.byline p` 10px; `.article` (margin-top 40px; `h2` 1.55rem, strong hairline bottom, `padding: 1em 0 .75rem`; `ul { padding: 0 15px }`; `blockquote` `.25em` strong-rule left border muted; `p a, li a` static underline in `--border-strong`, muted on hover); `.figure` and `.caption` per spec (strong hairlines, 20px padding, img 60% centred, caption 13px, bold label); code: `.article pre` strong hairlines top and bottom, 13px, line-height 1.3, `padding: 12px 0`, `background: transparent`, `overflow-x: auto`; `.article :not(pre) > code` 13px mono no background; `.katex-display { overflow-x: auto; overflow-y: hidden }`; `[data-footnotes]` margin-top 100px, 12px, muted, hairline top.
- [ ] **Step 2: Near-monochrome code.** Keep `rehypePrettyCode` and its `{ dark: "github-dark", light: "github-light" }` themes, but add to `article.css`: `.article pre code span { color: var(--fg) !important }`, `.article pre code [style*="italic"], .article pre code span[data-token*="comment"] { color: var(--muted) }`. Builder: if token metadata is unavailable, accept ink-only code and note it in the commit message.
- [ ] **Step 3: Write `Figure.tsx`** per interface.
- [ ] **Step 4: Rewrite `blog/[slug]/page.tsx`**: drop all Tailwind class names; compute `const headings = extractHeadings(post.content)`; `PageShell sections={[{id:"introduction",label:"Introduction"}, ...headings]}`; front-matter block with h1 title, `<h4>{post.summary}</h4>`, bylines Author (`profile.shortName`), Published (`formatDateLong(post.date)`), Category, Tags (`tags.join(", ")`, only when non-empty), Code (only when `post.reference`, link text "GitHub ↗" when the URL contains `github.com`, else "Paper ↗"); then `<div className="article"><div id="introduction"><MDXRemote … options.mdxOptions.remarkPlugins = [remarkGfm, remarkMath, remarkSectionHeadings] … components={{ Figure }} /></div></div>`.
- [ ] **Step 5: `npm run typecheck && npm run build`** — pass; the three post HTML files exist under `.next/server/app/blog/`. `grep -c 'id="summary"' '.next/server/app/blog/compute-information-and-asset-pricing.html'` → `1` (demoted h1 got an id); `grep -c '<h1' '.next/server/app/blog/compute-information-and-asset-pricing.html'` → `1` (only the title); `grep -c 'rail-list' .next/server/app/blog/friction-misspecification-deep-hedging.html` → `1`.
- [ ] **Step 6: Review Focus 5 check**: temporarily confirm that a post with no headings would hide the rail by running `npm test` (SectionNav null branch is covered by the `sections.length < 2` rule; add a one-line comment in `SectionNav.tsx` naming this requirement).
- [ ] **Step 7: Dev server**: open all three posts in both themes and both widths; KaTeX renders; rail lists the headings; footnote block sits below. Stop server.
- [ ] **Step 8: Commit** — `git add -A src && git commit -m "feat: post page with front-matter block, article styles, Figure, heading rail"`.

---

### Task 8: Experience page

**Files:**
- Modify: `src/app/experience/page.tsx`

**Interfaces:**
- Consumes: `PageShell`, `.section-title-row`, `.timeline*` (Task 4).

- [ ] **Step 1: Rewrite `experience/page.tsx`**: sections `[{id:"work",label:"Professional experience"},{id:"education",label:"Education"},{id:"memberships",label:"Professional Groups & Memberships"},{id:"activities",label:"Selected activities"}]`; `PageShell`; each existing `<section>` gets the matching `id` and `className="section"`, its `<h2 className="section-heading">` wrapped in `<div className="section-title-row">`; `.timeline` blocks get `className="timeline u"` so organisation links animate. All strings unchanged.
- [ ] **Step 2: `npm run typecheck && npm run build`** — pass; `grep -c 'id="memberships"' .next/server/app/experience.html` → `1`.
- [ ] **Step 3: Dev server**: `/experience` both widths/themes. Stop server.
- [ ] **Step 4: Commit** — `git commit -am "feat: experience page in minimal theme"`.

---

### Task 9: Final verification and cleanup

**Files:**
- Modify: `README.md` (one paragraph under Architecture noting the theme, the legacy file, and the `/blog` redirect; remove the stale Python `api/` description since that directory no longer exists)
- Modify: `src/styles/legacy/globals.legacy.css` (nothing beyond Task 3 header)

- [ ] **Step 1: `npm test && npm run typecheck && npm run build`** — all pass. Build output lists the same 13 routes as before (Home, _not-found, blog, blog/[slug] ×3, cv, experience, projects, projects/connectome, research).
- [ ] **Step 2: Accent audit**: `grep -rn 'var(--accent)' src/styles src/app/globals.css | grep -v legacy` — every hit is one of: rail active/indicator, `.u` underline, `.theme-toggle:hover`, `focus-visible`, `.download-link`. Anything else is a defect; fix it.
- [ ] **Step 3: Legacy audit**: `grep -rn 'globals.legacy' src` returns only the commented import in `layout.tsx` and the comment in `globals.css`. `git status` shows no deletions (`git diff --name-status fd80cf3 | grep '^D'` is empty; renames `R` are fine).
- [ ] **Step 4: Visual pass** against mockup v6 in both themes at ~1280px and ~390px: `/`, `/research`, `/blog/friction-misspecification-deep-hedging`, `/projects`, `/experience`, `/cv`, `/projects/connectome`. Note any deviation in the commit message rather than silently fixing design decisions.
- [ ] **Step 5: README edit** as above.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "docs: README for minimal theme; verification pass"`.
- [ ] **Step 7: Report**: list the commits, the three gates' results, and anything deferred (e.g. code token colours if Step 2 of Task 7 fell back to ink-only).
