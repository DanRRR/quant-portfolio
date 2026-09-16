export const profile = {
  name: "Thiraphat (Dan) Ruksujarit",
  shortName: "Dan Ruksujarit",
  location: "London, United Kingdom",
  email: "dan.ruksujarit@bayes.city.ac.uk",
  summary: "Mathematical Trading and Finance student at Bayes Business School and Computer Science graduate from the University of Leeds.",
  interests: "My interests centre on applying data-driven algorithms to financial markets, particularly systematic trading, alpha signal development, and applied machine learning.",
};

export const links = {
  github: "https://github.com/DanRRR",
  linkedin: "https://www.linkedin.com/in/thiraphat-ruksujarit/",
  cv: "/cv.pdf",
};

export type TimelineEntry = {
  period: string;
  title: string;
  organisation: string;
  location?: string;
  href?: string;
  details: string[];
};

export const experience: TimelineEntry[] = [
  {
    period: "May 2025 — Present",
    title: "Part-Time Research Consultant",
    organisation: "WorldQuant BRAIN",
    location: "Remote",
    href: "https://www.worldquantbrain.com/",
    details: [
      "Research quantitative signals across multiple universes and regions using the WorldQuant BRAIN platform.",
      "Built a multi-simulation pipeline to automate submissions, result polling, and performance logging.",
      "Selected after placing second in Thailand and in the top 1% globally in the International Quant Championship.",
    ],
  },
  {
    period: "June 2019",
    title: "Student Assistant",
    organisation: "Cambridge Academy of English",
    location: "Cambridge, United Kingdom",
    href: "https://www.cambridgeacademy.co.uk",
    details: ["Supported international student activities and reviewed internal scheduling and organisation workflows."],
  },
];

export const education: TimelineEntry[] = [
  {
    period: "Sep 2025 — Present",
    title: "MSc Quantitative Finance",
    organisation: "Bayes Business School, City St George’s, University of London",
    location: "London, United Kingdom",
    href: "https://www.bayes.citystgeorges.ac.uk/",
    details: [
      "Student representative for the MSc Quantitative Finance cohort.",
      "Study includes stochastic modelling, asset pricing, derivatives, and econometrics.",
    ],
  },
  {
    period: "Sep 2021 — Jul 2024",
    title: "BSc Computer Science (Hons)",
    organisation: "University of Leeds",
    location: "Leeds, United Kingdom",
    href: "https://eps.leeds.ac.uk/computing",
    details: ["Study included machine learning, artificial intelligence, cryptography, adaptive intelligence systems, and information visualisation."],
  },
  {
    period: "Sep 2016 — Jul 2021",
    title: "Secondary Education",
    organisation: "The Leys School",
    location: "Cambridge, United Kingdom",
    href: "https://www.theleys.net",
    details: ["A Levels in Computer Science, Physics, Mathematics, and Further Mathematics."],
  },
];

export const leadershipActivities: TimelineEntry[] = [
  {
    period: "2025",
    title: "Participant",
    organisation: "Bloomberg Trading Challenge",
    details: [
      "Developed earnings-based ideas and executed long-only equity trades as part of a five-person team.",
    ],
  },
  {
    period: "2023 — 2024",
    title: "Secretary",
    organisation: "University of Leeds Muay Thai Society",
    details: [
      "Managed society operations and engagement.",
      "Won gold in the 57.1–60 kg male category at the Muaythai GB University Championships (British Nationals).",
    ],
  },
];

