import { StatBar } from "@/components/primitives/stat-bar";
import { TrustBadge } from "./trust-badge";
import { XPTrack } from "@/components/primitives/xp-track";
import type { Agent, AgentReputation } from "@/types";

interface ReputationPanelProps {
  agent: Agent;
  reputation: AgentReputation | undefined;
}

export function ReputationPanel({ agent, reputation }: ReputationPanelProps) {
  const xpPercent = agent.xpToNext > 0 ? (agent.xp / agent.xpToNext) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Agent identity */}
      <div>
        <div className="font-mono text-[22px] font-medium tracking-[0.06em] text-foreground">
          {agent.callsign}
        </div>
        {agent.title && (
          <div className="font-serif italic text-[14px] text-muted-foreground mt-0.5">
            {agent.title}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono text-[11px] text-muted-foreground bg-secondary rounded-full px-2.5 py-0.5">
            Level {agent.level}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground bg-secondary rounded-full px-2.5 py-0.5">
            {agent.classLabel}
          </span>
        </div>
      </div>

      {/* XP bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.10em] text-muted-foreground">
            XP
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {agent.xp.toLocaleString()} / {agent.xpToNext.toLocaleString()}
          </span>
        </div>
        <XPTrack value={xpPercent} max={100} height={3} />
      </div>

      {/* Core stats */}
      <div>
        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-2">
          Core stats
        </div>
        <div className="space-y-1">
          {agent.stats.map((stat) => (
            <StatBar key={stat.key} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>

      {/* Reputation */}
      {reputation && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground">
              Reputation
            </span>
            <TrustBadge level={reputation.trustLevel} />
          </div>
          <div className="space-y-1">
            <StatBar label="Success" value={reputation.missionSuccessRate} />
            <StatBar label="Quality" value={reputation.qualityScore} />
            <StatBar label="Autonomy" value={100 - reputation.escalationRate} />
          </div>
          <div className="mt-2 font-mono text-[10px] text-muted-foreground/50">
            {reputation.totalMissions} total missions
          </div>
        </div>
      )}
    </div>
  );
}
