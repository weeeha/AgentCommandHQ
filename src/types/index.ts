// ─────────────────────────────────────────────────────────────
// Agent
// ─────────────────────────────────────────────────────────────

export type AgentStatus = "ready" | "deployed" | "critical" | "cooldown";

export type AgentClassKey =
  | "architect"
  | "analyst"
  | "scribe"
  | "engineer"
  | "scout"
  | "reviewer";

export interface Stat {
  key: string;
  label: string;
  value: number; // 0–100
}

export interface Loadout {
  tools: string[];
  doctrine: string;
  briefPacket: string;
}

export interface Perk {
  name: string;
  description: string;
  unlocksAtLevel: number;
}

export interface Agent {
  id: string;
  callsign: string;
  classKey: AgentClassKey;
  classLabel: string;
  title?: string;
  level: number;
  xp: number;
  xpToNext: number;
  status: AgentStatus;
  statusDetail?: string;
  stats: Stat[];
  loadout: Loadout;
  nextPerk: Perk;
  unlockedPerks: Perk[];
  achievements: Achievement[];
  portfolio: PortfolioItem[];
  skills: SlotItem[];
  connectors: SlotItem[];
  memories: SlotItem[];
  cronJobs: SlotItem[];
  reputation?: AgentReputation;
  specTrees?: SpecTree[];
}

// ─────────────────────────────────────────────────────────────
// Slot system (cyberware-style equipped items)
// ─────────────────────────────────────────────────────────────

export interface SlotItem {
  id: string;
  name: string;
  description: string;
  icon?: string; // lucide icon name
  tier?: "common" | "rare" | "epic" | "legendary";
}

// ─────────────────────────────────────────────────────────────
// Cyberware subsystems
// ─────────────────────────────────────────────────────────────

export type SubsystemKey =
  | "cortex"
  | "neural-mesh"
  | "optics"
  | "vocoder"
  | "manipulators"
  | "skill-matrix"
  | "reflex-arc"
  | "firewall";

export interface SubsystemDef {
  key: SubsystemKey;
  label: string;
  description: string;
  bodyRegion:
    | "head"
    | "brain"
    | "eyes"
    | "throat"
    | "arms"
    | "torso"
    | "spine"
    | "shell";
  maxSlots: number;
}

export interface AgentSubsystem {
  key: SubsystemKey;
  items: SlotItem[];
  capacity: number;
}

// ─────────────────────────────────────────────────────────────
// Reputation & trust
// ─────────────────────────────────────────────────────────────

export type TrustLevel =
  | "probationary"
  | "standard"
  | "trusted"
  | "autonomous";

export interface AgentReputation {
  trustLevel: TrustLevel;
  missionSuccessRate: number; // 0–100
  qualityScore: number; // 0–100
  escalationRate: number; // 0–100 (lower = better)
  totalMissions: number;
}

// ─────────────────────────────────────────────────────────────
// Specialization trees (data hooks — visual tree in v2)
// ─────────────────────────────────────────────────────────────

export interface SpecNode {
  id: string;
  name: string;
  description: string;
  tier: number; // 1–5 depth
  unlocked: boolean;
  requiredLevel: number;
  prerequisites?: string[];
}

export interface SpecTree {
  id: string;
  name: string;
  nodes: SpecNode[];
}

// ─────────────────────────────────────────────────────────────
// Missions & active operations
// ─────────────────────────────────────────────────────────────

export type DifficultyTier = 1 | 2 | 3 | 4 | 5;

export interface Mission {
  id: string;
  title: string;
  tier: DifficultyTier;
  xpReward: number;
  creditCost: number;
  estimatedMinutes: number;
  domainTag?: string;
  recommendedClasses?: AgentClassKey[];
}

export type OpState = "in-progress" | "needs-review" | "finalizing" | "blocked";

export interface ActiveOp {
  id: string;
  missionId: string;
  title: string;
  assignedAgentIds: string[];
  state: OpState;
  progress: number; // 0–100
  stateDetail: string;
  elapsedMinutes: number;
  etaMinutes: number;
  creditsSpent: number;
}

// ─────────────────────────────────────────────────────────────
// Portfolio & achievements
// ─────────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: string;
  title: string;
  typeTag: string;
  metric: {
    value: string;
    label: string;
    direction: "up" | "neutral" | "down";
  };
  shippedAt: string;
  subtitle?: string;
}

export interface Achievement {
  key: string;
  name: string;
  description: string;
  count?: number;
  streak?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Resources & log
// ─────────────────────────────────────────────────────────────

export interface ResourceMeter {
  key: "credits" | "slots" | "tempo" | "weekly-xp";
  label: string;
  value: number;
  max?: number;
  trend?: string;
  fillPercent?: number;
  tone?: "default" | "success" | "info" | "warning";
}

export type LogEventKind =
  | "flag"
  | "complete"
  | "level-up"
  | "rest"
  | "deploy"
  | "intervene";

export interface LogEvent {
  id: string;
  at: string;
  agentCallsign: string;
  message: string;
  kind: LogEventKind;
}

// ─────────────────────────────────────────────────────────────
// Feed (home page activity timeline)
// ─────────────────────────────────────────────────────────────

export type FeedItemKind =
  | "mission-complete"
  | "level-up"
  | "flag"
  | "deploy"
  | "review-request"
  | "achievement"
  | "alert"
  | "system";

export interface FeedItem {
  id: string;
  at: string; // ISO timestamp
  kind: FeedItemKind;
  title: string;
  body: string;
  agentCallsign?: string;
  agentClassKey?: AgentClassKey;
  linkLabel?: string;
  linkHref?: string;
  metric?: { value: string; label: string; tone?: "up" | "down" | "neutral" };
}

// ─────────────────────────────────────────────────────────────
// Tasks (kanban)
// ─────────────────────────────────────────────────────────────

export type TaskStatus =
  | "queued"
  | "in-progress"
  | "needs-review"
  | "done"
  | "blocked";

export type TaskPriority = "p0" | "p1" | "p2" | "p3";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedAgentId?: string;
  tags: string[];
  estimatedMinutes: number;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
  linkedMissionId?: string;
}

