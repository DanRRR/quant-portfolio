import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import { ListItem, YearGroup } from "@/components/YearList";
import { formatDateShort, groupByYear, yearOf } from "@/lib/listing";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Research" };

export default async function ResearchPage() {
  const posts = await getAllPosts();
  const groups = groupByYear(posts, (post) => yearOf(post.date));
  const sections = groups.map((group) => ({ id: `y-${group.year}`, label: group.year }));
  return (
    <PageShell sections={sections}>
      <div className="page">
        <SectionHeading
          eyebrow="Curiosity"
          title="Research"
          description="Technical Notes"
        />
        <p className="intro-note">
          <strong>Working collection.</strong> Notes are being expanded with exact
          data provenance, implementation links, diagnostics, and limitations.
        </p>
        {groups.map((group) => (
          <YearGroup year={group.year} key={group.year}>
            {group.items.map((post) => (
              <ListItem
                key={post.slug}
                meta={`${formatDateShort(post.date)} · ${post.category}`}
                title={post.title}
                href={`/blog/${post.slug}`}
                summary={post.summary}
                foot={post.tags?.length ? post.tags.join(" · ") : undefined}
              />
            ))}
          </YearGroup>
        ))}
        {posts.length === 0 && <p className="intro-note">No notes yet.</p>}
      </div>
    </PageShell>
  );
}
