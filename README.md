# Dan Ruksujarit — Quant Portfolio

A Next.js 15 + TypeScript portfolio with an MDX + KaTeX blog and Python
serverless functions for live market data. Hosted on Vercel.

## Architecture

```
quant-portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages (TS)
│   │   ├── page.tsx            # Landing: bio, live market widget, recent posts
│   │   ├── blog/               # Blog index + [slug] post detail
│   │   ├── projects/           # Project showcase
│   │   └── globals.css
│   ├── components/             # Nav, Footer, MarketSnapshot widget
│   └── lib/posts.ts            # MDX loader (gray-matter)
├── content/posts/*.mdx         # Blog posts (MDX with KaTeX math + code)
├── api/                        # Vercel serverless functions (Python)
│   └── quote.py                # GET /api/quote?symbols=SPY,QQQ,TLT
├── public/                     # Static assets (cv.pdf, hero.jpg, logos)
├── next.config.mjs             # MDX + remark/rehype plugins
├── vercel.json                 # Pin Python runtime
└── requirements.txt            # Python deps for serverless functions
```

### Why this stack

- **Next.js + TS** — first-class on Vercel, App Router, MDX, server components.
- **Python serverless** — `api/*.py` deploys as `/api/*` on Vercel, perfect for
  pandas/numpy quant code that doesn't belong in the browser.
- **MDX + KaTeX + rehype-pretty-code** — write posts with real math
  (`$$\beta = (X^TX)^{-1}X^Ty$$`) and syntax-highlighted code.
- **Recharts** — small, declarative, plays well with React state.

## Local development

```bash
# 1. Install JS deps
npm install

# 2. Install the Vercel CLI (once, globally)
npm i -g vercel

# 3. Run Next.js + Python functions together
vercel dev
```

`vercel dev` is what mounts `/api/quote.py` next to the Next.js app. Plain
`npm run dev` will run the UI but the market widget will show an error because
nothing is serving `/api/quote`.

## Add a blog post

Drop a new `.mdx` file in `content/posts/`:

```md
---
title: "On the Hurst Exponent"
date: "2026-05-12"
summary: "Mean reversion vs. momentum from a single number."
tags: ["time-series"]
---

The Hurst exponent $H$ of a series $\{X_t\}$ characterises long-range
dependence...
```

It will appear on `/blog` automatically (sorted by `date`, newest first).

## Add a Python function

Create `api/<name>.py` with a `handler(BaseHTTPRequestHandler)` class. It
deploys to `/api/<name>`. See `api/quote.py` for a working pattern.

## Deploy & DNS

See `DEPLOY.md` for the Cloudflare → Vercel cutover.
