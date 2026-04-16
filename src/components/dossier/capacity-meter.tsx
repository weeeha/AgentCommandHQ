import { cn } from "@/lib/utils";

interface CapacityMeterProps {
  label: string;
  used: number;
  total: number;
  className?: string;
}

export function CapacityMeter({ label, used, total, className }: CapacityMeterProps) {
  const percent = total > 0 ? (used / total) * 100 : 0;

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground/60">
        {label}
      </div>
      {/* Vertical bar */}
      <div className="w-[6px] h-[140px] rounded-full bg-muted overflow-hidden flex flex-col-reverse">
        <div
          className={cn(
            "w-full rounded-full transition-[height] duration-400 ease-out",
            percent > 80 ? "bg-warning" : "bg-accent"
          )}
          style={{ height: `${percent}%` }}
        />
      </div>
      <div className="font-mono text-[11px] text-muted-foreground">
        <span className="text-foreground">{used}</span>
        <span className="text-muted-foreground/50">/{total}</span>
      </div>
    </div>
  );
}
