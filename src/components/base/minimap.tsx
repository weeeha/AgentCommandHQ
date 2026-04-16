"use client";

import { useEffect, useRef } from "react";
import { useBaseStore } from "@/store/use-base";
import {
  MAP_COLS,
  MAP_ROWS,
  ROOM_ACCENT_COLORS,
  STATUS_COLORS,
} from "@/engine/constants";
import { useCockpitStore } from "@/store/use-cockpit";

const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = (MINIMAP_WIDTH * MAP_ROWS) / MAP_COLS;
const CELL = MINIMAP_WIDTH / MAP_COLS;

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ship = useBaseStore((s) => s.ship);
  const rooms = useBaseStore((s) => s.rooms);
  const positions = useBaseStore((s) => s.agentPositions);
  const agents = useCockpitStore((s) => s.agents);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = MINIMAP_WIDTH * dpr;
    canvas.height = MINIMAP_HEIGHT * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = "#050308";
    ctx.fillRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);

    // Hull cells
    ctx.fillStyle = "#1a1230";
    for (let r = 0; r < ship.rows; r++) {
      for (let c = 0; c < ship.cols; c++) {
        const cell = ship.cells[r][c];
        if (cell.kind !== "hull") {
          ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
        }
      }
    }

    // Rooms
    for (const room of rooms) {
      const accent = ROOM_ACCENT_COLORS[room.typeKey] ?? "#888";
      const span =
        room.gridSize === "2x2"
          ? { cols: 2, rows: 2 }
          : room.gridSize === "2x1"
            ? { cols: 2, rows: 1 }
            : room.gridSize === "1x2"
              ? { cols: 1, rows: 2 }
              : { cols: 1, rows: 1 };

      ctx.fillStyle = accent + "55";
      ctx.fillRect(
        room.anchor.col * CELL,
        room.anchor.row * CELL,
        span.cols * CELL,
        span.rows * CELL,
      );
      ctx.strokeStyle = accent;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(
        room.anchor.col * CELL + 0.25,
        room.anchor.row * CELL + 0.25,
        span.cols * CELL - 0.5,
        span.rows * CELL - 0.5,
      );
    }

    // Agents
    for (const pos of positions) {
      const agent = agents.find((a) => a.id === pos.agentId);
      if (!agent) continue;
      const px = (pos.pixelX / (MAP_COLS * 48)) * MINIMAP_WIDTH;
      const py = (pos.pixelY / (MAP_ROWS * 48)) * MINIMAP_HEIGHT;
      ctx.fillStyle = STATUS_COLORS[agent.status];
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [ship, rooms, positions, agents]);

  return (
    <div className="pointer-events-none absolute bottom-24 right-3 z-10">
      <div className="pointer-events-auto rounded-sm border border-white/10 bg-black/80 p-1.5 shadow-xl backdrop-blur-sm">
        <div className="mb-1 flex items-center justify-between px-1">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
            Base Map
          </span>
          <span className="font-mono text-[8px] tabular-nums text-muted-foreground/70">
            {rooms.length} rooms
          </span>
        </div>
        <canvas
          ref={canvasRef}
          style={{
            width: `${MINIMAP_WIDTH}px`,
            height: `${MINIMAP_HEIGHT}px`,
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
}
