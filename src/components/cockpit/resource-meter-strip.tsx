"use client";

import { useCockpitStore } from "@/store/use-cockpit";
import { MeterCard } from "./meter-card";

export function ResourceMeterStrip() {
  const resources = useCockpitStore((s) => s.resources);

  return (
    <div className="grid grid-cols-4 gap-3 px-5 max-md:grid-cols-2 max-sm:grid-cols-1">
      {resources.map((r) => (
        <MeterCard
          key={r.key}
          label={r.label}
          value={r.value}
          valueMax={r.max}
          subtitle={r.trend}
          fillPercent={r.fillPercent}
          tone={r.tone}
        />
      ))}
    </div>
  );
}
