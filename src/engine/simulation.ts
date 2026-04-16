import type { Agent, AgentPosition, RoomInstance } from "@/types";
import { useBaseStore, getRoomCenterTile } from "@/store/use-base";
import { TILE_SIZE, AGENT_WALK_SPEED, SIM_TICK_MS } from "./constants";

const TASKS = [
  "Analyzing data",
  "Reviewing PR",
  "Running query",
  "Compiling report",
  "Training model",
  "Fetching context",
  "Writing spec",
  "Debugging trace",
  "Calling tool",
  "Scanning logs",
  "Syncing memory",
  "Updating cache",
];

function randomTask(): string {
  return TASKS[Math.floor(Math.random() * TASKS.length)];
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

interface SimDeps {
  getAgents: () => Agent[];
}

export function startSimulation(deps: SimDeps): () => void {
  let animFrame = 0;
  let lastTick = Date.now();
  let lastFrame = Date.now();
  let lastAnimTick = Date.now();

  // Main render/movement loop (~60fps)
  const rafLoop = () => {
    const now = Date.now();
    const dt = (now - lastFrame) / 1000;
    lastFrame = now;

    const state = useBaseStore.getState();
    if (state.simulation.running) {
      // Smooth agent movement toward targets
      for (const pos of state.agentPositions) {
        if (
          pos.targetTileCol === undefined ||
          pos.targetTileRow === undefined
        ) {
          continue;
        }
        const targetX = pos.targetTileCol * TILE_SIZE + TILE_SIZE / 2;
        const targetY = pos.targetTileRow * TILE_SIZE + TILE_SIZE / 2;
        const dx = targetX - pos.pixelX;
        const dy = targetY - pos.pixelY;
        const dist = Math.hypot(dx, dy);
        const speed = AGENT_WALK_SPEED * state.simulation.speed;

        if (dist < 2) {
          useBaseStore.getState().updateAgentPosition(pos.agentId, {
            pixelX: targetX,
            pixelY: targetY,
            tileCol: pos.targetTileCol,
            tileRow: pos.targetTileRow,
            targetTileCol: undefined,
            targetTileRow: undefined,
            animState: "idle",
          });
        } else {
          const step = Math.min(dist, speed * dt);
          const nx = pos.pixelX + (dx / dist) * step;
          const ny = pos.pixelY + (dy / dist) * step;
          const facing =
            Math.abs(dx) > Math.abs(dy)
              ? dx > 0
                ? "right"
                : "left"
              : dy > 0
                ? "down"
                : "up";
          useBaseStore.getState().updateAgentPosition(pos.agentId, {
            pixelX: nx,
            pixelY: ny,
            animState: "walking",
            facing,
          });
        }
      }
    }

    // Animation frame advance (every 220ms)
    if (now - lastAnimTick >= 220) {
      lastAnimTick = now;
      animFrame = (animFrame + 1) % 4;
      for (const pos of useBaseStore.getState().agentPositions) {
        useBaseStore.getState().advanceAgentFrame(pos.agentId);
      }
    }

    animationFrameId = requestAnimationFrame(rafLoop);
  };

  let animationFrameId = requestAnimationFrame(rafLoop);

  // Discrete simulation tick (agent AI decisions, events)
  const tickInterval = setInterval(() => {
    const state = useBaseStore.getState();
    if (!state.simulation.running) return;

    state.tickSimulation();
    const tick = state.simulation.tickCount + 1;

    const agents = deps.getAgents();
    const rooms = state.rooms;

    // Every ~8 ticks, pick a random idle agent and send them to a random room
    if (tick % 8 === 0) {
      const idlePositions = state.agentPositions.filter(
        (p) => p.animState === "idle" && !p.targetTileCol,
      );
      const mover = pickRandom(idlePositions);
      if (mover && rooms.length > 1) {
        const currentRoomId = mover.roomId;
        const candidates = rooms.filter((r) => r.id !== currentRoomId);
        const target = pickRandom(candidates);
        if (target) {
          const center = getRoomCenterTile(target);
          useBaseStore.getState().updateAgentPosition(mover.agentId, {
            targetTileCol: center.col,
            targetTileRow: center.row,
            roomId: target.id,
            animState: "walking",
          });

          const agent = agents.find((a) => a.id === mover.agentId);
          if (agent) {
            useBaseStore.getState().addSimEvent({
              id: `ev-${crypto.randomUUID().slice(0, 8)}`,
              tick,
              type: "agent_moved",
              agentId: mover.agentId,
              message: `${agent.callsign} → ${shortRoomLabel(target)}`,
            });
          }
        }
      }
    }

    // Every ~5 ticks, assign / clear tasks
    if (tick % 5 === 0) {
      const deployedAgents = agents.filter((a) => a.status === "deployed");
      const target = pickRandom(deployedAgents);
      if (target) {
        const task = randomTask();
        useBaseStore.getState().setAgentTask(target.id, task);
      }
    }

    // Every ~12 ticks, add a random event message
    if (tick % 12 === 0) {
      const agent = pickRandom(agents);
      if (agent) {
        const messages = [
          `${agent.callsign} completed task`,
          `${agent.callsign} level progress +1`,
          `${agent.callsign} synced memory bank`,
          `${agent.callsign} received new directive`,
        ];
        useBaseStore.getState().addSimEvent({
          id: `ev-${crypto.randomUUID().slice(0, 8)}`,
          tick,
          type: "task_complete",
          agentId: agent.id,
          message: pickRandom(messages)!,
        });
      }
    }

    lastTick = Date.now();
  }, SIM_TICK_MS);

  return () => {
    cancelAnimationFrame(animationFrameId);
    clearInterval(tickInterval);
  };
}

function shortRoomLabel(room: RoomInstance): string {
  const map: Record<string, string> = {
    bridge: "Bridge",
    briefing: "Briefing",
    workshop: "Workshop",
    armory: "Armory",
    medbay: "Medbay",
    training: "Training",
    engineering: "Engineering",
    storage: "Storage",
    quarters: "Quarters",
    "memory-vault": "Memory Vault",
    "financial-center": "Financial",
    commons: "Commons",
  };
  return map[room.typeKey] ?? room.typeKey;
}
