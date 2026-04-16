"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Cpu,
  Search,
  PenTool,
  Wrench,
  Compass,
  Eye,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCockpitStore } from "@/store/use-cockpit";
import type { AgentClassKey, AgentStatus } from "@/types";

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

export function AgentSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const agents = useCockpitStore((s) => s.agents);
  const selectedAgentId = useCockpitStore((s) => s.selectedAgentId);
  const selectAgent = useCockpitStore((s) => s.selectAgent);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) ?? agents[0];

  if (!activeAgent) return null;

  const ActiveIcon = classIcons[activeAgent.classKey];

  const handleSelect = (agentId: string) => {
    selectAgent(agentId);
    // If on cyberware page, update URL param
    if (pathname.startsWith("/cyberware")) {
      router.push(`/cyberware?agent=${agentId}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md border-[0.5px] border-border",
          "bg-card hover:bg-secondary/60 hover:border-muted-foreground/40 transition-colors duration-150",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        )}
        aria-label={`Active agent: ${activeAgent.callsign}. Click to switch.`}
      >
        <div className="w-[22px] h-[22px] rounded bg-secondary flex items-center justify-center shrink-0">
          <ActiveIcon className="w-3 h-3 text-primary" />
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-[6px] h-[6px] rounded-full",
              statusColors[activeAgent.status],
              activeAgent.status === "critical" && "animate-pulse-dot"
            )}
          />
          <div className="text-left">
            <div className="font-mono text-[11px] font-medium tracking-[0.08em] text-foreground leading-none">
              {activeAgent.callsign}
            </div>
            <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.06em] mt-0.5 leading-none">
              LVL {activeAgent.level} &middot; {activeAgent.classLabel}
            </div>
          </div>
        </div>
        <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 ml-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px] p-1">
        <DropdownMenuLabel className="font-mono text-[10px] font-medium uppercase tracking-[0.10em] text-muted-foreground py-1.5">
          Squad &middot; {agents.length} agents
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {agents.map((agent) => {
          const Icon = classIcons[agent.classKey];
          const isActive = agent.id === activeAgent.id;
          return (
            <DropdownMenuItem
              key={agent.id}
              onSelect={() => handleSelect(agent.id)}
              className={cn(
                "flex items-center gap-2 py-2 cursor-pointer rounded-md",
                isActive && "bg-primary/10"
              )}
            >
              <div className="w-[22px] h-[22px] rounded bg-secondary flex items-center justify-center shrink-0">
                <Icon className={cn("w-3 h-3", isActive ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-[6px] h-[6px] rounded-full shrink-0",
                      statusColors[agent.status],
                      agent.status === "critical" && "animate-pulse-dot"
                    )}
                  />
                  <span className="font-mono text-[12px] font-medium tracking-[0.06em] text-foreground">
                    {agent.callsign}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">
                  LVL {agent.level} &middot; {agent.classLabel} &middot; {agent.status}
                </div>
              </div>
              {isActive && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
