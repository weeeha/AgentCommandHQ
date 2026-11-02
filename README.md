# Agent Command HQ

**Problem.** A squad of AI agents needs one place where a business user can see who is doing what, what is queued and what needs review.

**Idea.** Run the squad like a crew: each agent has a dossier, missions to deploy on, a room in a ship base and a cyberware skill tree, all in one cockpit.

**Built.** A Next.js 16, React 19, Tailwind v4 and shadcn/ui app with Zustand state and eight routes (home feed, cockpit, Kanban tasks, chat, missions, base, cyberware, skill tree), running on sample squad data. Live at https://agent-command-hq.vercel.app. 14 commits on 7 days, Apr 16 to Oct 20, 2026.

**Decision.** This deployment keeps the business cockpit only. The RimWorld-style game view and its canvas engine were removed here, and the gamified variant is the separate AgentRPG project.

Business-facing command dashboard for managing an AI agent squad.

![Home feed: activity timeline with squad, active ops and shortcuts panels](docs/screenshots/home-feed.webp)

🌐 **Live**: [agent-command-hq.vercel.app](https://agent-command-hq.vercel.app)

## Screenshots

![Cockpit: resource meters, squad roster, active operations and mission board](docs/screenshots/cockpit.webp)

The cockpit view at `/cockpit`, with the sample squad data the app ships with.

## Routes

- `/` — Home feed (activity timeline)
- `/cockpit` — Squad roster, resource meters, active operations, dossier, log
- `/tasks` — Kanban board with drag-and-drop (Queued / In progress / Needs review / Done / Blocked)
- `/chat` — Multi-thread AI chat interface with sidebar of conversations
- `/missions` - Mission board grid; `/missions/[id]` is the briefing for one mission
- `/base` — Ship base room plan with type-colored rooms and agent assignments
- `/cyberware` — Agent cyberware profile with 8-region subsystem visualization
- `/cyberware/skills` - Skill tree with node unlocking (`?agent=<id>` selects an agent)

## Stack

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS v4 · shadcn/ui components
- Zustand state management (cockpit store holds mission deployment and skill-tree state)
- Deployed on Vercel (auto-deploys on push to `main`)

## Related

- 🎮 [AgentRPG](https://github.com/weeeha/agent-rpg) — the gamified RimWorld-style variant at [agent-rpg.vercel.app](https://agent-rpg.vercel.app)

## Develop

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.
