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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RoomAgents } from "./room-agents";
import type { RoomInstance, RoomTypeKey, RoomTypeDef, GridSize } from "@/types";

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

const SIZE_SPANS: Record<GridSize, { cols: number; rows: number }> = {
  "1x1": { cols: 1, rows: 1 },
  "2x1": { cols: 2, rows: 1 },
  "1x2": { cols: 1, rows: 2 },
  "2x2": { cols: 2, rows: 2 },
};

// Map color token stems to tailwind classes
const colorMap: Record<string, { border: string; bg: string; bgSelected: string; text: string }> = {
  primary:     { border: "border-l-primary",     bg: "bg-primary/5",     bgSelected: "bg-primary/10",     text: "text-primary" },
  info:        { border: "border-l-info",        bg: "bg-info/5",        bgSelected: "bg-info/10",        text: "text-info" },
  accent:      { border: "border-l-accent",      bg: "bg-accent/5",      bgSelected: "bg-accent/10",      text: "text-accent" },
  destructive: { border: "border-l-destructive", bg: "bg-destructive/5", bgSelected: "bg-destructive/10", text: "text-destructive" },
  success:     { border: "border-l-success",     bg: "bg-success/5",     bgSelected: "bg-success/10",     text: "text-success" },
  warning:     { border: "border-l-warning",     bg: "bg-warning/5",     bgSelected: "bg-warning/10",     text: "text-warning" },
  "chart-1":   { border: "border-l-chart-1",     bg: "bg-chart-1/5",     bgSelected: "bg-chart-1/10",     text: "text-chart-1" },
  muted:       { border: "border-l-muted-foreground", bg: "bg-muted/10", bgSelected: "bg-muted/20",       text: "text-muted-foreground" },
  "chart-5":   { border: "border-l-chart-5",     bg: "bg-chart-5/5",     bgSelected: "bg-chart-5/10",     text: "text-chart-5" },
};

interface RoomTileProps {
  room: RoomInstance;
  roomType: RoomTypeDef;
  isSelected: boolean;
  onClick: () => void;
}

export function RoomTile({ room, roomType, isSelected, onClick }: RoomTileProps) {
  const Icon = roomIcons[room.typeKey];
  const { cols, rows } = SIZE_SPANS[room.gridSize];
  const colors = colorMap[roomType.color] ?? colorMap.muted;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "z-10 flex flex-col justify-between rounded-sm p-1.5 text-left cursor-pointer",
        "border-[0.5px] border-border/40 border-l-[3px] transition-colors duration-150",
        colors.border,
        isSelected ? colors.bgSelected : colors.bg,
        isSelected && "ring-1 ring-primary/40",
      )}
      style={{
        gridColumn: `${room.anchor.col + 1} / span ${cols}`,
        gridRow: `${room.anchor.row + 1} / span ${rows}`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-1 min-w-0">
        <Icon className={cn("size-3 shrink-0", colors.text)} strokeWidth={2} />
        <span className="font-mono text-[10px] font-medium tracking-[0.06em] text-foreground truncate">
          {roomType.label}
        </span>
        {room.level > 1 && (
          <Badge variant="secondary" className="ml-auto px-1 py-0 text-[8px] font-mono h-3.5">
            Lv{room.level}
          </Badge>
        )}
      </div>

      {/* Footer: agents */}
      {room.assignedAgentIds.length > 0 && (
        <div className="mt-auto pt-0.5">
          <RoomAgents agentIds={room.assignedAgentIds} />
        </div>
      )}
    </button>
  );
}
