import { cn } from "@/lib/utils";

type PillTone = "success" | "warning" | "danger" | "info" | "default";

interface PillProps extends React.ComponentProps<"span"> {
  tone?: PillTone;
}

const toneStyles: Record<PillTone, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
  default: "bg-secondary text-secondary-foreground",
};

export function Pill({ tone = "default", className, ...props }: PillProps) {
  return (
    <span
      data-slot="pill"
      className={cn(
        "inline-flex h-5 shrink-0 items-center justify-center px-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] rounded-full",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
