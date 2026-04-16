// Extended mission briefing data — companion to mock-missions.ts.
// Keyed by mission id. Contains narrative fields not needed in cockpit list view.

export interface MissionObjective {
  id: string;
  label: string;
  optional?: boolean;
  status?: "ready" | "locked";
}

export interface MissionConnector {
  id: string;
  label: string;
  icon?: string; // lucide icon name
}

export interface MissionReward {
  kind: "xp" | "credits" | "skill" | "memory" | "connector";
  label: string;
}

export interface MissionTag {
  label: string;
  tone?: "default" | "danger" | "info";
}

export interface MissionDetail {
  id: string;
  description: string;
  tags: MissionTag[];
  objectives: MissionObjective[];
  requiredConnectors: MissionConnector[];
  rewards: MissionReward[];
  recommendedAgentId?: string;
  matchScore?: number;
  additionalSlots?: number;
}

export const mockMissionDetails: Record<string, MissionDetail> = {
  "mission-auth-migration": {
    id: "mission-auth-migration",
    description:
      "Migrate the production auth service from legacy session tokens to OAuth2 with JWT. Requires coordinated token rotation across 12 downstream services with zero session invalidation. Agent will propose a migration plan, execute staged rollout, and verify token integrity at each step.",
    tags: [
      { label: "Security", tone: "danger" },
      { label: "High-Impact", tone: "info" },
    ],
    objectives: [
      { id: "o1", label: "Inventory all session token consumers", status: "ready" },
      { id: "o2", label: "Design JWT claim schema with refresh rotation", status: "ready" },
      { id: "o3", label: "Stage rollout plan across 12 services", status: "ready" },
      { id: "o4", label: "Execute migration with zero session drops", status: "locked" },
      { id: "o5", label: "Document rollback procedure", optional: true, status: "locked" },
    ],
    requiredConnectors: [
      { id: "github", label: "GitHub", icon: "Github" },
      { id: "vault", label: "Vault", icon: "Lock" },
    ],
    rewards: [
      { kind: "xp", label: "+800 XP" },
      { kind: "credits", label: "1,200 cr" },
      { kind: "skill", label: "Skill: Crypto Audit" },
    ],
    recommendedAgentId: "agent-cipher",
    matchScore: 94,
    additionalSlots: 3,
  },
  "mission-api-docs": {
    id: "mission-api-docs",
    description:
      "Document all public v3 API endpoints with examples, error cases, and SDK code snippets. Must match the existing brand voice guide and render cleanly in the docs portal. Include a migration note for deprecated v2 endpoints.",
    tags: [
      { label: "Documentation", tone: "default" },
      { label: "Low-Risk", tone: "default" },
    ],
    objectives: [
      { id: "o1", label: "Inventory all v3 endpoints and request/response shapes", status: "ready" },
      { id: "o2", label: "Draft per-endpoint reference pages", status: "ready" },
      { id: "o3", label: "Add curl + TypeScript + Python examples", status: "ready" },
      { id: "o4", label: "Cross-link deprecation notices from v2 pages", optional: true, status: "locked" },
    ],
    requiredConnectors: [
      { id: "notion", label: "Notion", icon: "FileText" },
      { id: "github", label: "GitHub", icon: "Github" },
    ],
    rewards: [
      { kind: "xp", label: "+300 XP" },
      { kind: "credits", label: "400 cr" },
      { kind: "skill", label: "Skill: Doc Style Match" },
    ],
    recommendedAgentId: "agent-muse",
    matchScore: 88,
    additionalSlots: 1,
  },
  "mission-payment-refactor": {
    id: "mission-payment-refactor",
    description:
      "Refactor the payment processing module to extract the Stripe integration into a pluggable adapter. Must preserve webhook-handling semantics and pass the existing 420-test integration suite. Expect coordination with the reviewer on cross-cutting changes.",
    tags: [
      { label: "Engineering", tone: "default" },
      { label: "Refactor", tone: "info" },
    ],
    objectives: [
      { id: "o1", label: "Map current payment module boundaries", status: "ready" },
      { id: "o2", label: "Design adapter interface for payment providers", status: "ready" },
      { id: "o3", label: "Port Stripe logic behind adapter", status: "ready" },
      { id: "o4", label: "Pass full integration test suite", status: "locked" },
      { id: "o5", label: "Add second adapter (test only) to validate shape", optional: true, status: "locked" },
    ],
    requiredConnectors: [
      { id: "github", label: "GitHub", icon: "Github" },
      { id: "stripe", label: "Stripe", icon: "CreditCard" },
    ],
    rewards: [
      { kind: "xp", label: "+550 XP" },
      { kind: "credits", label: "800 cr" },
      { kind: "skill", label: "Skill: Adapter Patterns" },
    ],
    recommendedAgentId: "agent-forge",
    matchScore: 91,
    additionalSlots: 2,
  },
  "mission-security-audit": {
    id: "mission-security-audit",
    description:
      "Conduct a full OWASP Top 10 audit on the user data API surface. Trace PII flow from ingress to storage to egress. Deliver a prioritized vulnerability report with proof-of-concept exploits for any critical findings.",
    tags: [
      { label: "Security", tone: "danger" },
      { label: "High-Impact", tone: "info" },
      { label: "Audit", tone: "default" },
    ],
    objectives: [
      { id: "o1", label: "Enumerate all user-data endpoints", status: "ready" },
      { id: "o2", label: "Trace PII flow end-to-end", status: "ready" },
      { id: "o3", label: "Execute OWASP Top 10 test battery", status: "ready" },
      { id: "o4", label: "Write PoC for any critical findings", status: "locked" },
      { id: "o5", label: "Deliver prioritized remediation report", status: "locked" },
    ],
    requiredConnectors: [
      { id: "github", label: "GitHub", icon: "Github" },
      { id: "snyk", label: "Snyk", icon: "Shield" },
      { id: "datadog", label: "Datadog", icon: "Activity" },
    ],
    rewards: [
      { kind: "xp", label: "+1,200 XP" },
      { kind: "credits", label: "2,000 cr" },
      { kind: "skill", label: "Skill: Threat Model" },
      { kind: "memory", label: "Memory: Audit History" },
    ],
    recommendedAgentId: "agent-mirror",
    matchScore: 97,
    additionalSlots: 2,
  },
  "mission-onboarding-flow": {
    id: "mission-onboarding-flow",
    description:
      "Design and build a new user onboarding flow with three progressive disclosure steps and a skip-to-dashboard option. Must integrate with the existing auth context and emit analytics events at each step.",
    tags: [
      { label: "Product", tone: "default" },
      { label: "Front-End", tone: "default" },
    ],
    objectives: [
      { id: "o1", label: "Draft 3-step onboarding copy with brand voice", status: "ready" },
      { id: "o2", label: "Implement progressive disclosure UI components", status: "ready" },
      { id: "o3", label: "Wire analytics events for funnel tracking", status: "ready" },
      { id: "o4", label: "A/B test skip vs forced flow", optional: true, status: "locked" },
    ],
    requiredConnectors: [
      { id: "github", label: "GitHub", icon: "Github" },
      { id: "figma", label: "Figma", icon: "Palette" },
    ],
    rewards: [
      { kind: "xp", label: "+350 XP" },
      { kind: "credits", label: "500 cr" },
      { kind: "skill", label: "Skill: Flow Design" },
    ],
    recommendedAgentId: "agent-forge",
    matchScore: 82,
    additionalSlots: 2,
  },
  "mission-db-optimization": {
    id: "mission-db-optimization",
    description:
      "Profile the top-50 slowest database queries from last week's traffic and optimize via index addition, query rewrites, or read-replica routing. Target a 5× speedup on p99 without increasing write latency.",
    tags: [
      { label: "Performance", tone: "info" },
      { label: "Engineering", tone: "default" },
    ],
    objectives: [
      { id: "o1", label: "Pull top-50 slow queries from observability", status: "ready" },
      { id: "o2", label: "Classify by fix type (index / rewrite / replica)", status: "ready" },
      { id: "o3", label: "Implement fixes and benchmark", status: "ready" },
      { id: "o4", label: "Verify write-path latency unchanged", status: "locked" },
    ],
    requiredConnectors: [
      { id: "github", label: "GitHub", icon: "Github" },
      { id: "datadog", label: "Datadog", icon: "Activity" },
    ],
    rewards: [
      { kind: "xp", label: "+500 XP" },
      { kind: "credits", label: "700 cr" },
    ],
    recommendedAgentId: "agent-cipher",
    matchScore: 85,
    additionalSlots: 1,
  },
  "mission-staging-deploy": {
    id: "mission-staging-deploy",
    description:
      "Spin up a new staging environment mirroring production topology. Must include seeded data, feature flags in preview mode, and access for the full engineering team.",
    tags: [{ label: "DevOps", tone: "default" }],
    objectives: [
      { id: "o1", label: "Provision infra from Terraform modules", status: "ready" },
      { id: "o2", label: "Seed database with sanitized prod snapshot", status: "ready" },
      { id: "o3", label: "Wire team SSO access", status: "ready" },
    ],
    requiredConnectors: [
      { id: "vercel", label: "Vercel", icon: "Cloud" },
      { id: "github", label: "GitHub", icon: "Github" },
    ],
    rewards: [
      { kind: "xp", label: "+150 XP" },
      { kind: "credits", label: "200 cr" },
    ],
    recommendedAgentId: "agent-forge",
    matchScore: 90,
    additionalSlots: 1,
  },
  "mission-rate-limiting": {
    id: "mission-rate-limiting",
    description:
      "Implement per-tenant rate limiting at the API gateway with sliding-window counters. Must support burst allowance and return structured 429 responses with retry-after headers.",
    tags: [
      { label: "Infrastructure", tone: "info" },
      { label: "API", tone: "default" },
    ],
    objectives: [
      { id: "o1", label: "Design per-tenant limit config schema", status: "ready" },
      { id: "o2", label: "Implement sliding-window counter in Redis", status: "ready" },
      { id: "o3", label: "Wire 429 response with Retry-After", status: "ready" },
      { id: "o4", label: "Load-test at 10× current peak", status: "locked" },
    ],
    requiredConnectors: [
      { id: "github", label: "GitHub", icon: "Github" },
      { id: "redis", label: "Redis", icon: "Database" },
    ],
    rewards: [
      { kind: "xp", label: "+480 XP" },
      { kind: "credits", label: "650 cr" },
    ],
    recommendedAgentId: "agent-atlas",
    matchScore: 89,
    additionalSlots: 2,
  },
  "mission-design-system-audit": {
    id: "mission-design-system-audit",
    description:
      "Audit the current component library for token coverage, naming consistency, and accessibility. Produce a prioritized list of fixes and a coverage report by component.",
    tags: [
      { label: "Design", tone: "default" },
      { label: "Audit", tone: "default" },
    ],
    objectives: [
      { id: "o1", label: "Inventory all components + variants", status: "ready" },
      { id: "o2", label: "Check hardcoded values vs design tokens", status: "ready" },
      { id: "o3", label: "Run axe-core pass on all components", status: "ready" },
      { id: "o4", label: "Produce remediation roadmap", status: "locked" },
    ],
    requiredConnectors: [
      { id: "figma", label: "Figma", icon: "Palette" },
      { id: "github", label: "GitHub", icon: "Github" },
    ],
    rewards: [
      { kind: "xp", label: "+320 XP" },
      { kind: "credits", label: "450 cr" },
    ],
    recommendedAgentId: "agent-mirror",
    matchScore: 84,
    additionalSlots: 1,
  },
  "mission-incident-response": {
    id: "mission-incident-response",
    description:
      "Active production incident — elevated 5xx error rate on checkout endpoints. Diagnose root cause, deploy mitigation, and lead the post-incident write-up. Time-critical.",
    tags: [
      { label: "Operations", tone: "danger" },
      { label: "Critical", tone: "danger" },
    ],
    objectives: [
      { id: "o1", label: "Triage alert and confirm scope", status: "ready" },
      { id: "o2", label: "Identify root cause from traces/logs", status: "ready" },
      { id: "o3", label: "Deploy mitigation (rollback or hotfix)", status: "ready" },
      { id: "o4", label: "Write postmortem within 48h", status: "locked" },
    ],
    requiredConnectors: [
      { id: "datadog", label: "Datadog", icon: "Activity" },
      { id: "pagerduty", label: "PagerDuty", icon: "AlertTriangle" },
      { id: "github", label: "GitHub", icon: "Github" },
    ],
    rewards: [
      { kind: "xp", label: "+1,500 XP" },
      { kind: "credits", label: "2,500 cr" },
      { kind: "skill", label: "Skill: Incident Lead" },
    ],
    recommendedAgentId: "agent-sentinel",
    matchScore: 98,
    additionalSlots: 2,
  },
};
