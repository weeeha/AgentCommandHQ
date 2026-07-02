"use client";

import { useCockpitStore } from "@/store/use-cockpit";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MissionRow } from "./mission-row";

export function MissionBoard() {
  const missions = useCockpitStore((s) => s.missions);

  return (
    <Card className="border-[0.5px] bg-card">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground">
          Mission board
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {missions.length} available
        </span>
      </div>
      <ScrollArea className="max-h-[320px]">
        <div className="px-4 pb-3">
          {missions.length === 0 ? (
            <div className="py-8 text-center font-mono text-[12px] text-muted-foreground/60">
              No missions available
            </div>
          ) : (
            missions.map((mission) => (
              <MissionRow key={mission.id} mission={mission} />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
