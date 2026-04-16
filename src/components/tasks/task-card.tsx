"use client";

import type { Task, TaskPriority } from "@/types";
import { useCockpitStore } from "@/store/use-cockpit";
import { cn } from "@/lib/utils";
import { Clock, Tag, AlertOctagon } from "lucide-react";

const priorityTone: Record<TaskPriority, string> = {
  p0: "text-destructive border-destructive/40 bg-destructive/10",
  p1: "text-warning border-warning/40 bg-warning/10",
  p2: "text-info border-info/40 bg-info/10",
  p3: "text-muted-foreground border-border/40 bg-secondary/40",
};

const priorityLabel: Record<TaskPriority, string> = {
  p0: "P0",
  p1: "P1",
  p2: "P2",
  p3: "P3",
};

function minToLabel(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  return rem ? `${h}h${rem}m` : `${h}h`;
}

export function TaskCard({
  task,
  onClick,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}) {
  const agents = useCockpitStore((s) => s.agents);
  const agent = agents.find((a) => a.id === task.assignedAgentId);

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "group cursor-grab rounded-md border-[0.5px] border-border/60 bg-card p-3 shadow-sm transition-all",
        "hover:border-primary/40 hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans text-[12px] font-medium leading-tight text-foreground">
          {task.title}
        </h3>
        <span
          className={cn(
            "shrink-0 rounded-sm border-[0.5px] px-1 font-mono text-[9px] font-semibold",
            priorityTone[task.priority],
          )}
        >
          {priorityLabel[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="mt-1.5 font-sans text-[11px] leading-snug text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-sm border-[0.5px] border-border/40 bg-secondary/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground"
            >
              <Tag className="size-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between border-t border-border/30 pt-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <Clock className="size-3" />
          <span className="tabular-nums">{minToLabel(task.estimatedMinutes)}</span>
        </div>
        {agent ? (
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium text-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {agent.callsign}
          </span>
        ) : (
          <span className="font-mono text-[10px] italic text-muted-foreground/60">
            unassigned
          </span>
        )}
      </div>

      {task.status === "blocked" && (
        <div className="mt-2 flex items-center gap-1 rounded-sm bg-destructive/10 px-1.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-destructive">
          <AlertOctagon className="size-3" />
          Blocked
        </div>
      )}
    </article>
  );
}
