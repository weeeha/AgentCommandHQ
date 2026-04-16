import { SlotCard } from "./slot-card";
import type { SlotItem } from "@/types";

interface SlotCategoryProps {
  label: string;
  items: SlotItem[];
  maxSlots?: number;
}

export function SlotCategory({ label, items, maxSlots = 3 }: SlotCategoryProps) {
  const slots = Array.from({ length: maxSlots }, (_, i) => items[i] ?? undefined);

  return (
    <div>
      <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-2">
        {label}
        <span className="text-muted-foreground/40 ml-1.5">
          {items.length}/{maxSlots}
        </span>
      </div>
      <div className="space-y-1.5">
        {slots.map((item, i) => (
          <SlotCard key={item?.id ?? `empty-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
