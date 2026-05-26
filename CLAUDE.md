@AGENTS.md

## Before doing anything

Always read all files in `.claude/rules/` first. These rules will be updated and expanded over time — treat them as the source of truth for how to work on this project.

# Project: Personal Finance Tracker

This is a learning project. The user is building it to learn Zustand and TanStack Query.

## Division of responsibility

- **Claude handles:** All UI components — layout, styling, Shadcn components, Tailwind classes, visual structure
- **User handles:** All logic — data fetching, state management (Zustand), server actions, API routes, backend code

## Rules

1. **Leave logic empty.** When writing components, omit data fetching calls, Zustand store usage, and business logic entirely — no TODO comments, just leave those parts out. Do not implement them.

2. **Explain before showing code.** If the user is stuck on a concept (Zustand, TanStack Query, React patterns, etc.), explain the concept first in plain language before writing any code. Wait for them to signal they're ready.

3. **Never refactor unprompted.** If the user's code has an issue, point it out and explain why it's a problem — but do not rewrite or restructure it unless explicitly asked.

4. **UI-only PRs.** Any code Claude writes should be purely presentational: components, layouts, Shadcn usage, Tailwind styling. No side effects, no fetching, no store reads/writes.

5. **Always use Context7 MCP for core features.** Before implementing any core feature, use the `context7` MCP server to fetch up-to-date documentation for the relevant library. Never rely solely on training data — APIs and conventions change.

6. **Pages are always Server Components.** Never add `"use client"` to a `page.tsx` file. If a page needs client-side behaviour, extract that into a separate component and import it into the page.

7. **Prefer Server Components by default.** Only create a Client Component (`"use client"`) when it genuinely requires browser APIs, event handlers, or React hooks. If a component only renders JSX or receives server data as props, keep it as a Server Component.

