"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCockpitStore } from "@/store/use-cockpit";

interface RoomAgentsProps {
  agentIds: string[];
  max?: number;
}

export function RoomAgents({ agentIds, max = 3 }: RoomAgentsProps) {
  const agents = useCockpitStore((s) => s.agents);
  const visible = agentIds.slice(0, max);
  const overflow = agentIds.length - max;

  if (agentIds.length === 0) return null;

  return (
    <div className="flex -space-x-1.5">
      {visible.map((id) => {
        const agent = agents.find((a) => a.id === id);
        const initials = agent
          ? agent.callsign.slice(0, 2).toUpperCase()
          : "??";
        return (
          <Avatar key={id} size="sm" className="size-4">
            <AvatarFallback className="text-[7px] font-mono font-medium bg-secondary text-secondary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        );
      })}
      {overflow > 0 && (
        <span className="flex items-center justify-center size-5 rounded-full bg-muted text-[8px] font-mono text-muted-foreground border border-border">
          +{overflow}
        </span>
      )}
    </div>
  );
}
