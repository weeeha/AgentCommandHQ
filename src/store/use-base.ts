import { create } from "zustand";
import type {
  ShipLayout,
  RoomInstance,
  BaseResources,
  RoomTypeKey,
  GridSize,
} from "@/types";
import { createDefaultShipLayout, roomTypeDefs } from "@/data";

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

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

interface BaseStore {
  ship: ShipLayout;
  rooms: RoomInstance[];
  baseResources: BaseResources;

  selectedCellPos: { row: number; col: number } | null;
  selectedRoomId: string | null;
  buildMenuOpen: boolean;

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
}

const initial = createDefaultShipLayout();

export const useBaseStore = create<BaseStore>((set) => ({
  ship: initial.ship,
  rooms: initial.rooms,
  baseResources: {
    power: { current: 12, max: 30 },
    supplies: 500,
    credits: 1850,
  },

  selectedCellPos: null,
  selectedRoomId: null,
  buildMenuOpen: false,

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
}));
