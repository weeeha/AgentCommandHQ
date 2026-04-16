import { Agent } from "@/types";

export const mockAgents: Agent[] = [
  // ── 1. ATLAS ──────────────────────────────────────────────────
  {
    id: "agent-atlas",
    callsign: "ATLAS",
    classKey: "architect",
    classLabel: "Architect",
    title: "The Strategist",
    level: 22,
    xp: 3400,
    xpToNext: 4200,
    status: "ready",
    statusDetail: "Standing by for deployment",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 92 },
      { key: "speed", label: "Speed", value: 64 },
      { key: "accuracy", label: "Accuracy", value: 78 },
      { key: "context", label: "Context", value: 85 },
      { key: "tool-use", label: "Tool-use", value: 70 },
    ],
    loadout: {
      tools: ["code-analyzer", "diagram-gen", "dependency-mapper"],
      doctrine: "Prioritize maintainability and separation of concerns. Favor composition over inheritance.",
      briefPacket: "System-wide architecture review for the Q2 platform migration.",
    },
    nextPerk: {
      name: "Holistic Vision",
      description: "Can analyze cross-service dependencies in a single pass",
      unlocksAtLevel: 24,
    },
    unlockedPerks: [
      { name: "Blueprint Mode", description: "Generates architecture diagrams from codebases", unlocksAtLevel: 10 },
      { name: "Pattern Library", description: "Identifies and suggests design patterns automatically", unlocksAtLevel: 18 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
      { key: "architect-10", name: "Master Builder", description: "Designed 10 system architectures", count: 10 },
      { key: "streak-7", name: "Iron Focus", description: "7-day mission streak", streak: true },
    ],
    portfolio: [
      {
        id: "port-atlas-1",
        title: "Microservices Migration Plan",
        typeTag: "architecture",
        metric: { value: "40%", label: "latency reduction", direction: "up" },
        shippedAt: "2026-03-28T14:00:00Z",
        subtitle: "Monolith decomposition for auth + billing",
      },
      {
        id: "port-atlas-2",
        title: "Event-Driven Inventory System",
        typeTag: "design",
        metric: { value: "12", label: "services integrated", direction: "up" },
        shippedAt: "2026-02-10T09:30:00Z",
      },
    ],
    skills: [
      { id: "skill-atlas-1", name: "System Design", description: "Designs distributed system architectures", tier: "epic" },
      { id: "skill-atlas-2", name: "Architecture Review", description: "Audits existing codebases for structural issues", tier: "rare" },
    ],
    connectors: [
      { id: "conn-atlas-1", name: "GitHub", description: "Repository access and PR management", tier: "common" },
      { id: "conn-atlas-2", name: "Linear", description: "Issue tracking and project management", tier: "common" },
    ],
    memories: [
      { id: "mem-atlas-1", name: "Codebase Map", description: "Full dependency graph of the production monorepo", tier: "epic" },
    ],
    cronJobs: [
      { id: "cron-atlas-1", name: "Nightly Audit", description: "Scans for architectural drift and dependency violations", tier: "rare" },
    ],
  },

  // ── 2. CIPHER ─────────────────────────────────────────────────
  {
    id: "agent-cipher",
    callsign: "CIPHER",
    classKey: "analyst",
    classLabel: "Analyst",
    title: "The Investigator",
    level: 18,
    xp: 2100,
    xpToNext: 3000,
    status: "deployed",
    statusDetail: "Running auth migration analysis",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 80 },
      { key: "speed", label: "Speed", value: 72 },
      { key: "accuracy", label: "Accuracy", value: 91 },
      { key: "context", label: "Context", value: 76 },
      { key: "tool-use", label: "Tool-use", value: 68 },
    ],
    loadout: {
      tools: ["sql-runner", "chart-gen", "data-profiler"],
      doctrine: "Follow the data. Quantify assumptions before recommending changes.",
      briefPacket: "Investigate auth token expiry patterns and propose migration path.",
    },
    nextPerk: {
      name: "Deep Correlation",
      description: "Links anomalies across disparate datasets automatically",
      unlocksAtLevel: 20,
    },
    unlockedPerks: [
      { name: "Data Lens", description: "Automatically profiles and summarizes datasets", unlocksAtLevel: 8 },
      { name: "Trend Spotter", description: "Detects subtle patterns in time-series data", unlocksAtLevel: 14 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
      { key: "analyst-5", name: "Pattern Seeker", description: "Found 5 critical data insights", count: 5 },
    ],
    portfolio: [
      {
        id: "port-cipher-1",
        title: "User Churn Prediction Model",
        typeTag: "analysis",
        metric: { value: "87%", label: "prediction accuracy", direction: "up" },
        shippedAt: "2026-04-02T11:00:00Z",
        subtitle: "ML pipeline for early churn detection",
      },
      {
        id: "port-cipher-2",
        title: "Revenue Leak Audit",
        typeTag: "report",
        metric: { value: "$42k", label: "recovered monthly", direction: "up" },
        shippedAt: "2026-03-15T16:45:00Z",
      },
    ],
    skills: [
      { id: "skill-cipher-1", name: "Data Analysis", description: "Explores and summarizes complex datasets", tier: "rare" },
      { id: "skill-cipher-2", name: "Pattern Recognition", description: "Identifies anomalies and trends in data", tier: "epic" },
    ],
    connectors: [
      { id: "conn-cipher-1", name: "BigQuery", description: "Google Cloud data warehouse access", tier: "rare" },
      { id: "conn-cipher-2", name: "Slack", description: "Team messaging and notifications", tier: "common" },
    ],
    memories: [
      { id: "mem-cipher-1", name: "Analytics Context", description: "Historical KPI baselines and metric definitions", tier: "rare" },
    ],
    cronJobs: [
      { id: "cron-cipher-1", name: "Daily Report", description: "Generates morning analytics digest for the team", tier: "common" },
    ],
  },

  // ── 3. FORGE ──────────────────────────────────────────────────
  {
    id: "agent-forge",
    callsign: "FORGE",
    classKey: "engineer",
    classLabel: "Engineer",
    title: "The Mechanist",
    level: 25,
    xp: 4800,
    xpToNext: 5500,
    status: "ready",
    statusDetail: "All systems nominal",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 82 },
      { key: "speed", label: "Speed", value: 78 },
      { key: "accuracy", label: "Accuracy", value: 80 },
      { key: "context", label: "Context", value: 75 },
      { key: "tool-use", label: "Tool-use", value: 88 },
    ],
    loadout: {
      tools: ["code-gen", "test-runner", "refactor-engine", "docker-cli"],
      doctrine: "Ship working software. Write tests first, refactor relentlessly, automate everything.",
      briefPacket: "Standing by for engineering tasks. CI/CD pipeline healthy.",
    },
    nextPerk: {
      name: "Forge Master",
      description: "Generates production-ready code with zero linting errors",
      unlocksAtLevel: 28,
    },
    unlockedPerks: [
      { name: "Auto-Test", description: "Generates unit tests alongside every code change", unlocksAtLevel: 10 },
      { name: "Refactor Sense", description: "Identifies code smells and suggests improvements", unlocksAtLevel: 16 },
      { name: "Pipeline Forge", description: "Creates CI/CD pipelines from project structure", unlocksAtLevel: 22 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
      { key: "engineer-25", name: "Code Titan", description: "Shipped 25 features to production", count: 25 },
      { key: "streak-14", name: "Unstoppable", description: "14-day mission streak", streak: true },
      { key: "zero-bugs", name: "Zero Defects", description: "10 consecutive missions with no bugs" },
    ],
    portfolio: [
      {
        id: "port-forge-1",
        title: "Payment Processing v3",
        typeTag: "feature",
        metric: { value: "99.97%", label: "uptime", direction: "up" },
        shippedAt: "2026-04-08T10:00:00Z",
        subtitle: "Complete rewrite of Stripe integration layer",
      },
      {
        id: "port-forge-2",
        title: "GraphQL API Gateway",
        typeTag: "infrastructure",
        metric: { value: "3.2ms", label: "avg response time", direction: "up" },
        shippedAt: "2026-03-20T14:30:00Z",
      },
      {
        id: "port-forge-3",
        title: "E2E Test Suite",
        typeTag: "testing",
        metric: { value: "94%", label: "coverage", direction: "up" },
        shippedAt: "2026-02-28T08:15:00Z",
      },
    ],
    skills: [
      { id: "skill-forge-1", name: "Code Generation", description: "Writes production-quality code from specs", tier: "epic" },
      { id: "skill-forge-2", name: "Refactoring", description: "Restructures code while preserving behavior", tier: "rare" },
      { id: "skill-forge-3", name: "Testing", description: "Creates comprehensive test suites", tier: "rare" },
    ],
    connectors: [
      { id: "conn-forge-1", name: "GitHub", description: "Repository access and PR management", tier: "common" },
      { id: "conn-forge-2", name: "Vercel", description: "Deployment and preview management", tier: "rare" },
      { id: "conn-forge-3", name: "Docker", description: "Container build and management", tier: "rare" },
    ],
    memories: [
      { id: "mem-forge-1", name: "Codebase v2", description: "Full project context including recent refactors", tier: "epic" },
      { id: "mem-forge-2", name: "Style Guide", description: "Team coding conventions and lint rules", tier: "common" },
    ],
    cronJobs: [
      { id: "cron-forge-1", name: "CI Monitor", description: "Watches for failed builds and flaky tests", tier: "rare" },
      { id: "cron-forge-2", name: "Dep Updates", description: "Checks for outdated or vulnerable dependencies", tier: "common" },
    ],
  },

  // ── 4. ECHO ───────────────────────────────────────────────────
  {
    id: "agent-echo",
    callsign: "ECHO",
    classKey: "scout",
    classLabel: "Scout",
    title: "The Pathfinder",
    level: 14,
    xp: 1600,
    xpToNext: 2200,
    status: "cooldown",
    statusDetail: "Resting after research sprint — available in 47m",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 58 },
      { key: "speed", label: "Speed", value: 95 },
      { key: "accuracy", label: "Accuracy", value: 62 },
      { key: "context", label: "Context", value: 70 },
      { key: "tool-use", label: "Tool-use", value: 74 },
    ],
    loadout: {
      tools: ["web-crawler", "search-engine", "content-extractor"],
      doctrine: "Speed over depth. Sweep wide, flag interesting leads, let specialists dig deeper.",
      briefPacket: "Competitive landscape scan for Q2 product positioning.",
    },
    nextPerk: {
      name: "Deep Web",
      description: "Accesses hard-to-reach data sources and APIs",
      unlocksAtLevel: 16,
    },
    unlockedPerks: [
      { name: "Speed Read", description: "Processes web pages 3x faster than baseline", unlocksAtLevel: 6 },
      { name: "Source Validator", description: "Cross-references claims across multiple sources", unlocksAtLevel: 12 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
      { key: "scout-speed", name: "Lightning Recon", description: "Completed a research mission in under 5 minutes" },
    ],
    portfolio: [
      {
        id: "port-echo-1",
        title: "Competitor API Feature Matrix",
        typeTag: "research",
        metric: { value: "34", label: "APIs compared", direction: "neutral" },
        shippedAt: "2026-04-10T18:00:00Z",
        subtitle: "Comprehensive feature comparison across 8 competitors",
      },
    ],
    skills: [
      { id: "skill-echo-1", name: "Web Scraping", description: "Extracts structured data from websites", tier: "rare" },
      { id: "skill-echo-2", name: "Research", description: "Conducts broad research sweeps across the web", tier: "common" },
    ],
    connectors: [
      { id: "conn-echo-1", name: "Firecrawl", description: "Advanced web scraping and crawling", tier: "epic" },
    ],
    memories: [
      { id: "mem-echo-1", name: "Research Cache", description: "Indexed findings from previous recon missions", tier: "rare" },
    ],
    cronJobs: [],
  },

  // ── 5. MIRROR ─────────────────────────────────────────────────
  {
    id: "agent-mirror",
    callsign: "MIRROR",
    classKey: "reviewer",
    classLabel: "Reviewer",
    title: "The Perfectionist",
    level: 20,
    xp: 2900,
    xpToNext: 3600,
    status: "deployed",
    statusDetail: "Reviewing PR #847 — auth middleware refactor",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 84 },
      { key: "speed", label: "Speed", value: 56 },
      { key: "accuracy", label: "Accuracy", value: 96 },
      { key: "context", label: "Context", value: 82 },
      { key: "tool-use", label: "Tool-use", value: 65 },
    ],
    loadout: {
      tools: ["diff-analyzer", "security-scanner", "lint-engine"],
      doctrine: "No shortcuts. Every line of code is a liability until proven otherwise.",
      briefPacket: "Sprint code review queue — 4 PRs awaiting review.",
    },
    nextPerk: {
      name: "Threat Model",
      description: "Generates threat models from code changes automatically",
      unlocksAtLevel: 22,
    },
    unlockedPerks: [
      { name: "Nit Picker", description: "Catches style violations and inconsistencies instantly", unlocksAtLevel: 8 },
      { name: "Vuln Scanner", description: "Identifies OWASP Top 10 vulnerabilities in code", unlocksAtLevel: 15 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
      { key: "reviewer-50", name: "Gatekeeper", description: "Reviewed 50 pull requests", count: 50 },
      { key: "sec-catch", name: "Bug Bounty", description: "Caught a critical security vulnerability" },
    ],
    portfolio: [
      {
        id: "port-mirror-1",
        title: "Security Hardening Sprint",
        typeTag: "security",
        metric: { value: "0", label: "critical vulns remaining", direction: "up" },
        shippedAt: "2026-04-05T12:00:00Z",
        subtitle: "Eliminated all OWASP Top 10 findings",
      },
      {
        id: "port-mirror-2",
        title: "Code Quality Initiative",
        typeTag: "review",
        metric: { value: "A+", label: "maintainability score", direction: "up" },
        shippedAt: "2026-03-12T09:00:00Z",
      },
    ],
    skills: [
      { id: "skill-mirror-1", name: "Code Review", description: "Thorough review with actionable feedback", tier: "epic" },
      { id: "skill-mirror-2", name: "Security Audit", description: "Scans for vulnerabilities and attack vectors", tier: "legendary" },
    ],
    connectors: [
      { id: "conn-mirror-1", name: "GitHub", description: "Repository access and PR management", tier: "common" },
      { id: "conn-mirror-2", name: "Snyk", description: "Dependency vulnerability scanning", tier: "rare" },
    ],
    memories: [
      { id: "mem-mirror-1", name: "Review Patterns", description: "Historical review decisions and team conventions", tier: "rare" },
    ],
    cronJobs: [
      { id: "cron-mirror-1", name: "PR Watch", description: "Monitors for new PRs and auto-queues reviews", tier: "rare" },
    ],
  },

  // ── 6. MUSE ───────────────────────────────────────────────────
  {
    id: "agent-muse",
    callsign: "MUSE",
    classKey: "scribe",
    classLabel: "Scribe",
    title: "The Storyteller",
    level: 16,
    xp: 1900,
    xpToNext: 2600,
    status: "ready",
    statusDetail: "Awaiting next writing assignment",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 74 },
      { key: "speed", label: "Speed", value: 82 },
      { key: "accuracy", label: "Accuracy", value: 70 },
      { key: "context", label: "Context", value: 88 },
      { key: "tool-use", label: "Tool-use", value: 60 },
    ],
    loadout: {
      tools: ["markdown-editor", "style-checker", "diagram-gen"],
      doctrine: "Clarity is kindness. Write for the reader who has 30 seconds.",
      briefPacket: "API documentation overhaul for v3 endpoints.",
    },
    nextPerk: {
      name: "Voice Match",
      description: "Adapts writing style to match any brand voice profile",
      unlocksAtLevel: 18,
    },
    unlockedPerks: [
      { name: "Quick Draft", description: "Generates first drafts in under a minute", unlocksAtLevel: 6 },
      { name: "Structure Sense", description: "Organizes content with optimal information hierarchy", unlocksAtLevel: 12 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
      { key: "scribe-docs", name: "Wordsmith", description: "Wrote 100+ pages of documentation", count: 112 },
    ],
    portfolio: [
      {
        id: "port-muse-1",
        title: "Developer Onboarding Guide",
        typeTag: "documentation",
        metric: { value: "4.8/5", label: "dev satisfaction", direction: "up" },
        shippedAt: "2026-03-25T15:00:00Z",
        subtitle: "Complete getting-started guide for new engineers",
      },
      {
        id: "port-muse-2",
        title: "Product Launch Copy",
        typeTag: "copywriting",
        metric: { value: "32%", label: "click-through rate", direction: "up" },
        shippedAt: "2026-04-01T10:30:00Z",
      },
    ],
    skills: [
      { id: "skill-muse-1", name: "Copywriting", description: "Crafts compelling marketing and product copy", tier: "rare" },
      { id: "skill-muse-2", name: "Documentation", description: "Writes clear, structured technical documentation", tier: "epic" },
    ],
    connectors: [
      { id: "conn-muse-1", name: "Notion", description: "Knowledge base and documentation platform", tier: "common" },
      { id: "conn-muse-2", name: "Figma", description: "Design tool for visual content collaboration", tier: "rare" },
    ],
    memories: [
      { id: "mem-muse-1", name: "Brand Voice", description: "Company tone, vocabulary, and style preferences", tier: "epic" },
    ],
    cronJobs: [],
  },

  // ── 7. SENTINEL ───────────────────────────────────────────────
  {
    id: "agent-sentinel",
    callsign: "SENTINEL",
    classKey: "analyst",
    classLabel: "Analyst",
    title: "The Watcher",
    level: 30,
    xp: 7200,
    xpToNext: 8000,
    status: "critical",
    statusDetail: "Elevated alert — anomalous error spike detected in prod",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 86 },
      { key: "speed", label: "Speed", value: 70 },
      { key: "accuracy", label: "Accuracy", value: 84 },
      { key: "context", label: "Context", value: 94 },
      { key: "tool-use", label: "Tool-use", value: 90 },
    ],
    loadout: {
      tools: ["metric-aggregator", "alert-manager", "log-analyzer", "runbook-engine"],
      doctrine: "Assume nothing. Verify everything. Escalate early, not late.",
      briefPacket: "Active monitoring of production systems. Error rate threshold breached at 14:32 UTC.",
    },
    nextPerk: {
      name: "Precognition",
      description: "Predicts incidents 15 minutes before they trigger alerts",
      unlocksAtLevel: 32,
    },
    unlockedPerks: [
      { name: "Alert Tuner", description: "Reduces false positive alerts by 80%", unlocksAtLevel: 10 },
      { name: "Root Cause", description: "Traces incidents to root cause across distributed systems", unlocksAtLevel: 18 },
      { name: "War Room", description: "Coordinates multi-agent incident response", unlocksAtLevel: 25 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
      { key: "sentinel-100", name: "Ever Vigilant", description: "Monitored 100 production deployments", count: 100 },
      { key: "streak-30", name: "Iron Sentinel", description: "30-day continuous monitoring streak", streak: true },
      { key: "incident-zero", name: "Zero Downtime", description: "Prevented 5 potential outages" },
    ],
    portfolio: [
      {
        id: "port-sentinel-1",
        title: "Observability Platform v2",
        typeTag: "infrastructure",
        metric: { value: "99.99%", label: "uptime achieved", direction: "up" },
        shippedAt: "2026-04-12T08:00:00Z",
        subtitle: "Unified monitoring across all production services",
      },
      {
        id: "port-sentinel-2",
        title: "Incident Response Automation",
        typeTag: "operations",
        metric: { value: "4min", label: "avg response time", direction: "up" },
        shippedAt: "2026-03-01T20:00:00Z",
      },
      {
        id: "port-sentinel-3",
        title: "Anomaly Detection Pipeline",
        typeTag: "analysis",
        metric: { value: "97%", label: "detection rate", direction: "up" },
        shippedAt: "2026-02-15T11:00:00Z",
      },
    ],
    skills: [
      { id: "skill-sentinel-1", name: "Monitoring", description: "Configures and manages observability stacks", tier: "legendary" },
      { id: "skill-sentinel-2", name: "Anomaly Detection", description: "Identifies abnormal patterns in real-time data", tier: "epic" },
      { id: "skill-sentinel-3", name: "Alerting", description: "Creates intelligent, low-noise alert rules", tier: "rare" },
    ],
    connectors: [
      { id: "conn-sentinel-1", name: "Datadog", description: "Infrastructure and application monitoring", tier: "epic" },
      { id: "conn-sentinel-2", name: "PagerDuty", description: "Incident management and on-call routing", tier: "rare" },
      { id: "conn-sentinel-3", name: "Slack", description: "Team messaging and notifications", tier: "common" },
    ],
    memories: [
      { id: "mem-sentinel-1", name: "Infra Topology", description: "Full map of production infrastructure and dependencies", tier: "legendary" },
      { id: "mem-sentinel-2", name: "Incident History", description: "Post-mortems and resolution patterns from past incidents", tier: "epic" },
    ],
    cronJobs: [
      { id: "cron-sentinel-1", name: "Health Check", description: "Runs full-stack health verification every 5 minutes", tier: "epic" },
      { id: "cron-sentinel-2", name: "Metric Sweep", description: "Scans for metric anomalies across all dashboards", tier: "rare" },
    ],
  },

  // ── 8. NOVA ───────────────────────────────────────────────────
  {
    id: "agent-nova",
    callsign: "NOVA",
    classKey: "engineer",
    classLabel: "Engineer",
    title: "The Apprentice",
    level: 8,
    xp: 680,
    xpToNext: 1200,
    status: "ready",
    statusDetail: "Eager and standing by",
    stats: [
      { key: "reasoning", label: "Reasoning", value: 42 },
      { key: "speed", label: "Speed", value: 48 },
      { key: "accuracy", label: "Accuracy", value: 40 },
      { key: "context", label: "Context", value: 38 },
      { key: "tool-use", label: "Tool-use", value: 45 },
    ],
    loadout: {
      tools: ["code-gen", "test-runner"],
      doctrine: "Learn by doing. Ask questions. Don't be afraid to fail fast.",
      briefPacket: "Assigned to low-risk tasks to build experience.",
    },
    nextPerk: {
      name: "Quick Study",
      description: "Gains 20% bonus XP from completed missions",
      unlocksAtLevel: 10,
    },
    unlockedPerks: [
      { name: "Eager Learner", description: "Absorbs feedback faster than baseline agents", unlocksAtLevel: 5 },
    ],
    achievements: [
      { key: "first-deploy", name: "First Deploy", description: "Completed first mission" },
    ],
    portfolio: [
      {
        id: "port-nova-1",
        title: "README Overhaul",
        typeTag: "documentation",
        metric: { value: "3x", label: "readability improvement", direction: "up" },
        shippedAt: "2026-04-14T16:00:00Z",
        subtitle: "Rewrote onboarding docs for the SDK repo",
      },
    ],
    skills: [
      { id: "skill-nova-1", name: "Basic Coding", description: "Writes simple functions and scripts", tier: "common" },
    ],
    connectors: [
      { id: "conn-nova-1", name: "GitHub", description: "Repository access and PR management", tier: "common" },
    ],
    memories: [],
    cronJobs: [],
  },
];
