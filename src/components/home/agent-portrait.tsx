"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const availablePortraits = new Set([
  "atlas",
  "cipher",
  "echo",
  "forge",
  "mirror",
  "muse",
  "nova",
  "sentinel",
]);

interface AgentPortraitProps {
  callsign: string;
  size?: number;
  className?: string;
}

export function AgentPortrait({
  callsign,
  size = 56,
  className,
}: AgentPortraitProps) {
  const slug = callsign.toLowerCase();
  const hasImage = availablePortraits.has(slug);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border-[0.5px] border-border/60 bg-card/60",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {hasImage ? (
        <Image
          src={`/generated/home/agents/${slug}.png`}
          alt={`${callsign} portrait`}
          width={size}
          height={size}
          className="size-full object-cover [image-rendering:pixelated]"
          unoptimized
        />
      ) : (
        <div className="flex size-full items-center justify-center font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {callsign.slice(0, 3)}
        </div>
      )}
    </div>
  );
}
