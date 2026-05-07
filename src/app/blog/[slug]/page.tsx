import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPost } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="prose prose-invert max-w-none">
      <header className="not-prose mb-8 space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        <div className="text-sm text-[var(--color-fg-muted)]">
          {post.date}
          {post.tags && post.tags.length > 0 && (
            <> · {post.tags.join(", ")}</>
          )}
        </div>
      </header>
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
              [rehypeKatex, { strict: false }],
              [
                rehypePrettyCode,
                { theme: { dark: "github-dark", light: "github-light" } },
              ],
            ],
          },
        }}
      />
    </article>
  );
}
