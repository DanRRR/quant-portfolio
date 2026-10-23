# Dan Ruksujarit — Quant Portfolio

A Next.js 15 + TypeScript portfolio with an MDX + KaTeX research blog.
Intended host: Vercel.

## Architecture

```
quant-portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages (TS)
│   │   ├── page.tsx            # Home: portrait, links, current, selected research/projects
│   │   ├── research/           # Year-grouped list of published notes
│   │   ├── blog/[slug]/        # Post page (MDX). /blog itself redirects to /research
│   │   ├── projects/           # Year-grouped list of projects
│   │   │   └── connectome/     # Case-study page with its own film + connectome.css
│   │   ├── cv/                 # Timeline page (experience/ kept but redirects here)
│   │   └── globals.css         # Imports the stylesheets in src/styles
│   ├── styles/                 # tokens, base, nav, footer, rail, timeline, home, lists, article
│   │   └── legacy/             # globals.legacy.css — the pre-2026-10 theme, parked, not imported
│   ├── components/             # Nav, ThemeToggle, Footer, PageShell, SectionNav, YearList, Figure, Timeline
│   ├── data/site.ts            # Profile, experience, education, memberships, projects, skills
│   └── lib/                    # posts.ts (MDX loader), listing.ts (dates/years), headings.ts (rail + remark plugin)
├── content/posts/*.mdx         # Posts (front matter: title, date, summary, category, tags, reference, published)
├── tests/*.test.ts             # node:test unit tests for src/lib
├── docs/superpowers/           # Design spec and implementation plan for the minimal theme
├── public/                     # Static assets (cv.pdf, hero.jpg, logos, project media)
└── next.config.mjs             # MDX plugins, /blog → /research redirect
```

### Theme

The site follows a single 700px reading column with a sticky "On this page"
rail (scroll-spy) in the left gutter, hairline rules instead of cards, one
ink colour, and a single accent used only for interactive state. Headings are
Inter; body text is the system sans. Light/dark follows `data-theme` on
`<html>`, set by the inline script in `layout.tsx` and the toggle in the nav.
Design document: `docs/superpowers/specs/2026-10-22-minimal-theme-design.md`.

The previous theme is kept unchanged at `src/styles/legacy/globals.legacy.css`
and is not imported. Replaced components (`ProjectCard`, `CvSectionNav`) stay
in the tree with a header note.

### Why this stack

- **Next.js + TS** — first-class on Vercel, App Router, server components.
- **MDX + KaTeX + rehype-pretty-code** — posts with real math
  (`$$\beta = (X^TX)^{-1}X^Ty$$`) and syntax-highlighted code, rendered at build time.
- **Plain CSS** — about 900 lines across `src/styles/*.css`; no utility framework in the output.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm test           # node:test over tests/*.test.ts
npm run build      # production build, prerenders all routes
```

## Add a post

Drop a new `.mdx` file in `content/posts/`:

```md
---
title: "On the Hurst Exponent"
date: "2026-05-12"
summary: "Mean reversion vs. momentum from a single number."
category: "Research Note"
tags: ["time-series"]
reference: "https://github.com/DanRRR/..."   # optional, shown as a Code/Paper link
published: true                               # false hides it everywhere
---

The Hurst exponent $H$ of a series $\{X_t\}$ characterises long-range
dependence...

## First section          <- h2 headings feed the "On this page" rail
```

Body-level `#` headings are demoted to `##` at render time. Figures use the
`<Figure src alt caption label />` MDX component.

## Deploy & DNS

See `DEPLOY.md` for the Vercel import and Cloudflare DNS cutover. As of
October 2026 the live domain still serves the older GitHub Pages CV; the
cutover has not been done.
