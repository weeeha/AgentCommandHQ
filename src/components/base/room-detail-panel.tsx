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
  ArrowUpCircle,
  Trash2,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useBaseStore } from "@/store/use-base";
import { useCockpitStore } from "@/store/use-cockpit";
import { roomTypeDefs } from "@/data";
import type { RoomTypeKey, RoomStatus } from "@/types";

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

const statusLabels: Record<RoomStatus, string> = {
  operational: "Operational",
  building: "Under Construction",
  damaged: "Damaged",
  upgrading: "Upgrading",
  offline: "Offline",
};

const statusColors: Record<RoomStatus, string> = {
  operational: "bg-success",
  building: "bg-warning",
  damaged: "bg-destructive",
  upgrading: "bg-info",
  offline: "bg-muted-foreground",
};

export function RoomDetailPanel() {
  const selectedRoomId = useBaseStore((s) => s.selectedRoomId);
  const rooms = useBaseStore((s) => s.rooms);
  const selectRoom = useBaseStore((s) => s.selectRoom);
  const demolishRoom = useBaseStore((s) => s.demolishRoom);
  const assignAgent = useBaseStore((s) => s.assignAgent);
  const unassignAgent = useBaseStore((s) => s.unassignAgent);
  const allAgents = useCockpitStore((s) => s.agents);

  const room = rooms.find((r) => r.id === selectedRoomId);
  if (!room) return null;

  const typeDef = roomTypeDefs[room.typeKey];
  const Icon = roomIcons[room.typeKey];

  // Agents assigned to this room
  const assigned = allAgents.filter((a) =>
    room.assignedAgentIds.includes(a.id),
  );
  // Agents not assigned to any room
  const allAssignedIds = rooms.flatMap((r) => r.assignedAgentIds);
  const available = allAgents.filter((a) => !allAssignedIds.includes(a.id));

  return (
    <Card className="w-72 shrink-0 border-[0.5px] bg-card overflow-y-auto max-h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-primary" strokeWidth={2} />
            <CardTitle className="font-mono text-sm tracking-[0.06em]">
              {typeDef.label}
            </CardTitle>
          </div>
          <button
            type="button"
            onClick={() => selectRoom(null)}
            className="font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            close
          </button>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground mt-1">
          {typeDef.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status & level */}
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", statusColors[room.status])} />
          <span className="font-mono text-[11px] text-muted-foreground">
            {statusLabels[room.status]}
          </span>
          <Badge variant="secondary" className="ml-auto text-[10px] font-mono px-1.5 py-0">
            Level {room.level} / {typeDef.maxLevel}
          </Badge>
        </div>

        {/* Build progress */}
        {room.buildProgress !== undefined && (
          <div>
            <div className="font-mono text-[10px] text-muted-foreground mb-1">
              Build progress
            </div>
            <Progress value={room.buildProgress} className="h-1.5" />
          </div>
        )}

        {/* Power */}
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-muted-foreground">Power draw</span>
          <span className="text-warning">{room.powerConsumption} PU</span>
        </div>

        <Separator />

        {/* Assigned agents */}
        <div>
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-2">
            Assigned agents
          </div>
          {assigned.length === 0 ? (
            <p className="font-mono text-[10px] text-muted-foreground/60">
              No agents assigned
            </p>
          ) : (
            <div className="space-y-1.5">
              {assigned.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between"
                >
                  <span className="font-mono text-[11px] text-foreground">
                    {agent.callsign}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => unassignAgent(room.id, agent.id)}
                  >
                    <UserMinus className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assign agent */}
        {available.length > 0 && (
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-muted-foreground mb-2">
              Available
            </div>
            <div className="space-y-1">
              {available.slice(0, 4).map((agent) => (
                <Button
                  key={agent.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-mono text-[11px] h-7"
                  onClick={() => assignAgent(room.id, agent.id)}
                >
                  <UserPlus className="size-3 mr-1.5" />
                  {agent.callsign}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          {room.level < typeDef.maxLevel && (
            <Button variant="secondary" size="sm" className="flex-1 font-mono text-[11px]">
              <ArrowUpCircle className="size-3 mr-1" />
              Upgrade
            </Button>
          )}
          {room.typeKey !== "bridge" && (
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-[11px] text-destructive hover:text-destructive"
              onClick={() => demolishRoom(room.id)}
            >
              <Trash2 className="size-3 mr-1" />
              Demolish
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
