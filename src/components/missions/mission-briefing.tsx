"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Check, Lock, Plus } from "lucide-react";
import { mockMissions, mockAgents } from "@/data";
import { mockMissionDetails } from "@/data/mock-mission-details";
import { DifficultyStars } from "@/components/primitives/difficulty-stars";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MissionBriefingProps {
  missionId: string;
}

export function MissionBriefing({ missionId }: MissionBriefingProps) {
  const mission = mockMissions.find((m) => m.id === missionId);
  const detail = mockMissionDetails[missionId];

  if (!mission || !detail) {
    notFound();
  }

  const recommendedAgent = detail.recommendedAgentId
    ? mockAgents.find((a) => a.id === detail.recommendedAgentId)
    : undefined;

  return (
    <div className="px-6 pt-4 pb-10 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/missions"
          className="inline-flex items-center gap-1 font-mono text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Missions
        </Link>
        <span className="font-mono text-[12px] text-muted-foreground/40">/</span>
        <span className="font-mono text-[12px] text-foreground">
          {mission.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Left — briefing card */}
        <Card className="border-[0.5px] bg-card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-sans text-[26px] font-medium leading-tight text-foreground">
              {mission.title}
            </h1>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                Difficulty
              </span>
              <DifficultyStars value={mission.tier} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {detail.tags.map((tag) => (
              <Pill
                key={tag.label}
                tone={
                  tag.tone === "danger"
                    ? "danger"
                    : tag.tone === "info"
                      ? "info"
                      : "default"
                }
              >
                {tag.label}
              </Pill>
            ))}
          </div>

          <p className="font-sans text-[13.5px] leading-relaxed text-muted-foreground mb-8">
            {detail.description}
          </p>

          {/* Objectives */}
          <section className="mb-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Objectives
            </h2>
            <ul className="space-y-2.5">
              {detail.objectives.map((obj) => {
                const isLocked = obj.status === "locked";
                return (
                  <li key={obj.id} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-[1.5px] " +
                        (isLocked
                          ? "border-muted-foreground/30 bg-transparent"
                          : "border-accent bg-accent/15")
                      }
                    >
                      {!isLocked && (
                        <Check className="h-3 w-3 text-accent" strokeWidth={2.5} />
                      )}
                    </span>
                    <span
                      className={
                        "font-sans text-[13px] " +
                        (isLocked
                          ? "text-muted-foreground/60"
                          : "text-foreground")
                      }
                    >
                      {obj.label}
                    </span>
                    {obj.optional && (
                      <Pill className="ml-1">Optional</Pill>
                    )}
                    {obj.status === "ready" && !obj.optional && (
                      <Pill tone="success" className="ml-auto">
                        Ready
                      </Pill>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Required connectors */}
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Required Connectors
            </h2>
            <div className="flex flex-wrap gap-2">
              {detail.requiredConnectors.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border-[0.5px] border-border bg-secondary/50 font-mono text-[11px] text-foreground"
                >
                  <span
                    aria-hidden
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                  />
                  {c.label}
                </span>
              ))}
            </div>
          </section>
        </Card>

        {/* Right — deploy panel */}
        <Card className="border-[0.5px] bg-card p-5 h-fit lg:sticky lg:top-16">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-4">
            Deploy
          </h2>

          {/* Recommended agent */}
          {recommendedAgent && (
            <div className="relative rounded-lg border border-accent/40 bg-accent/5 p-3 mb-3">
              <div
                aria-hidden
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{ boxShadow: "var(--neon-glow)" }}
              />
              <div className="relative flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-[13px] font-medium text-accent">
                  {recommendedAgent.callsign.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
                    Recommended
                  </div>
                  <div className="font-sans text-[15px] font-medium text-foreground leading-none">
                    {recommendedAgent.callsign}
                  </div>
                  <div className="font-sans text-[12px] text-muted-foreground mt-0.5">
                    {recommendedAgent.classLabel}
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Match score
                    </span>
                    <span className="font-mono text-[12px] text-accent">
                      {detail.matchScore}%
                    </span>
                  </div>
                  <div className="mt-1 h-[3px] rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${detail.matchScore ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional slots */}
          {detail.additionalSlots && detail.additionalSlots > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-5">
              {Array.from({ length: detail.additionalSlots }).map((_, i) => (
                <button
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border/80 text-muted-foreground/60 hover:border-accent/50 hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  aria-label={`Add supporting agent ${i + 1}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          {/* Rewards */}
          <section className="mb-5">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
              Rewards
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {detail.rewards.map((r) => (
                <RewardChip key={r.label} reward={r} />
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              className="w-full h-10 font-mono text-[12px] uppercase tracking-[0.14em] shadow-[0_0_20px_theme(colors.primary/40%)] hover:shadow-[0_0_28px_theme(colors.primary/55%)]"
              size="lg"
            >
              Deploy
            </Button>
            <Button
              variant="outline"
              className="w-full h-9 font-mono text-[11px] uppercase tracking-[0.14em] border-border/80"
            >
              Abort Briefing
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RewardChip({
  reward,
}: {
  reward: { kind: string; label: string };
}) {
  const tone =
    reward.kind === "xp"
      ? "text-[color:var(--violet)] border-[color:var(--violet)]/40 bg-[color:var(--violet)]/10"
      : reward.kind === "credits"
        ? "text-accent border-accent/40 bg-accent/10"
        : reward.kind === "skill"
          ? "text-primary border-primary/40 bg-primary/10"
          : "text-foreground border-border bg-secondary/60";

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[11px] " +
        tone
      }
    >
      {reward.kind === "skill" && (
        <Lock className="h-3 w-3" strokeWidth={2.2} aria-hidden />
      )}
      {reward.label}
    </span>
  );
}
