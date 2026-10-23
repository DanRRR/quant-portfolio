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

// 2026-10-23: the hero fills the first screen above the rail, so it is no longer a rail entry.
const sections = [
  // { id: "intro", label: "Introduction" },
  { id: "current", label: "Current" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
];

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 2);
  return (
    <>
      {/* Full-height hero in the content column; the rail and sections start below it. */}
      <div className="shell layout">
        <section id="intro" className="col hero">
          <div className="intro">
            <div className="portrait-wrap">
              <Image
                src="/hero.jpg"
                alt="Thiraphat Dan Ruksujarit"
                width={560}
                height={560}
                sizes="(max-width: 560px) 60vw, 280px"
                priority
                className="portrait"
              />
              <p className="portrait-caption">London, UK</p>
            </div>
            <div className="intro-copy">
              {/* <p className="eyebrow">Quantitative finance · Computer science</p> — removed 2026-10-23 */}
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
                <Link href="/cv">CV</Link>
              </div>
              <p className="hero-memberships u">
                <span className="hero-memberships-label">Community member</span>
                <a href="https://lqg.org.uk/" target="_blank" rel="noreferrer">
                  London Quant Group
                </a>
                <span aria-hidden="true"> · </span>
                <a
                  href="https://thalesians.com/seminars/"
                  target="_blank"
                  rel="noreferrer"
                >
                  The Thalesians
                </a>
              </p>
            </div>
          </div>
          <a href="#current" className="scroll-cue">
            ↓ Scroll
          </a>
        </section>
      </div>

      {/* Second snap point: the rail + content block settles just under the header. */}
      <div className="home-after">
        <PageShell sections={sections}>
          <div className="page home-body">
            <section id="current" className="section">
              <div className="section-title-row u">
                <h2>Current</h2>
                <Link href="/cv#experience">Full experience →</Link>
              </div>
              {[experience[0], education[0]].map((item) => (
                <article key={item.organisation} className="row u">
                  <h3>{item.title}</h3>
                  <p className="post-date">{item.period}</p>
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
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="post-date">
                    {formatDateShort(post.date)} · {post.category}
                  </p>
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
                  <h3>
                    <Link href={`/projects#${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="post-date">
                    {project.period} · {project.type}
                  </p>
                  <p>{project.summary}</p>
                  {/* <span className="work-row-arrow" aria-hidden="true">↗</span> — parked 2026-10-22 */}
                </article>
              ))}
            </section>
          </div>
        </PageShell>
      </div>
    </>
  );
}
