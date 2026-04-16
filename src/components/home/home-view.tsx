"use client";

import { mockFeed } from "@/data";
import { useCockpitStore } from "@/store/use-cockpit";
import { FeedItemRow } from "./feed-item-row";
import { AgentPortrait } from "./agent-portrait";
import { StatusDot } from "@/components/primitives/status-dot";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AgentStatus } from "@/types";

export function HomeView() {
  const agents = useCockpitStore((s) => s.agents);
  const activeOps = useCockpitStore((s) => s.activeOps);

  const ready = agents.filter((a) => a.status === "ready").length;
  const deployed = agents.filter((a) => a.status === "deployed").length;
  const cooling = agents.filter((a) => a.status === "cooldown").length;
  const critical = agents.filter((a) => a.status === "critical").length;

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[1fr_320px]">
      {/* Main column — feed */}
      <div>
        <header className="mb-4 flex items-baseline justify-between">
          <div>
            <h1 className="font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Activity
            </h1>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/60">
              Everything your squad has been up to
            </p>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            LIVE
          </div>
        </header>

        <div className="rounded-md border-[0.5px] border-border/60 bg-card/50 px-5 py-2">
          {mockFeed.map((item) => (
            <FeedItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Right rail */}
      <aside className="space-y-4">
        {/* Squad snapshot */}
        <section className="rounded-md border-[0.5px] border-border/60 bg-card/50 p-4">
          <h2 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Squad
          </h2>
          <ul className="grid grid-cols-4 gap-2">
            {agents.map((agent) => (
              <li
                key={agent.id}
                className="flex flex-col items-center gap-1"
                title={`${agent.callsign} · ${agent.status}`}
              >
                <div className="relative">
                  <AgentPortrait callsign={agent.callsign} size={56} />
                  <StatusDot
                    variant={agent.status as AgentStatus}
                    className="absolute right-0.5 top-0.5 ring-1 ring-card/80"
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {agent.callsign}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-border/30 pt-2 font-mono text-[10px] text-muted-foreground">
            <span>
              <span className="text-foreground tabular-nums">{ready}</span>/
              {agents.length} ready
            </span>
            <span>
              <span className="text-foreground tabular-nums">{deployed}</span>{" "}
              deployed
            </span>
            <span>
              <span className="text-foreground tabular-nums">{cooling}</span>{" "}
              cooling
            </span>
            {critical > 0 && (
              <span className="text-destructive">
                <span className="tabular-nums">{critical}</span> critical
              </span>
            )}
          </div>
          <Link
            href="/cockpit"
            className="mt-3 flex items-center justify-between rounded-sm border-[0.5px] border-border/40 bg-secondary/40 px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-foreground hover:bg-secondary"
          >
            View Cockpit
            <ArrowRight className="size-3" />
          </Link>
        </section>

        {/* Active ops */}
        <section className="rounded-md border-[0.5px] border-border/60 bg-card/50 p-4">
          <h2 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Active ops
          </h2>
          {activeOps.length === 0 ? (
            <p className="font-mono text-[11px] italic text-muted-foreground/60">
              No active operations
            </p>
          ) : (
            <ul className="space-y-2">
              {activeOps.slice(0, 4).map((op) => (
                <li
                  key={op.id}
                  className="rounded-sm border-[0.5px] border-border/40 bg-background/50 p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[11px] font-medium text-foreground">
                      {op.title}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
                      {op.progress}%
                    </span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-muted">
                    <div
                      className="h-1 rounded-full bg-primary"
                      style={{ width: `${op.progress}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/tasks"
            className="mt-3 flex items-center justify-between rounded-sm border-[0.5px] border-border/40 bg-secondary/40 px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-foreground hover:bg-secondary"
          >
            View Tasks
            <ArrowRight className="size-3" />
          </Link>
        </section>

        {/* Quick links */}
        <section className="rounded-md border-[0.5px] border-border/60 bg-card/50 p-4">
          <h2 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Shortcuts
          </h2>
          <nav className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <Link
              href="/chat"
              className="rounded-sm border-[0.5px] border-border/40 bg-background/50 px-2 py-2 text-center hover:border-primary/40 hover:bg-primary/5"
            >
              Open chat
            </Link>
            <Link
              href="/base"
              className="rounded-sm border-[0.5px] border-border/40 bg-background/50 px-2 py-2 text-center hover:border-primary/40 hover:bg-primary/5"
            >
              Ship base
            </Link>
            <Link
              href="/cyberware"
              className="rounded-sm border-[0.5px] border-border/40 bg-background/50 px-2 py-2 text-center hover:border-primary/40 hover:bg-primary/5"
            >
              Cyberware
            </Link>
            <Link
              href="/cockpit"
              className="rounded-sm border-[0.5px] border-border/40 bg-background/50 px-2 py-2 text-center hover:border-primary/40 hover:bg-primary/5"
            >
              Cockpit
            </Link>
          </nav>
        </section>
      </aside>
    </div>
  );
}

