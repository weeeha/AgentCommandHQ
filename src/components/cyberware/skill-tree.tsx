"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { useCockpitStore } from "@/store/use-cockpit";
import {
  getSpecTree,
  SKILL_CATEGORY_LABELS,
  type SkillCategory,
  type SkillNode,
} from "@/data/mock-spec-trees";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SkillTreeScreenProps {
  agentId?: string;
}

const VIEWBOX = { w: 1000, h: 620, padX: 60, padY: 50 };

export function SkillTreeScreen({ agentId }: SkillTreeScreenProps) {
  const agents = useCockpitStore((s) => s.agents);
  const storeAgentId = useCockpitStore((s) => s.selectedAgentId);
  const resolvedId = agentId ?? storeAgentId ?? agents[0]?.id;
  const agent = agents.find((a) => a.id === resolvedId);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | null>(
    null
  );

  const tree = useMemo(
    () => (agent ? getSpecTree(agent.id, agent.classKey) : null),
    [agent]
  );

  if (!agent || !tree) {
    return (
      <div className="min-h-[calc(100vh-3rem)] bg-background flex items-center justify-center">
        <div className="font-mono text-[13px] text-muted-foreground">
          No agent selected
        </div>
      </div>
    );
  }

  const selectedNode = tree.nodes.find((n) => n.id === selectedNodeId);

  const categories: SkillCategory[] = [
    "analysis",
    "engineering",
    "security",
    "leadership",
    "memory",
  ];

  // Build edges from prereq graph
  const edges = tree.nodes.flatMap((n) =>
    n.prerequisites.map((p) => ({ from: p, to: n.id }))
  );

  const nodeById = new Map(tree.nodes.map((n) => [n.id, n]));

  const mapX = (x: number) =>
    VIEWBOX.padX + x * (VIEWBOX.w - VIEWBOX.padX * 2);
  const mapY = (y: number) =>
    VIEWBOX.padY + y * (VIEWBOX.h - VIEWBOX.padY * 2);

  const categoryMatches = (c: SkillCategory) =>
    !categoryFilter || categoryFilter === c;

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-4 pb-3 border-b-[0.5px] border-border">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/cyberware?agent=${agent.id}`}
            className="inline-flex items-center gap-1 font-mono text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Cyberware
          </Link>
          <span className="font-mono text-[12px] text-muted-foreground/40">/</span>
          <span className="font-mono text-[12px] text-foreground">
            {agent.callsign} / Skill Matrix
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="font-sans text-[22px] font-medium text-foreground">
              {agent.callsign}
            </h1>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              · Skill Matrix
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-accent/40 bg-accent/10 font-mono text-[11px] text-accent">
            <span className="font-medium">{tree.availablePoints}</span>
            <span>skill points available</span>
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[180px_1fr_280px] max-lg:grid-cols-1 gap-0">
        {/* Left rail — categories */}
        <aside className="px-4 py-5 border-r-[0.5px] border-border max-lg:border-r-0 max-lg:border-b-[0.5px]">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-3 px-2">
            Category Filter
          </h2>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => setCategoryFilter(null)}
                className={
                  "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-[0.08em] transition-colors " +
                  (categoryFilter === null
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")
                }
              >
                <span>All</span>
                <span className="font-mono text-[10px]">{tree.nodes.length}</span>
              </button>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() =>
                    setCategoryFilter(categoryFilter === c ? null : c)
                  }
                  className={
                    "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-[0.08em] transition-colors " +
                    (categoryFilter === c
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")
                  }
                >
                  <span>{SKILL_CATEGORY_LABELS[c]}</span>
                  <span className="font-mono text-[10px]">
                    {tree.categoryCounts[c]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center — SVG skill graph */}
        <main className="relative p-4 max-lg:order-3">
          <div className="relative w-full h-full min-h-[520px] rounded-lg border-[0.5px] border-border bg-card overflow-hidden">
            <svg
              viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
              className="w-full h-full"
              role="img"
              aria-label={`${agent.callsign} skill graph`}
            >
              {/* Subtle grid dots */}
              <defs>
                <pattern
                  id="gridDots"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="1"
                    cy="1"
                    r="0.8"
                    fill="oklch(0.40 0.05 275)"
                    opacity="0.35"
                  />
                </pattern>
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              <rect
                width={VIEWBOX.w}
                height={VIEWBOX.h}
                fill="url(#gridDots)"
              />

              {/* Edges */}
              {edges.map(({ from, to }, i) => {
                const a = nodeById.get(from);
                const b = nodeById.get(to);
                if (!a || !b) return null;
                const bothUnlocked =
                  a.state === "unlocked" && b.state === "unlocked";
                const oneUnlocked =
                  a.state === "unlocked" || b.state === "unlocked";
                const dimmed =
                  categoryFilter &&
                  !(
                    categoryMatches(a.category) || categoryMatches(b.category)
                  );

                return (
                  <line
                    key={`edge-${i}`}
                    x1={mapX(a.x)}
                    y1={mapY(a.y)}
                    x2={mapX(b.x)}
                    y2={mapY(b.y)}
                    stroke={
                      bothUnlocked
                        ? "oklch(0.84 0.16 215)" /* cyan */
                        : oneUnlocked
                          ? "oklch(0.84 0.16 215)"
                          : "oklch(0.40 0.05 275)"
                    }
                    strokeWidth={bothUnlocked ? 2 : 1.2}
                    strokeDasharray={bothUnlocked ? undefined : "4 4"}
                    opacity={dimmed ? 0.15 : bothUnlocked ? 0.85 : 0.45}
                  />
                );
              })}

              {/* Nodes */}
              {tree.nodes.map((n) => {
                const cx = mapX(n.x);
                const cy = mapY(n.y);
                const dim =
                  categoryFilter !== null && !categoryMatches(n.category);
                return (
                  <g
                    key={n.id}
                    transform={`translate(${cx} ${cy})`}
                    opacity={dim ? 0.2 : 1}
                    onClick={() => setSelectedNodeId(n.id)}
                    className="cursor-pointer"
                    role="button"
                    aria-label={`${n.name} — ${n.state}`}
                  >
                    {/* Glow halo for unlocked + available */}
                    {n.state !== "locked" && (
                      <circle
                        r={28}
                        fill={
                          n.state === "unlocked"
                            ? "oklch(0.70 0.24 1 / 0.45)"
                            : "oklch(0.84 0.16 215 / 0.35)"
                        }
                        filter="url(#nodeGlow)"
                      />
                    )}
                    <circle
                      r={22}
                      fill={
                        n.state === "unlocked"
                          ? "oklch(0.70 0.24 1)" /* magenta */
                          : n.state === "available"
                            ? "oklch(0.16 0.045 275)"
                            : "oklch(0.18 0.03 275)"
                      }
                      stroke={
                        selectedNodeId === n.id
                          ? "oklch(0.96 0.01 270)"
                          : n.state === "available"
                            ? "oklch(0.84 0.16 215)"
                            : n.state === "unlocked"
                              ? "oklch(0.96 0.01 270 / 0.4)"
                              : "oklch(0.40 0.05 275)"
                      }
                      strokeWidth={selectedNodeId === n.id ? 2.5 : 1.5}
                    />
                    {n.state === "locked" ? (
                      <g transform="translate(-6 -6)">
                        <path
                          d="M3 6h6v5H3z M4 6V4a2 2 0 0 1 4 0v2"
                          fill="none"
                          stroke="oklch(0.55 0.06 265)"
                          strokeWidth={1.2}
                        />
                      </g>
                    ) : (
                      <circle
                        r={6}
                        fill={
                          n.state === "unlocked"
                            ? "oklch(0.98 0 0)"
                            : "oklch(0.84 0.16 215)"
                        }
                      />
                    )}
                    <text
                      y={42}
                      textAnchor="middle"
                      className="fill-foreground"
                      fontFamily="var(--font-mono)"
                      fontSize="10"
                      fontWeight="500"
                      letterSpacing="0.06em"
                    >
                      {n.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </main>

        {/* Right — node detail */}
        <aside className="px-4 py-5 border-l-[0.5px] border-border max-lg:border-l-0 max-lg:border-t-[0.5px] max-lg:order-2">
          {selectedNode ? (
            <NodeDetail node={selectedNode} />
          ) : (
            <Card className="border-[0.5px] bg-card p-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
                Node Details
              </h3>
              <p className="font-sans text-[12.5px] text-muted-foreground/80 leading-relaxed">
                Click a node in the skill graph to inspect it.
              </p>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function NodeDetail({ node }: { node: SkillNode }) {
  const stateLabel =
    node.state === "unlocked"
      ? "Unlocked"
      : node.state === "available"
        ? "Available"
        : "Locked";
  const toneColor =
    node.state === "unlocked"
      ? "bg-primary/15 text-primary border-primary/40"
      : node.state === "available"
        ? "bg-accent/15 text-accent border-accent/40"
        : "bg-muted text-muted-foreground border-border";

  return (
    <Card className="border-[0.5px] bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span
          className={
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-mono text-[10px] uppercase tracking-[0.1em] " +
            toneColor
          }
        >
          {node.state === "locked" && <Lock className="h-2.5 w-2.5" />}
          {stateLabel}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Tier {node.tier}
        </span>
      </div>

      <h3 className="font-sans text-[16px] font-medium text-foreground mb-1.5">
        {node.name}
      </h3>
      <p className="font-sans text-[12.5px] leading-relaxed text-muted-foreground mb-4">
        {node.description}
      </p>

      <div className="flex items-center justify-between py-2 border-t-[0.5px] border-border mb-3">
        <span className="font-mono text-[11px] text-muted-foreground">
          Cost
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[12px] text-foreground">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-accent text-[9px] font-bold">
            {node.cost}
          </span>
          <span className="text-muted-foreground">
            point{node.cost === 1 ? "" : "s"}
          </span>
        </span>
      </div>

      {node.prerequisites.length > 0 && (
        <div className="mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Prerequisite
          </span>
          <div className="mt-1 font-mono text-[11px] text-foreground/80">
            {node.prerequisites.join(", ")}
          </div>
        </div>
      )}

      {node.state === "available" && (
        <Button
          className="w-full h-9 font-mono text-[11px] uppercase tracking-[0.14em] shadow-[0_0_16px_theme(colors.primary/35%)]"
          size="sm"
        >
          Unlock
        </Button>
      )}
      {node.state === "locked" && (
        <Button
          disabled
          className="w-full h-9 font-mono text-[11px] uppercase tracking-[0.14em]"
          size="sm"
          variant="outline"
        >
          Locked
        </Button>
      )}
    </Card>
  );
}
