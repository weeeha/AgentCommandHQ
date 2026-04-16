"use client";

import { cn } from "@/lib/utils";

type StatusDotVariant = "ready" | "deployed" | "critical" | "cooldown";

interface StatusDotProps {
  variant: StatusDotVariant;
  className?: string;
}

const variantStyles: Record<StatusDotVariant, string> = {
  ready: "bg-success",
  deployed: "bg-warning",
  critical: "bg-destructive animate-pulse-dot",
  cooldown: "bg-info",
};

export function StatusDot({ variant, className }: StatusDotProps) {
  return (
    <div
      data-slot="status-dot"
      className={cn(
        "size-[7px] shrink-0 rounded-full",
        variantStyles[variant],
        className
      )}
      role="status"
      aria-label={variant}
    />
  );
}
