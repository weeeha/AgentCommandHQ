import type {
  CellKind,
  GridCell,
  ShipLayout,
  RoomInstance,
  RoomTypeKey,
  GridSize,
} from "@/types";

// Characters: '.' = outside hull, '#' = buildable interior
// 24 cols x 18 rows — expanded oval-shaped corvette
const HULL_MAP: string[] = [
  "......##########........", // row 0  — nose
  ".....############.......", // row 1
  "....##############......", // row 2
  "...################.....", // row 3
  "..##################....", // row 4
  ".####################...", // row 5
  ".####################...", // row 6
  "######################..", // row 7
  "########################", // row 8  — widest
  "########################", // row 9
  "######################..", // row 10
  ".####################...", // row 11
  ".####################...", // row 12
  "..##################....", // row 13
  "...################.....", // row 14
  "....##############......", // row 15
  ".....############.......", // row 16
  "......##########........", // row 17 — engines
];

function charToKind(ch: string): CellKind {
  if (ch === "W") return "wall";
  if (ch === "#") return "empty";
  return "hull";
}

function parseHullMap(map: string[]): GridCell[][] {
  return map.map((rowStr, row) =>
    rowStr.split("").map((ch, col) => ({
      row,
      col,
      kind: charToKind(ch),
      roomId: null,
      isAnchor: false,
    })),
  );
}

const SIZE_SPANS: Record<GridSize, { cols: number; rows: number }> = {
  "1x1": { cols: 1, rows: 1 },
  "2x1": { cols: 2, rows: 1 },
  "1x2": { cols: 1, rows: 2 },
  "2x2": { cols: 2, rows: 2 },
};

function placeRoom(
  cells: GridCell[][],
  room: RoomInstance,
  colSpan: number,
  rowSpan: number,
) {
  for (let r = 0; r < rowSpan; r++) {
    for (let c = 0; c < colSpan; c++) {
      const cell = cells[room.anchor.row + r]?.[room.anchor.col + c];
      if (!cell) continue;
      cell.roomId = room.id;
      cell.kind = "empty";
      cell.isAnchor = r === 0 && c === 0;
    }
  }
}

interface PreBuiltRoom {
  id: string;
  typeKey: RoomTypeKey;
  size: GridSize;
  anchor: { row: number; col: number };
  level: number;
  power: number;
  assignedAgents?: string[];
}

const DEFAULT_ROOMS: PreBuiltRoom[] = [
  // Command cluster (top)
  {
    id: "room-bridge",
    typeKey: "bridge",
    size: "2x2",
    anchor: { row: 2, col: 10 },
    level: 2,
    power: 4,
    assignedAgents: ["agent-atlas"],
  },
  {
    id: "room-financial",
    typeKey: "financial-center",
    size: "2x2",
    anchor: { row: 3, col: 7 },
    level: 1,
    power: 2,
  },
  {
    id: "room-briefing",
    typeKey: "briefing",
    size: "2x2",
    anchor: { row: 3, col: 13 },
    level: 1,
    power: 2,
  },

  // Operations row
  {
    id: "room-workshop",
    typeKey: "workshop",
    size: "2x2",
    anchor: { row: 6, col: 4 },
    level: 3,
    power: 3,
    assignedAgents: ["agent-forge"],
  },
  {
    id: "room-memory-vault",
    typeKey: "memory-vault",
    size: "2x2",
    anchor: { row: 6, col: 18 },
    level: 2,
    power: 3,
    assignedAgents: ["agent-sentinel"],
  },

  // Center (commons)
  {
    id: "room-commons",
    typeKey: "commons",
    size: "2x2",
    anchor: { row: 8, col: 11 },
    level: 1,
    power: 1,
  },

  // Support
  {
    id: "room-armory",
    typeKey: "armory",
    size: "2x1",
    anchor: { row: 8, col: 7 },
    level: 1,
    power: 2,
  },
  {
    id: "room-medbay",
    typeKey: "medbay",
    size: "2x1",
    anchor: { row: 8, col: 15 },
    level: 1,
    power: 3,
  },
  {
    id: "room-training",
    typeKey: "training",
    size: "2x2",
    anchor: { row: 11, col: 6 },
    level: 2,
    power: 2,
    assignedAgents: ["agent-echo"],
  },
  {
    id: "room-engineering",
    typeKey: "engineering",
    size: "2x2",
    anchor: { row: 11, col: 16 },
    level: 2,
    power: 0,
    assignedAgents: ["agent-nova"],
  },

  // Quarters (personal, bottom)
  {
    id: "room-quarters-1",
    typeKey: "quarters",
    size: "1x1",
    anchor: { row: 13, col: 10 },
    level: 1,
    power: 1,
    assignedAgents: ["agent-cipher"],
  },
  {
    id: "room-quarters-2",
    typeKey: "quarters",
    size: "1x1",
    anchor: { row: 13, col: 13 },
    level: 1,
    power: 1,
    assignedAgents: ["agent-mirror"],
  },
  {
    id: "room-quarters-3",
    typeKey: "quarters",
    size: "1x1",
    anchor: { row: 14, col: 11 },
    level: 1,
    power: 1,
    assignedAgents: ["agent-muse"],
  },
  {
    id: "room-quarters-4",
    typeKey: "quarters",
    size: "1x1",
    anchor: { row: 14, col: 12 },
    level: 1,
    power: 1,
  },

  // Storage
  {
    id: "room-storage",
    typeKey: "storage",
    size: "2x1",
    anchor: { row: 15, col: 9 },
    level: 1,
    power: 1,
  },
];

export function createDefaultShipLayout(): {
  ship: ShipLayout;
  rooms: RoomInstance[];
} {
  const cells = parseHullMap(HULL_MAP);
  const rows = cells.length;
  const cols = cells[0].length;

  const rooms: RoomInstance[] = DEFAULT_ROOMS.map((r) => {
    const instance: RoomInstance = {
      id: r.id,
      typeKey: r.typeKey,
      level: r.level,
      status: "operational",
      gridSize: r.size,
      anchor: r.anchor,
      assignedAgentIds: r.assignedAgents ?? [],
      powerConsumption: r.power,
    };
    const spans = SIZE_SPANS[r.size];
    placeRoom(cells, instance, spans.cols, spans.rows);
    return instance;
  });

  return {
    ship: {
      rows,
      cols,
      cells,
      hullName: "Vanguard-class Corvette",
    },
    rooms,
  };
}
