"use client";

import { useBaseStore } from "@/store/use-base";
import { useCockpitStore } from "@/store/use-cockpit";
import { roomTypeDefs } from "@/data/room-types";
import { StatusDot } from "@/components/primitives/status-dot";
import { ROOM_ACCENT_COLORS } from "@/engine/constants";
import { X, Zap, Users, TrendingUp } from "lucide-react";

export function RoomPanel() {
  const selectedEntity = useBaseStore((s) => s.selectedEntity);
  const closePanel = useBaseStore((s) => s.closePanel);
  const rooms = useBaseStore((s) => s.rooms);
  const agents = useCockpitStore((s) => s.agents);
  const selectEntity = useBaseStore((s) => s.selectEntity);

  if (!selectedEntity || selectedEntity.type !== "room") return null;

  const room = rooms.find((r) => r.id === selectedEntity.id);
  if (!room) return null;

  const def = roomTypeDefs[room.typeKey];
  const accent = ROOM_ACCENT_COLORS[room.typeKey] ?? "#b84aff";
  const assignedAgents = agents.filter((a) =>
    room.assignedAgentIds.includes(a.id),
  );

  return (
    <aside className="absolute bottom-0 right-0 top-0 z-20 flex w-[380px] flex-col border-l border-white/20 bg-black/92 shadow-[0_0_30px_rgba(184,74,255,0.15)] backdrop-blur-md">
      {/* Header */}
      <div
        className="flex items-start justify-between border-b border-white/10 px-4 py-3"
        style={{ borderTop: `2px solid ${accent}` }}
      >
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            {def.category.toUpperCase()} ROOM
          </div>
          <div
            className="mt-0.5 font-mono text-[18px] font-bold tracking-wide"
            style={{ color: accent }}
          >
            {def.label.toUpperCase()}
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
            LVL {room.level} / {def.maxLevel} · {room.status}
          </div>
        </div>
        <button
          onClick={closePanel}
          className="rounded-sm p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Description */}
        <div className="border-b border-white/5 px-4 py-3">
          <p className="font-mono text-[11px] leading-relaxed text-foreground/80">
            {def.description}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 border-b border-white/5">
          <QuickStat
            icon={<Zap className="size-3" />}
            label="Power"
            value={`${room.powerConsumption}`}
          />
          <QuickStat
            icon={<Users className="size-3" />}
            label="Agents"
            value={`${assignedAgents.length}`}
          />
          <QuickStat
            icon={<TrendingUp className="size-3" />}
            label="Size"
            value={room.gridSize}
          />
        </div>

        {/* Assigned agents */}
        <div className="border-b border-white/5 px-4 py-3">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Assigned Agents
          </div>
          {assignedAgents.length === 0 ? (
            <div className="font-mono text-[10px] italic text-muted-foreground/60">
              No agents assigned.
            </div>
          ) : (
            <div className="space-y-1">
              {assignedAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => selectEntity({ type: "agent", id: agent.id })}
                  className="flex w-full items-center gap-2 rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5 text-left hover:bg-white/[0.05]"
                >
                  <StatusDot variant={agent.status} />
                  <div className="flex-1">
                    <div className="font-mono text-[11px] font-medium text-foreground">
                      {agent.callsign}
                    </div>
                    <div className="font-mono text-[9px] text-muted-foreground">
                      {agent.classLabel} · LVL {agent.level}
                    </div>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Room-type specific content */}
        {room.typeKey === "financial-center" && <FinancialContent />}
        {room.typeKey === "bridge" && <BridgeContent />}
        {room.typeKey === "memory-vault" && <MemoryVaultContent />}
      </div>
    </aside>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-white/5 px-3 py-2 last:border-r-0">
      <div className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>
      <div className="mt-1 font-mono text-[13px] font-semibold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}

function FinancialContent() {
  return (
    <div className="space-y-3 px-4 py-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        Token Spend (24h)
      </div>
      <div className="space-y-1.5">
        {[
          { label: "Claude Sonnet", value: 142000, color: "#b84aff" },
          { label: "Claude Opus", value: 38000, color: "#ff7a3a" },
          { label: "Embeddings", value: 12400, color: "#3affcc" },
          { label: "Gemini", value: 24800, color: "#4aa8ff" },
        ].map((row) => {
          const max = 142000;
          const pct = (row.value / max) * 100;
          return (
            <div key={row.label}>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-foreground">{row.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {row.value.toLocaleString()}
                </span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-white/5">
                <div
                  className="h-1 rounded-full"
                  style={{ width: `${pct}%`, background: row.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-sm border border-warning/30 bg-warning/5 px-2 py-1.5">
        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-warning">
          Budget Alert
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-foreground">
          73% of monthly budget used. 8 days left in period.
        </div>
      </div>
    </div>
  );
}

function BridgeContent() {
  return (
    <div className="space-y-3 px-4 py-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        Global Overview
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Uptime", value: "99.7%", tone: "#3affcc" },
          { label: "Avg Latency", value: "1.2s", tone: "#4aa8ff" },
          { label: "Success Rate", value: "94%", tone: "#3affcc" },
          { label: "Queue Depth", value: "3", tone: "#ffcc3a" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-sm border border-white/5 bg-white/[0.02] px-2 py-2"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {m.label}
            </div>
            <div
              className="mt-0.5 font-mono text-[14px] font-semibold tabular-nums"
              style={{ color: m.tone }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryVaultContent() {
  return (
    <div className="space-y-3 px-4 py-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        Memory Banks
      </div>
      <div className="space-y-1.5">
        {[
          { label: "Project Context", usage: 78, size: "2.4M tok" },
          { label: "Codebase Index", usage: 92, size: "4.1M tok" },
          { label: "Conversation History", usage: 45, size: "820K tok" },
          { label: "Research Notes", usage: 61, size: "1.8M tok" },
        ].map((bank) => (
          <div
            key={bank.label}
            className="rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5"
          >
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-foreground">{bank.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {bank.size}
              </span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-white/5">
              <div
                className="h-1 rounded-full bg-info"
                style={{ width: `${bank.usage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
