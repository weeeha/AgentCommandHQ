import type { Agent, AgentSubsystem, SlotItem, AgentReputation } from "@/types";
import { SUBSYSTEM_DEFS, mockReputations } from "@/data/mock-cyberware";

/**
 * Derive cyberware subsystem slots from an Agent's existing data.
 * Maps agent fields to the 8 subsystem categories.
 */
export function buildSubsystems(agent: Agent): AgentSubsystem[] {
  const reputation = agent.reputation ?? mockReputations[agent.id];

  return SUBSYSTEM_DEFS.map((def) => {
    let items: SlotItem[];

    switch (def.key) {
      case "cortex":
        items = [
          {
            id: `${agent.id}-cortex`,
            name: `${agent.classLabel} Core`,
            description: `Level ${agent.level} ${agent.classKey} reasoning engine`,
            tier: agent.level >= 25 ? "legendary" : agent.level >= 15 ? "epic" : agent.level >= 8 ? "rare" : "common",
          },
        ];
        break;

      case "neural-mesh":
        items = agent.memories;
        break;

      case "optics":
        items = agent.connectors;
        break;

      case "vocoder":
        items = [
          {
            id: `${agent.id}-vocoder`,
            name: agent.title ?? "Default Protocol",
            description: agent.loadout.doctrine,
            tier: agent.unlockedPerks.length >= 3 ? "epic" : agent.unlockedPerks.length >= 1 ? "rare" : "common",
          },
        ];
        break;

      case "manipulators":
        items = agent.loadout.tools.map((tool, i) => ({
          id: `${agent.id}-tool-${i}`,
          name: tool,
          description: `Equipped tool module`,
          tier: "common" as const,
        }));
        break;

      case "skill-matrix":
        items = agent.skills;
        break;

      case "reflex-arc":
        items = agent.cronJobs;
        break;

      case "firewall":
        if (reputation) {
          items = [
            {
              id: `${agent.id}-firewall`,
              name: `${capitalize(reputation.trustLevel)} clearance`,
              description: `${reputation.totalMissions} missions · ${reputation.missionSuccessRate}% success`,
              tier: trustToTier(reputation.trustLevel),
            },
          ];
        } else {
          items = [];
        }
        break;

      default:
        items = [];
    }

    return { key: def.key, items, capacity: def.maxSlots };
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function trustToTier(level: string): SlotItem["tier"] {
  switch (level) {
    case "autonomous": return "legendary";
    case "trusted": return "epic";
    case "standard": return "rare";
    default: return "common";
  }
}
