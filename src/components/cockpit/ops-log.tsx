"use client";

import { useCockpitStore } from "@/store/use-cockpit";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogEventRow } from "./log-event-row";

export function OpsLog() {
  const log = useCockpitStore((s) => s.log);

  return (
    <Card className="border-[0.5px] bg-card">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground">
          Ops log
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {log.length} events
        </span>
      </div>
      <ScrollArea className="max-h-[200px]">
        <div className="px-4 pb-3" aria-live="polite">
          {log.length === 0 ? (
            <div className="py-6 text-center font-mono text-[12px] text-muted-foreground/60">
              No events recorded
            </div>
          ) : (
            log.map((event) => <LogEventRow key={event.id} event={event} />)
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
