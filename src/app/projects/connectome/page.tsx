import Link from "next/link";
import ConnectomeFilm from "@/components/ConnectomeFilm";

export const metadata = {
  title: "Connectome — Stateful Market Prediction",
  description:
    "A visual case study of a stateful GRU pipeline for short-horizon market prediction.",
};

export default function ConnectomeProjectPage() {
  return (
    <article className="connectome-story">
      <header className="connectome-hero">
        <div className="connectome-kicker">
          <span>Wunder Fund ML Competition</span>
          <span>September 2026</span>
        </div>
        <h1>Connectome: Stateful Market Prediction</h1>
        <p>
          Revealing latent microstructure state from 249.6 million ordered
          observations with a stateful recurrent learning pipeline.
        </p>
        <div className="connectome-links">
          <a
            href="https://github.com/DanRRR/wnn_connectome_challenge"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <Link href="/projects">All projects →</Link>
        </div>
      </header>

      <section className="connectome-film-stage" aria-label="Project film">
        <ConnectomeFilm />
      </section>

      <footer className="connectome-project-footer">
        <p>
          The training pipeline, technical report, and implementation are being
          refined for public sharing as the competition progresses.
        </p>
        <Link href="/projects">Return to projects →</Link>
      </footer>
    </article>
  );
}
