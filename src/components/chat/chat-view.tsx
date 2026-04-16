"use client";

import { useState } from "react";
import { mockChats } from "@/data";
import { ChatSidebar } from "./chat-sidebar";
import { ChatConversation } from "./chat-conversation";
import type { ChatThread } from "@/types";

export function ChatView() {
  const [threads, setThreads] = useState<ChatThread[]>(mockChats);
  const [activeId, setActiveId] = useState<string | null>(threads[0]?.id ?? null);

  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];

  const handleSelect = (id: string) => {
    setActiveId(id);
    // Clear unread counter for the selected thread
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)),
    );
  };

  const handleNew = () => {
    const id = `chat-new-${Date.now()}`;
    const newThread: ChatThread = {
      id,
      title: "New conversation",
      agentId: "agent-atlas",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveId(id);
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      <ChatSidebar
        threads={threads}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
      />
      {activeThread ? (
        <ChatConversation thread={activeThread} />
      ) : (
        <div className="flex flex-1 items-center justify-center bg-background">
          <div className="text-center">
            <p className="font-mono text-[13px] text-muted-foreground">
              No chat selected
            </p>
            <button
              onClick={handleNew}
              className="mt-3 rounded-sm border-[0.5px] border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-primary hover:bg-primary/20"
            >
              Start a new chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
