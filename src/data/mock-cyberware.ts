import type { SubsystemDef, AgentReputation } from "@/types";

// ─────────────────────────────────────────────────────────────
// Subsystem definitions (the 8 "body regions")
// ─────────────────────────────────────────────────────────────

export const SUBSYSTEM_DEFS: SubsystemDef[] = [
  {
    key: "cortex",
    label: "Cortex",
    description: "Model engine and reasoning core — the fundamental intelligence layer",
    bodyRegion: "head",
    maxSlots: 1,
  },
  {
    key: "neural-mesh",
    label: "Neural Mesh",
    description: "Persistent memory banks and knowledge context",
    bodyRegion: "brain",
    maxSlots: 3,
  },
  {
    key: "optics",
    label: "Optics",
    description: "Input connectors and external data feeds",
    bodyRegion: "eyes",
    maxSlots: 4,
  },
  {
    key: "vocoder",
    label: "Vocoder",
    description: "Personality matrix and communication protocol",
    bodyRegion: "throat",
    maxSlots: 1,
  },
  {
    key: "manipulators",
    label: "Manipulators",
    description: "Action tools for reading, writing, and executing",
    bodyRegion: "arms",
    maxSlots: 6,
  },
  {
    key: "skill-matrix",
    label: "Skill Matrix",
    description: "Specialized capability modules",
    bodyRegion: "torso",
    maxSlots: 3,
  },
  {
    key: "reflex-arc",
    label: "Reflex Arc",
    description: "Automated triggers, cron jobs, and hooks",
    bodyRegion: "spine",
    maxSlots: 3,
  },
  {
    key: "firewall",
    label: "Firewall",
    description: "Trust boundaries and safety protocols",
    bodyRegion: "shell",
    maxSlots: 1,
  },
];

// ─────────────────────────────────────────────────────────────
// Mock reputation data keyed by agent ID
// ─────────────────────────────────────────────────────────────

export const mockReputations: Record<string, AgentReputation> = {
  "agent-atlas": {
    trustLevel: "trusted",
    missionSuccessRate: 94,
    qualityScore: 88,
    escalationRate: 12,
    totalMissions: 47,
  },
  "agent-cipher": {
    trustLevel: "standard",
    missionSuccessRate: 87,
    qualityScore: 91,
    escalationRate: 18,
    totalMissions: 32,
  },
  "agent-forge": {
    trustLevel: "autonomous",
    missionSuccessRate: 96,
    qualityScore: 82,
    escalationRate: 8,
    totalMissions: 78,
  },
  "agent-echo": {
    trustLevel: "standard",
    missionSuccessRate: 79,
    qualityScore: 68,
    escalationRate: 24,
    totalMissions: 19,
  },
  "agent-mirror": {
    trustLevel: "trusted",
    missionSuccessRate: 92,
    qualityScore: 96,
    escalationRate: 6,
    totalMissions: 55,
  },
  "agent-muse": {
    trustLevel: "standard",
    missionSuccessRate: 85,
    qualityScore: 78,
    escalationRate: 20,
    totalMissions: 28,
  },
  "agent-sentinel": {
    trustLevel: "autonomous",
    missionSuccessRate: 98,
    qualityScore: 90,
    escalationRate: 4,
    totalMissions: 112,
  },
  "agent-nova": {
    trustLevel: "probationary",
    missionSuccessRate: 72,
    qualityScore: 58,
    escalationRate: 35,
    totalMissions: 6,
  },
};
