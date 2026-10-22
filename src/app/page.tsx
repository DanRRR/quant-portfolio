import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getAllPosts } from "@/lib/posts";
import { formatDateShort } from "@/lib/listing";
import {
  education,
  experience,
  featuredProjects,
  links,
  profile,
} from "@/data/site";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "current", label: "Current" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
];

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 2);
  return (
    <PageShell sections={sections}>
      <div className="page">
        <section id="intro" className="intro">
          <div className="portrait-wrap">
            <Image
              src="/hero.jpg"
              alt="Thiraphat Dan Ruksujarit"
              width={160}
              height={160}
              priority
              className="portrait"
            />
            <p className="portrait-caption">London, UK</p>
          </div>
          <div className="intro-copy">
            <p className="eyebrow">Quantitative finance · Computer science</p>
            <h1>{profile.name}</h1>
            {/* hero description, parked 2026-10-22 (minimal theme):
            <p className="lede">{profile.summary}</p>
            <p>{profile.interests}</p>
            */}
            <div className="text-links u" aria-label="Profile links">
              <a href={links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`}>Email</a>
              <Link href="/cv">Curriculum vitae</Link>
            </div>
            <p className="hero-memberships u">
              <span className="hero-memberships-label">Community member</span>
              <a href="https://lqg.org.uk/" target="_blank" rel="noreferrer">London Quant Group</a>
              <span aria-hidden="true"> · </span>
              <a href="https://thalesians.com/seminars/" target="_blank" rel="noreferrer">The Thalesians</a>
            </p>
          </div>
        </section>

        <section id="current" className="section">
          <div className="section-title-row u">
            <h2>Current</h2>
            <Link href="/experience">Full experience →</Link>
          </div>
          {[experience[0], education[0]].map((item) => (
            <article key={item.organisation} className="row u">
              <p className="eyebrow" style={{ margin: 0 }}>{item.period}</p>
              <h3>{item.title}</h3>
              <p>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.organisation}
                </a>
              </p>
            </article>
          ))}
        </section>

        <section id="research" className="section">
          <div className="section-title-row u">
            <h2>Selected research</h2>
            <Link href="/research">All research →</Link>
          </div>
          {posts.map((post) => (
            <article key={post.slug} className="row u">
              <p className="eyebrow" style={{ margin: 0 }}>
                {post.category} · {formatDateShort(post.date)}
              </p>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.summary}</p>
              {/* <span className="work-row-arrow" aria-hidden="true">↗</span> — parked 2026-10-22 */}
            </article>
          ))}
        </section>

        <section id="projects" className="section">
          <div className="section-title-row u">
            <h2>Selected projects</h2>
            <Link href="/projects">All projects →</Link>
          </div>
          {featuredProjects.map((project) => (
            <article key={project.title} className="row u">
              <p className="eyebrow" style={{ margin: 0 }}>
                {project.type} · {project.period}
              </p>
              <h3>
                <Link href={`/projects#${project.slug}`}>{project.title}</Link>
              </h3>
              <p>{project.summary}</p>
              {/* <span className="work-row-arrow" aria-hidden="true">↗</span> — parked 2026-10-22 */}
            </article>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
