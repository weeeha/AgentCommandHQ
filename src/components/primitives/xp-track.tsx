"use client";

import { cn } from "@/lib/utils";

interface XPTrackProps {
  value: number;
  max: number;
  height?: 2 | 3 | 4;
  className?: string;
  showLabel?: boolean;
}

const heightMap: Record<2 | 3 | 4, string> = {
  2: "h-[2px]",
  3: "h-[3px]",
  4: "h-[4px]",
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function XPTrack({
  value,
  max,
  height = 3,
  className,
  showLabel = false,
}: XPTrackProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div data-slot="xp-track" className={cn("flex flex-col gap-1", className)}>
      {showLabel && (
        <span className="font-mono text-[11px] font-medium tabular-nums tracking-[0.04em] text-muted-foreground">
          {formatNumber(value)}&nbsp;/&nbsp;{formatNumber(max)}
        </span>
      )}
      <div
        className={cn("w-full rounded-full bg-xp-track", heightMap[height])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "rounded-full bg-xp transition-[width] duration-[400ms] ease-out",
            heightMap[height]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
