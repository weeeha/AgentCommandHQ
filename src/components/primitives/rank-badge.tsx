import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank: "S" | "A" | "B" | "C" | "D";
  className?: string;
}

const rankStyles: Record<RankBadgeProps["rank"], string> = {
  S: "bg-primary/15 text-primary",
  A: "bg-accent/15 text-accent",
  B: "bg-info/15 text-info",
  C: "bg-muted-foreground/15 text-muted-foreground",
  D: "bg-muted-foreground/10 text-muted-foreground/50",
};

export function RankBadge({ rank, className }: RankBadgeProps) {
  return (
    <span
      data-slot="rank-badge"
      className={cn(
        "inline-flex h-5 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-medium",
        rankStyles[rank],
        className
      )}
      aria-label={`rank ${rank}`}
    >
      {rank}
    </span>
  );
}
