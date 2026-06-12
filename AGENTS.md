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

This starter owns application bootstrapping:

- Semaphor provider setup, DevTools placement, environment variables, Vite
  wiring, root layout, and the minimal mount surface for generated Data Apps.
- Local shadcn primitives under `src/components/ui` and any starter-only glue
  required to run the app.

Reusable Semaphor-specific presentation belongs in the public component
registry at `/Users/rohit/code/semaphor/semaphor-data-app-components`.
Use its gallery as the visual source of truth for dashboard density, spacing,
typography, cards, filters, charts, tables, matrix views, loading/error/empty
states, and applied-filter chips.

Do not move analytics decisions into presentation components, and do not invent
Semaphor query/filter wiring in UI files when generated contract exports exist.

## Before Editing

For broad Data App/dashboard builds:

1. Read this file and `README.md`.
2. Open the Semaphor component gallery:
   `https://semaphor-analytics.github.io/semaphor-data-app-components/`.
3. Pick the closest gallery sample before designing a layout:
   executive scorecard, operations table, or matrix drilldown.
4. Install the required registry components with `create-semaphor-app
   --components recommended` or the gallery's `npx shadcn@latest add ...`
   commands.
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
  columnKeysForView,
  createInputHandleMap,
  inputOptionQueries,
  inputsForView,
  rowValuesForView,
  queryOptionsForView,
  queries,
  semaphorGeneratedContractMetadata,
} from "./semaphor/generated"
```

Use `useSemaphorInputs(appInputSpecs)` for visible filters, `inputOptionQueries`
for Semaphor-backed dropdown choices, and `useSemaphorQuery(queries.someView,
queryOptionsForView.someView(inputHandles))` for view data. Prefer
`queryOptionsForView` over manually passing `inputsForView` so DevTools traces
carry the dashboard view title, visual type, query id, and source identity.
For records/analysis views, map rows through
`rowValuesForView.someView(row, result.columns)` or resolve keys with
`columnKeysForView`; do not read `row.semantic_field_name` or
`row[visualSpec.encoding.y]` directly.

Do not define Semaphor sources, fields, query specs, input option specs, or
filter bindings by hand in `App.tsx` or view components unless the generator
reported a clear unsupported gap.

## First-Run Visual Baseline

Do not hand-roll a dashboard from blank cards. For the first generated version,
compose one of these proven patterns:

- Executive scorecard: page header, filter bar, KPI row, trend/card grid, and a
  bounded records table.
- Operations table: page header, scoped filters, and one server-backed table as
  the primary workspace.
- Matrix drilldown: page header, scoped filters, KPI context if useful, and a
  matrix table as the primary workspace.

Good first-run dashboards are dense, readable, and data-first. Avoid marketing
heroes, oversized decorative sections, broad gradients, unbounded card grids,
and custom controls when a registry component exists.

## Registry Components To Reuse

Use the Semaphor component registry before creating new dashboard primitives:

- `query-state-boundary`: query-result boundary for loading, empty, partial,
  failed, and stale SDK states.
- `metric-kpis`: SDK-backed KPI card, comparison badge, and multi-measure KPI
  components. Use these with
  `useSemaphorQuery(queries.someView, queryOptionsForView.someView(inputHandles))`
  results instead of mapping metric payloads into static sample KPI props.
- `filter-controls`: Semaphor-aware date range, single-select, multi-select,
  and active filter summary components. Use these for generated
  Semaphor-backed filters so raw typed option values are preserved.
- `server-data-table`: Semaphor server table component for operational,
  drill-through, exploratory, paginated, or sortable tables.
- `matrix-table`: governed matrix/pivot table for matrix query results.
- `query-state`: lower-level presentation states for custom non-SDK views.

Use `src/components/ui/*` shadcn primitives for lower-level UI controls.

## Sample Data Boundary

Demo data in the component gallery is for visual examples only. Agents may copy
layout structure and component composition from gallery samples, but production
Data App views must use `react-semaphor/data-app-sdk` runtime queries. Do not
copy demo JSON imports, static arrays, or client-side filtering as the source
of truth for governed analytics.

## Filter UX Rules

- Render dashboard-wide filters in `FilterBar`.
- Render scoped filters near the section they affect or label their scope
  clearly.
- Date filters must not set a wall-clock range merely because the control
  rendered. Leave date inputs inactive unless the generated contract supplies
  an initial value or the component receives an explicit `defaultPreset` or
  `defaultValue`.
- For BI query windows, prefer shared query `timeWindow` with
  `timeWindowAnchor: "latest_available"`. Use wall-clock `now` only when the
  user explicitly asks for current-calendar behavior.
- Populate Semaphor-backed filter choices through generated
  `inputOptionQueries`, not broad `records` lookup queries.
- After installing `filter-controls`, use `SemaphorMultiSelectFilter` or
  `SemaphorSingleSelectFilter` from the installed registry component when
  connecting Semaphor input handles to select controls.
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
- Prefer dense, scannable operational layouts from the component gallery: page
  header, filter bar, KPI strip, charts, tables, and supporting commentary
  blocks.
- Keep `App.tsx` focused on provider setup, root DevTools, and high-level
  composition.
- Put repeated data-bearing cards/views into separate components under a
  feature, dashboard, views, sections, or cards folder.
- Keep card titles compact and descriptions functional.
- Use local formatting helpers or small local utilities for numbers, dates,
  currency, and percentages.
- Preserve loading, empty, error, and stale/unsupported states for each
  data-bearing component.
- After installing `server-data-table`, use `SemaphorServerDataTable` or
  `ServerDataTableView` for operational/detail/exploratory/paginated/sortable
  tables. Use simple bounded table markup only for small top-N or summary
  tables.
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
