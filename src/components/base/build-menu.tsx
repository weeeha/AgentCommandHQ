"use client";

import {
  Radio,
  Users,
  Wrench,
  Shield,
  Heart,
  Dumbbell,
  Zap,
  Package,
  BedDouble,
  Brain,
  TrendingUp,
  Coffee,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBaseStore, canBuildAt } from "@/store/use-base";
import { roomTypeDefs } from "@/data";
import type { RoomTypeKey, RoomCategory, GridSize } from "@/types";

const roomIcons: Record<RoomTypeKey, React.ElementType> = {
  bridge: Radio,
  briefing: Users,
  workshop: Wrench,
  armory: Shield,
  medbay: Heart,
  training: Dumbbell,
  engineering: Zap,
  storage: Package,
  quarters: BedDouble,
  "memory-vault": Brain,
  "financial-center": TrendingUp,
  commons: Coffee,
};

const categoryLabels: Record<RoomCategory, string> = {
  command: "Command",
  operations: "Operations",
  support: "Support",
  personal: "Personal",
};

const categoryOrder: RoomCategory[] = ["command", "operations", "support", "personal"];

export function BuildMenu() {
  const open = useBaseStore((s) => s.buildMenuOpen);
  const cellPos = useBaseStore((s) => s.selectedCellPos);
  const ship = useBaseStore((s) => s.ship);
  const rooms = useBaseStore((s) => s.rooms);
  const credits = useBaseStore((s) => s.baseResources.credits);
  const closeBuildMenu = useBaseStore((s) => s.closeBuildMenu);
  const buildRoom = useBaseStore((s) => s.buildRoom);

  if (!cellPos) return null;

  // Group room types by category, exclude bridge (pre-built only)
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    types: Object.values(roomTypeDefs).filter(
      (def) => def.category === cat && def.key !== "bridge",
    ),
  })).filter((g) => g.types.length > 0);

  const handleBuild = (typeKey: RoomTypeKey, size: GridSize) => {
    buildRoom(typeKey, cellPos, size);
  };

  // Check if a unique room is already built
  const existingRoomTypes = new Set(rooms.map((r) => r.typeKey));

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => { if (!isOpen) closeBuildMenu(); }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm tracking-[0.06em]">
            Build Room
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px]">
            Cell [{cellPos.row}, {cellPos.col}] — {credits} credits available
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto">
          {grouped.map(({ category, types }) => (
            <div key={category}>
              <div className="font-mono text-[10px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-2">
                {categoryLabels[category]}
              </div>
              <div className="space-y-1.5">
                {types.map((def) => {
                  const Icon = roomIcons[def.key];
                  const alreadyBuilt = def.unique && existingRoomTypes.has(def.key);
                  const tooExpensive = credits < def.baseBuildCost;

                  // Pick the first allowed size that fits
                  const viableSize = def.allowedSizes.find((s) =>
                    canBuildAt(ship, cellPos.row, cellPos.col, s),
                  );
                  const canPlace = !!viableSize;

                  const disabled = alreadyBuilt || tooExpensive || !canPlace;

                  return (
                    <button
                      type="button"
                      key={def.key}
                      disabled={disabled}
                      onClick={() => {
                        if (viableSize) handleBuild(def.key, viableSize);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-sm text-left transition-colors",
                        "border-[0.5px] border-border/40",
                        disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-muted/30 cursor-pointer",
                      )}
                    >
                      <Icon className="size-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-medium text-foreground">
                            {def.label}
                          </span>
                          {viableSize && (
                            <Badge variant="outline" className="text-[8px] font-mono px-1 py-0 h-3.5">
                              {viableSize}
                            </Badge>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground truncate">
                          {alreadyBuilt
                            ? "Already built"
                            : tooExpensive
                              ? `Need ${def.baseBuildCost} credits`
                              : def.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-[11px] text-foreground">
                          {def.baseBuildCost}c
                        </div>
                        <div className="font-mono text-[9px] text-muted-foreground">
                          {def.basePowerCost} PU
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
