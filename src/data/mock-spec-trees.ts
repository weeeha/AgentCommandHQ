// Specialization trees for each agent class.
// Keyed by agent id. Each node has position coordinates (0..1) used by the
// skill-tree SVG renderer to lay out the graph without a physics solver.

import type { AgentClassKey } from "@/types";

export type SkillCategory =
  | "analysis"
  | "engineering"
  | "security"
  | "leadership"
  | "memory";

export type SkillNodeState = "unlocked" | "available" | "locked";

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  tier: number; // 1 (inner) → 5 (outer rim)
  cost: number; // skill points
  state: SkillNodeState;
  prerequisites: string[]; // ids of prereq nodes
  /** Position in normalized 0..1 coords, mapped to SVG viewport */
  x: number;
  y: number;
  /** Optional lucide icon name */
  icon?: string;
}

export interface SpecTree {
  agentId: string;
  classKey: AgentClassKey;
  availablePoints: number;
  nodes: SkillNode[];
  categoryCounts: Record<SkillCategory, number>;
}

// ─────────────────────────────────────────────────────────────
// ATLAS — Architect tree: system design radiating out
// ─────────────────────────────────────────────────────────────

const atlasTree: SpecTree = {
  agentId: "agent-atlas",
  classKey: "architect",
  availablePoints: 14,
  categoryCounts: {
    analysis: 3,
    engineering: 1,
    security: 1,
    leadership: 1,
    memory: 1,
  },
  nodes: [
    // Tier 1 — center
    { id: "atlas-start", name: "START", description: "Root node — always unlocked.", category: "engineering", tier: 1, cost: 0, state: "unlocked", prerequisites: [], x: 0.5, y: 0.5, icon: "Circle" },

    // Tier 2 — immediate ring
    { id: "atlas-code-audit", name: "Code Audit", description: "Analyze a codebase for structural issues and debt.", category: "analysis", tier: 2, cost: 1, state: "unlocked", prerequisites: ["atlas-start"], x: 0.38, y: 0.3, icon: "FileSearch" },
    { id: "atlas-system-design", name: "System Design", description: "Draft distributed system architectures with clear boundaries.", category: "engineering", tier: 2, cost: 2, state: "unlocked", prerequisites: ["atlas-start"], x: 0.5, y: 0.28, icon: "Network" },
    { id: "atlas-refactor", name: "Refactor", description: "Restructure code while preserving behavior.", category: "engineering", tier: 2, cost: 1, state: "unlocked", prerequisites: ["atlas-start"], x: 0.62, y: 0.3, icon: "GitBranch" },
    { id: "atlas-security-review", name: "Security Review", description: "Identify vulnerabilities in code and config.", category: "security", tier: 2, cost: 2, state: "available", prerequisites: ["atlas-start"], x: 0.72, y: 0.44, icon: "ShieldCheck" },
    { id: "atlas-lead-prompt", name: "Lead Prompt", description: "Direct a team of agents with structured briefs.", category: "leadership", tier: 2, cost: 2, state: "unlocked", prerequisites: ["atlas-start"], x: 0.38, y: 0.72, icon: "Users" },
    { id: "atlas-context-window", name: "Context Window", description: "Expand working context for larger codebases.", category: "memory", tier: 2, cost: 1, state: "available", prerequisites: ["atlas-start"], x: 0.62, y: 0.72, icon: "Layers" },

    // Tier 3 — outer ring, behind prereqs
    { id: "atlas-deep-audit", name: "Deep Audit", description: "Cross-service dependency analysis in one pass.", category: "analysis", tier: 3, cost: 2, state: "available", prerequisites: ["atlas-code-audit"], x: 0.22, y: 0.22, icon: "ScanLine" },
    { id: "atlas-blueprint", name: "Blueprint", description: "Auto-generate architecture diagrams from code.", category: "engineering", tier: 3, cost: 2, state: "available", prerequisites: ["atlas-system-design"], x: 0.5, y: 0.15, icon: "LayoutDashboard" },
    { id: "atlas-pattern-library", name: "Pattern Library", description: "Suggest design patterns automatically.", category: "engineering", tier: 3, cost: 2, state: "locked", prerequisites: ["atlas-refactor", "atlas-system-design"], x: 0.72, y: 0.22, icon: "Puzzle" },
    { id: "atlas-threat-model", name: "Threat Model", description: "Derive threat models from code changes.", category: "security", tier: 3, cost: 3, state: "locked", prerequisites: ["atlas-security-review"], x: 0.85, y: 0.55, icon: "ShieldAlert" },
    { id: "atlas-war-room", name: "War Room", description: "Coordinate multi-agent incident response.", category: "leadership", tier: 3, cost: 3, state: "locked", prerequisites: ["atlas-lead-prompt"], x: 0.22, y: 0.78, icon: "Radio" },
    { id: "atlas-parallel-exec", name: "Parallel Execution", description: "Run multiple analyses concurrently.", category: "engineering", tier: 3, cost: 2, state: "locked", prerequisites: ["atlas-context-window"], x: 0.72, y: 0.82, icon: "GitMerge" },

    // Tier 4 — capstones
    { id: "atlas-holistic", name: "Holistic Vision", description: "Understand an entire system as a single coherent model.", category: "analysis", tier: 4, cost: 4, state: "locked", prerequisites: ["atlas-deep-audit", "atlas-blueprint"], x: 0.5, y: 0.02, icon: "Infinity" },
    { id: "atlas-zero-trust", name: "Zero Trust", description: "Design architectures that assume breach.", category: "security", tier: 4, cost: 4, state: "locked", prerequisites: ["atlas-threat-model"], x: 0.95, y: 0.75, icon: "Lock" },
  ],
};

