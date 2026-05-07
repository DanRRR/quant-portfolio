import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Blog" };

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="border-b border-[var(--color-border)] pb-4">
            <Link href={`/blog/${p.slug}`} className="no-underline">
              <div className="text-lg font-medium text-[var(--color-fg)]">{p.title}</div>
              <div className="text-sm text-[var(--color-fg-muted)]">
                {p.date} — {p.summary}
              </div>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="text-[var(--color-fg-muted)]">No posts yet.</li>
        )}
      </ul>
    </div>
  );
}
