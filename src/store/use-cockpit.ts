import { create } from "zustand";
import {
  Agent,
  ActiveOp,
  Mission,
  LogEvent,
  ResourceMeter,
  DomainKey,
  SubsystemKey,
} from "@/types";
import {
  mockAgents,
  mockMissions,
  mockActiveOps,
  mockLog,
  mockResources,
} from "@/data";
import { getSpecTree, type SpecTree } from "@/data/mock-spec-trees";

interface CockpitStore {
  // Data
  agents: Agent[];
  missions: Mission[];
  activeOps: ActiveOp[];
  log: LogEvent[];
  resources: ResourceMeter[];
  domain: DomainKey;
  specTrees: Record<string, SpecTree>;

  // Selection
  selectedAgentId: string | null;
  selectedMissionId: string | null;
  activeSubsystem: SubsystemKey | null;

  // Actions
  selectAgent: (id: string | null) => void;
  selectMission: (id: string | null) => void;
  selectSubsystem: (key: SubsystemKey | null) => void;
  setDomain: (domain: DomainKey) => void;
  addLogEvent: (event: Omit<LogEvent, "id" | "at">) => void;
  deployMission: (missionId: string, agentIds: string[]) => void;
  unlockSkillNode: (agentId: string, nodeId: string) => void;
}

const initialSpecTrees: Record<string, SpecTree> = Object.fromEntries(
  mockAgents.map((a) => [a.id, getSpecTree(a.id, a.classKey)])
);

export const useCockpitStore = create<CockpitStore>((set) => ({
  // Data
  agents: mockAgents,
  missions: mockMissions,
  activeOps: mockActiveOps,
  log: mockLog,
  resources: mockResources,
  domain: "ops",
  specTrees: initialSpecTrees,

  // Selection
  selectedAgentId: null,
  selectedMissionId: null,
  activeSubsystem: null,

  // Actions
  selectAgent: (id) => set({ selectedAgentId: id, activeSubsystem: null }),
  selectMission: (id) => set({ selectedMissionId: id }),
  selectSubsystem: (key) => set({ activeSubsystem: key }),
  setDomain: (domain) => set({ domain }),
  addLogEvent: (event) =>
    set((state) => ({
      log: [
        { ...event, id: crypto.randomUUID(), at: new Date().toISOString() },
        ...state.log,
      ],
    })),
  deployMission: (missionId, agentIds) =>
    set((state) => {
      const mission = state.missions.find((m) => m.id === missionId);
      if (!mission || agentIds.length === 0) return state;

      const assignedSet = new Set(agentIds);
      const leadAgent = state.agents.find((a) => a.id === agentIds[0]);

      const newOp: ActiveOp = {
        id: crypto.randomUUID(),
        missionId,
        title: mission.title,
        assignedAgentIds: agentIds,
        state: "in-progress",
        progress: 0,
        stateDetail: "Deployed",
        elapsedMinutes: 0,
        etaMinutes: mission.estimatedMinutes,
        creditsSpent: 0,
      };

      const newLogEvent: LogEvent = {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        agentCallsign: leadAgent?.callsign ?? "Squad",
        message: `Deployed on ${mission.title}`,
        kind: "deploy",
      };

      return {
        missions: state.missions.filter((m) => m.id !== missionId),
        activeOps: [newOp, ...state.activeOps],
        agents: state.agents.map((a) =>
          assignedSet.has(a.id) ? { ...a, status: "deployed" as const } : a
        ),
        log: [newLogEvent, ...state.log],
      };
    }),
  unlockSkillNode: (agentId, nodeId) =>
    set((state) => {
      const tree = state.specTrees[agentId];
      if (!tree) return state;

      const node = tree.nodes.find((n) => n.id === nodeId);
      if (!node || node.state !== "available" || node.cost > tree.availablePoints) {
        return state;
      }

      const intermediateNodes = tree.nodes.map((n) =>
        n.id === nodeId ? { ...n, state: "unlocked" as const } : n
      );

      const unlockedIds = new Set(
        intermediateNodes.filter((n) => n.state === "unlocked").map((n) => n.id)
      );

      const finalNodes = intermediateNodes.map((n) => {
        if (n.state !== "locked") return n;
        const allPrereqsMet = n.prerequisites.every((p) => unlockedIds.has(p));
        return allPrereqsMet ? { ...n, state: "available" as const } : n;
      });

      const updatedTree: SpecTree = {
        ...tree,
        availablePoints: tree.availablePoints - node.cost,
        nodes: finalNodes,
      };

      const agent = state.agents.find((a) => a.id === agentId);
      const newLogEvent: LogEvent = {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        agentCallsign: agent?.callsign ?? "Agent",
        message: `Unlocked ${node.name}`,
        kind: "level-up",
      };

      return {
        specTrees: { ...state.specTrees, [agentId]: updatedTree },
        log: [newLogEvent, ...state.log],
      };
    }),
}));
