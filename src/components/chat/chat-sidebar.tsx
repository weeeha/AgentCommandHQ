"use client";

import type { ChatThread } from "@/types";
import { useCockpitStore } from "@/store/use-cockpit";
import { cn } from "@/lib/utils";
import { Pin, MessageSquarePlus, Search } from "lucide-react";

function relTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function ChatSidebar({
  threads,
  activeId,
  onSelect,
  onNew,
}: {
  threads: ChatThread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const agents = useCockpitStore((s) => s.agents);
  const agentById = new Map(agents.map((a) => [a.id, a]));

  const pinned = threads.filter((t) => t.pinned);
  const recent = threads.filter((t) => !t.pinned);

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border/40 bg-card/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Chats
        </h2>
        <button
          onClick={onNew}
          className="flex items-center gap-1 rounded-sm border-[0.5px] border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-primary hover:bg-primary/20"
        >
          <MessageSquarePlus className="size-3" />
          New
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-border/40 p-3">
        <div className="flex items-center gap-2 rounded-sm border-[0.5px] border-border/40 bg-background/50 px-2 py-1.5">
          <Search className="size-3 text-muted-foreground" />
          <input
            placeholder="Search chats…"
            className="flex-1 bg-transparent font-mono text-[11px] placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto">
        {pinned.length > 0 && (
          <ThreadSection
            title="Pinned"
            threads={pinned}
            activeId={activeId}
            onSelect={onSelect}
            agentById={agentById}
            showPin
          />
        )}
        <ThreadSection
          title={pinned.length > 0 ? "Recent" : undefined}
          threads={recent}
          activeId={activeId}
          onSelect={onSelect}
          agentById={agentById}
        />
      </div>
    </aside>
  );
}

function ThreadSection({
  title,
  threads,
  activeId,
  onSelect,
  agentById,
  showPin,
}: {
  title?: string;
  threads: ChatThread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  agentById: Map<string, any>;
  showPin?: boolean;
}) {
  if (threads.length === 0) return null;

  return (
    <section className="py-2">
      {title && (
        <h3 className="px-4 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
          {title}
        </h3>
      )}
      <ul>
        {threads.map((thread) => {
          const agent = agentById.get(thread.agentId);
          const lastMsg = thread.messages[thread.messages.length - 1];
          const isActive = activeId === thread.id;
          return (
            <li key={thread.id}>
              <button
                onClick={() => onSelect(thread.id)}
                className={cn(
                  "w-full border-l-2 px-4 py-2.5 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-secondary/50",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    {showPin && (
                      <Pin className="size-3 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate font-sans text-[12px] font-medium text-foreground">
                      {thread.title}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {thread.unread !== undefined && thread.unread > 0 && (
                      <span className="inline-flex min-w-[16px] items-center justify-center rounded-full bg-primary px-1 font-mono text-[9px] font-semibold text-primary-foreground">
                        {thread.unread}
                      </span>
                    )}
                    <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
                      {relTime(thread.updatedAt)}
                    </span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  {agent && (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-secondary/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                      <span className="size-1 rounded-full bg-primary" />
                      {agent.callsign}
                    </span>
                  )}
                  {lastMsg && (
                    <p className="truncate font-sans text-[10px] text-muted-foreground">
                      {lastMsg.content.split("\n")[0]}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
