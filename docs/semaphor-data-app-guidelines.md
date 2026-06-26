# Semaphor Data App Guidelines

Use these rules when building a Semaphor Data App with Semaphor's Data App SDK
and Semaphor component semantics. They are scoped to Semaphor Data App
implementation and should not replace the host app's root agent or
design-system instructions.

## Core Contract

- Generate Semaphor sources, fields, inputs, queries, and bindings from the
  accepted Data App contract. Do not hand-write parallel analytics specs.
- Keep `App.tsx` as a provider and page shell. Put repeated data-bearing views
  in `src/views`, `src/cards`, `src/sections`, or `src/components`.
- Use generated `queryOptionsForView.*(inputHandles)` or equivalent generated
  bindings so filters are applied from the contract, not inferred from labels.
- Treat generated query factories, column-key helpers, row-value helpers, and
  input-scope metadata as the app's local contract. Components should receive
  SDK query results and generated helpers; they should not reconstruct source
  refs, filter bindings, row keys, table sort identities, or matrix cells.

## Generated API Map

Use the generated contract helpers by responsibility:

- `queries.<view>`: governed SDK query definition for a data-bearing view.
- `queryOptionsForView.<view>(inputHandles)`: runtime options that apply only
  the generated filters proven for that view.
- `inputOptionQueries.<input>`: governed SDK option-list query for a filter.
- `queryOptionsForInputOptionQuery.<input>(inputHandles)`: runtime options for
  explicit cascading option dependencies.
- `tableColumnsForView.<view>`: generated display/sort columns for records
  views.
- `rowValuesForView.<view>(row, columns)`: maps one raw runtime row into
  generated field keys.
- `rowsForView.<view>(result)`: maps a whole records result into generated row
  keys and is the preferred table/chart input.
- `roleValuesForView.<view>(row, columns)`: stable role accessors such as
  `primaryDimension` and `primaryMeasure` for UI that should survive dimension
  swaps.
- `metricValuesForView.<view>(result)`: maps metric result bindings into
  generated metric keys.
- `missingMetricMeasuresForView.<view>(result)`: reports requested metrics that
  runtime did not return.

Do not read `result.value` or raw `result.records` as the generated UI
contract. Use `metricValuesForView` for KPIs and `rowsForView` for records,
charts, and tables.

## Live Generated Query Pattern

```tsx
import {
  appInputSpecs,
  createInputHandleMap,
  inputOptionQueries,
  metricValuesForView,
  queries,
  queryOptionsForInputOptionQuery,
  queryOptionsForView,
  rowsForView,
  tableColumnsForView,
} from "@/semaphor/generated"
import { SemaphorMultiSelectFilter } from "@/components/semaphor/filter-controls"
import { SemaphorMetricKpiCard } from "@/components/semaphor/metric-kpis"
import { SemaphorServerDataTable } from "@/components/semaphor/server-data-table"
import {
  type SemaphorInputHandle,
  useSemaphorInputs,
  useSemaphorQuery,
} from "react-semaphor/data-app-sdk"

export function RevenueOverview() {
  const handles = useSemaphorInputs(appInputSpecs)
  const inputHandles = createInputHandleMap(handles)

  const regionOptions = useSemaphorQuery(
    inputOptionQueries.region,
    queryOptionsForInputOptionQuery.region(inputHandles),
  )
  const kpi = useSemaphorQuery(
    queries.keyMeasures(),
    queryOptionsForView.keyMeasures(inputHandles),
  )

  const metrics = metricValuesForView.keyMeasures(kpi)

  return (
    <>
      <SemaphorMultiSelectFilter
        label="Region"
        options={regionOptions.options}
        value={(inputHandles.region?.value as string[] | undefined) ?? []}
        onChange={(value) =>
          (inputHandles.region as SemaphorInputHandle<string[]> | undefined)?.setValue(value)
        }
      />
      <SemaphorMetricKpiCard
        result={kpi}
        label="Revenue"
        value={metrics.netRevenue}
        format="currency-compact"
      />
      <SemaphorServerDataTable
        queryFactory={(state) => queries.topProducts(state)}
        options={queryOptionsForView.topProducts(inputHandles)}
        columns={tableColumnsForView.topProducts}
        rowsAccessor={(result) => rowsForView.topProducts(result)}
      />
      {/* Use metrics.netRevenue for custom KPI shells when not using the starter KPI card. */}
    </>
  )
}
```

## Default Semaphor Components Or Equivalent Semantics

The default starter includes Semaphor components for query state, view shells,
filters, KPIs, tables, and matrix views. They are the default starter and eval
implementation, not a required customer design system. Customer apps may
replace any visual component with their own shadcn or product components when
they preserve the same Semaphor semantics.

- Use `SemaphorViewCard viewId={...}` by default for generated starter/eval
  views, or provide an equivalent shell that exposes the generated
  `data-semaphor-view-id` marker and renders query state plus active filter
  affordances.
- Use generated `semaphorViewMarkerProps(viewId)` and
  `semaphorInputMarkerProps(inputId)` when host-owned components need to carry
  the same inspectable authoring markers.
- Use `SemaphorQueryStateBoundary` by default, or equivalent loading, error,
  empty, partial, and refreshing state semantics backed by SDK result state.
- Use `filter-controls` by default for generated apps, or equivalent controls
  backed by generated input handles and `semaphor.inputOptions(...)`.
- Use `metric-kpis`, `server-data-table`, and `matrix-table` by default for
  matching SDK result shapes. Custom components must still consume SDK results
  directly and preserve server-owned pagination, sorting, and matrix semantics.

## Filter Semantics

- A card is not "filtered" just because a filter can apply to it.
- Show card-level filter badges only for active selected filter values scoped to
  that view.
- Treat relationship keys as execution metadata. User-facing filter values
  should be business attributes unless the input is explicitly an entity picker
  with an id value and human label.
- Do not infer filter applicability from text, chart rows, or field-name
  guesses. Use generated input scope metadata.

## Visual Quality

- Keep dashboard pages quiet, dense, and scannable: concise header, visible
  filters, KPI row, charts/tables grouped by task.
- Use the host shadcn theme tokens. Do not hardcode Semaphor colors, gradients,
  shadows, or oversized marketing-style sections.
- Prefer small, consistent controls. Avoid wrapping text inside cramped filter
  triggers.

## Validation

- Run the generated app typecheck.
- Run the Semaphor Data App validator.
- Capture DevTools traces and verify that data-bearing views settle.
- When possible, select at least one filter option and confirm subscribed views
  rerun while unrelated views remain stable.
- For launch/readiness smoke, include one page or test path that exercises a
  KPI, records/table view, matrix view, at least one visible filter, and public
  SDK result state (`isFiltered`, `isEmpty`, `isPartial`, `executionResult`,
  and column-key row access).
