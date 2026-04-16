import { cn } from "@/lib/utils";
import type { TrustLevel } from "@/types";

const trustConfig: Record<TrustLevel, { label: string; className: string }> = {
  probationary: {
    label: "Probationary",
    className: "bg-muted-foreground/15 text-muted-foreground",
  },
  standard: {
    label: "Standard",
    className: "bg-info/15 text-info",
  },
  trusted: {
    label: "Trusted",
    className: "bg-primary/15 text-primary",
  },
  autonomous: {
    label: "Autonomous",
    className: "bg-accent/15 text-accent",
  },
};

interface TrustBadgeProps {
  level: TrustLevel;
  className?: string;
}

export function TrustBadge({ level, className }: TrustBadgeProps) {
  const config = trustConfig[level];
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.08em] rounded-full px-2.5 py-0.5",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
