"use client";

import type { FeedItem, FeedItemKind } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  CheckCircle2,
  TrendingUp,
  Flag,
  Rocket,
  Eye,
  Trophy,
  AlertTriangle,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

const kindMeta: Record<
  FeedItemKind,
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  "mission-complete": {
    label: "Mission complete",
    icon: CheckCircle2,
    tone: "text-success",
  },
  "level-up": { label: "Level up", icon: TrendingUp, tone: "text-primary" },
  flag: { label: "Flag", icon: Flag, tone: "text-warning" },
  deploy: { label: "Deploy", icon: Rocket, tone: "text-info" },
  "review-request": { label: "Review", icon: Eye, tone: "text-warning" },
  achievement: { label: "Achievement", icon: Trophy, tone: "text-accent" },
  alert: { label: "Alert", icon: AlertTriangle, tone: "text-destructive" },
  system: { label: "System", icon: Settings, tone: "text-muted-foreground" },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function FeedItemRow({ item }: { item: FeedItem }) {
  const meta = kindMeta[item.kind];
  const Icon = meta.icon;

  const TrendIcon =
    item.metric?.tone === "up"
      ? ArrowUpRight
      : item.metric?.tone === "down"
        ? ArrowDownRight
        : Minus;
  const trendColor =
    item.metric?.tone === "up"
      ? "text-success"
      : item.metric?.tone === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <article className="group flex items-start gap-3 border-b border-border/30 py-4 last:border-0">
      {/* Icon column */}
      <div
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-card",
          meta.tone,
        )}
      >
        <Icon className="size-4" />
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-[9px] uppercase tracking-[0.14em]",
                meta.tone,
              )}
            >
              {meta.label}
            </span>
            {item.agentCallsign && (
              <span className="font-mono text-[10px] text-muted-foreground">
                · {item.agentCallsign}
              </span>
            )}
          </div>
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70">
            {timeAgo(item.at)}
          </span>
        </div>

        <h3 className="mt-1 font-sans text-[13px] font-medium leading-tight text-foreground">
          {item.title}
        </h3>
        <p className="mt-1 font-sans text-[12px] leading-snug text-muted-foreground">
          {item.body}
        </p>

        <div className="mt-2 flex items-center gap-3">
          {item.metric && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-sm border border-border/40 bg-secondary/40 px-1.5 py-0.5",
                trendColor,
              )}
            >
              <TrendIcon className="size-3" />
              <span className="font-mono text-[10px] font-semibold tabular-nums">
                {item.metric.value}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                {item.metric.label}
              </span>
            </div>
          )}
          {item.linkHref && (
            <Link
              href={item.linkHref}
              className="font-mono text-[11px] font-medium text-primary hover:underline"
            >
              {item.linkLabel ?? "View"} →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
