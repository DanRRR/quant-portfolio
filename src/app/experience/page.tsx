import PageShell from "@/components/PageShell";
// Superseded 2026-10-23: this page was folded into src/app/cv/page.tsx and
// /experience now redirects to /cv (next.config.mjs). Kept for reference; not linked.
import SectionHeading from "@/components/SectionHeading";
import Timeline from "@/components/Timeline";
import { education, experience } from "@/data/site";

export const metadata = { title: "Experience" };

const sections = [
  { id: "work", label: "Professional experience" },
  { id: "education", label: "Education" },
  { id: "memberships", label: "Professional Groups & Memberships" },
  { id: "activities", label: "Selected activities" },
];

export default function ExperiencePage() {
  return (
    <PageShell sections={sections}>
      <div className="page">
        <SectionHeading /* eyebrow="Background" — removed 2026-10-23 */ title="Experience" description="Research, education, and selected activities that shape my work in quantitative finance." />
        <section id="work" className="section">
          <div className="section-title-row">
            <h2>Professional experience</h2>
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
        <section id="memberships" className="section">
          <div className="section-title-row">
            <h2>Professional Groups &amp; Memberships</h2>
          </div>
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
        </section>
        <section id="activities" className="section">
          <div className="section-title-row">
            <h2>Selected activities</h2>
          </div>
          <div className="timeline u">
            <article className="timeline-entry">
              <h3>Bloomberg Trading Challenge</h3>
              <p className="date-label">2025</p>
              <p className="entry-meta">Participant</p>
              <p>Developed earnings-based ideas and executed long-only equity trades as part of a five-person team.</p>
            </article>
            <article className="timeline-entry">
              <h3>Secretary</h3>
              <p className="date-label">2023 — 2024</p>
              <p className="entry-meta">University of Leeds Muay Thai Society</p>
              <ul className="detail-list">
                  <li>Managed society operations and engagement.</li>
                  <li>
                    Won gold in the{" "}
                    <a href="https://www.kihapp.com/tournaments/13350-mtgb-university-championships-2024/competitors/575461-dan-ruksujarit" target="_blank" rel="noreferrer">
                      57.1–60 kg male category at the Muaythai GB University Championships (British Nationals)
                    </a>
                    , sanctioned by{" "}
                    <a href="https://www.muaythaigb.org" target="_blank" rel="noreferrer">
                      Muaythai GB
                    </a>
                    .
                  </li>
                </ul>
            </article>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
