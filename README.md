# Semaphor Data App Starter

A Vite React starter for building Semaphor-backed data apps with Codex, Claude
Code, or another coding agent.

This template includes:

- React 19, TypeScript, Vite, and Tailwind CSS v4
- shadcn/ui using the `b1au68YWO` preset with Base UI primitives
- `react-semaphor` and `react-semaphor/data-app-sdk`
- TanStack Table and TanStack Virtual for production table paths
- a clean placeholder app surface for agent-generated Semaphor views

The starter is optional. Existing React apps can use the Semaphor Agent Plugin
directly without adopting this repo's file layout.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Semaphor project token to `.env.local`:

```bash
VITE_SEMAPHOR_PROJECT_TOKEN="<project-token>"
```

Get the token from:

```text
https://semaphor.cloud/project
```

## Use With The Semaphor Agent Plugin

Open Codex or Claude Code in this repository and ask:

```text
What Semaphor data can I use in this project?
```

Then ask the agent to customize the starter:

```text
Use my Semaphor project data to replace the placeholder with real KPIs,
filters, a trend, and a server-backed table.
```

For broad dashboard changes, ask for a plan before editing:

```text
Plan the dashboard first. Show which views are server-backed, derived, or not
supported by the current model.
```

## Placeholder App Surface

The starter does not ship with dummy metrics, fake rows, or placeholder query
refs. The first screen is an empty app surface with suggested agent prompts.
That keeps the initial state honest: the agent should inspect your Semaphor
project through MCP before adding data-bearing code.

Generated views should use public SDK imports such as:

```tsx
import {
  SemaphorDataAppProvider,
  semaphor,
  useSemaphorQuery,
} from "react-semaphor/data-app-sdk"
```

For tables, prefer the installed TanStack Table dependency and Semaphor
server-side filtering, sorting, and pagination for large result sets.

## Scripts

```bash
npm run dev
npm run typecheck
npm run build
npm run lint
npm run preview
```

## Publish To Semaphor

When the app is ready, use the Semaphor Agent Plugin from this repository:

```text
Save this as a Semaphor Data App named "Operations Dashboard".
Publish the latest revision to Semaphor.
```

The plugin prepares the static Vite build, saves the source revision, uploads
hashed assets, and publishes the hosted Semaphor Data App.
