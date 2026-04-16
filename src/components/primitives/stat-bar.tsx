import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  className?: string;
}

export function StatBar({ label, value, className }: StatBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      data-slot="stat-bar"
      className={cn("grid grid-cols-[100px_1fr_32px] items-center gap-3", className)}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <div className="h-1 w-full rounded-full bg-muted">
        <div
          className="h-1 rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-right font-mono text-[13px] font-medium tabular-nums">
        {clamped}
      </span>
    </div>
  );
}
