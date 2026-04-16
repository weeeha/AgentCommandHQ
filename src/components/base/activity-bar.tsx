"use client";

import { useBaseStore } from "@/store/use-base";
import type { SimEvent } from "@/types";

const typeColors: Record<SimEvent["type"], string> = {
  task_complete: "#3affcc",
  mission_arrived: "#4aa8ff",
  level_up: "#f5c14b",
  status_change: "#b84aff",
  resource_tick: "#888",
  agent_moved: "#c9b5ff",
};

const typeLabels: Record<SimEvent["type"], string> = {
  task_complete: "DONE",
  mission_arrived: "MISSION",
  level_up: "LVL UP",
  status_change: "STATUS",
  resource_tick: "TICK",
  agent_moved: "MOVE",
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "now";
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

export function ActivityBar() {
  const events = useBaseStore((s) => s.simulation.events);
  const tick = useBaseStore((s) => s.simulation.tickCount);
  const running = useBaseStore((s) => s.simulation.running);
  // tick dep reused to force re-render of "time ago" strings
  void tick;

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-3">
      <div className="pointer-events-auto rounded-sm border border-white/10 bg-black/75 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5">
          <div
            className={`size-1.5 rounded-full ${running ? "bg-success animate-pulse" : "bg-muted-foreground"}`}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Activity Log
          </span>
          <span className="ml-auto font-mono text-[9px] tabular-nums text-muted-foreground">
            T+{tick}
          </span>
        </div>

        <div className="flex h-16 gap-2 overflow-x-auto px-3 py-2 scrollbar-thin">
          {events.length === 0 && (
            <div className="flex items-center font-mono text-[10px] italic text-muted-foreground/60">
              Awaiting simulation events…
            </div>
          )}
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex shrink-0 flex-col justify-between rounded-sm border border-white/10 bg-black/40 px-2.5 py-1.5"
              style={{
                borderLeft: `2px solid ${typeColors[ev.type]}`,
                minWidth: "180px",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono text-[8px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: typeColors[ev.type] }}
                >
                  {typeLabels[ev.type]}
                </span>
                <span className="ml-auto font-mono text-[9px] tabular-nums text-muted-foreground/70">
                  {timeAgo(ev.timestamp)}
                </span>
              </div>
              <div className="truncate font-mono text-[10px] text-foreground/90">
                {ev.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
