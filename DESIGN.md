# Semaphor Data App Starter Design Guide

> Read this before changing dashboard UI, samples, or Semaphor presentation
> components in this starter.

This starter is the default first-run experience for generated Semaphor Data
Apps. It should give agents and developers a polished, inspectable baseline
without requiring a second component install.

## Distribution Mental Model

The starter owns the default customer bootstrap:

- `src/components/ui/*` are the host shadcn primitives. They belong to the app
  and may be changed by a customer preset or product design system.
- `src/components/semaphor/*` are Semaphor-specific composition components for
  query states, view cards, filters, KPIs, server tables, and matrix tables.
- `src/samples/*` and `/samples` are the local visual and interaction baseline
  that agents should inspect before building a dashboard.
- `docs/semaphor-data-app-guidelines.md` owns Semaphor SDK semantics: generated
  bindings, filter value/label separation, query state, validation, and DevTools.

`semaphor-data-app-components` remains the public gallery and optional
individual registry/reference path for existing apps. It is not part of the
default starter bootstrap path.

## Design Principles

1. **Compose over primitive churn.** Put Semaphor dashboard behavior and
   affordances under `src/components/semaphor/*`. Do not change
   `src/components/ui/*` to fix one dashboard or one Semaphor component.
2. **Use host tokens.** Use Tailwind/shadcn tokens from `src/index.css`:
   `bg-background`, `bg-card`, `text-muted-foreground`, `border-border`,
   `text-brand`, `--chart-*`. Do not hardcode one-off hex colors, shadows, or
   radius values.
3. **Start from local samples.** For generated dashboards, first inspect
   `/samples` and adapt the closest pattern: executive scorecard, operational
   records, matrix analysis, KPI preview, filter controls, server table, or
   matrix table.
4. **Preserve Semaphor semantics.** UI can be customized, but generated query
   specs, input handles, source-bearing refs, query state, filter scope, and
   server-owned pagination/sorting remain Semaphor contract behavior.

## Visual Baseline

Data Apps should feel like dense analytics tools, not marketing pages.

- Use a compact page header, visible filters, KPI summaries, chart/table grids,
  and clear card titles.
- Keep cards scannable: `CardTitle` for the view name, short functional
  descriptions, and compact applied-filter affordances.
- Prefer full-width dashboard surfaces. Use centered max-width only for docs or
  component detail pages.
- Use border containment over decorative shadows. Save shadows for floating
  overlays such as popovers and dropdowns.
- Use `tabular-nums` for displayed measures, counts, currencies, percentages,
  dates, and table totals.

## Canonical Exemplars

`/samples` is the bar, not just a gallery. Before building, open it and copy the
closest pattern instead of inventing layout.

Dashboard patterns (Dashboards in `/samples`):

- **Executive scorecard**: page header, filter bar, KPI row, a chart grid, and a
  bounded records table. The default for "how are we doing."
- **Operations table**: page header, scoped filters, and one server-backed table
  as the primary workspace.
- **Matrix drilldown**: page header, scoped filters, KPI context, and a matrix
  table as the primary workspace.

Component exemplars (Components in `/samples`):

- KPIs: `Metric KPIs`. Charts: `Charts`. Filters: `Filter Controls`.
- Tables: `Server Data Table`, `Matrix Table`.
- State: `Query State Boundary`, `View Card`.

Good first run: dense, scannable, data-first, formatted numbers, every chart and
table formatter-aware. Avoid: marketing heroes, oversized decorative cards, broad
gradients, unbounded card grids, charts with raw/unformatted tooltips, and
hand-rolled controls when a starter component exists.

## Tooltips

There are two kinds of tooltip. Treat them differently.

**Chart tooltips** (hover on a data point) belong to the chart components. Use
the Semaphor chart wrappers; never add a raw Recharts `<Tooltip>`. Pass
`valueFormatter`, and `labelFormatter` for date or coded dimensions, so the
tooltip shows the same formatted value as the axis.

