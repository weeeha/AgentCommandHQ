"use client";

import type { ChatThread } from "@/types";
import { useCockpitStore } from "@/store/use-cockpit";
import { cn } from "@/lib/utils";
import { Send, Sparkles, CircleUser } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function timeAt(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Very small markdown-to-JSX: supports **bold**, `code`, and line-break newlines. */
function renderBody(text: string): React.ReactNode {
  // Split on newlines, handle inline markers per line
  return text.split("\n").map((line, i) => {
    const parts: Array<{ type: "text" | "bold" | "code"; value: string }> = [];
    let remaining = line;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);
      const nextIdx = Math.min(
        boldMatch?.index ?? Infinity,
        codeMatch?.index ?? Infinity,
      );
      if (nextIdx === Infinity) {
        parts.push({ type: "text", value: remaining });
        break;
      }
      if (nextIdx > 0) {
        parts.push({ type: "text", value: remaining.slice(0, nextIdx) });
      }
      if (boldMatch && boldMatch.index === nextIdx) {
        parts.push({ type: "bold", value: boldMatch[1] });
        remaining = remaining.slice(nextIdx + boldMatch[0].length);
      } else if (codeMatch && codeMatch.index === nextIdx) {
        parts.push({ type: "code", value: codeMatch[1] });
        remaining = remaining.slice(nextIdx + codeMatch[0].length);
      } else break;
    }
    return (
      <span key={i} className="block">
        {parts.map((p, j) =>
          p.type === "bold" ? (
            <strong key={j} className="font-semibold text-foreground">
              {p.value}
            </strong>
          ) : p.type === "code" ? (
            <code
              key={j}
              className="rounded-sm bg-secondary/60 px-1 py-0.5 font-mono text-[11px]"
            >
              {p.value}
            </code>
          ) : (
            <span key={j}>{p.value}</span>
          ),
        )}
      </span>
    );
  });
}

export function ChatConversation({ thread }: { thread: ChatThread }) {
  const agents = useCockpitStore((s) => s.agents);
  const agent = agents.find((a) => a.id === thread.agentId);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [thread.id, thread.messages.length]);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      {/* Thread header */}
      <header className="flex items-center justify-between border-b border-border/40 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h1 className="font-sans text-[14px] font-semibold leading-tight text-foreground">
              {thread.title}
            </h1>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              with {agent?.callsign ?? "agent"} · {agent?.classLabel ?? ""}
            </p>
          </div>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">
          {thread.messages.length} messages
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[760px] px-6 py-6">
          {thread.messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={cn(
                  "mb-6 flex gap-3",
                  isUser ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    isUser
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent",
                  )}
                >
                  {isUser ? (
                    <CircleUser className="size-4" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}
                </div>
                <div className="max-w-[80%]">
                  <div
                    className={cn(
                      "flex items-baseline gap-2",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {isUser ? "You" : agent?.callsign ?? "Agent"}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
                      {timeAt(msg.at)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-1 rounded-lg border-[0.5px] px-4 py-2.5 font-sans text-[13px] leading-relaxed",
                      isUser
                        ? "border-primary/30 bg-primary/10 text-foreground"
                        : "border-border/40 bg-card text-foreground",
                    )}
                  >
                    {renderBody(msg.content)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border/40 bg-card/30 p-4">
        <div className="mx-auto max-w-[760px]">
          <div className="flex items-end gap-2 rounded-lg border-[0.5px] border-border/60 bg-background px-3 py-2 focus-within:border-primary/40">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              placeholder={`Message ${agent?.callsign ?? "agent"}…`}
              className="flex-1 resize-none bg-transparent py-1.5 font-sans text-[13px] leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none"
              style={{ minHeight: "28px", maxHeight: "160px" }}
            />
            <button
              disabled={!draft.trim()}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
                draft.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-muted-foreground",
              )}
              aria-label="Send"
            >
              <Send className="size-3.5" />
            </button>
          </div>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground/60">
            ⏎ to send · ⇧⏎ for new line · this is a mocked interface
          </p>
        </div>
      </div>
    </div>
  );
}
