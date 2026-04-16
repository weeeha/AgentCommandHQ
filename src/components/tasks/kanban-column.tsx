"use client";

import type { Task, TaskStatus } from "@/types";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";

const statusTone: Record<TaskStatus, string> = {
  queued: "border-muted-foreground/40",
  "in-progress": "border-info/50",
  "needs-review": "border-warning/50",
  done: "border-success/50",
  blocked: "border-destructive/50",
};

const statusAccent: Record<TaskStatus, string> = {
  queued: "bg-muted-foreground/60",
  "in-progress": "bg-info",
  "needs-review": "bg-warning",
  done: "bg-success",
  blocked: "bg-destructive",
};

export function KanbanColumn({
  status,
  label,
  tasks,
  onDrop,
  onTaskDragStart,
  draggingTaskId,
  onTaskClick,
}: {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onDrop: (status: TaskStatus) => void;
  onTaskDragStart: (taskId: string) => void;
  draggingTaskId: string | null;
  onTaskClick?: (task: Task) => void;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(status);
      }}
      className={cn(
        "flex min-h-[300px] w-[280px] shrink-0 flex-col rounded-md border-[0.5px] bg-secondary/30 p-3",
        statusTone[status],
      )}
    >
      {/* Column header */}
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", statusAccent[status])} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
            {label}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </header>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border/40 font-mono text-[11px] italic text-muted-foreground/50">
            drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
              isDragging={draggingTaskId === task.id}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                onTaskDragStart(task.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
