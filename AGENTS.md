<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Command HQ

Business-facing command dashboard for managing an AI agent squad — home feed, missions,
multi-thread chat, ship base, cyberware skill tree. Live at
[agent-command-hq.vercel.app](https://agent-command-hq.vercel.app).

## Commands

```bash
npm run dev
npm run build
npm run lint         # eslint
```

No test script. Verification is visual — open the affected panel and interact with it.

## Layout

```
src/app/          routes
src/components/   panels (squad, missions, cyberware, chat, ship base)
src/store/        zustand — the cockpit store
src/data/         static squad/mission/skill data
src/types/        shared types
src/lib/
sprocket-variants/, nanobanana-output/, generate_sprocket.py
                  generated pixel-art assets + the script that made them
```

State is **zustand**, held in the cockpit store. Mission deployment and skill-tree unlocking
both live there — UI panels read the store rather than owning their own copies.

## Gotchas

- **The package name is `agent-rpg`, not `agent-command-hq`.** There is also a *separate*
  `agent-rpg` repo and an `AgentRPG.duplicate` folder in `~/ClaudeCode Projects/`. Three
  different things share that name — confirm which directory you're in before editing, and
  don't "fix" the package name without checking what depends on it.
- Pixel-art portraits and sprocket variants are **generated assets** (`generate_sprocket.py`,
  Nano Banana output), not hand-drawn. Regenerate rather than hand-editing them, and don't
  delete the generator.
- This is deployed and public — the Vercel URL is in the README. Treat visible copy as
  published content.
- Never push to `main` — branch per task, PR.
