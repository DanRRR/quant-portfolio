import Link from "next/link";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import { ListItem, YearGroup } from "@/components/YearList";
// import ProjectCard from "@/components/ProjectCard"; // superseded by YearList items (minimal theme, 2026-10-22)
import { groupByYear, yearOf } from "@/lib/listing";
import { projects } from "@/data/site";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const groups = groupByYear(projects, (project) => yearOf(project.period));
  const sections = groups.map((group) => ({ id: `y-${group.year}`, label: group.year }));
  return (
    <PageShell sections={sections}>
      <div className="page">
        <SectionHeading
          eyebrow="Selected technical work"
          title="Projects"
          description="Applied work across forecasting, machine learning, and quantitative finance."
        />
        {groups.map((group) => (
          <YearGroup year={group.year} key={group.year}>
            {group.items.map((project) => (
              <ListItem
                key={project.title}
                id={project.slug}
                meta={`${project.period} · ${project.type}`}
                title={project.title}
                href={project.detailHref ?? project.github}
                external={!project.detailHref}
                summary={project.summary}
                foot={
                  <>
                    {project.methods.join(" · ")}
                    {" · "}
                    {project.detailHref && (
                      <>
                        <Link href={project.detailHref}>Case study</Link>
                        {" · "}
                      </>
                    )}
                    <a href={project.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </>
                }
              />
            ))}
          </YearGroup>
        ))}
      </div>
    </PageShell>
  );
}
