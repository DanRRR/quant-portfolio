import SectionHeading from "@/components/SectionHeading";
import Timeline from "@/components/Timeline";
import CvSectionNav from "@/components/CvSectionNav";
import {
  education,
  experience,
  featuredProjects,
  leadershipActivities,
  links,
  profile,
  skillGroups,
} from "@/data/site";

export const metadata = { title: "Curriculum Vitae" };
const sections = [
  { id: "basics", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "membership", label: "Memberships" },
  { id: "projects", label: "Projects" },
  { id: "activities", label: "Activities" },
  { id: "skills", label: "Skills" },
];

export default function CvPage() {
  return (
    <div className="cv-page">
      <aside className="cv-nav" aria-label="CV sections">
        <CvSectionNav sections={sections} />
        <a
          className="download-link"
          href={links.cv}
          target="_blank"
          rel="noreferrer"
        >
          Download PDF ↗
        </a>
      </aside>
      <div className="cv-content page-stack">
        <SectionHeading
          eyebrow="Web résumé"
          title="Curriculum Vitae"
          description="A concise record of my education, experience, and technical work."
        />
        <section id="basics" className="anchor-section">
          <h2 className="section-heading">Profile</h2>
          <dl className="basics-grid">
            <dt>Name</dt>
            <dd>{profile.name}</dd>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
            <dt>Location</dt>
            <dd>{profile.location}</dd>
            <dt>Focus</dt>
            <dd>
              Systematic equity and alpha research, market microstructure,
              algorithmic execution, and machine learning
            </dd>
          </dl>
        </section>
        <section id="experience" className="anchor-section">
          <h2 className="section-heading">Experience</h2>
          <Timeline entries={experience} />
        </section>
        <section id="education" className="anchor-section">
          <h2 className="section-heading">Education</h2>
          <Timeline entries={education} />
        </section>
        <section id="membership" className="anchor-section">
          <h2 className="section-heading">Professional Groups &amp; Memberships</h2>
          <div className="timeline">
            <article className="timeline-entry">
              <p className="date-label">Student Member</p>
              <div>
                <h3>
                  <a href="https://lqg.org.uk" target="_blank" rel="noreferrer">
                    London Quant Group (LQG)
                  </a>
                </h3>
                <p>
                  Attend practitioner-led seminars and discussions on quantitative
                  finance, investment research, and portfolio management.
                </p>
              </div>
            </article>
            <article className="timeline-entry">
              <p className="date-label">Seminar Participant</p>
              <div>
                <h3>
                  <a href="https://thalesians.com/seminars/" target="_blank" rel="noreferrer">
                    The Thalesians
                  </a>
                </h3>
                <p>
                  Attend seminars hosted by a community of professionals interested in
                  artificial intelligence, machine learning, quantitative finance,
                  economics, mathematics, physics, and computer science.
                </p>
              </div>
            </article>
          </div>
        </section>
        <section id="projects" className="anchor-section">
          <h2 className="section-heading">Selected projects</h2>
          <div className="work-list">
            {featuredProjects.map((project) => (
              <article className="work-row" key={project.title}>
                <div>
                  <p className="eyebrow">{project.period}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="activities" className="anchor-section">
          <h2 className="section-heading">Activities and achievements</h2>
          <Timeline entries={leadershipActivities} />
        </section>
        <section id="skills" className="anchor-section">
          <h2 className="section-heading">Skills and languages</h2>
          <dl className="basics-grid">
            {skillGroups.map((group) => (
              <div className="contents" key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.values.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
