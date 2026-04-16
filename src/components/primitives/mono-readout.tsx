import { cn } from "@/lib/utils";

interface MonoReadoutProps {
  value: string | number;
  unit?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles: Record<"sm" | "md" | "lg", { value: string; unit: string }> = {
  sm: { value: "text-[13px]", unit: "text-[11px]" },
  md: { value: "text-[17px]", unit: "text-[13px]" },
  lg: { value: "text-[22px]", unit: "text-[17px]" },
};

export function MonoReadout({
  value,
  unit,
  size = "md",
  className,
}: MonoReadoutProps) {
  const s = sizeStyles[size];

  return (
    <span
      data-slot="mono-readout"
      className={cn(
        "inline-flex items-baseline gap-1 font-mono font-medium tabular-nums tracking-[0.04em]",
        s.value,
        className
      )}
    >
      {value}
      {unit && (
        <span className={cn("text-muted-foreground", s.unit)}>{unit}</span>
      )}
    </span>
  );
}
