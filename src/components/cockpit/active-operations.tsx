"use client";

import { useCockpitStore } from "@/store/use-cockpit";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActiveOpRow } from "./active-op-row";

export function ActiveOperations() {
  const activeOps = useCockpitStore((s) => s.activeOps);
  const agents = useCockpitStore((s) => s.agents);

  const getAgentCallsign = (agentIds: string[]) => {
    if (agentIds.length === 0) return undefined;
    const agent = agents.find((a) => a.id === agentIds[0]);
    return agent?.callsign;
  };

  return (
    <Card className="border-[0.5px] bg-card">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground">
          Active operations
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {activeOps.length}
        </span>
      </div>
      <ScrollArea className="max-h-[320px]">
        <div className="px-4 pb-3">
          {activeOps.length === 0 ? (
            <div className="py-8 text-center font-mono text-[12px] text-muted-foreground/60">
              No active operations
            </div>
          ) : (
            activeOps.map((op) => (
              <ActiveOpRow
                key={op.id}
                op={op}
                agentCallsign={getAgentCallsign(op.assignedAgentIds)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
