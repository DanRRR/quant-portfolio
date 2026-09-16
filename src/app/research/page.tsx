import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Research" };

export default async function ResearchPage() {
  const posts = await getAllPosts();
  return (
    <div className="page-stack research-page">
      <SectionHeading eyebrow="Curiosity-led" title="Research" description="Technical Notes" />
      <div className="notice"><strong>Working collection.</strong> Notes are being expanded with exact data provenance, implementation links, diagnostics, and limitations.</div>
      <div className="work-list">
        {posts.map((post) => (
          <Link className="work-row work-row-link" href={`/blog/${post.slug}`} key={post.slug}>
            <div>
              <p className="eyebrow">Research note · {post.date}</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              {post.tags?.length ? <div className="tag-list">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
            </div>
            <span className="work-row-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
