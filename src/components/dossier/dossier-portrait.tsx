"use client";

import {
  Cpu,
  Search,
  PenTool,
  Wrench,
  Compass,
  Eye,
} from "lucide-react";
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

interface DossierPortraitProps {
  agent: Agent;
}

export function DossierPortrait({ agent }: DossierPortraitProps) {
  const Icon = classIcons[agent.classKey];
  const xpPercent = agent.xpToNext > 0 ? (agent.xp / agent.xpToNext) * 100 : 0;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar frame */}
      <div className="w-[120px] h-[120px] rounded-xl bg-secondary border-[0.5px] border-primary/30 flex items-center justify-center mb-3">
        <Icon className="w-12 h-12 text-primary/60" />
      </div>

      {/* Callsign */}
      <div className="font-mono text-[17px] font-medium tracking-[0.06em] text-foreground">
        {agent.callsign}
      </div>

      {/* Title (serif italic — the editorial moment) */}
      {agent.title && (
        <div className="font-serif italic text-[14px] text-muted-foreground mt-0.5">
          {agent.title}
        </div>
      )}

      {/* Level pill */}
      <div className="mt-2 font-mono text-[11px] tracking-[0.04em] bg-secondary rounded-full px-3 py-1 text-muted-foreground">
        Level {agent.level} &middot; {agent.classLabel}
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 mt-2">
        <div
          className={cn(
            "w-[7px] h-[7px] rounded-full",
            statusColors[agent.status],
            agent.status === "critical" && "animate-pulse-dot"
          )}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          {agent.status}
        </span>
      </div>

      {/* XP bar */}
      <div className="w-full max-w-[200px] mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] text-muted-foreground">XP</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {agent.xp.toLocaleString()} / {agent.xpToNext.toLocaleString()}
          </span>
        </div>
        <div className="h-[3px] rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-400 ease-out"
            style={{ width: `${xpPercent}%` }}
            role="progressbar"
            aria-valuenow={agent.xp}
            aria-valuemin={0}
            aria-valuemax={agent.xpToNext}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-[200px] mt-4 space-y-1.5">
        {agent.stats.map((stat) => (
          <div key={stat.key} className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground w-[60px] text-left truncate">
              {stat.label}
            </span>
            <div className="flex-1 h-[3px] rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/50"
                style={{ width: `${stat.value}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-foreground/70 w-[24px] text-right">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