export const projects = [
  {
    slug: "market-state-forecasting",
    featured: true,
    title: "Connectome: Stateful Market Prediction",
    period: "September 2026",
    type: "Wunder Fund ML Competition",
    github: "https://github.com/DanRRR/wnn_connectome_challenge",
    preview: "/projects/figure-placeholder.svg",
    summary: "An end-to-end stateful Gated Recurrent Unit (GRU) pipeline for predicting two anonymised short-horizon market targets from 112 order-book and trade features across 249.6 million training and validation rows.",
    methods: ["Python", "PyTorch", "GRU", "ONNX", "Market microstructure"],
    note: "The training pipeline, technical report, and implementation are being refined and prepared for public sharing as the competition progresses.",
  },
  {
    slug: "deep-hedging-transaction-costs",
    featured: true,
    title: "Transaction Cost and Temporary Market Impact Misspecification with Neural Networks",
    period: "September 2026",
    type: "MSc Research Project",
    github: "https://github.com/DanRRR/Deep_hedging_with_transaction_costs",
    preview: "/projects/figure-placeholder.svg",
    summary: "Adopted the Deep Hedging framework to study how proportional transaction costs and temporary market impact reshape dynamic option-hedging policies, and how friction misspecification creates deployment regret for learned hedgers.",
    methods: ["Python", "PyTorch", "Deep hedging", "Transaction costs", "Temporary market impact"],
    note: "Supporting code, report, and selected results are available on GitHub.",
  },
  {
    slug: "trading-costs-robust-portfolio-construction",
    featured: true,
    title: "Trading Costs, Momentum, and Portfolio Construction",
    period: "June 2026",
    type: "MSc Trading and Market Microstructure Coursework",
    github: "https://github.com/DanRRR/CW1_Trading_and_Market_Microstructure",
    preview: "/projects/figure-placeholder.svg",
    summary: "A group study linking empirical trading costs to portfolio construction: analysing intraday spreads, depth, and volatility in FTSE 100 stocks, then testing country momentum and mean-variance portfolios using sample and shrinkage-based covariance estimates across 34 equity markets.",
    methods: ["Python", "Market microstructure", "Momentum", "Mean-variance optimisation", "Covariance shrinkage"],
    note: "The analysis pipeline and supporting notebooks are available on GitHub.",
  },
  {
    slug: "comomentum-crowding-aware-strategies",
    title: "Comomentum: Crowding-Aware Momentum Strategies",
    period: "March 2026",
    type: "MSc Quantitative Trading Coursework",
    github: "https://github.com/DanRRR/CW1_Quantitative_Trading",
    preview: "/projects/figure-placeholder.svg",
    summary: "A group replication and extension of Lou and Polk's comomentum framework across approximately 7,200 US equities, testing whether residual-return crowding signals can improve the timing and downside risk of momentum exposure.",
    methods: ["Python", "Fama–MacBeth", "Fama–French factors", "Momentum", "Backtesting"],
    note: "Research notebooks and the implementation are available on GitHub.",
  },
  {
    slug: "structured-floating-rate-note-pricing-hedging",
    title: "Structured Floating-Rate Note Pricing and Hedging",
    period: "March 2026",
    type: "MSc Fixed Income Coursework",
    github: "https://github.com/DanRRR/CW1_Fix_Income",
    preview: "/projects/figure-placeholder.svg",
    summary: "A group valuation and risk study of UniCredit's 10-year capped, leveraged 3M EURIBOR floating-rate note, decomposing its embedded floor and cap, calibrating curves and option inputs, and designing IRS/CDS hedges with PCA, VaR, and stress testing.",
    methods: ["Python", "QuantLib", "Curve bootstrapping", "Displaced-Black", "PCA and VaR hedging"],
    note: "The submitted report, analysis notebooks, and implementation are available on GitHub.",
  },
  {
    slug: "risk-analysis-var-portfolio-construction",
    title: "Risk Analysis: VaR, Expected Shortfall and Portfolio Construction",
    period: "June 2026",
    type: "MSc Risk Analysis Coursework",
    github: "https://github.com/DanRRR/CW1_Risk_Analysis",
    preview: "/projects/figure-placeholder.svg",
    summary: "A group study of market risk across an equity portfolio, risk-managed allocations, and a fixed-income position, combining rolling VaR and Expected Shortfall forecasts with Kupiec backtesting, GARCH power analysis, risk parity, maximum diversification, and Monte Carlo bond revaluation.",
    methods: ["Python", "VaR and Expected Shortfall", "GARCH", "Risk parity", "Monte Carlo revaluation"],
    note: "The analysis notebooks, data workflow, and implementation are available on GitHub.",
  },
  {
    slug: "lob-fairy-predictorium",
    title: "LOB Fairy Predictorium: Short-Horizon Price-Movement Forecasting",
    period: "February 2026",
    type: "Wunder Fund ML Competition",
    github: "https://github.com/DanRRR/LOB_fairy_predictorium",
    preview: "/projects/figure-placeholder.svg",
    summary: "Developed a streaming forecasting pipeline for two anonymised price-movement targets using limit-order-book and trade data, engineered microstructure features, and Gated Recurrent Unit (GRU) models deployed through ONNX.",
    methods: ["Python", "PyTorch", "GRU", "ONNX", "Limit order book"],
    note: "The modelling pipeline and competition implementation are available on GitHub.",
  },
  {
    slug: "market-state-forecast-wunder-challenge",
    title: "Market-State Forecasting with Recurrent Neural Networks",
    period: "November 2025",
    type: "Wunder Fund ML Competition",
    github: "https://github.com/DanRRR/wunder_challenge",
    preview: "/projects/figure-placeholder.svg",
    summary: "Built a stateful Long Short-Term Memory (LSTM) forecasting pipeline to predict the next anonymised market-state vector from independent temporal sequences, with sequence-aware validation and streaming inference.",
    methods: ["Python", "TensorFlow", "LSTM", "Sequence modelling", "R² validation"],
    note: "The competition solution and supporting experiments are available on GitHub.",
  },
  {
    slug: "cross-asset-econometrics",
    title: "Cross-Asset Econometrics: Cointegration, Causality and Volatility",
    period: "November 2025",
    type: "MSc Foundations of Econometrics Coursework",
    github: "https://github.com/DanRRR/CW1_Foundation_of_Econometrics",
    preview: "/projects/figure-placeholder.svg",
    summary: "A group time-series study of equities, gold, foreign exchange, government yields, and credit spreads, testing stationarity, long-run relationships, price discovery, and asymmetric volatility dynamics across market regimes.",
    methods: ["Python", "ADF tests", "Cointegration", "Granger causality", "GARCH"],
    note: "The econometric analysis and supporting notebooks are available on GitHub.",
  },
  {
    slug: "stock-decision-support",
    title: "Stock Decision Support with Candlestick Patterns and Machine Learning",
    period: "May 2024",
    type: "Undergraduate Research Project",
    github: "https://github.com/DanRRR",
    preview: "/projects/figure-placeholder.svg",
    summary: "Research into combining candlestick classification, engineered financial features, and LSTM variants for trading decision support.",
    methods: ["Python", "TensorFlow", "scikit-learn", "vectorbt"],
    note: "Project report and implementation links are being prepared for public sharing.",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const skillGroups = [
  { label: "Proficient", values: ["Python", "C", "SQL", "Bash"] },
  { label: "Working knowledge", values: ["C++", "Java", "JavaScript", "HTML/CSS"] },
  { label: "Languages", values: ["English — fluent", "Thai — fluent"] },
];
