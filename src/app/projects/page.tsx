export const metadata = { title: "Projects" };

type Project = {
  title: string;
  blurb: string;
  status: "complete" | "in-progress" | "planned";
  href?: string;
  github?: string;
  tags: string[];
};

const projects: Project[] = [
  {
    title: "Cointegration-Based Pairs Trading (US Equities)",
    blurb:
      "Daily stat-arb strategy on liquid US equities using Engle–Granger cointegration. Spread modelled as an Ornstein–Uhlenbeck process; positions sized by z-score with dynamic entry/exit bands. Rolling re-estimation every 5 days reduces beta drift. Out-of-sample Sharpe ~1.2 after 5 bps round-trip costs.",
    status: "complete",
    href: "/blog/cointegration-pairs",
    tags: ["Python", "statsmodels", "Stat-arb", "Backtest"],
  },
  {
    title: "Vol-Targeted Trend Following on Futures",
    blurb:
      "Cross-asset trend strategy across commodities, rates, and FX futures. EWMA volatility targeting keeps annualised portfolio vol at 15%. Compares EWMA vs. channel-breakout signals; risk-parity position sizing. Written as part of MSc Trading Market Microstructure coursework.",
    status: "in-progress",
    tags: ["Python", "pandas", "Vol targeting", "Risk parity"],
  },
  {
    title: "Heston Model Calibration to Options Chain",
    blurb:
      "Calibrating the Heston stochastic volatility model to SPX options across strikes and maturities. Objective function minimises RMSE in implied vol space; gradient via finite differences. Compares COS method vs. Monte Carlo pricing for efficiency. Work from MSc Stochastic Modelling module (88.8%).",
    status: "in-progress",
    tags: ["Python", "SciPy", "Options pricing", "Stochastic vol"],
  },
  {
    title: "ML Return Prediction: Factor Signals + Gradient Boosting",
    blurb:
      "Predicts 5-day forward returns using engineered features: momentum, volatility regime, Fama–French exposures, and short-term reversal. XGBoost with walk-forward CV to prevent lookahead. IC decay and feature importance plotted. From MSc Applied Machine Learning module (80.75%).",
    status: "complete",
    tags: ["Python", "XGBoost", "Feature engineering", "Walk-forward CV"],
  },
  {
    title: "Bayesian Factor Model with PyMC",
    blurb:
      "Hierarchical Bayesian regression of equity returns onto Fama–French five factors. Posterior distributions over factor loadings vs. OLS point estimates. Partial pooling across assets in the same sector. Demonstrates how prior regularisation compares to frequentist Ridge regression.",
    status: "planned",
    tags: ["PyMC", "Bayesian", "Factor models", "MCMC"],
  },
];

const STATUS_STYLE: Record<Project["status"], string> = {
  complete: "text-emerald-400 border-emerald-800 bg-emerald-950",
  "in-progress": "text-amber-400 border-amber-800 bg-amber-950",
  planned: "text-[var(--color-fg-muted)] border-[var(--color-border)] bg-transparent",
};

const STATUS_LABEL: Record<Project["status"], string> = {
  complete: "Complete",
  "in-progress": "In progress",
  planned: "Planned",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="text-[var(--color-fg-muted)]">
          Research and code spanning systematic strategies, stochastic modelling,
          and machine learning. Write-ups link from each card as they are published.
        </p>
      </header>
      <ul className="space-y-5">
        {projects.map((p) => (
          <li
            key={p.title}
            className="border border-[var(--color-border)] rounded-lg p-5 bg-[var(--color-surface)]"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-semibold leading-snug">
                {p.href ? (
                  <a href={p.href} className="no-underline hover:underline hover:text-[var(--color-accent)]">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h2>
              <span className={`shrink-0 text-xs font-mono px-2 py-0.5 rounded border ${STATUS_STYLE[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>
            </div>
            <p className="text-sm text-[var(--color-fg-muted)] mt-2 leading-relaxed">{p.blurb}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-fg-muted)]"
                >
                  {t}
                </span>
              ))}
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs ml-auto hover:text-[var(--color-accent)]"
                >
                  GitHub →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
