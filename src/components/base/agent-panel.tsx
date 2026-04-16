"use client";

import { useBaseStore } from "@/store/use-base";
import { useCockpitStore } from "@/store/use-cockpit";
import { StatusDot } from "@/components/primitives/status-dot";
import { StatBar } from "@/components/primitives/stat-bar";
import { XPTrack } from "@/components/primitives/xp-track";
import { Pill } from "@/components/primitives/pill";
import { X, Briefcase, BookOpen, Wrench, Cpu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const classColors: Record<string, string> = {
  architect: "#b84aff",
  analyst: "#4aa8ff",
  scribe: "#c04aff",
  engineer: "#ff8a3a",
  scout: "#3affcc",
  reviewer: "#ffcc3a",
};

export function AgentPanel() {
  const selectedEntity = useBaseStore((s) => s.selectedEntity);
  const closePanel = useBaseStore((s) => s.closePanel);
  const agents = useCockpitStore((s) => s.agents);
  const positions = useBaseStore((s) => s.agentPositions);

  if (!selectedEntity || selectedEntity.type !== "agent") return null;

  const agent = agents.find((a) => a.id === selectedEntity.id);
  if (!agent) return null;

  const pos = positions.find((p) => p.agentId === agent.id);
  const accent = classColors[agent.classKey] ?? "#b84aff";
  const spritePath = `/sprites/agents/${agent.id.replace(/^agent-/, "")}.png`;

  return (
    <aside className="absolute bottom-0 right-0 top-0 z-20 flex w-[380px] flex-col border-l border-primary/30 bg-black/92 shadow-[0_0_30px_rgba(184,74,255,0.15)] backdrop-blur-md">
      {/* Header */}
      <div
        className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3"
        style={{ borderTop: `2px solid ${accent}` }}
      >
        <div className="flex items-start gap-3">
          <AgentPortrait spritePath={spritePath} accent={accent} callsign={agent.callsign} />
          <div>
            <div className="flex items-center gap-1.5">
              <StatusDot variant={agent.status} />
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {agent.status}
              </span>
            </div>
            <div className="mt-0.5 font-mono text-[16px] font-bold leading-none tracking-wider text-foreground">
              {agent.callsign}
            </div>
            {agent.title && (
              <div className="mt-1 font-serif text-[11px] italic text-muted-foreground">
                &ldquo;{agent.title}&rdquo;
              </div>
            )}
            <div className="mt-1.5 flex items-center gap-2">
              <Pill className="text-[9px]" style={{ color: accent, borderColor: `${accent}55` }}>
                {agent.classLabel}
              </Pill>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                LVL {agent.level}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={closePanel}
          className="rounded-sm p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto">
        {/* XP Track */}
        <div className="border-b border-white/5 px-4 py-3">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Experience
            </span>
            <span className="font-mono text-[10px] tabular-nums text-foreground">
              {agent.xp.toLocaleString()} / {agent.xpToNext.toLocaleString()}
            </span>
          </div>
          <XPTrack value={agent.xp} max={agent.xpToNext} height={3} />
          <div className="mt-1 font-mono text-[9px] text-muted-foreground">
            Next perk @ lvl {agent.nextPerk.unlocksAtLevel}: {agent.nextPerk.name}
          </div>
        </div>

        {/* Current status */}
        {pos?.currentTask && (
          <div className="border-b border-white/5 bg-primary/5 px-4 py-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
              Currently
            </div>
            <div className="mt-1 font-mono text-[12px] text-foreground">
              {pos.currentTask}
            </div>
          </div>
        )}

        {/* Stats */}
        <Section icon={<Cpu className="size-3.5" />} title="Stats">
          <div className="space-y-2">
            {agent.stats.map((stat) => (
              <StatBar key={stat.key} label={stat.label} value={stat.value} />
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section icon={<Briefcase className="size-3.5" />} title="Skills">
          <SlotList items={agent.skills.slice(0, 6)} emptyText="No skills equipped." />
        </Section>

        {/* Memory */}
        <Section icon={<BookOpen className="size-3.5" />} title="Memory">
          <SlotList items={agent.memories.slice(0, 4)} emptyText="No memory banks." />
        </Section>

        {/* Connectors */}
        <Section icon={<Wrench className="size-3.5" />} title="Connectors">
          <SlotList items={agent.connectors.slice(0, 6)} emptyText="No connectors." />
        </Section>

        {/* Reputation */}
        {agent.reputation && (
          <Section icon={<Cpu className="size-3.5" />} title="Reputation">
            <div className="grid grid-cols-2 gap-2">
              <RepStat label="Trust" value={agent.reputation.trustLevel} />
              <RepStat
                label="Success"
                value={`${agent.reputation.missionSuccessRate}%`}
              />
              <RepStat
                label="Quality"
                value={`${agent.reputation.qualityScore}`}
              />
              <RepStat
                label="Missions"
                value={`${agent.reputation.totalMissions}`}
              />
            </div>
          </Section>
        )}
      </div>
    </aside>
  );
}

function AgentPortrait({
  spritePath,
  accent,
  callsign,
}: {
  spritePath: string;
  accent: string;
  callsign: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative size-14 shrink-0 overflow-hidden rounded-sm border"
      style={{
        borderColor: `${accent}66`,
        background:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 4px)",
        imageRendering: "pixelated",
      }}
    >
      {!failed ? (
        <Image
          src={spritePath}
          alt={callsign}
          width={56}
          height={56}
          className="size-full object-contain"
          style={{ imageRendering: "pixelated" }}
          onError={() => setFailed(true)}
          unoptimized
        />
      ) : (
        <div
          className="flex size-full items-center justify-center font-mono text-[22px] font-bold"
          style={{ color: accent }}
        >
          {callsign[0]}
        </div>
      )}
      {/* Scanline effect */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/5 px-4 py-3">
      <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-[0.14em]">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function SlotList({
  items,
  emptyText,
}: {
  items: Array<{ id: string; name: string; description?: string; tier?: string }>;
  emptyText: string;
}) {
  if (!items.length) {
    return (
      <div className="font-mono text-[10px] italic text-muted-foreground/60">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-2 rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5"
        >
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[11px] font-medium text-foreground">
              {item.name}
            </div>
            {item.description && (
              <div className="truncate font-mono text-[9px] text-muted-foreground">
                {item.description}
              </div>
            )}
          </div>
          {item.tier && (
            <span
              className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] ${
                item.tier === "legendary"
                  ? "text-warning"
                  : item.tier === "epic"
                    ? "text-primary"
                    : item.tier === "rare"
                      ? "text-info"
                      : "text-muted-foreground"
              }`}
            >
              {item.tier}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function RepStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-white/5 bg-white/[0.02] px-2 py-1.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-[12px] font-semibold tabular-nums capitalize text-foreground">
        {value}
      </div>
    </div>
  );
}
