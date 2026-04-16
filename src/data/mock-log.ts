import { LogEvent } from "@/types";

/**
 * Helper: returns an ISO string for `minutesAgo` minutes before now.
 * Keeps log timestamps realistic relative to viewing time.
 */
function ago(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

export const mockLog: LogEvent[] = [
  {
    id: "log-001",
    at: ago(3),
    agentCallsign: "SENTINEL",
    message: "Error rate spike detected on /api/checkout — investigating",
    kind: "flag",
  },
  {
    id: "log-002",
    at: ago(12),
    agentCallsign: "CIPHER",
    message: "API docs overhaul at 95% — entering final formatting pass",
    kind: "complete",
  },
  {
    id: "log-003",
    at: ago(28),
    agentCallsign: "MIRROR",
    message: "Flagged 3 changes in payment handler for human review",
    kind: "flag",
  },
  {
    id: "log-004",
    at: ago(45),
    agentCallsign: "FORGE",
    message: "CI pipeline restored — flaky test in auth module quarantined",
    kind: "complete",
  },
  {
    id: "log-005",
    at: ago(62),
    agentCallsign: "CIPHER",
    message: "Auth migration step 7 started — token format conversion",
    kind: "deploy",
  },
  {
    id: "log-006",
    at: ago(90),
    agentCallsign: "ECHO",
    message: "Research sprint complete — entering cooldown",
    kind: "rest",
  },
  {
    id: "log-007",
    at: ago(115),
    agentCallsign: "ATLAS",
    message: "Architecture review for event-bus proposal completed",
    kind: "complete",
  },
  {
    id: "log-008",
    at: ago(140),
    agentCallsign: "NOVA",
    message: "Leveled up to 8 — unlocked Eager Learner perk",
    kind: "level-up",
  },
  {
    id: "log-009",
    at: ago(185),
    agentCallsign: "SENTINEL",
    message: "Deployed new alert rules for p99 latency monitoring",
    kind: "deploy",
  },
  {
    id: "log-010",
    at: ago(220),
    agentCallsign: "MUSE",
    message: "Developer onboarding guide v2 shipped to Notion",
    kind: "complete",
  },
  {
    id: "log-011",
    at: ago(310),
    agentCallsign: "MIRROR",
    message: "Completed security audit on user session handling",
    kind: "complete",
  },
  {
    id: "log-012",
    at: ago(380),
    agentCallsign: "FORGE",
    message: "Deployed hotfix for rate limiter bypass — patch v2.4.1",
    kind: "deploy",
  },
  {
    id: "log-013",
    at: ago(450),
    agentCallsign: "SENTINEL",
    message: "Human override requested — auto-scaling threshold adjustment",
    kind: "intervene",
  },
  {
    id: "log-014",
    at: ago(520),
    agentCallsign: "CIPHER",
    message: "Daily analytics report generated and posted to #data-team",
    kind: "complete",
  },
  {
    id: "log-015",
    at: ago(640),
    agentCallsign: "ECHO",
    message: "Competitor API scan complete — 34 endpoints catalogued",
    kind: "complete",
  },
  {
    id: "log-016",
    at: ago(780),
    agentCallsign: "FORGE",
    message: "Leveled up to 25 — unlocked Pipeline Forge perk",
    kind: "level-up",
  },
  {
    id: "log-017",
    at: ago(900),
    agentCallsign: "ATLAS",
    message: "Deployed microservices migration plan to Linear",
    kind: "deploy",
  },
  {
    id: "log-018",
    at: ago(1020),
    agentCallsign: "MIRROR",
    message: "Human intervention — overrode auto-merge on PR #831",
    kind: "intervene",
  },
  {
    id: "log-019",
    at: ago(1200),
    agentCallsign: "SENTINEL",
    message: "Completed overnight health check — all systems nominal",
    kind: "complete",
  },
  {
    id: "log-020",
    at: ago(1380),
    agentCallsign: "NOVA",
    message: "README overhaul deployed to main branch",
    kind: "deploy",
  },
];
