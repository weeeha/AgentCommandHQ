"use client";

import {
  Cpu,
  Search,
  PenTool,
  Wrench,
  Compass,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Agent, AgentClassKey, AgentStatus } from "@/types";

const classIcons: Record<AgentClassKey, React.ElementType> = {
  architect: Cpu,
  analyst: Search,
  scribe: PenTool,
  engineer: Wrench,
  scout: Compass,
  reviewer: Eye,
};

const statusColors: Record<AgentStatus, string> = {
  ready: "bg-success",
  deployed: "bg-warning",
  critical: "bg-destructive",
  cooldown: "bg-info",
};

const statusLabels: Record<AgentStatus, string> = {
  ready: "ready",
  deployed: "deployed",
  critical: "critical",
  cooldown: "cooldown",
};

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const Icon = classIcons[agent.classKey];
  const xpPercent = agent.xpToNext > 0 ? (agent.xp / agent.xpToNext) * 100 : 0;

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "w-[180px] shrink-0 px-3.5 py-3 cursor-pointer border-[0.5px] transition-colors duration-150",
        "hover:border-muted-foreground/30",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card"
      )}
    >
      {/* Header: icon + callsign */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            "w-[26px] h-[26px] rounded-md flex items-center justify-center",
            isSelected ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[12px] font-medium tracking-[0.08em] text-foreground truncate">
            {agent.callsign}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground truncate">
            {agent.classLabel}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 mb-2">
        <div
          className={cn(
            "w-[7px] h-[7px] rounded-full",
            statusColors[agent.status],
            agent.status === "critical" && "animate-pulse-dot"
          )}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          {statusLabels[agent.status]}
          {agent.statusDetail && (
            <span className="text-muted-foreground/60"> &middot; {agent.statusDetail}</span>
          )}
        </span>
      </div>

      {/* Level + XP */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[11px] font-medium tracking-[0.04em] text-foreground">
          LVL {agent.level}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {Math.round(xpPercent)}%
        </span>
      </div>
      <div className="h-[2px] rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-400 ease-out"
          style={{ width: `${xpPercent}%` }}
          role="progressbar"
          aria-valuenow={agent.xp}
          aria-valuemin={0}
          aria-valuemax={agent.xpToNext}
          aria-label={`XP progress: ${agent.xp} of ${agent.xpToNext}`}
        />
      </div>

      {/* Mini stat bars */}
      <div className="mt-2.5 space-y-1">
        {agent.stats.slice(0, 4).map((stat) => (
          <div key={stat.key} className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground/70 w-[28px] truncate">
              {stat.label.slice(0, 3)}
            </span>
            <div className="flex-1 h-[2px] rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/40"
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
