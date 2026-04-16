import {
  Rocket,
  CheckCircle2,
  Flag,
  TrendingUp,
  Moon,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LogEvent, LogEventKind } from "@/types";

const kindConfig: Record<
  LogEventKind,
  { icon: React.ElementType; color: string; label: string }
> = {
  deploy: { icon: Rocket, color: "text-primary", label: "deploy" },
  complete: { icon: CheckCircle2, color: "text-success", label: "complete" },
  flag: { icon: Flag, color: "text-warning", label: "flag" },
  "level-up": { icon: TrendingUp, color: "text-accent", label: "level up" },
  rest: { icon: Moon, color: "text-info", label: "rest" },
  intervene: { icon: AlertTriangle, color: "text-destructive", label: "intervene" },
};

interface LogEventRowProps {
  event: LogEvent;
}

export function LogEventRow({ event }: LogEventRowProps) {
  const config = kindConfig[event.kind];
  const Icon = config.icon;

  const time = new Date(event.at);
  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-start gap-3 py-1.5 border-b-[0.5px] border-border/50 last:border-b-0">
      {/* Timestamp */}
      <span className="font-mono text-[11px] text-muted-foreground/60 w-[42px] shrink-0 pt-px">
        {timeStr}
      </span>

      {/* Icon */}
      <Icon className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", config.color)} />

      {/* Message */}
      <span className="text-[13px] text-foreground/90 flex-1 min-w-0">
        <span className="font-mono text-muted-foreground text-[12px]">
          {event.agentCallsign}
        </span>{" "}
        {event.message}
      </span>

      {/* Kind label */}
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground/50 shrink-0">
        {config.label}
      </span>
    </div>
  );
}
