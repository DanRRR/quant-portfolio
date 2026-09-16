import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import {
  education,
  experience,
  featuredProjects,
  links,
  profile,
} from "@/data/site";

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 2);
  return (
    <div className="page-stack">
      <section className="intro-grid">
        <div className="portrait-wrap">
          <Image
            src="/hero.jpg"
            alt="Thiraphat Dan Ruksujarit"
            width={370}
            height={370}
            priority
            className="portrait"
          />
          <p className="portrait-caption">London, UK</p>
        </div>
        <div className="intro-copy">
          <p className="eyebrow">Quantitative finance · Computer science</p>
          <h1>{profile.name}</h1>
          <p className="lede">{profile.summary}</p>
          <p>{profile.interests}</p>
          <div className="text-links" aria-label="Profile links">
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <Link href="/cv">Curriculum vitae</Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-title-row">
          <h2>Current</h2>
          <Link href="/experience">Full experience →</Link>
        </div>
        <div className="compact-list">
          {[experience[0], education[0]].map((item) => (
            <article key={item.organisation} className="compact-row">
              <p className="date-label">{item.period}</p>
              <div>
                <h3>{item.title}</h3>
                <p>{item.organisation}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-title-row">
          <h2>Selected research</h2>
          <Link href="/research">All research →</Link>
        </div>
        <div className="work-list">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="work-row work-row-link"
            >
              <div>
                <p className="eyebrow">Research note · {post.date}</p>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
              </div>
              <span className="work-row-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-title-row">
          <h2>Selected projects</h2>
          <Link href="/projects">All projects →</Link>
        </div>
        <div className="work-list">
          {featuredProjects.map((project) => (
            <Link
              key={project.title}
              href={`/projects#${project.slug}`}
              className="work-row work-row-link"
            >
              <div>
                <p className="eyebrow">
                  {project.type} · {project.period}
                </p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <span className="work-row-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
