import type { ShipLayout, RoomInstance, GridSize } from "@/types";
import {
  TILE_SIZE,
  ROOM_FLOOR_COLORS,
  ROOM_ACCENT_COLORS,
} from "./constants";
import { getSprite } from "./sprite-loader";

const SIZE_SPANS: Record<GridSize, { cols: number; rows: number }> = {
  "1x1": { cols: 1, rows: 1 },
  "2x1": { cols: 2, rows: 1 },
  "1x2": { cols: 1, rows: 2 },
  "2x2": { cols: 2, rows: 2 },
};

/** Maps room type to its floor sprite path. */
function floorSpritePath(typeKey: string): string {
  return `/sprites/tiles/floor-${typeKey}.png`;
}

const HULL_SPRITE = "/sprites/tiles/hull.png";

/**
 * Draws the static layer: exterior hull, floor tiles per room, walls.
 * Intended to be drawn once into an offscreen canvas and blitted each frame.
 */
export function drawStaticLayer(
  ctx: CanvasRenderingContext2D,
  ship: ShipLayout,
  rooms: RoomInstance[],
): void {
  const roomById = new Map(rooms.map((r) => [r.id, r]));

  // Background (space)
  ctx.fillStyle = "#08060f";
  ctx.fillRect(0, 0, ship.cols * TILE_SIZE, ship.rows * TILE_SIZE);

  // Hull exterior — subtle purple tint showing buildable interior
  const hullSprite = getSprite(HULL_SPRITE);
  for (let r = 0; r < ship.rows; r++) {
    for (let c = 0; c < ship.cols; c++) {
      const cell = ship.cells[r][c];
      if (cell.kind === "hull") continue;

      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (cell.roomId) {
        // Will be drawn as floor below
        continue;
      }

      // Empty interior (corridor)
      if (hullSprite) {
        ctx.drawImage(hullSprite, x, y, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = "#1a1230";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }

      // Subtle grid
      ctx.strokeStyle = "rgba(90, 50, 140, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    }
  }

  // Floor tiles per room
  for (const room of rooms) {
    const floorPath = floorSpritePath(room.typeKey);
    const floorSprite = getSprite(floorPath);
    const spans = SIZE_SPANS[room.gridSize];
    const floorColor = ROOM_FLOOR_COLORS[room.typeKey] ?? "#2a2a4a";
    const accent = ROOM_ACCENT_COLORS[room.typeKey] ?? "#aaaaff";

    for (let r = 0; r < spans.rows; r++) {
      for (let c = 0; c < spans.cols; c++) {
        const x = (room.anchor.col + c) * TILE_SIZE;
        const y = (room.anchor.row + r) * TILE_SIZE;

        if (floorSprite) {
          ctx.drawImage(floorSprite, x, y, TILE_SIZE, TILE_SIZE);
        } else {
          // Placeholder: flat color + diagonal accent pattern
          ctx.fillStyle = floorColor;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          // Subtle accent stripes
          ctx.strokeStyle = accent + "22";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y + TILE_SIZE);
          ctx.lineTo(x + TILE_SIZE, y);
          ctx.stroke();
        }
      }
    }

    // Room border (walls)
    const roomX = room.anchor.col * TILE_SIZE;
    const roomY = room.anchor.row * TILE_SIZE;
    const roomW = spans.cols * TILE_SIZE;
    const roomH = spans.rows * TILE_SIZE;

    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(roomX + 1, roomY + 1, roomW - 2, roomH - 2);

    // Inner glow
    ctx.strokeStyle = accent + "44";
    ctx.lineWidth = 1;
    ctx.strokeRect(roomX + 3, roomY + 3, roomW - 6, roomH - 6);
  }

  // Room labels (tiny)
  ctx.font = "600 9px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const room of rooms) {
    const spans = SIZE_SPANS[room.gridSize];
    const cx = (room.anchor.col + spans.cols / 2) * TILE_SIZE;
    const cy = room.anchor.row * TILE_SIZE + 4;
    const accent = ROOM_ACCENT_COLORS[room.typeKey] ?? "#ffffff";

    const label = roomShortLabel(room.typeKey);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillText(label, cx + 1, cy + 1);
    ctx.fillStyle = accent;
    ctx.fillText(label, cx, cy);
  }
}

function roomShortLabel(typeKey: string): string {
  const map: Record<string, string> = {
    bridge: "BRIDGE",
    briefing: "BRIEFING",
    workshop: "WORKSHOP",
    armory: "ARMORY",
    medbay: "MEDBAY",
    training: "TRAINING",
    engineering: "ENGINEER",
    storage: "STORAGE",
    quarters: "QTRS",
    "memory-vault": "MEMORY",
    "financial-center": "FINANCE",
    commons: "COMMONS",
  };
  return map[typeKey] ?? typeKey.toUpperCase();
}

/**
 * Creates an offscreen canvas with the static layer pre-rendered.
 * Call this once on mount and whenever rooms change.
 */
export function renderStaticLayer(
  ship: ShipLayout,
  rooms: RoomInstance[],
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = ship.cols * TILE_SIZE;
  canvas.height = ship.rows * TILE_SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  drawStaticLayer(ctx, ship, rooms);
  return canvas;
}
