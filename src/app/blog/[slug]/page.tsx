import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import Figure from "@/components/Figure";
import PageShell from "@/components/PageShell";
import { extractHeadings, remarkSectionHeadings } from "@/lib/headings";
import { formatDateLong } from "@/lib/listing";
import { getAllPosts, getPost } from "@/lib/posts";
import { profile } from "@/data/site";

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

  const sections = [
    { id: "introduction", label: "Introduction" },
    ...extractHeadings(post.content),
  ];
  const referenceLabel = post.reference?.includes("github.com") ? "GitHub ↗" : "Paper ↗";

  return (
    <PageShell sections={sections}>
      <article className="page" style={{ paddingTop: 0 }}>
        <header className="front-matter">
          <h1>{post.title}</h1>
          {post.summary && <h4>{post.summary}</h4>}
          <div className="bylines">
            <div className="byline">
              <h3>Author</h3>
              <p>{profile.shortName}</p>
            </div>
            {post.date && (
              <div className="byline">
                <h3>Published</h3>
                <p>{formatDateLong(post.date)}</p>
              </div>
            )}
            <div className="byline">
              <h3>Category</h3>
              <p>{post.category}</p>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="byline">
                <h3>Tags</h3>
                <p>{post.tags.join(", ")}</p>
              </div>
            )}
            {post.reference && (
              <div className="byline u">
                <h3>Code</h3>
                <p>
                  <a href={post.reference} target="_blank" rel="noreferrer">
                    {referenceLabel}
                  </a>
                </p>
              </div>
            )}
          </div>
        </header>
        <div className="article">
          <div id="introduction">
            <MDXRemote
              source={post.content}
              components={{ Figure }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath, remarkSectionHeadings],
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
          </div>
        </div>
      </article>
    </PageShell>
  );
}
