"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActiveOp, OpState } from "@/types";

const stateConfig: Record<OpState, { bar: string; pill: string; pillBg: string; label: string }> = {
  "in-progress": {
    bar: "bg-warning",
    pill: "text-warning",
    pillBg: "bg-warning/15",
    label: "in progress",
  },
  "needs-review": {
    bar: "bg-destructive",
    pill: "text-destructive",
    pillBg: "bg-destructive/15",
    label: "needs review",
  },
  finalizing: {
    bar: "bg-success",
    pill: "text-success",
    pillBg: "bg-success/15",
    label: "finalizing",
  },
  blocked: {
    bar: "bg-destructive",
    pill: "text-destructive",
    pillBg: "bg-destructive/15",
    label: "blocked",
  },
};

interface ActiveOpRowProps {
  op: ActiveOp;
  agentCallsign?: string;
}

export function ActiveOpRow({ op, agentCallsign }: ActiveOpRowProps) {
  const config = stateConfig[op.state];

  return (
    <div className="py-3 border-b-[0.5px] border-border last:border-b-0">
      {/* Header: title + state pill */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-medium text-foreground truncate">
            {op.title}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
            {agentCallsign && (
              <span className="text-foreground/70">{agentCallsign}</span>
            )}
            {agentCallsign && " \u00b7 "}
            {op.stateDetail}
            {" \u00b7 "}
            {op.elapsedMinutes}m elapsed
          </div>
        </div>
        <span
          className={cn(
            "font-mono text-[10px] font-medium uppercase tracking-[0.08em] rounded-full px-2 py-0.5 shrink-0",
            config.pill,
            config.pillBg
          )}
        >
          {config.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[4px] rounded-full bg-muted overflow-hidden my-2">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-400 ease-out",
            config.bar
          )}
          style={{ width: `${op.progress}%` }}
          role="progressbar"
          aria-valuenow={op.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Footer: stats + action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span>{op.progress}%</span>
          <span>{op.creditsSpent} cr</span>
          {op.etaMinutes > 0 && <span>~{op.etaMinutes}m left</span>}
        </div>
        {op.state === "needs-review" ? (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[11px] font-mono border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            Intervene
          </Button>
        ) : op.state === "finalizing" ? (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[11px] font-mono"
          >
            Preview
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[11px] font-mono"
          >
            Inspect
          </Button>
        )}
      </div>
    </div>
  );
}
