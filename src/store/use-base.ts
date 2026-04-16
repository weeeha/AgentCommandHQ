import { create } from "zustand";
import type {
  ShipLayout,
  RoomInstance,
  BaseResources,
  RoomTypeKey,
  GridSize,
  AgentPosition,
  CameraState,
  SimState,
  SimEvent,
  SelectedEntity,
  PanelMode,
  AgentAnimState,
  AgentFacing,
} from "@/types";
import { createDefaultShipLayout, roomTypeDefs } from "@/data";
import { TILE_SIZE } from "@/engine/constants";

// ─────────────────────────────────────────────────────────────
// Helpers (pure functions, exported for use in components)
// ─────────────────────────────────────────────────────────────

const SIZE_SPANS: Record<GridSize, { cols: number; rows: number }> = {
  "1x1": { cols: 1, rows: 1 },
  "2x1": { cols: 2, rows: 1 },
  "1x2": { cols: 1, rows: 2 },
  "2x2": { cols: 2, rows: 2 },
};

export function getRoomAt(
  ship: ShipLayout,
  rooms: RoomInstance[],
  row: number,
  col: number,
): RoomInstance | null {
  const cell = ship.cells[row]?.[col];
  if (!cell?.roomId) return null;
  return rooms.find((r) => r.id === cell.roomId) ?? null;
}

export function canBuildAt(
  ship: ShipLayout,
  row: number,
  col: number,
  size: GridSize,
): boolean {
  const { cols, rows } = SIZE_SPANS[size];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = ship.cells[row + r]?.[col + c];
      if (!cell) return false;
      if (cell.kind !== "empty") return false;
      if (cell.roomId !== null) return false;
    }
  }
  return true;
}

export function getRoomCenterTile(room: RoomInstance): {
  col: number;
  row: number;
} {
  const spans = SIZE_SPANS[room.gridSize];
  return {
    col: room.anchor.col + Math.floor(spans.cols / 2),
    row: room.anchor.row + Math.floor(spans.rows / 2),
  };
}

