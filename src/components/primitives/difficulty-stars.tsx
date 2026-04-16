import { cn } from "@/lib/utils";

interface DifficultyStarsProps {
  value: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export function DifficultyStars({ value, className }: DifficultyStarsProps) {
  return (
    <span
      data-slot="difficulty-stars"
      className={cn(
        "inline-flex font-mono text-[11px] tracking-[0.06em]",
        className
      )}
      aria-label={`difficulty ${value} of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            i < value ? "text-primary" : "text-muted-foreground/30"
          )}
          aria-hidden="true"
        >
          &#9733;
        </span>
      ))}
    </span>
  );
}
