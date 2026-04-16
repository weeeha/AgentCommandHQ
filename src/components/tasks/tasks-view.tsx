"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "@/types";
import { mockTasks } from "@/data";
import { KanbanColumn } from "./kanban-column";
import { Plus, Filter } from "lucide-react";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "queued", label: "Queued" },
  { status: "in-progress", label: "In progress" },
  { status: "needs-review", label: "Needs review" },
  { status: "done", label: "Done" },
  { status: "blocked", label: "Blocked" },
];

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDrop = (newStatus: TaskStatus) => {
    if (!draggingId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === draggingId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
    setDraggingId(null);
  };

  const byStatus = (status: TaskStatus) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => {
        // P0 first, then by updatedAt desc
        const pdiff =
          Number(a.priority.slice(1)) - Number(b.priority.slice(1));
        if (pdiff !== 0) return pdiff;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

  const counts = {
    total: tasks.length,
    p0: tasks.filter((t) => t.priority === "p0").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <div>
          <h1 className="font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Tasks
          </h1>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/60">
            Kanban board · drag to change status
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Counters */}
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <Stat label="Total" value={counts.total} />
            <Stat label="P0" value={counts.p0} tone="text-destructive" />
            <Stat label="Blocked" value={counts.blocked} tone="text-warning" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 rounded-sm border-[0.5px] border-border/40 bg-card px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground">
              <Filter className="size-3" />
              Filter
            </button>
            <button className="flex items-center gap-1 rounded-sm border-[0.5px] border-primary/40 bg-primary/10 px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-primary hover:bg-primary/20">
              <Plus className="size-3" />
              New task
            </button>
          </div>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-3 p-5">
          {COLUMNS.map(({ status, label }) => (
            <KanbanColumn
              key={status}
              status={status}
              label={label}
              tasks={byStatus(status)}
              onDrop={handleDrop}
              onTaskDragStart={setDraggingId}
              draggingTaskId={draggingId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-mono text-[13px] font-semibold tabular-nums ${tone ?? "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
