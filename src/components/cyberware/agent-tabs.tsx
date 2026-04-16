"use client";

import { cn } from "@/lib/utils";
import type { Agent, AgentStatus } from "@/types";

const statusColors: Record<AgentStatus, string> = {
  ready: "bg-success",
  deployed: "bg-warning",
  critical: "bg-destructive",
  cooldown: "bg-info",
};

interface AgentTabsProps {
  agents: Agent[];
  activeAgentId: string | undefined;
  onSelect: (id: string) => void;
}

export function AgentTabs({ agents, activeAgentId, onSelect }: AgentTabsProps) {
  return (
    <div className="border-b-[0.5px] border-border">
      <div
        className="flex items-stretch overflow-x-auto scrollbar-none"
        role="tablist"
      >
        {agents.map((agent) => {
          const isActive = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(agent.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 shrink-0 cursor-pointer",
                "font-mono text-[11px] tracking-[0.08em] uppercase",
                "transition-colors duration-150 border-r-[0.5px] border-border/50",
                isActive
                  ? "text-foreground bg-secondary/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
              )}
            >
              {/* Status dot */}
              <span
                className={cn(
                  "w-[6px] h-[6px] rounded-full shrink-0",
                  statusColors[agent.status],
                  agent.status === "critical" && "animate-pulse-dot"
                )}
              />

              {/* Callsign */}
              <span className="font-medium">{agent.callsign}</span>

              {/* Level */}
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  isActive ? "text-muted-foreground" : "text-muted-foreground/50"
                )}
              >
                L{agent.level}
              </span>

              {/* Active underline indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
