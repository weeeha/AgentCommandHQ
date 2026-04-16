"use client";

import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustBadge } from "./trust-badge";
import type { Agent, AgentReputation } from "@/types";

interface CyberwareHeaderProps {
  agent: Agent;
  reputation: AgentReputation | undefined;
}

export function CyberwareHeader({ agent, reputation }: CyberwareHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b-[0.5px] border-border">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-mono text-[15px] font-medium tracking-[0.06em] text-foreground">
            {agent.callsign}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/50">
            /
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.10em] text-muted-foreground">
            Cyberware
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {reputation && <TrustBadge level={reputation.trustLevel} />}
        <span className="font-mono text-[11px] text-muted-foreground">
          Level {agent.level} &middot; {agent.classLabel}
        </span>
      </div>
    </header>
  );
}
