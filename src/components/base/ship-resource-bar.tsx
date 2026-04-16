"use client";

import { MeterCard } from "@/components/cockpit/meter-card";
import { useBaseStore } from "@/store/use-base";

export function ShipResourceBar() {
  const res = useBaseStore((s) => s.baseResources);

  return (
    <div className="grid grid-cols-3 gap-3 px-6 pt-4">
      <MeterCard
        label="Power"
        value={res.power.current}
        valueMax={res.power.max}
        fillPercent={(res.power.current / res.power.max) * 100}
        tone={res.power.current >= res.power.max ? "warning" : "info"}
        subtitle="draw / capacity"
      />
      <MeterCard
        label="Supplies"
        value={res.supplies}
        tone="success"
        subtitle="stockpile"
      />
      <MeterCard
        label="Credits"
        value={res.credits}
        tone="default"
        subtitle="available"
      />
    </div>
  );
}