// ─────────────────────────────────────────────────────────────
// Chat (multi-thread AI chat)
// ─────────────────────────────────────────────────────────────

export type ChatRole = "user" | "agent" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  at: string;
  /** Which agent answered, if role === "agent" */
  agentId?: string;
}

export interface ChatThread {
  id: string;
  title: string;
  /** Which agent this thread is primarily with */
  agentId: string;
  /** Last-updated timestamp for sort order */
  updatedAt: string;
  messages: ChatMessage[];
  unread?: number;
  pinned?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Domain theme
// ─────────────────────────────────────────────────────────────

export type DossierVariant = "engineering" | "creative";

export type DomainKey = "ops" | "sales" | "clinical" | "legal" | "marketing";

export interface DomainTheme {
  key: DomainKey;
  roomName: string;
  roomSubtitle: string;
  vocabulary: {
    deploy: string;
    intervene: string;
    critical: string;
    mission: string;
  };
  statAxes: Array<{ key: string; label: string }>;
}

// ─────────────────────────────────────────────────────────────
// Cockpit state
// ─────────────────────────────────────────────────────────────

export interface CockpitState {
  agents: Agent[];
  activeOps: ActiveOp[];
  missions: Mission[];
  log: LogEvent[];
  resources: ResourceMeter[];
  selection: {
    agentId: string | null;
    missionId: string | null;
    opId: string | null;
  };
}

// ─────────────────────────────────────────────────────────────
// Ship base / facility management
// ─────────────────────────────────────────────────────────────

export type RoomTypeKey =
  | "bridge"
  | "briefing"
  | "workshop"
  | "armory"
  | "medbay"
  | "training"
  | "engineering"
  | "storage"
  | "quarters"
  | "memory-vault"
  | "financial-center"
  | "commons";

export type RoomCategory = "command" | "operations" | "support" | "personal";

export type GridSize = "1x1" | "2x1" | "1x2" | "2x2";

export interface RoomTypeDef {
  key: RoomTypeKey;
  label: string;
  category: RoomCategory;
  description: string;
  icon: string; // lucide icon name
  color: string; // tailwind color token stem
  maxLevel: number;
  basePowerCost: number;
  baseBuildCost: number;
  allowedSizes: GridSize[];
  unique: boolean;
}

export type CellKind = "hull" | "wall" | "empty";

export interface GridCell {
  row: number;
  col: number;
  kind: CellKind;
  roomId: string | null;
  isAnchor: boolean;
}

export interface ShipLayout {
  rows: number;
  cols: number;
  cells: GridCell[][];
  hullName: string;
}

export type RoomStatus =
  | "operational"
  | "building"
  | "damaged"
  | "upgrading"
  | "offline";

export interface RoomInstance {
  id: string;
  typeKey: RoomTypeKey;
  level: number;
  status: RoomStatus;
  gridSize: GridSize;
  anchor: { row: number; col: number };
  assignedAgentIds: string[];
  powerConsumption: number;
  buildProgress?: number; // 0–100
}

export interface BaseResources {
  power: { current: number; max: number };
  supplies: number;
  credits: number;
}

// ─────────────────────────────────────────────────────────────
// Game engine state (canvas renderer)
// ─────────────────────────────────────────────────────────────

export type AgentAnimState = "idle" | "walking" | "working";
export type AgentFacing = "down" | "up" | "left" | "right";

export interface AgentPosition {
  agentId: string;
  roomId: string | null;
  tileCol: number;
  tileRow: number;
  pixelX: number;
  pixelY: number;
  targetTileCol?: number;
  targetTileRow?: number;
  animState: AgentAnimState;
  animFrame: number;
  facing: AgentFacing;
  currentTask?: string;
}

export type SimEventType =
  | "task_complete"
  | "mission_arrived"
  | "level_up"
  | "status_change"
  | "resource_tick"
  | "agent_moved";

export interface SimEvent {
  id: string;
  tick: number;
  type: SimEventType;
  agentId?: string;
  message: string;
  timestamp: number;
}

export interface SimState {
  running: boolean;
  tickCount: number;
  speed: 1 | 2 | 4;
  events: SimEvent[];
}

export interface CameraState {
  panX: number;
  panY: number;
  zoom: number;
}

export type PanelMode = "agent" | "room" | "stats" | null;

export interface SelectedEntity {
  type: "agent" | "room";
  id: string;
}
