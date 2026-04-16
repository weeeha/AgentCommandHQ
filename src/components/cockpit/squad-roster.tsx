"use client";

import { useCockpitStore } from "@/store/use-cockpit";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AgentCard } from "./agent-card";

export function SquadRoster() {
  const agents = useCockpitStore((s) => s.agents);
  const selectedAgentId = useCockpitStore((s) => s.selectedAgentId);
  const selectAgent = useCockpitStore((s) => s.selectAgent);

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground">
          Squad roster
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          {agents.length} agents
        </div>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-3">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentId === agent.id}
              onSelect={() =>
                selectAgent(selectedAgentId === agent.id ? null : agent.id)
              }
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
