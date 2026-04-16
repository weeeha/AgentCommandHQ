import { cn } from "@/lib/utils";
import type { SlotItem } from "@/types";

const tierColors: Record<string, string> = {
  common: "border-border",
  rare: "border-info/50",
  epic: "border-primary/50",
  legendary: "border-accent/50",
};

const tierDots: Record<string, string> = {
  common: "bg-muted-foreground/30",
  rare: "bg-info",
  epic: "bg-primary",
  legendary: "bg-accent",
};

interface SlotCardProps {
  item?: SlotItem;
  className?: string;
}

export function SlotCard({ item, className }: SlotCardProps) {
  if (!item) {
    return (
      <div
        className={cn(
          "h-[52px] rounded-lg border-[0.5px] border-dashed border-border/50",
          "flex items-center justify-center",
          className
        )}
      >
        <span className="font-mono text-[10px] text-muted-foreground/30 uppercase tracking-[0.08em]">
          empty
        </span>
      </div>
    );
  }

  const tier = item.tier ?? "common";

  return (
    <div
      className={cn(
        "h-[52px] rounded-lg border-[0.5px] px-2.5 py-1.5",
        "bg-secondary/50 hover:bg-secondary/80 transition-colors duration-150 cursor-default",
        tierColors[tier],
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <div className={cn("w-[5px] h-[5px] rounded-full shrink-0", tierDots[tier])} />
        <span className="font-mono text-[11px] font-medium text-foreground truncate">
          {item.name}
        </span>
      </div>
      <div className="font-mono text-[10px] text-muted-foreground/70 truncate mt-0.5 pl-[11px]">
        {item.description}
      </div>
    </div>
  );
}
