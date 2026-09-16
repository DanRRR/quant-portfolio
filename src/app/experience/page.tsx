import SectionHeading from "@/components/SectionHeading";
import Timeline from "@/components/Timeline";
import { education, experience } from "@/data/site";

export const metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <div className="page-stack">
      <SectionHeading eyebrow="Background" title="Experience" description="Research, education, and selected activities that shape my work in quantitative finance." />
      <section><h2 className="section-heading">Professional experience</h2><Timeline entries={experience} /></section>
      <section><h2 className="section-heading">Education</h2><Timeline entries={education} /></section>
      <section>
        <h2 className="section-heading">Selected activities</h2>
        <div className="timeline">
          <article className="timeline-entry"><p className="date-label">2025</p><div><h3>Bloomberg Trading Challenge</h3><p className="entry-meta">Participant</p><p>Developed earnings-based ideas and executed long-only equity trades as part of a five-person team.</p></div></article>
          <article className="timeline-entry">
            <p className="date-label">2023 — 2024</p>
            <div>
              <h3>Secretary</h3>
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
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
