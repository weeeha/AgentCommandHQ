import type { Agent, AgentPosition } from "@/types";
import { TILE_SIZE, AGENT_SPRITE_SIZE, STATUS_COLORS } from "./constants";
import { getSprite } from "./sprite-loader";

/** Map agent id → sprite path. */
function agentSpritePath(agentId: string): string {
  // agent-atlas → /sprites/agents/atlas.png
  const short = agentId.replace(/^agent-/, "");
  return `/sprites/agents/${short}.png`;
}

/** Deterministic placeholder color based on agent id. */
function placeholderColor(agentId: string): string {
  const palette = [
    "#b84aff",
    "#4aa8ff",
    "#ff8a3a",
    "#3affcc",
    "#ffcc3a",
    "#ff4a4a",
    "#c04aff",
    "#eaff3a",
  ];
  let hash = 0;
  for (let i = 0; i < agentId.length; i++)
    hash = (hash * 31 + agentId.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  agents: Agent[];
  positions: AgentPosition[];
  tick: number;
  hoveredAgentId: string | null;
  selectedAgentId: string | null;
}

export function drawAgents(dc: DrawContext): void {
  const { ctx, agents, positions, tick, hoveredAgentId, selectedAgentId } = dc;
  const agentById = new Map(agents.map((a) => [a.id, a]));

  for (const pos of positions) {
    const agent = agentById.get(pos.agentId);
    if (!agent) continue;

    const x = pos.pixelX - AGENT_SPRITE_SIZE / 2;
    const y = pos.pixelY - AGENT_SPRITE_SIZE / 2;

    const statusColor = STATUS_COLORS[agent.status] ?? "#ffffff";
    const isHovered = hoveredAgentId === pos.agentId;
    const isSelected = selectedAgentId === pos.agentId;

    // Status aura (glow)
    ctx.save();
    const pulseAlpha = 0.25 + 0.15 * Math.sin(tick * 0.08);
    ctx.globalAlpha = pulseAlpha;
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(pos.pixelX, pos.pixelY + 8, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Sprite
    const sprite = getSprite(agentSpritePath(pos.agentId));
    if (sprite && sprite.complete) {
      // Slight bob for idle animation
      const bob =
        pos.animState === "idle" ? Math.floor(Math.sin(tick * 0.12) * 1) : 0;
      ctx.drawImage(
        sprite,
        Math.round(x),
        Math.round(y + bob),
        AGENT_SPRITE_SIZE,
        AGENT_SPRITE_SIZE,
      );
    } else {
      // Placeholder: colored circle with initial
      const color = placeholderColor(pos.agentId);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.pixelX, pos.pixelY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px JetBrains Mono, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(agent.callsign[0], pos.pixelX, pos.pixelY);
    }

    // Callsign label
    ctx.font = "600 9px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const labelY = pos.pixelY + 18;

    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(pos.pixelX - 24, labelY - 1, 48, 12);
    ctx.fillStyle = statusColor;
    ctx.fillText(agent.callsign, pos.pixelX, labelY + 1);

    // Status dot next to label
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(pos.pixelX - 20, labelY + 5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Hover/select ring
    if (isHovered || isSelected) {
      ctx.strokeStyle = isSelected ? "#ffffff" : statusColor;
      ctx.lineWidth = 2;
      ctx.setLineDash(isSelected ? [] : [4, 3]);
      ctx.beginPath();
      ctx.arc(pos.pixelX, pos.pixelY, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Thought bubble when deployed with a task
    if (pos.currentTask && agent.status === "deployed") {
      drawThoughtBubble(ctx, pos.pixelX, pos.pixelY - 24, pos.currentTask);
    }
  }
}

function drawThoughtBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
): void {
  const maxChars = 18;
  const display = text.length > maxChars ? text.slice(0, maxChars) + "…" : text;

  ctx.font = "500 9px JetBrains Mono, monospace";
  const metrics = ctx.measureText(display);
  const padX = 6;
  const padY = 4;
  const w = metrics.width + padX * 2;
  const h = 12 + padY * 2;

  // Tail
  ctx.fillStyle = "rgba(10,8,20,0.92)";
  ctx.beginPath();
  ctx.moveTo(x - 3, y + h / 2 + 4);
  ctx.lineTo(x, y + h / 2 + 10);
  ctx.lineTo(x + 3, y + h / 2 + 4);
  ctx.closePath();
  ctx.fill();

  // Bubble
  ctx.fillStyle = "rgba(10,8,20,0.92)";
  ctx.strokeStyle = "rgba(184, 74, 255, 0.6)";
  ctx.lineWidth = 1;
  const rx = x - w / 2;
  const ry = y - h / 2;
  roundRect(ctx, rx, ry, w, h, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f5ebff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(display, x, y);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

/**
 * Hit-test agents at a given world position. Returns the agent id or null.
 */
export function agentAt(
  positions: AgentPosition[],
  worldX: number,
  worldY: number,
): string | null {
  const hitRadius = 18;
  for (const pos of positions) {
    const dx = pos.pixelX - worldX;
    const dy = pos.pixelY - worldY;
    if (dx * dx + dy * dy <= hitRadius * hitRadius) return pos.agentId;
  }
  return null;
}
