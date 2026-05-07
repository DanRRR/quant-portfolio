import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags?: string[];
};

export type Post = PostMeta & { content: string };

export async function getAllPosts(): Promise<PostMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(
    entries
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
      .map(async (f) => {
        const slug = f.replace(/\.mdx?$/, "");
        const raw = await fs.readFile(path.join(POSTS_DIR, f), "utf8");
        const { data } = matter(raw);
        return {
          slug,
          title: (data.title as string) ?? slug,
          date: (data.date as string) ?? "",
          summary: (data.summary as string) ?? "",
          tags: (data.tags as string[]) ?? [],
        };
      })
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const c of candidates) {
    const file = path.join(POSTS_DIR, c);
    try {
      const raw = await fs.readFile(file, "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "",
        summary: (data.summary as string) ?? "",
        tags: (data.tags as string[]) ?? [],
        content,
      };
    } catch {
      // try next extension
    }
  }
  return null;
}
