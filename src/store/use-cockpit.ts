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

interface CockpitStore {
  // Data
  agents: Agent[];
  missions: Mission[];
  activeOps: ActiveOp[];
  log: LogEvent[];
  resources: ResourceMeter[];
  domain: DomainKey;

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
}

export const useCockpitStore = create<CockpitStore>((set) => ({
  // Data
  agents: mockAgents,
  missions: mockMissions,
  activeOps: mockActiveOps,
  log: mockLog,
  resources: mockResources,
  domain: "ops",

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
}));
