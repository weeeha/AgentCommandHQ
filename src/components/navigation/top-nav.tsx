"use client";

import { useState, useEffect } from "react";
import { Shield, Activity } from "lucide-react";
import { NavTabs } from "./nav-tabs";
import { AgentSwitcher } from "./agent-switcher";
import { useCockpitStore } from "@/store/use-cockpit";

export function TopNav() {
  const [time, setTime] = useState("");
  const resources = useCockpitStore((s) => s.resources);

  const credits = resources.find((r) => r.key === "credits");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between gap-4 px-5 h-14 border-b-[0.5px] border-border bg-background/95 backdrop-blur-sm"
      aria-label="Top navigation"
    >
      {/* Left: brand + system status */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-primary shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="whitespace-nowrap">
            <div className="font-mono text-[13px] font-medium tracking-[0.08em] text-foreground leading-none">
              Agent RPG
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.10em] text-muted-foreground mt-0.5 leading-none">
              Command HQ
            </div>
          </div>
        </div>

        <span aria-hidden className="hidden xl:block h-6 w-[0.5px] bg-border mx-1" />

        {/* System status */}
        <div className="hidden xl:flex items-center gap-2 whitespace-nowrap">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="flex items-center gap-1.5">
            <span className="w-[6px] h-[6px] rounded-full bg-success" />
            <span className="font-mono text-[10px] uppercase tracking-[0.10em] text-muted-foreground">
              nominal
            </span>
          </div>
        </div>
      </div>

      {/* Center: page tabs */}
      <div className="flex-1 flex justify-center min-w-0">
        <NavTabs />
      </div>

      {/* Right: resources + agent switcher + clock */}
      <div className="flex items-center gap-3 shrink-0">
        {credits && (
          <div className="hidden xl:flex items-center gap-1.5 font-mono text-[11px] whitespace-nowrap">
            <span className="text-muted-foreground uppercase tracking-[0.08em] text-[10px]">
              CR
            </span>
            <span className="font-medium text-foreground tabular-nums">
              {credits.value.toLocaleString()}
            </span>
          </div>
        )}

        <AgentSwitcher />

        <time
          className="hidden 2xl:block font-mono text-[11px] tracking-[0.04em] text-muted-foreground tabular-nums whitespace-nowrap"
          suppressHydrationWarning
        >
          {time}
        </time>
      </div>
    </header>
  );
}
