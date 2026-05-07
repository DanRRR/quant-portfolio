import Link from "next/link";
import Image from "next/image";
import MarketSnapshot from "@/components/widgets/MarketSnapshot";
import { getAllPosts } from "@/lib/posts";

const AFFILIATIONS = [
  {
    name: "WorldQuant BRAIN",
    role: "Research Consultant",
    logo: "/logos/worldquant.jpeg",
    href: "https://www.worldquantbrain.com/",
  },
  {
    name: "Bayes Business School",
    role: "MSc Mathematical Trading & Finance",
    logo: "/logos/bayes.jpg",
    href: "https://www.bayes.citystgeorges.ac.uk/",
  },
  {
    name: "University of Leeds",
    role: "BSc Computer Science",
    logo: "/logos/leeds.jpeg",
    href: "https://eps.leeds.ac.uk/computing",
  },
];

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <div className="space-y-14">
      {/* ── Hero ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-5">
          <Image
            src="/hero.jpg"
            alt="Thiraphat Dan Ruksujarit"
            width={72}
            height={72}
            className="rounded-full object-cover ring-1 ring-[var(--color-border)]"
          />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight leading-tight">
              Thiraphat (Dan) Ruksujarit
            </h1>
            <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">
              Quantitative Researcher · London
            </p>
          </div>
        </div>

        <p className="text-base text-[var(--color-fg-muted)] leading-relaxed">
          MSc Mathematical Trading &amp; Finance candidate at Bayes Business
          School. Building systematic strategies at the intersection of
          stochastic modelling, machine learning, and market microstructure.
          Writing about the math, code, and edge cases behind each idea.
        </p>

        {/* Affiliations */}
        <div className="flex flex-wrap gap-4">
          {AFFILIATIONS.map((a) => (
            <a
              key={a.name}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] no-underline hover:border-[var(--color-accent-muted)] group"
            >
              <Image
                src={a.logo}
                alt={a.name}
                width={20}
                height={20}
                className="rounded-sm object-contain opacity-80 group-hover:opacity-100"
              />
              <span className="text-xs leading-tight">
                <span className="block text-[var(--color-fg)] font-medium">{a.name}</span>
                <span className="block text-[var(--color-fg-muted)]">{a.role}</span>
              </span>
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-2 pt-1 text-sm">
          <Link href="/projects" className="px-3 py-1.5 rounded-md border border-[var(--color-border)] no-underline hover:bg-[var(--color-surface)]">
            Projects
          </Link>
          <Link href="/blog" className="px-3 py-1.5 rounded-md border border-[var(--color-border)] no-underline hover:bg-[var(--color-surface)]">
            Blog
          </Link>
          <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md border border-[var(--color-border)] no-underline hover:bg-[var(--color-surface)]">
            CV
          </a>
          <a href="https://github.com/DanRRR" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md border border-[var(--color-border)] no-underline hover:bg-[var(--color-surface)]">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/thiraphat-ruksujarit/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md border border-[var(--color-border)] no-underline hover:bg-[var(--color-surface)]">
            LinkedIn
          </a>
        </div>
      </section>

      {/* ── Market snapshot ── */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Live market snapshot</h2>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Equity indices, rates, and vol — fetched on each load via a Python
          serverless function on Vercel.
        </p>
        <MarketSnapshot />
      </section>

      {/* ── Recent writing ── */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Recent writing</h2>
          <Link href="/blog" className="text-sm">All posts →</Link>
        </div>
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-[var(--color-border)] pb-3">
              <Link href={`/blog/${p.slug}`} className="no-underline group">
                <div className="font-medium text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">{p.title}</div>
                <div className="text-sm text-[var(--color-fg-muted)] mt-0.5">
                  {p.date} · {p.summary}
                </div>
              </Link>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="text-sm text-[var(--color-fg-muted)]">Posts coming soon.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
