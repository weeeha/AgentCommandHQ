"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GridCell } from "@/types";

interface GridCellTileProps {
  cell: GridCell;
  isSelected: boolean;
  onClick: () => void;
}

export function GridCellTile({ cell, isSelected, onClick }: GridCellTileProps) {
  // Outside the hull — render nothing
  if (cell.kind === "hull") {
    return <div className="pointer-events-none" />;
  }

  // Wall cell — structural, not interactive
  if (cell.kind === "wall") {
    return (
      <div className="bg-muted/40 border-[0.5px] border-border/30 rounded-sm" />
    );
  }

  // Non-anchor cell occupied by a room — invisible (room-tile spans over it)
  if (cell.roomId && !cell.isAnchor) {
    return <div className="pointer-events-none" />;
  }

  // Anchor cell — handled by room-tile in ship-grid, should not reach here
  if (cell.roomId && cell.isAnchor) {
    return null;
  }

  // Empty buildable slot
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center rounded-sm",
        "border border-dashed border-muted-foreground/20",
        "transition-colors duration-150 cursor-pointer",
        "hover:border-muted-foreground/40 hover:bg-muted/20",
        isSelected && "border-primary/50 bg-primary/5 ring-1 ring-primary/30",
      )}
    >
      <Plus
        className="size-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors"
        strokeWidth={1.5}
      />
    </button>
  );
}
