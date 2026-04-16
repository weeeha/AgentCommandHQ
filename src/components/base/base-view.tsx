"use client";

import { useBaseStore } from "@/store/use-base";
import { ShipResourceBar } from "./ship-resource-bar";
import { ShipGrid } from "./ship-grid";
import { RoomDetailPanel } from "./room-detail-panel";
import { BuildMenu } from "./build-menu";

export function BaseView() {
  const shipName = useBaseStore((s) => s.ship.hullName);
  const selectedRoomId = useBaseStore((s) => s.selectedRoomId);

  return (
    <div className="flex h-dvh bg-background text-foreground overflow-hidden">
      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-6 pt-5 pb-2">
          <h1 className="font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Ship Base
          </h1>
          <p className="font-mono text-[11px] text-muted-foreground/60">
            {shipName}
          </p>
        </header>

        {/* Resource meters */}
        <ShipResourceBar />

        {/* Ship grid */}
        <div className="flex-1 overflow-auto">
          <ShipGrid />
        </div>
      </div>

      {/* Detail panel (conditional) */}
      {selectedRoomId && (
        <aside className="border-l border-border/40 p-4 overflow-y-auto">
          <RoomDetailPanel />
        </aside>
      )}

      {/* Build dialog */}
      <BuildMenu />
    </div>
  );
}