function makeInitialPositions(rooms: RoomInstance[]): AgentPosition[] {
  const positions: AgentPosition[] = [];
  for (const room of rooms) {
    const center = getRoomCenterTile(room);
    for (const agentId of room.assignedAgentIds) {
      positions.push({
        agentId,
        roomId: room.id,
        tileCol: center.col,
        tileRow: center.row,
        pixelX: center.col * TILE_SIZE + TILE_SIZE / 2,
        pixelY: center.row * TILE_SIZE + TILE_SIZE / 2,
        animState: "idle",
        animFrame: 0,
        facing: "down",
      });
    }
  }
  return positions;
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

interface BaseStore {
  // Data
  ship: ShipLayout;
  rooms: RoomInstance[];
  baseResources: BaseResources;

  // Legacy selection (preserved for compatibility)
  selectedCellPos: { row: number; col: number } | null;
  selectedRoomId: string | null;
  buildMenuOpen: boolean;

  // Game engine state
  agentPositions: AgentPosition[];
  camera: CameraState;
  simulation: SimState;
  hoveredTile: { row: number; col: number } | null;
  hoveredEntity: SelectedEntity | null;
  selectedEntity: SelectedEntity | null;
  panelOpen: PanelMode;

  // Legacy actions
  selectCell: (pos: { row: number; col: number } | null) => void;
  selectRoom: (id: string | null) => void;
  openBuildMenu: () => void;
  closeBuildMenu: () => void;
  buildRoom: (
    typeKey: RoomTypeKey,
    anchor: { row: number; col: number },
    size: GridSize,
  ) => void;
  demolishRoom: (roomId: string) => void;
  assignAgent: (roomId: string, agentId: string) => void;
  unassignAgent: (roomId: string, agentId: string) => void;

  // Engine actions
  setCamera: (cam: Partial<CameraState>) => void;
  panCamera: (dx: number, dy: number) => void;
  zoomCamera: (delta: number, anchorX: number, anchorY: number) => void;
  setHoveredTile: (tile: { row: number; col: number } | null) => void;
  setHoveredEntity: (entity: SelectedEntity | null) => void;
  selectEntity: (entity: SelectedEntity | null) => void;
  openPanel: (panel: PanelMode) => void;
  closePanel: () => void;

  // Simulation actions
  updateAgentPosition: (agentId: string, patch: Partial<AgentPosition>) => void;
  setAgentAnim: (
    agentId: string,
    state: AgentAnimState,
    facing?: AgentFacing,
  ) => void;
  advanceAgentFrame: (agentId: string) => void;
  setAgentTask: (agentId: string, task: string | undefined) => void;
  moveAgentToRoom: (agentId: string, roomId: string) => void;
  addSimEvent: (event: Omit<SimEvent, "timestamp">) => void;
  tickSimulation: () => void;
  setSimSpeed: (speed: 1 | 2 | 4) => void;
  toggleSimRunning: () => void;
}

const initial = createDefaultShipLayout();

export const useBaseStore = create<BaseStore>((set, get) => ({
  // Data
  ship: initial.ship,
  rooms: initial.rooms,
  baseResources: {
    power: { current: 12, max: 30 },
    supplies: 500,
    credits: 1850,
  },

  // Legacy selection
  selectedCellPos: null,
  selectedRoomId: null,
  buildMenuOpen: false,

  // Game engine state
  agentPositions: makeInitialPositions(initial.rooms),
  camera: {
    panX: 0,
    panY: 0,
    zoom: 1,
  },
  simulation: {
    running: true,
    tickCount: 0,
    speed: 1,
    events: [],
  },
  hoveredTile: null,
  hoveredEntity: null,
  selectedEntity: null,
  panelOpen: null,

  // Legacy actions
  selectCell: (pos) =>
    set({ selectedCellPos: pos, selectedRoomId: null, buildMenuOpen: false }),

  selectRoom: (id) =>
    set({ selectedRoomId: id, selectedCellPos: null, buildMenuOpen: false }),

  openBuildMenu: () => set({ buildMenuOpen: true }),

  closeBuildMenu: () => set({ buildMenuOpen: false }),

  buildRoom: (typeKey, anchor, size) =>
    set((state) => {
      if (!canBuildAt(state.ship, anchor.row, anchor.col, size)) return state;

      const def = roomTypeDefs[typeKey];
      const id = `room-${crypto.randomUUID().slice(0, 8)}`;
      const { cols, rows } = SIZE_SPANS[size];

      const newRoom: RoomInstance = {
        id,
        typeKey,
        level: 1,
        status: "operational",
        gridSize: size,
        anchor,
        assignedAgentIds: [],
        powerConsumption: def.basePowerCost,
      };

      const newCells = state.ship.cells.map((row) => row.map((c) => ({ ...c })));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = newCells[anchor.row + r][anchor.col + c];
          cell.roomId = id;
          cell.isAnchor = r === 0 && c === 0;
        }
      }

      return {
        ship: { ...state.ship, cells: newCells },
        rooms: [...state.rooms, newRoom],
        baseResources: {
          ...state.baseResources,
          credits: state.baseResources.credits - def.baseBuildCost,
          power: {
            ...state.baseResources.power,
            current: state.baseResources.power.current + def.basePowerCost,
          },
        },
        selectedRoomId: id,
        selectedCellPos: null,
        buildMenuOpen: false,
      };
    }),

  demolishRoom: (roomId) =>
    set((state) => {
      const room = state.rooms.find((r) => r.id === roomId);
      if (!room || room.typeKey === "bridge") return state;

      const newCells = state.ship.cells.map((row) => row.map((c) => ({ ...c })));
      for (const row of newCells) {
        for (const cell of row) {
          if (cell.roomId === roomId) {
            cell.roomId = null;
            cell.isAnchor = false;
          }
        }
      }

      return {
        ship: { ...state.ship, cells: newCells },
        rooms: state.rooms.filter((r) => r.id !== roomId),
        baseResources: {
          ...state.baseResources,
          credits:
            state.baseResources.credits +
            Math.floor(roomTypeDefs[room.typeKey].baseBuildCost * 0.5),
          power: {
            ...state.baseResources.power,
            current: state.baseResources.power.current - room.powerConsumption,
          },
        },
        selectedRoomId: null,
      };
    }),

  assignAgent: (roomId, agentId) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId && !r.assignedAgentIds.includes(agentId)
          ? { ...r, assignedAgentIds: [...r.assignedAgentIds, agentId] }
          : r,
      ),
    })),

  unassignAgent: (roomId, agentId) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              assignedAgentIds: r.assignedAgentIds.filter((id) => id !== agentId),
            }
          : r,
      ),
    })),

  // Engine actions
  setCamera: (cam) =>
    set((state) => ({ camera: { ...state.camera, ...cam } })),

  panCamera: (dx, dy) =>
    set((state) => ({
      camera: {
        ...state.camera,
        panX: state.camera.panX + dx,
        panY: state.camera.panY + dy,
      },
    })),

  zoomCamera: (delta, anchorX, anchorY) =>
    set((state) => {
      const oldZoom = state.camera.zoom;
      const newZoom = Math.max(0.4, Math.min(2.5, oldZoom * (1 + delta)));
      const ratio = newZoom / oldZoom;
      // Keep the anchor point fixed under the cursor
      const panX = anchorX - (anchorX - state.camera.panX) * ratio;
      const panY = anchorY - (anchorY - state.camera.panY) * ratio;
      return { camera: { panX, panY, zoom: newZoom } };
    }),

  setHoveredTile: (tile) => set({ hoveredTile: tile }),

  setHoveredEntity: (entity) => set({ hoveredEntity: entity }),

  selectEntity: (entity) =>
    set({
      selectedEntity: entity,
      panelOpen: entity?.type ?? null,
    }),

  openPanel: (panel) => set({ panelOpen: panel }),

  closePanel: () => set({ panelOpen: null, selectedEntity: null }),

  // Simulation
  updateAgentPosition: (agentId, patch) =>
    set((state) => ({
      agentPositions: state.agentPositions.map((p) =>
        p.agentId === agentId ? { ...p, ...patch } : p,
      ),
    })),

  setAgentAnim: (agentId, animState, facing) =>
    set((state) => ({
      agentPositions: state.agentPositions.map((p) =>
        p.agentId === agentId
          ? { ...p, animState, ...(facing ? { facing } : {}) }
          : p,
      ),
    })),

  advanceAgentFrame: (agentId) =>
    set((state) => ({
      agentPositions: state.agentPositions.map((p) =>
        p.agentId === agentId
          ? { ...p, animFrame: (p.animFrame + 1) % 4 }
          : p,
      ),
    })),

  setAgentTask: (agentId, task) =>
    set((state) => ({
      agentPositions: state.agentPositions.map((p) =>
        p.agentId === agentId ? { ...p, currentTask: task } : p,
      ),
    })),

  moveAgentToRoom: (agentId, roomId) => {
    const state = get();
    const room = state.rooms.find((r) => r.id === roomId);
    if (!room) return;
    const center = getRoomCenterTile(room);
    set({
      agentPositions: state.agentPositions.map((p) =>
        p.agentId === agentId
          ? {
              ...p,
              targetTileCol: center.col,
              targetTileRow: center.row,
              animState: "walking",
            }
          : p,
      ),
    });
  },

  addSimEvent: (event) =>
    set((state) => {
      const newEvent: SimEvent = { ...event, timestamp: Date.now() };
      const events = [newEvent, ...state.simulation.events].slice(0, 30);
      return { simulation: { ...state.simulation, events } };
    }),

  tickSimulation: () =>
    set((state) => ({
      simulation: {
        ...state.simulation,
        tickCount: state.simulation.tickCount + 1,
      },
    })),

  setSimSpeed: (speed) =>
    set((state) => ({ simulation: { ...state.simulation, speed } })),

  toggleSimRunning: () =>
    set((state) => ({
      simulation: { ...state.simulation, running: !state.simulation.running },
    })),
}));
