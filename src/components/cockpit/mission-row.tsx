"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Mission } from "@/types";

interface MissionRowProps {
  mission: Mission;
}

export function MissionRow({ mission }: MissionRowProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < mission.tier);

  return (
    <Link
      href={`/missions/${mission.id}`}
      className={cn(
        "block w-full text-left py-3 px-3 -mx-3 rounded-lg transition-colors duration-150",
        "border-b-[0.5px] border-border last:border-b-0",
        "hover:bg-secondary/50",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      )}
    >
      {/* Title + stars */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-[14px] font-medium text-foreground">
          {mission.title}
        </span>
        <span
          className="font-mono text-[11px] tracking-[0.04em] shrink-0"
          aria-label={`difficulty ${mission.tier} of 5`}
        >
          {stars.map((filled, i) => (
            <span
              key={i}
              className={filled ? "text-primary" : "text-muted-foreground/30"}
            >
              &#9733;
            </span>
          ))}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <span className="text-accent">+{mission.xpReward} xp</span>
        <span>&middot;</span>
        <span>{mission.creditCost} cr</span>
        <span>&middot;</span>
        <span>~{mission.estimatedMinutes}m</span>
        {mission.domainTag && (
          <>
            <span>&middot;</span>
            <span className="text-muted-foreground/70">{mission.domainTag}</span>
          </>
        )}
      </div>
    </Link>
  );
}
