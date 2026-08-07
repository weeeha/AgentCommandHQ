"use client";

import Link from "next/link";
import { mockMissionDetails } from "@/data/mock-mission-details";
import { useCockpitStore } from "@/store/use-cockpit";
import { DifficultyStars } from "@/components/primitives/difficulty-stars";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/ui/card";

export function MissionGrid() {
  const missions = useCockpitStore((s) => s.missions);

  return (
    <div className="px-6 pt-5 pb-10 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h1 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Missions
          </h1>
          <h2 className="font-sans text-[22px] font-medium text-foreground mt-0.5">
            Mission Board
          </h2>
        </div>
        <span className="font-mono text-[12px] text-muted-foreground">
          {missions.length} available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((mission) => {
          const detail = mockMissionDetails[mission.id];
          const primaryTag = detail?.tags[0];

          return (
            <Link
              key={mission.id}
              href={`/missions/${mission.id}`}
              className="group block focus-visible:outline-none"
            >
              <Card className="relative overflow-hidden border-[0.5px] bg-card p-5 h-full transition-all duration-150 group-hover:border-accent/40 group-hover:shadow-[0_0_24px_theme(colors.accent/15%)] group-focus-visible:ring-2 group-focus-visible:ring-ring">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-sans text-[15px] leading-snug text-foreground">
                    {mission.title}
                  </h3>
                  <DifficultyStars value={mission.tier} className="shrink-0" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {detail?.tags.slice(0, 2).map((tag) => (
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
                  )) ?? (
                    <Pill>{mission.domainTag}</Pill>
                  )}
                </div>

                {detail?.description && (
                  <p className="font-sans text-[12.5px] leading-relaxed text-muted-foreground line-clamp-3 mb-4">
                    {detail.description}
                  </p>
                )}

                <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground pt-3 border-t-[0.5px] border-border">
                  <span className="text-[color:var(--violet)]">
                    +{mission.xpReward} xp
                  </span>
                  <span className="text-accent">{mission.creditCost} cr</span>
                  <span>~{mission.estimatedMinutes}m</span>
                </div>

                {primaryTag?.tone === "danger" && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[1.5px] bg-primary/60"
                  />
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
