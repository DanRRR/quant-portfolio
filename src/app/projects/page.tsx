import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/site";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="page-stack">
      <SectionHeading eyebrow="Selected technical work" title="Projects" description="Applied work across forecasting, machine learning, and quantitative finance." />
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
      </div>
    </div>
  );
}
