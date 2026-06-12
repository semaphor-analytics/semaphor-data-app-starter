# Semaphor Data App Starter

A Vite React starter for building Semaphor-backed data apps with Codex, Claude
Code, or another coding agent.

For the reusable Semaphor UI component gallery, see:
https://semaphor-analytics.github.io/semaphor-data-app-components/

This template includes:

- React 19, TypeScript, Vite, and Tailwind CSS v4
- shadcn/ui using the `b1au68YWO` preset with Base UI primitives
- `react-semaphor` and `react-semaphor/data-app-sdk`
- TanStack Table and TanStack Virtual for production table paths
- shadcn chart, select, input, textarea, progress, tabs, tooltip, table, card,
  alert, badge, and skeleton components
- a clean placeholder app surface for agent-generated Semaphor views

Reusable Semaphor-specific UI helpers are distributed through the
`semaphor-data-app-components` shadcn registry. Prefer creating new apps with
`create-semaphor-app --components recommended` when you want those helpers
installed into the app source.

For a presentable first run, start from the component gallery samples instead
of hand-rolling dashboard chrome:

```text
https://semaphor-analytics.github.io/semaphor-data-app-components/
```

Use the closest sample pattern as the baseline: executive scorecard,
operations table, or matrix drilldown. The starter should keep Semaphor app
wiring and DevTools setup; reusable visuals should come from the registry.

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

After installing the recommended registry components, use the Semaphor-aware
presentation components for query state and KPI rendering:

```bash
npx shadcn@latest add semaphor-analytics/semaphor-data-app-components/metric-kpis
```

Then import the installed source component:

```tsx
import { SemaphorMetricKpiCard } from "@/components/semaphor/metric-kpis"
```

```tsx
const revenue = useSemaphorQuery(
  queries.revenue,
  queryOptionsForView.revenue(inputHandles)
)

return (
  <SemaphorMetricKpiCard
    result={revenue}
    label="Revenue"
    format="currency-compact"
    comparisonLabel="vs previous period"
  />
)
```

`SemaphorQueryStateBoundary` accepts the same query result object and handles
loading, empty, partial, failed, and stale states. For multi-measure metric
queries, pass the same result to `SemaphorMultiMeasureKpis`. Query-level metric
comparisons belong to the primary `result.value`; explicit secondary
`measureKey` KPI cards do not reuse that comparison badge.

For tables, prefer the installed TanStack Table dependency and Semaphor
server-side filtering, sorting, and pagination for large result sets.

Date controls should not activate a wall-clock range merely because they
render. Use shared query `timeWindow` with `timeWindowAnchor: "latest_available"`
for BI windows unless the user explicitly asks for wall-clock `now`. If the
planner intentionally wants a visible default date filter, provide it through
generated input defaults or an explicit `defaultPreset`/`defaultValue` on
`SemaphorDateRangeFilter`.

## Scripts

```bash
npm run dev
npm test
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
