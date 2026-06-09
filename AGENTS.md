# Semaphor Data App Starter - Agent Guide

This starter is a Vite React app for agent-built Semaphor Data Apps. Treat it
as the local UI and composition reference for generated dashboards.

## Core Split

The Semaphor Agent Plugin owns analytics mechanics:

- Semaphor auth, project, and semantic-domain discovery.
- Data App planning and contract generation.
- Generated source refs, fields, inputs, input option queries, view queries,
  and per-view input bindings under `src/semaphor/generated`.
- Runtime SDK usage, DevTools, validation, and trace verification.

This starter owns presentation:

- Page shell, dashboard density, spacing, typography, cards, filters, charts,
  tables, matrix views, loading/error/empty states, and applied-filter chips.
- Reusable React components under `src/samples/components` and
  `src/components/ui`.
- Visual conventions shown by the sample pages under `src/samples/pages`.

Do not move analytics decisions into presentation components, and do not invent
Semaphor query/filter wiring in UI files when generated contract exports exist.

## Before Editing

For broad Data App/dashboard builds:

1. Read this file, `README.md`, and `src/samples/README.md`.
2. Inspect `src/samples/pages/OverviewPage.tsx` for the preferred dashboard
   structure.
3. Inspect the specific sample components you plan to reuse.
4. Use Semaphor MCP/plugin tools to resolve auth, project, domain, and the
   generated analytics contract before writing UI.
5. Decide the implementation map before the first source edit: component
   layout, generated query ids, filter scope, applied-filter chip behavior,
   and root DevTools setup.

Do not start by replacing `src/App.tsx` with a large dashboard file.

## Required Semaphor Pattern

For greenfield generated apps, prefer the plugin's combined contract path:

```text
semaphor_create_data_app_contract(workspaceDir, domainId, goal, preferences)
-> import from src/semaphor/generated
-> build UI with local starter components
-> semaphor_validate_data_app_contract(workspaceDir)
```

Runtime UI should import generated analytics exports such as:

```tsx
import {
  appInputSpecs,
  createInputHandleMap,
  inputOptionQueries,
  inputsForView,
  queries,
  semaphorGeneratedContractMetadata,
} from "./semaphor/generated"
```

Use `useSemaphorInputs(appInputSpecs)` for visible filters, `inputOptionQueries`
for Semaphor-backed dropdown choices, and `useSemaphorQuery(queries.someView,
{ inputs: inputsForView.someView(inputHandles) })` for view data.

Do not define Semaphor sources, fields, query specs, input option specs, or
filter bindings by hand in `App.tsx` or view components unless the generator
reported a clear unsupported gap.

## Sample Components To Reuse

Use these components before creating new dashboard primitives:

- `src/samples/components/PageHeader.tsx`: top page title, subtitle, date badge,
  and actions.
- `src/samples/components/FilterBar.tsx`: global or section-level filter row.
- `src/samples/components/DateRangePicker.tsx`: date-range filter with presets.
- `src/samples/components/MultiSelectFilter.tsx`: searchable multi-select
  dropdown.
- `src/samples/components/SingleSelectFilter.tsx`: searchable or compact
  single-select dropdown.
- `src/samples/components/ChartCard.tsx`: card shell with title, description,
  action slot, body padding control, and applied-filter chips.
- `src/samples/components/FilterChipStrip.tsx`: compact per-card applied
  filter affordance.
- `src/samples/components/KpiStrip.tsx`, `KpiCard.tsx`, `MultiMeasureKpi.tsx`,
  and `SparklineKpi.tsx`: KPI presentation.
- `src/samples/components/TrendChart.tsx`,
  `src/samples/components/RankedBarChart.tsx`, and
  `src/samples/components/charts/*`: chart presentation.
- `src/samples/components/DataTable.tsx` and `ServerDataTable.tsx`: table
  presentation and server-table mechanics.
- `src/samples/components/Matrix.tsx`: matrix/pivot presentation.
- `src/samples/components/states.tsx`: loading, empty, and error states.

Use `src/components/ui/*` shadcn primitives for lower-level UI controls.

## Sample Data Boundary

Files under `src/samples/data` are dummy data for visual examples only.

Agents may copy component structure and styling from samples, but production
Data App views must use `react-semaphor/data-app-sdk` runtime queries. Do not
copy sample JSON imports, static arrays, or client-side filtering as the source
of truth for governed analytics.

## Filter UX Rules

- Render dashboard-wide filters in `FilterBar`.
- Render scoped filters near the section they affect or label their scope
  clearly.
- Populate Semaphor-backed filter choices through generated
  `inputOptionQueries`, not broad `records` lookup queries.
- Preserve label/value/runtime-field separation:
  visible label can be a name, selected value should be a stable key when
  available, and runtime binding must use the planner-approved field for each
  view.
- Preserve raw Semaphor option values when adapting to local UI controls. If a
  shadcn/sample component requires string values, use a local string key for
  the control and map it back to the original `option.value` before calling
  `handle.setValue(...)`. Do not write `String(option.value)` back to a
  Semaphor handle unless the raw option value was already a string.
- Use `semaphorGeneratedContractMetadata.filterScopeByInput` to decide which
  cards show applied-filter chips.
- Every affected card/chart/table should show compact applied-filter chips via
  `ChartCard` and `FilterChipStrip`.
- Do not pass a filter handle to a view unless `inputsForView` does so.
- Browser-test each visible filter by selecting an option, confirming the
  trigger label changes, confirming the selected value is not cleared by input
  option validation, and confirming subscribed cards show applied-filter chips.

## Layout And Style

- Build the actual dashboard experience as the first screen, not a landing
  page.
- Prefer dense, scannable operational layouts: page header, filter bar, KPI
  strip, charts, tables, and supporting commentary blocks.
- Keep `App.tsx` focused on provider setup, root DevTools, and high-level
  composition.
- Put repeated data-bearing cards/views into separate components under a
  feature, dashboard, views, sections, or cards folder.
- Keep card titles compact and descriptions functional.
- Use local formatting helpers or small local utilities for numbers, dates,
  currency, and percentages.
- Preserve loading, empty, error, and stale/unsupported states for each
  data-bearing component.
- Do not add unrelated dependencies when local shadcn/sample components can
  express the UI.

## DevTools

Generated local/dev apps should mount one root `SemaphorDevtools` under
`SemaphorDataAppProvider`, with the provider debug bridge enabled only for
authoring environments. Do not add per-card DevTools wrapper boilerplate.

Use the built-in DevTools and browser smoke checks to verify:

- data query traces register,
- input option traces register,
- selecting each visible filter reruns subscribed queries,
- affected cards show applied-filter chips,
- unsupported or unscoped filters are deliberate and visible.

## Validation

Before final handoff, run:

```bash
npm run typecheck
npm run build
```

When the Semaphor plugin tools are available, also run:

```text
semaphor_validate_data_app_contract(workspaceDir)
```

If a Semaphor filter, metric, table, or chart cannot be expressed through the
generated contract and public SDK, state the unsupported gap and the workaround
instead of silently shipping client-side analytics logic.
