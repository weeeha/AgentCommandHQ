import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MeterCardProps {
  label: string;
  value: string | number;
  valueMax?: number;
  subtitle?: string;
  fillPercent?: number;
  tone?: "warning" | "success" | "info" | "default";
}

const toneColors: Record<string, { bar: string; text: string }> = {
  success: { bar: "bg-success", text: "text-success" },
  warning: { bar: "bg-warning", text: "text-warning" },
  info: { bar: "bg-info", text: "text-info" },
  default: { bar: "bg-primary", text: "text-primary" },
};

export function MeterCard({
  label,
  value,
  valueMax,
  subtitle,
  fillPercent,
  tone = "default",
}: MeterCardProps) {
  const colors = toneColors[tone];

  return (
    <Card className="px-4 py-3 border-[0.5px] bg-card">
      <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-1.5">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("font-mono text-[22px] font-medium", colors.text)}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {valueMax !== undefined && (
          <span className="font-mono text-[13px] text-muted-foreground">
            / {valueMax.toLocaleString()}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="font-mono text-[11px] text-muted-foreground mt-1">
          {subtitle}
        </div>
      )}
      {fillPercent !== undefined && (
        <div className="mt-2 h-[3px] rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-[width] duration-400 ease-out", colors.bar)}
            style={{ width: `${Math.min(100, fillPercent)}%` }}
          />
        </div>
      )}
    </Card>
  );
}
