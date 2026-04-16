"use client";

import { useState, useEffect } from "react";
import { Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandBarProps {
  roomName: string;
  roomSubtitle: string;
  systemStatus: "green" | "amber" | "red";
  systemLabel: string;
}

export function CommandBar({
  roomName,
  roomSubtitle,
  systemStatus,
  systemLabel,
}: CommandBarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b-[0.5px] border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-primary">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="font-mono text-[15px] font-medium tracking-[0.06em] text-foreground">
            {roomName}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.10em] text-muted-foreground mt-0.5">
            {roomSubtitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Activity className="w-3.5 h-3.5 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-[7px] h-[7px] rounded-full",
              systemStatus === "green" && "bg-success",
              systemStatus === "amber" && "bg-warning animate-pulse-dot",
              systemStatus === "red" && "bg-destructive animate-pulse-dot"
            )}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {systemLabel}
          </span>
        </div>
        <time
          className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground ml-4"
          suppressHydrationWarning
        >
          {time}
        </time>
      </div>
    </header>
  );
}
