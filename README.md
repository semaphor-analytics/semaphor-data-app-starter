# Semaphor Data App Starter

A Vite React starter for building Semaphor-backed data apps with Codex, Claude
Code, or another coding agent.

This template includes:

- React 19, TypeScript, Vite, and Tailwind CSS v4
- shadcn/ui using the `b1au68YWO` preset with Base UI primitives
- `react-semaphor` and `react-semaphor/data-app-sdk`
- TanStack Table and TanStack Virtual for production table paths
- a dashboard shell with loading/error/empty-ready table patterns

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
Use my Semaphor project data to replace the starter dashboard with real KPIs,
filters, a trend, and a server-backed table.
```

For broad dashboard changes, ask for a plan before editing:

```text
Plan the dashboard first. Show which views are server-backed, derived, or not
supported by the current model.
```

## Starter Query

`src/semaphor/starter-query.ts` contains a compile-time example of the
Semaphor Data App SDK query shape. Its source and field refs are placeholders.
Ask the Semaphor Agent Plugin to replace them with MCP-discovered project
metadata before enabling live execution.

Live execution is off by default:

```bash
VITE_SEMAPHOR_ENABLE_STARTER_QUERY="false"
```

After the query refs are replaced with real Semaphor metadata, set it to:

```bash
VITE_SEMAPHOR_ENABLE_STARTER_QUERY="true"
```

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
