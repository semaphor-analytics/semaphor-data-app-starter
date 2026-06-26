# Semaphor Charts

Themed Recharts wrappers for generated Data App rows. These are the sanctioned
charting path for generated apps. Do not hand-roll Recharts in view code: the
wrappers keep tooltips, axes, legends, colors, and value formatting consistent,
and they let a customer re-theme every chart by overriding `--chart-*` tokens.

## Catalog

| Component | Use for | Multi-series |
| --- | --- | --- |
| `SemaphorLineChart` | Trends over time | Yes (`series`) |
| `SemaphorAreaChart` | Trends with magnitude; `stacked` for composition over time | Yes |
| `SemaphorBarChart` | Category comparison; `stacked` and `horizontal` variants | Yes |
| `SemaphorPieChart` | Part-to-whole (`donut` by default, `showLegend`) | No (single measure) |
| `SemaphorRadarChart` | Multi-axis profiles / scorecards | Yes |

## Rules

- Pass generated rows from `rowsForView.<view>(result)`, not raw `result.records`.
- Pass generated field keys as `dimensionKey`/`valueKey` (or `series[].key`),
  never display labels. For views that may swap dimensions, prefer the generated
  role accessors (`primaryDimension`, `primaryMeasure`, `secondaryMeasure`).
- Always pass a `valueFormatter` so the Y axis and the tooltip render the same
  number (currency, percent, compact). Use `labelFormatter` for date or coded
  dimensions so axis ticks and the tooltip label match.
- Use `aggregateDuplicateLabels` only when the chart should intentionally combine
  duplicate display labels. It keeps React keys stable and sums every measure.
- Colors come from the host `--chart-1..5` ramp via `chartColorAt`. Do not pass
  one-off hex colors; override the tokens in `index.css` to re-theme globally.

## Single vs multi-series

```tsx
// Single measure
<SemaphorLineChart
  rows={rowsForView.revenueTrend(result)}
  dimensionKey="order_month"
  valueKey="net_revenue"
  valueLabel="Revenue"
  valueFormatter={(v) => currency.format(Number(v))}
  labelFormatter={(v) => formatMonth(v)}
/>

// Multiple measures (legend renders automatically)
<SemaphorBarChart
  rows={rowsForView.channelMix(result)}
  dimensionKey="channel"
  series={[
    { key: "net_revenue", label: "Revenue" },
    { key: "target_revenue", label: "Target" },
  ]}
  valueFormatter={(v) => currency.format(Number(v))}
/>
```

## Breakdown (long to wide)

When a query returns long rows (one row per dimension + breakdown value), use
`pivotChartRows` to turn the breakdown into series for a grouped or stacked
chart, instead of hand-rolling pivot logic. Keep the breakdown cardinality
bounded.

```tsx
const { rows, series } = pivotChartRows(
  rowsForView.salesByMonthSegment(result),
  { dimensionKey: "order_month", seriesKey: "segment", valueKey: "net_revenue" },
)

<SemaphorBarChart
  rows={rows}
  dimensionKey="order_month"
  series={series}
  stacked
  valueFormatter={(v) => currency.format(Number(v))}
/>
```

See `src/samples/examples/charts-basic.tsx` and `/samples` for the canonical,
runnable examples to copy.
