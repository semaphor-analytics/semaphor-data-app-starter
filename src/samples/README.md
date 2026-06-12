# Reference Dashboard

A visual and structural reference for what a polished Semaphor-backed data app
looks like. Routed at `/samples`.

## Purpose

When you ask Codex or Claude Code to build a dashboard with the Semaphor Agent
Plugin, the agent is instructed to look here first and match its conventions:

- Page header and filter bar layout
- KPI strip with delta + comparison context
- SDK-backed KPI and multi-measure KPI components
- Trend chart with prev-period comparison
- Ranked composition view
- Sortable, bounded data table with a totals row
- Applied-filter chip strip on every affected card
- Density and spacing choices

## Important: dummy data only

Every page reads from static JSON in `data/`. There are no SDK calls and no
network. This sample exists for visual reference and as a structural
copy-anchor only — **production code must use `useSemaphorQuery`** per
`react-semaphor/data-app-sdk`. Agents are explicitly told not to copy this
sample's data-loading pattern.

The KPI and state pages also show Semaphor query-result components with
result-shaped fixtures. In production, pass the real `useSemaphorQuery` result
object to `SemaphorMetricKpiCard`, `SemaphorMultiMeasureKpis`, or
`SemaphorQueryStateBoundary`.

## Running

```bash
npm install
npm run dev
```

Then open `/samples` in the browser.

## Customizing

Edit any file under `src/samples/` and the dev server hot-reloads. If you
change the theme tokens in `src/index.css`, the sample inherits them — that
is the point. Drop your own reference in `src/samples/` if you want the agent
to learn a different aesthetic.
