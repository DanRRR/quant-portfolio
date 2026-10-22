import createMDX from "@next/mdx";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Prevent shiki (rehype-pretty-code) from being bundled into the
  // serverless function — it pulls in hundreds of language grammars
  // which blow past Vercel's 250 MB unzipped function limit.
  serverExternalPackages: ["shiki"],
  experimental: {
    mdxRs: false,
  },
  // The blog index moved to /research (minimal theme, 2026-10-22); post URLs are unchanged.
  async redirects() {
    return [{ source: "/blog", destination: "/research", permanent: true }];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      [rehypeKatex, { strict: false }],
      [
        rehypePrettyCode,
        { theme: { dark: "github-dark", light: "github-light" } },
      ],
    ],
  },
});

export default withMDX(nextConfig);
