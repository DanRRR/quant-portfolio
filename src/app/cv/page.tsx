import SectionHeading from "@/components/SectionHeading";
import Timeline from "@/components/Timeline";
import PageShell from "@/components/PageShell";
// import CvSectionNav from "@/components/CvSectionNav"; // superseded by SectionNav via PageShell (minimal theme, 2026-10-22)
import {
  education,
  experience,
  // featuredProjects, — Selected projects section parked 2026-10-23 (the Projects page covers it)
  leadershipActivities,
  links,
  memberships,
  // profile, — Profile section parked 2026-10-23 (hero covers name, email, location)
  skillGroups,
} from "@/data/site";

export const metadata = { title: "Curriculum Vitae" };
// 2026-10-23: /experience folded into this page (it redirects here). Profile and
// Projects sections parked; see the JSX comments below.
const sections = [
  // { id: "basics", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "membership", label: "Memberships" },
  // { id: "projects", label: "Projects" },
  { id: "activities", label: "Activities" },
  { id: "skills", label: "Skills" },
];

export default function CvPage() {
  return (
    <PageShell sections={sections} download={{ href: links.cv, label: "Download PDF ↗" }}>
      {/* Old sidebar, parked 2026-10-22 — the rail now comes from PageShell:
      <aside className="cv-nav" aria-label="CV sections">
        <CvSectionNav sections={sections} />
        <a className="download-link" href={links.cv} target="_blank" rel="noreferrer">
          Download PDF ↗
        </a>
      </aside>
      */}
      <div className="page">
        <SectionHeading
          /* eyebrow="Web résumé" — removed 2026-10-23 */
          title="Curriculum Vitae"
          /* description="A concise record of my education, experience, and technical work." — replaced 2026-10-23 by the former Profile "Focus" line */
          description="Systematic equity and alpha research, market microstructure, algorithmic execution, and machine learning."
        />
        {/* Profile section, parked 2026-10-23 (the hero carries name, email and location; Focus moved to the page description):
        <section id="basics" className="section">
          <div className="section-title-row">
            <h2>Profile</h2>
          </div>
          <dl className="basics-grid">
            <dt>Name</dt>
            <dd>{profile.name}</dd>
            <dt>Email</dt>
            <dd className="u">
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
        */}
        <section id="experience" className="section">
          <div className="section-title-row">
            <h2>Experience</h2>
          </div>
          <div className="u">
            <Timeline entries={experience} />
          </div>
        </section>
        <section id="education" className="section">
          <div className="section-title-row">
            <h2>Education</h2>
          </div>
          <div className="u">
            <Timeline entries={education} />
          </div>
        </section>
        <section id="membership" className="section">
          <div className="section-title-row">
            <h2>Professional Groups &amp; Memberships</h2>
          </div>
          <div className="u">
            <Timeline entries={memberships} />
          </div>
          {/* Hand-written memberships, replaced 2026-10-23 by the data-driven Timeline above:
          <div className="timeline u">
            <article className="timeline-entry">
              <h3>
                <a href="https://lqg.org.uk" target="_blank" rel="noreferrer">
                  London Quant Group (LQG)
                </a>
              </h3>
              <p className="date-label">Student Member</p>
              <p>
                Attend practitioner-led seminars and discussions on quantitative
                finance, investment research, and portfolio management.
              </p>
            </article>
            <article className="timeline-entry">
              <h3>
                <a href="https://thalesians.com/seminars/" target="_blank" rel="noreferrer">
                  The Thalesians
                </a>
              </h3>
              <p className="date-label">Seminar Participant</p>
              <p>
                Attend seminars hosted by a community of professionals interested in
                artificial intelligence, machine learning, quantitative finance,
                economics, mathematics, physics, and computer science.
              </p>
            </article>
          </div>
          */}
        </section>
        {/* Selected projects section, parked 2026-10-23 (duplicated the Projects page):
        <section id="projects" className="section">
          <div className="section-title-row">
            <h2>Selected projects</h2>
          </div>
          {featuredProjects.map((project) => (
            <article className="row" key={project.title}>
              <h3>{project.title}</h3>
              <p className="post-date">{project.period}</p>
              <p>{project.summary}</p>
            </article>
          ))}
        </section>
        */}
        <section id="activities" className="section">
          <div className="section-title-row">
            <h2>Activities and achievements</h2>
          </div>
          <Timeline entries={leadershipActivities} />
        </section>
        <section id="skills" className="section">
          <div className="section-title-row">
            <h2>Skills and languages</h2>
          </div>
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
    </PageShell>
  );
}
