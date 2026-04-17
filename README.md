# Agent Command HQ

Business-facing command dashboard for managing an AI agent squad.

🌐 **Live**: [agent-command-hq.vercel.app](https://agent-command-hq.vercel.app)

## Routes

- `/` — Home feed (activity timeline)
- `/cockpit` — Squad roster, resource meters, active operations, dossier, log
- `/tasks` — Kanban board with drag-and-drop (Queued / In progress / Needs review / Done / Blocked)
- `/chat` — Multi-thread AI chat interface with sidebar of conversations
- `/base` — Ship base room plan with type-colored rooms and agent assignments
- `/cyberware` — Agent cyberware profile with 8-region subsystem visualization

## Stack

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS v4 · shadcn/ui components
- Zustand state management
- Deployed on Vercel (auto-deploys on push to `main`)

## Related

- 🎮 [AgentRPG](https://github.com/weeeha/agent-rpg) — the gamified RimWorld-style variant at [agent-rpg.vercel.app](https://agent-rpg.vercel.app)

## Develop

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.
