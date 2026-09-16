import SectionHeading from "@/components/SectionHeading";
import Timeline from "@/components/Timeline";
import CvSectionNav from "@/components/CvSectionNav";
import { education, experience, links, profile, projects, skillGroups } from "@/data/site";

export const metadata = { title: "Curriculum Vitae" };
const sections = [
  { id: "basics", label: "Basics" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

export default function CvPage() {
  return (
    <div className="cv-page">
      <aside className="cv-nav" aria-label="CV sections">
        <CvSectionNav sections={sections} />
        <a className="download-link" href={links.cv} target="_blank" rel="noreferrer">Download PDF ↗</a>
      </aside>
      <div className="cv-content page-stack">
        <SectionHeading eyebrow="Web résumé" title="Curriculum Vitae" description="A concise record of my education, experience, and technical work." />
        <section id="basics" className="anchor-section"><h2 className="section-heading">Basics</h2><dl className="basics-grid"><dt>Name</dt><dd>{profile.name}</dd><dt>Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd><dt>Location</dt><dd>{profile.location}</dd><dt>Focus</dt><dd>Systematic trading, alpha research, and applied machine learning</dd></dl></section>
        <section id="experience" className="anchor-section"><h2 className="section-heading">Experience</h2><Timeline entries={experience} /></section>
        <section id="education" className="anchor-section"><h2 className="section-heading">Education</h2><Timeline entries={education} /></section>
        <section id="projects" className="anchor-section"><h2 className="section-heading">Projects</h2><div className="work-list">{projects.map((project) => <article className="work-row" key={project.title}><div><p className="eyebrow">{project.period}</p><h3>{project.title}</h3><p>{project.summary}</p></div></article>)}</div></section>
        <section id="skills" className="anchor-section"><h2 className="section-heading">Skills and languages</h2><dl className="basics-grid">{skillGroups.map((group) => <div className="contents" key={group.label}><dt>{group.label}</dt><dd>{group.values.join(" · ")}</dd></div>)}</dl></section>
      </div>
    </div>
  );
}