// ─────────────────────────────────────────────────────────────
// Generic fallback — used for agents without a custom tree
// ─────────────────────────────────────────────────────────────

function makeGenericTree(agentId: string, classKey: AgentClassKey): SpecTree {
  return {
    agentId,
    classKey,
    availablePoints: 6,
    categoryCounts: {
      analysis: 1,
      engineering: 1,
      security: 0,
      leadership: 1,
      memory: 1,
    },
    nodes: [
      { id: `${agentId}-start`, name: "START", description: "Root node.", category: "engineering", tier: 1, cost: 0, state: "unlocked", prerequisites: [], x: 0.5, y: 0.5, icon: "Circle" },
      { id: `${agentId}-basics`, name: "Basics", description: "Fundamental class skill.", category: "engineering", tier: 2, cost: 1, state: "unlocked", prerequisites: [`${agentId}-start`], x: 0.35, y: 0.35, icon: "Wrench" },
      { id: `${agentId}-focus`, name: "Focus", description: "Narrower expertise path.", category: "analysis", tier: 2, cost: 1, state: "unlocked", prerequisites: [`${agentId}-start`], x: 0.65, y: 0.35, icon: "Target" },
      { id: `${agentId}-speed`, name: "Speed", description: "Operate faster on class tasks.", category: "engineering", tier: 2, cost: 2, state: "available", prerequisites: [`${agentId}-start`], x: 0.5, y: 0.22, icon: "Zap" },
      { id: `${agentId}-memory`, name: "Long Memory", description: "Retain context across sessions.", category: "memory", tier: 2, cost: 2, state: "available", prerequisites: [`${agentId}-start`], x: 0.35, y: 0.65, icon: "Database" },
      { id: `${agentId}-collab`, name: "Collaboration", description: "Work with other agents in parallel.", category: "leadership", tier: 2, cost: 2, state: "available", prerequisites: [`${agentId}-start`], x: 0.65, y: 0.65, icon: "Users" },
      { id: `${agentId}-capstone`, name: "Capstone", description: "Class-defining late-game ability.", category: "engineering", tier: 3, cost: 3, state: "locked", prerequisites: [`${agentId}-basics`, `${agentId}-focus`], x: 0.5, y: 0.82, icon: "Crown" },
    ],
  };
}

export function getSpecTree(agentId: string, classKey: AgentClassKey): SpecTree {
  if (agentId === "agent-atlas") return atlasTree;
  return makeGenericTree(agentId, classKey);
}

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  analysis: "Analysis",
  engineering: "Engineering",
  security: "Security",
  leadership: "Leadership",
  memory: "Memory",
};
