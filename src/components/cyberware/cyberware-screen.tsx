"use client";

import { useEffect, useMemo } from "react";
import { useCockpitStore } from "@/store/use-cockpit";
import { mockReputations } from "@/data/mock-cyberware";
import { buildSubsystems } from "./utils";
import { CyberwareHeader } from "./cyberware-header";
import { AgentTabs } from "./agent-tabs";
import { ReputationPanel } from "./reputation-panel";
import { GhostFigure } from "./ghost-figure";
import { SubsystemPanel, SubsystemOverview } from "./subsystem-panel";
import type { SubsystemKey } from "@/types";

interface CyberwareScreenProps {
  agentId?: string;
}

export function CyberwareScreen({ agentId }: CyberwareScreenProps) {
  const agents = useCockpitStore((s) => s.agents);
  const selectedAgentId = useCockpitStore((s) => s.selectedAgentId);
  const selectAgent = useCockpitStore((s) => s.selectAgent);
  const activeSubsystem = useCockpitStore((s) => s.activeSubsystem);
  const selectSubsystem = useCockpitStore((s) => s.selectSubsystem);

  // Resolve agent: URL param > store selection > first agent
  const resolvedId = agentId ?? selectedAgentId ?? agents[0]?.id;
  const agent = agents.find((a) => a.id === resolvedId);

  // Sync store selection if needed
  useEffect(() => {
    if (resolvedId && resolvedId !== selectedAgentId) {
      selectAgent(resolvedId);
    }
  }, [resolvedId, selectedAgentId, selectAgent]);

  const reputation = agent
    ? agent.reputation ?? mockReputations[agent.id]
    : undefined;

  const subsystems = useMemo(
    () => (agent ? buildSubsystems(agent) : []),
    [agent]
  );

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-mono text-[13px] text-muted-foreground">
          No agent selected
        </div>
      </div>
    );
  }

  const handleRegionClick = (key: SubsystemKey) => {
    selectSubsystem(activeSubsystem === key ? null : key);
  };

  const handleRegionHover = (_key: SubsystemKey | null) => {
    // Hover feedback is handled in the SVG via CSS; no store update needed
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CyberwareHeader agent={agent} reputation={reputation} />
      <AgentTabs
        agents={agents}
        activeAgentId={resolvedId}
        onSelect={selectAgent}
      />

      <div className="flex-1 px-5 py-5">
        {/* Desktop: 3-column grid */}
        <div className="grid grid-cols-[240px_1fr_280px] gap-6 max-lg:grid-cols-1 max-lg:gap-4 h-full">
          {/* Left: Stats + Reputation */}
          <div className="max-lg:order-1">
            <ReputationPanel agent={agent} reputation={reputation} />
          </div>

          {/* Center: Ghost figure */}
          <div className="flex flex-col items-center justify-start max-lg:order-3">
            <div className="w-full max-w-[340px]">
              <GhostFigure
                activeRegion={activeSubsystem}
                onRegionClick={handleRegionClick}
                onRegionHover={handleRegionHover}
              />
            </div>
          </div>

          {/* Right: Subsystem detail or overview */}
          <div className="max-lg:order-2">
            {activeSubsystem ? (
              <SubsystemPanel
                subsystems={subsystems}
                activeKey={activeSubsystem}
              />
            ) : (
              <SubsystemOverview
                subsystems={subsystems}
                activeKey={activeSubsystem}
                onSelect={handleRegionClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