**UI help tooltips** (hover on an icon, label, or control) use `InfoTip` from
`src/components/semaphor/info-tip`, which wraps the `ui/tooltip.tsx` primitive.

Use a help tooltip for:

- icon-only buttons that need an accessible name,
- a metric or measure definition next to a KPI or column header,
- a truncated label whose full text matters,
- why a control is disabled.

Do not:

- hide information the user needs to finish the task inside a tooltip,
- put links, buttons, or other interactive content in a tooltip,
- restate a label that is already visible,
- use a tooltip for persistent or multi-line detail (e.g. an active-filter
  summary); that belongs in a Popover, optionally with `openOnHover`,
- override tooltip colors per usage. Re-theme through `bg-popover`/`--popover-*`.

Mechanics: one short sentence, sentence case, default side `top`, and let the
shared 150ms delay stand.

## Type And Spacing Roles

Pick text size by role instead of eyeballing:

| Role | Typical class |
| --- | --- |
| Page/dashboard title | `text-2xl font-semibold tracking-tight` |
| Primary KPI value | `text-3xl font-semibold tabular-nums` |
| Secondary KPI value | `text-2xl font-semibold tabular-nums` |
| Card title | `text-base font-medium` |
| Body/description | `text-sm text-muted-foreground leading-6` |
| Filter/select value | `text-sm` |
| Table body/footer | `text-sm tabular-nums` |
| Table header/action text | `text-xs font-medium` |
| Eyebrow/KPI label/nav group | `text-[11px] font-medium uppercase tracking-wider text-muted-foreground` |

Avoid stray `text-lg`, `text-xl`, oversized dashboard cards, or large empty
sections unless the sample pattern already uses them for a clear reason.

## Required Data App Affordances

Every data-bearing generated view should preserve these affordances:

- `SemaphorQueryStateBoundary` or equivalent handling for loading, refreshing,
  empty, partial, failed, and stale states.
- `SemaphorViewCard` or equivalent card shell for query state and active
  per-card filter scope cues.
- `filter-controls` or equivalent controls backed by generated input handles.
- `SemaphorMetricKpiCard` / `SemaphorMultiMeasureKpis` or equivalent KPI
  rendering that uses generated `metricValuesForView` accessors or explicit
  `result.primaryValue` for single-measure SDK results.
- `ServerDataTableView` or equivalent server-owned table behavior for large,
  sortable, paginated, or exploratory records.
- `MatrixTableView` or equivalent matrix behavior for governed matrix results.
- Semaphor chart wrappers (`SemaphorLineChart`, `SemaphorAreaChart`,
  `SemaphorBarChart`, `SemaphorPieChart`, `SemaphorRadarChart`) for
  visualizations, always with a `valueFormatter` so the axis and the tooltip
  show the same number. Do not hand-roll Recharts in view code.
- `InfoTip` for inline help (metric definitions, icon-button names) instead of
  ad-hoc per-view tooltips.

## What Not To Do

- Do not install a second Semaphor component bundle into this starter by
  default.
- Do not parse labels, chart rows, or prose to infer analytics behavior.
- Do not convert Semaphor option values to strings before writing them back to
  input handles unless the original value was already a string.
- Do not hide partial, failed, stale, or empty states behind generic success UI.
- Do not replace the starter samples with static demo data as the production
  source of truth. Generated apps must use `react-semaphor/data-app-sdk`
  runtime queries.

## Before Handoff

- [ ] Read `AGENTS.md`, this file, and `docs/semaphor-data-app-guidelines.md`.
- [ ] Used `/samples` as the visual baseline.
- [ ] Kept `App.tsx` as provider/page composition, not a giant dashboard file.
- [ ] Put repeated data-bearing views into separate components.
- [ ] Preserved query state and active filter-scope affordances.
- [ ] Used generated query/input bindings instead of hand-written analytics
      specs.
- [ ] Ran typecheck/lint/test or documented why a check could not run.
