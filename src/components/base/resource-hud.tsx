"use client";

import { useBaseStore } from "@/store/use-base";
import { useCockpitStore } from "@/store/use-cockpit";
import {
  Coins,
  Zap,
  Users,
  Target,
  Pause,
  Play,
  FastForward,
} from "lucide-react";

function ResourceChip({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-sm border border-white/10 bg-black/60 px-3 py-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.5)] backdrop-blur-sm"
      style={{ borderLeft: `2px solid ${accent}` }}
    >
      <span className="text-[13px]" style={{ color: accent }}>
        {icon}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-[13px] font-semibold tabular-nums text-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}

export function ResourceHUD() {
  const baseResources = useBaseStore((s) => s.baseResources);
  const agents = useCockpitStore((s) => s.agents);
  const activeOps = useCockpitStore((s) => s.activeOps);
  const sim = useBaseStore((s) => s.simulation);
  const toggleRunning = useBaseStore((s) => s.toggleSimRunning);
  const setSpeed = useBaseStore((s) => s.setSimSpeed);

  const readyCount = agents.filter((a) => a.status === "ready").length;
  const deployedCount = agents.filter((a) => a.status === "deployed").length;

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-3 p-3">
      {/* Left cluster — title */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="rounded-sm border border-primary/40 bg-black/75 px-3 py-1.5 backdrop-blur-sm">
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary/80">
            Vanguard-class Corvette
          </div>
          <div className="font-mono text-[11px] font-semibold tracking-wide text-foreground">
            AGENT BASE // SECTOR 7
          </div>
        </div>
      </div>

      {/* Center — resource chips */}
      <div className="pointer-events-auto flex items-center gap-2">
        <ResourceChip
          icon={<Coins className="size-3.5" />}
          label="Credits"
          value={baseResources.credits.toLocaleString()}
          accent="#f5c14b"
        />
        <ResourceChip
          icon={<Zap className="size-3.5" />}
          label="Power"
          value={`${baseResources.power.current}/${baseResources.power.max}`}
          accent="#4af0ff"
        />
        <ResourceChip
          icon={<Users className="size-3.5" />}
          label="Agents"
          value={`${readyCount}/${agents.length}`}
          accent="#b84aff"
        />
        <ResourceChip
          icon={<Target className="size-3.5" />}
          label="Ops"
          value={`${deployedCount} active`}
          accent="#ff7a3a"
        />
      </div>

      {/* Right — sim controls */}
      <div className="pointer-events-auto flex items-center gap-1 rounded-sm border border-white/10 bg-black/60 p-1 backdrop-blur-sm">
        <button
          onClick={toggleRunning}
          className="rounded-sm p-1.5 text-foreground hover:bg-white/10"
          aria-label={sim.running ? "Pause" : "Play"}
        >
          {sim.running ? (
            <Pause className="size-3.5" />
          ) : (
            <Play className="size-3.5" />
          )}
        </button>
        {[1, 2, 4].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s as 1 | 2 | 4)}
            className={`rounded-sm px-2 py-1 font-mono text-[10px] font-semibold tabular-nums ${
              sim.speed === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-white/10"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
