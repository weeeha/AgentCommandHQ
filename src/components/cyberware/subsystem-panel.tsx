"use client";

import { SlotCard } from "@/components/dossier/slot-card";
import { SUBSYSTEM_DEFS } from "@/data/mock-cyberware";
import type { AgentSubsystem, SubsystemKey } from "@/types";

interface SubsystemPanelProps {
  subsystems: AgentSubsystem[];
  activeKey: SubsystemKey | null;
}

export function SubsystemPanel({ subsystems, activeKey }: SubsystemPanelProps) {
  const activeSub = activeKey
    ? subsystems.find((s) => s.key === activeKey)
    : null;
  const activeDef = activeKey
    ? SUBSYSTEM_DEFS.find((d) => d.key === activeKey)
    : null;

  if (!activeSub || !activeDef) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.10em] text-muted-foreground/30">
            Select a subsystem
          </div>
          <div className="font-mono text-[10px] text-muted-foreground/20 mt-1">
            Click a region on the ghost figure
          </div>
        </div>
      </div>
    );
  }

  const emptySlots = Math.max(0, activeSub.capacity - activeSub.items.length);

  return (
    <div className="space-y-4">
      {/* Subsystem header */}
      <div>
        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-accent mb-1">
          {activeDef.label}
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          {activeDef.description}
        </div>
        <div className="font-mono text-[10px] text-muted-foreground/40 mt-1">
          {activeSub.items.length} / {activeSub.capacity} slots filled
        </div>
      </div>

      {/* Slot cards */}
      <div className="space-y-2">
        {activeSub.items.map((item) => (
          <SlotCard key={item.id} item={item} />
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <SlotCard key={`empty-${i}`} />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact overview showing all subsystems at once (used when no subsystem is selected).
 */
export function SubsystemOverview({
  subsystems,
  activeKey,
  onSelect,
}: {
  subsystems: AgentSubsystem[];
  activeKey: SubsystemKey | null;
  onSelect: (key: SubsystemKey) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground">
        Subsystems
      </div>
      {subsystems.map((sub) => {
        const def = SUBSYSTEM_DEFS.find((d) => d.key === sub.key);
        if (!def) return null;
        const isActive = activeKey === sub.key;

        return (
          <button
            key={sub.key}
            onClick={() => onSelect(sub.key)}
            className={`w-full text-left rounded-lg border-[0.5px] px-3 py-2 transition-colors duration-150 cursor-pointer ${
              isActive
                ? "border-primary/50 bg-primary/5"
                : "border-border/50 bg-secondary/30 hover:bg-secondary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium text-foreground">
                {def.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/50">
                {sub.items.length}/{sub.capacity}
              </span>
            </div>
            <div className="mt-0.5 flex gap-1">
              {Array.from({ length: sub.capacity }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] flex-1 rounded-full ${
                    i < sub.items.length
                      ? "bg-accent/60"
                      : "bg-muted-foreground/10"
                  }`}
                />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
