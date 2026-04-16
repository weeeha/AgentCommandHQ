import type { ChatThread } from "@/types";

const iso = (offsetMin: number) =>
  new Date(Date.now() - offsetMin * 60_000).toISOString();

export const mockChats: ChatThread[] = [
  {
    id: "chat-1",
    title: "Q3 platform architecture",
    agentId: "agent-atlas",
    updatedAt: iso(3),
    pinned: true,
    messages: [
      {
        id: "m-1-1",
        role: "user",
        content:
          "Atlas, given current load growth we'll hit single-region limits by end of Q3. What's the migration path to multi-region?",
        at: iso(24),
      },
      {
        id: "m-1-2",
        role: "agent",
        agentId: "agent-atlas",
        content:
          "Three viable paths. Ranked by risk/reward:\n\n1. **Active-passive failover** (lowest risk) — replicate primary region to us-east-2, DNS-based failover. Gets us resilience but not horizontal capacity.\n\n2. **Active-active with regional sharding** — users pinned to nearest region. Needs cross-region sync for shared state (billing, auth).\n\n3. **Full cell-based architecture** — each cell is autonomous, users assigned to cells. Highest reinvention, best ceiling.\n\nStart with (1) as an insurance policy. Plan (2) for H1 next year.",
        at: iso(23),
      },
      {
        id: "m-1-3",
        role: "user",
        content: "What's the failover RTO we can realistically commit to?",
        at: iso(4),
      },
      {
        id: "m-1-4",
        role: "agent",
        agentId: "agent-atlas",
        content:
          "With DNS-based failover and 60s TTL: **5-8 minutes** realistic RTO, 15 minutes worst case. If we need sub-minute, need BGP anycast which is 6-week lift minimum.",
        at: iso(3),
      },
    ],
  },
  {
    id: "chat-2",
    title: "Auth migration triage",
    agentId: "agent-cipher",
    updatedAt: iso(11),
    unread: 2,
    messages: [
      {
        id: "m-2-1",
        role: "user",
        content: "Cipher, status on the JWT migration?",
        at: iso(45),
      },
      {
        id: "m-2-2",
        role: "agent",
        agentId: "agent-cipher",
        content:
          "Step 7 of 11 — currently rotating tokens in batches of 100. 64,200 of 127,000 tokens migrated. No failures.",
        at: iso(44),
      },
      {
        id: "m-2-3",
        role: "user",
        content: "Any edge cases we should flag?",
        at: iso(13),
      },
      {
        id: "m-2-4",
        role: "agent",
        agentId: "agent-cipher",
        content:
          "Four so far. Captured in memo-auth-edge. Two are safe to handle silently (empty scope), two need product decision (users with expired refresh tokens — drop or re-prompt?).",
        at: iso(12),
      },
      {
        id: "m-2-5",
        role: "agent",
        agentId: "agent-cipher",
        content:
          "Also — noticed 38 users with duplicate JWT claims from the legacy SSO integration. Not breaking, but worth consolidating during this pass. Want me to include it in the migration batch?",
        at: iso(11),
      },
    ],
  },
  {
    id: "chat-3",
    title: "Payment handler review",
    agentId: "agent-mirror",
    updatedAt: iso(42),
    unread: 1,
    messages: [
      {
        id: "m-3-1",
        role: "user",
        content: "Mirror, walk me through the flagged changes on the payment handler.",
        at: iso(60),
      },
      {
        id: "m-3-2",
        role: "agent",
        agentId: "agent-mirror",
        content:
          "Three flags:\n\n**1. Null deref risk (L142)** — `customer.address.zip` assumed present. Suggest guard or default.\n\n**2. Naming (L88)** — `processTx` should be `processTransaction` per convention.\n\n**3. Missing test case** — refund flow for partial captures isn't covered.\n\nOnly #1 is a blocker.",
        at: iso(58),
      },
      {
        id: "m-3-3",
        role: "agent",
        agentId: "agent-mirror",
        content:
          "Draft fix for #1 ready if you want to review before I apply.",
        at: iso(42),
      },
    ],
  },
  {
    id: "chat-4",
    title: "Weekly ops review",
    agentId: "agent-sentinel",
    updatedAt: iso(60 * 4),
    messages: [
      {
        id: "m-4-1",
        role: "user",
        content: "Give me the weekly rollup.",
        at: iso(60 * 5),
      },
      {
        id: "m-4-2",
        role: "agent",
        agentId: "agent-sentinel",
        content:
          "**Week of T-7:**\n- Success rate 94% (+2% WoW)\n- p99 latency 1.24s (-40ms WoW)\n- 3 incidents, 0 breached SLO\n- Token spend $4,280 / $5,500 budget (78%)\n- 2 agents leveled up (ATLAS, CIPHER)\n\nWatchlist: Opus spend trending +8% — worth checking if it can be routed via gateway.",
        at: iso(60 * 4),
      },
    ],
  },
  {
    id: "chat-5",
    title: "Docs refresh planning",
    agentId: "agent-muse",
    updatedAt: iso(60 * 8),
    messages: [
      {
        id: "m-5-1",
        role: "user",
        content:
          "Muse, what should we prioritize for the next docs sprint?",
        at: iso(60 * 9),
      },
      {
        id: "m-5-2",
        role: "agent",
        agentId: "agent-muse",
        content:
          "Top three based on user feedback + support ticket analysis:\n\n1. Getting-started flow (36% of tickets are setup issues)\n2. Auth + permissions guide (needs full rewrite for new JWT model)\n3. Cookbook of common agent patterns (frequently requested, high NPS impact)",
        at: iso(60 * 8),
      },
    ],
  },
  {
    id: "chat-6",
    title: "Dependency cleanup",
    agentId: "agent-forge",
    updatedAt: iso(60 * 24),
    messages: [
      {
        id: "m-6-1",
        role: "user",
        content: "What's the state of the dependency audit?",
        at: iso(60 * 25),
      },
      {
        id: "m-6-2",
        role: "agent",
        agentId: "agent-forge",
        content:
          "42 outdated packages. 3 have CVEs — recommend immediate update:\n\n- `axios` → 1.7.4 (CVE-2024-39338)\n- `micromatch` → 4.0.8 (CVE-2024-4067)\n- `ws` → 8.17.1 (CVE-2024-37890)\n\nReady to open PR when you give the nod.",
        at: iso(60 * 24),
      },
    ],
  },
];
