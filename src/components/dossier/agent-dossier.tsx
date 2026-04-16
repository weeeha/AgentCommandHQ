"use client";

import { useCockpitStore } from "@/store/use-cockpit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { DossierPortrait } from "./dossier-portrait";
import { SlotCategory } from "./slot-category";
import { CapacityMeter } from "./capacity-meter";

export function AgentDossier() {
  const selectedAgentId = useCockpitStore((s) => s.selectedAgentId);
  const agents = useCockpitStore((s) => s.agents);
  const selectAgent = useCockpitStore((s) => s.selectAgent);

  const agent = agents.find((a) => a.id === selectedAgentId);

  if (!agent) return null;

  const totalSlots =
    agent.skills.length +
    agent.connectors.length +
    agent.memories.length +
    agent.cronJobs.length +
    agent.loadout.tools.length;
  const maxSlots = 3 + 4 + 3 + 3 + agent.loadout.tools.length; // rough capacity

  return (
    <Card className="border-[0.5px] bg-card mx-5">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground/50">
            Roster
          </span>
          <span className="text-muted-foreground/30">/</span>
          <span className="font-mono text-[11px] text-foreground font-medium tracking-[0.04em]">
            {agent.callsign}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-[11px] font-mono border-primary/30 text-primary hover:bg-primary/10"
          >
            Deploy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => selectAgent(null)}
            aria-label="Close dossier"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Cyberware-style layout: left slots | center portrait | right slots */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 max-md:grid-cols-1 max-md:gap-4">
          {/* Left column: skills + tools + cron */}
          <div className="flex items-start gap-4">
            {/* Capacity meter */}
            <CapacityMeter
              label="cap"
              used={totalSlots}
              total={maxSlots}
              className="max-md:hidden"
            />
            <div className="flex-1 space-y-5">
              <SlotCategory label="Skills" items={agent.skills} maxSlots={3} />
              <SlotCategory label="Cron jobs" items={agent.cronJobs} maxSlots={3} />
              <LoadoutSection
                label="Toolkit"
                items={agent.loadout.tools}
              />
            </div>
          </div>

          {/* Center: portrait */}
          <div className="flex justify-center">
            <DossierPortrait agent={agent} />
          </div>

          {/* Right column: connectors + memories + perks */}
          <div className="flex items-start gap-4 flex-row-reverse">
            <CapacityMeter
              label="mem"
              used={agent.memories.length}
              total={3}
              className="max-md:hidden"
            />
            <div className="flex-1 space-y-5">
              <SlotCategory label="Connectors" items={agent.connectors} maxSlots={4} />
              <SlotCategory label="Memories" items={agent.memories} maxSlots={3} />
              {agent.nextPerk && (
                <div>
                  <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-2">
                    Next unlock &middot; level {agent.nextPerk.unlocksAtLevel}
                  </div>
                  <div className="rounded-lg border-[0.5px] border-border bg-secondary/30 px-3 py-2">
                    <div className="text-[13px] font-medium text-foreground">
                      {agent.nextPerk.name}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                      {agent.nextPerk.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doctrine + brief below */}
        <div className="mt-5 pt-4 border-t-[0.5px] border-border/50 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-1">
              Doctrine
            </div>
            <div className="text-[13px] font-medium text-foreground">
              {agent.loadout.doctrine}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-1">
              Brief packet
            </div>
            <div className="text-[13px] font-medium text-foreground">
              {agent.loadout.briefPacket}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function LoadoutSection({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((tool) => (
          <span
            key={tool}
            className="font-mono text-[11px] text-muted-foreground bg-secondary rounded-full px-2.5 py-0.5"
          >
            {tool}
          </span>
        ))}
        {items.length === 0 && (
          <span className="font-mono text-[10px] text-muted-foreground/30">
            no tools equipped
          </span>
        )}
      </div>
    </div>
  );
}
