import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, aside, className }: SectionLabelProps) {
  return (
    <div
      data-slot="section-label"
      className={cn(
        "mb-3 flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground",
        className
      )}
    >
      <span>{children}</span>
      {aside && <span>{aside}</span>}
    </div>
  );
}
