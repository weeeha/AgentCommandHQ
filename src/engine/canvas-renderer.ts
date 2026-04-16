import type { Agent, ShipLayout, RoomInstance, AgentPosition } from "@/types";
import { renderStaticLayer } from "./tile-map";
import { drawAgents, agentAt } from "./agent-renderer";
import { TILE_SIZE } from "./constants";
import { screenToWorld } from "./camera";
import { useBaseStore } from "@/store/use-base";

interface RenderState {
  ship: ShipLayout;
  rooms: RoomInstance[];
  agents: Agent[];
  positions: AgentPosition[];
  camera: { panX: number; panY: number; zoom: number };
  hoveredAgentId: string | null;
  hoveredRoomId: string | null;
  selectedAgentId: string | null;
  selectedRoomId: string | null;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private staticLayer: HTMLCanvasElement | null = null;
  private lastShipRef: ShipLayout | null = null;
  private lastRoomsRef: RoomInstance[] | null = null;
  private frame = 0;
  private rafId = 0;
  private getState: () => RenderState;

  constructor(canvas: HTMLCanvasElement, getState: () => RenderState) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context not available");
    this.ctx = ctx;
    this.getState = getState;
  }

  start(): void {
    const loop = () => {
      this.frame++;
      this.render();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    cancelAnimationFrame(this.rafId);
  }

  invalidateStatic(): void {
    this.staticLayer = null;
    this.lastShipRef = null;
    this.lastRoomsRef = null;
  }

  private ensureStaticLayer(
    ship: ShipLayout,
    rooms: RoomInstance[],
  ): HTMLCanvasElement {
    if (
      !this.staticLayer ||
      this.lastShipRef !== ship ||
      this.lastRoomsRef !== rooms
    ) {
      this.staticLayer = renderStaticLayer(ship, rooms);
      this.lastShipRef = ship;
      this.lastRoomsRef = rooms;
    }
    return this.staticLayer;
  }

  private render(): void {
    const state = this.getState();
    const { ctx, canvas } = this;

    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // Clear
    ctx.fillStyle = "#050308";
    ctx.fillRect(0, 0, cssW, cssH);

    // Starfield (subtle)
    this.drawStars(cssW, cssH);

    // Apply camera transform
    ctx.save();
    ctx.translate(state.camera.panX, state.camera.panY);
    ctx.scale(state.camera.zoom, state.camera.zoom);

    // Static layer
    const layer = this.ensureStaticLayer(state.ship, state.rooms);
    ctx.drawImage(layer, 0, 0);

    // Hovered tile highlight
    if (state.hoveredRoomId) {
      const room = state.rooms.find((r) => r.id === state.hoveredRoomId);
      if (room) {
        const spans = gridSpan(room.gridSize);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2 / state.camera.zoom;
        ctx.strokeRect(
          room.anchor.col * TILE_SIZE + 1,
          room.anchor.row * TILE_SIZE + 1,
          spans.cols * TILE_SIZE - 2,
          spans.rows * TILE_SIZE - 2,
        );
      }
    }

    // Selected room highlight
    if (state.selectedRoomId) {
      const room = state.rooms.find((r) => r.id === state.selectedRoomId);
      if (room) {
        const spans = gridSpan(room.gridSize);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3 / state.camera.zoom;
        ctx.strokeRect(
          room.anchor.col * TILE_SIZE,
          room.anchor.row * TILE_SIZE,
          spans.cols * TILE_SIZE,
          spans.rows * TILE_SIZE,
        );
      }
    }

    // Agents
    drawAgents({
      ctx,
      agents: state.agents,
      positions: state.positions,
      tick: this.frame,
      hoveredAgentId: state.hoveredAgentId,
      selectedAgentId: state.selectedAgentId,
    });

    ctx.restore();
  }

  private drawStars(w: number, h: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#8a7abf";
    // Deterministic star pattern
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 73) % w) + ((i * 13) % 7);
      const sy = ((i * 137) % h) + ((i * 19) % 5);
      const size = (i % 3 === 0 ? 2 : 1) * (window.devicePixelRatio || 1) / (window.devicePixelRatio || 1);
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.restore();
  }

  /** Returns what's at the given screen coords (agent > room > empty). */
  hitTest(
    screenX: number,
    screenY: number,
  ):
    | { type: "agent"; id: string }
    | { type: "room"; id: string }
    | { type: "tile"; col: number; row: number }
    | null {
    const state = this.getState();
    const { worldX, worldY } = screenToWorld(
      state.camera,
      screenX,
      screenY,
    );

    const agentId = agentAt(state.positions, worldX, worldY);
    if (agentId) return { type: "agent", id: agentId };

    const col = Math.floor(worldX / TILE_SIZE);
    const row = Math.floor(worldY / TILE_SIZE);
    if (row < 0 || row >= state.ship.rows || col < 0 || col >= state.ship.cols)
      return null;

    const cell = state.ship.cells[row][col];
    if (cell.roomId) return { type: "room", id: cell.roomId };

    if (cell.kind === "empty") return { type: "tile", col, row };
    return null;
  }
}

function gridSpan(size: string): { cols: number; rows: number } {
  const map: Record<string, { cols: number; rows: number }> = {
    "1x1": { cols: 1, rows: 1 },
    "2x1": { cols: 2, rows: 1 },
    "1x2": { cols: 1, rows: 2 },
    "2x2": { cols: 2, rows: 2 },
  };
  return map[size] ?? { cols: 1, rows: 1 };
}

/** Helper: build the RenderState from the stores for the renderer. */
export function buildRenderState(agents: Agent[]): RenderState {
  const b = useBaseStore.getState();
  const hoveredAgentId =
    b.hoveredEntity?.type === "agent" ? b.hoveredEntity.id : null;
  const hoveredRoomId =
    b.hoveredEntity?.type === "room" ? b.hoveredEntity.id : null;
  const selectedAgentId =
    b.selectedEntity?.type === "agent" ? b.selectedEntity.id : null;
  const selectedRoomId =
    b.selectedEntity?.type === "room" ? b.selectedEntity.id : null;

  return {
    ship: b.ship,
    rooms: b.rooms,
    agents,
    positions: b.agentPositions,
    camera: b.camera,
    hoveredAgentId,
    hoveredRoomId,
    selectedAgentId,
    selectedRoomId,
  };
}
