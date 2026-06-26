import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import {
  buildSemaphorChartRows,
  chartColorAt,
  numberValue,
  resolveChartSeries,
  stringValue,
  sumValues,
  type ResolvedChartSeries,
  type SemaphorChartLabelFormatter,
  type SemaphorChartRow,
  type SemaphorChartSeries,
  type SemaphorChartValueFormatter,
} from "./core"

/**
 * Plotted measure(s). A chart must receive exactly one of: a single `valueKey`
 * shorthand, or an explicit `series` list. The union makes passing neither a
 * compile-time error. (An empty `series` array still type-checks because
 * generated/pivoted series are built dynamically; the wrappers guard for it at
 * runtime.)
 */
type ChartSeriesInput =
  | { valueKey: string; valueLabel?: string; series?: never }
  | {
      series: readonly SemaphorChartSeries[]
      valueKey?: never
      valueLabel?: never
    }

/**
 * Shared props for cartesian charts (line, area, bar). Pass generated rows from
 * `rowsForView` and generated field keys. Colors default to the themed
 * `--chart-*` ramp; customers re-theme globally by overriding those tokens.
 */
type CartesianChartProps = {
  rows: readonly Record<string, unknown>[]
  dimensionKey: string
  className?: string
  /** Formats measure values for the Y axis and tooltip. */
  valueFormatter?: SemaphorChartValueFormatter
  /** Formats the dimension for the X axis ticks and tooltip label. */
  labelFormatter?: SemaphorChartLabelFormatter
  aggregateDuplicateLabels?: boolean
} & ChartSeriesInput

function ChartEmpty({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-32 w-full items-center justify-center text-xs text-muted-foreground",
        className,
      )}
    >
      No chart series provided
    </div>
  )
}

function buildChartConfig(series: ResolvedChartSeries[]): ChartConfig {
  const config: ChartConfig = {}
  for (const entry of series) {
    config[entry.key] = { label: entry.label, color: entry.color }
  }
  return config
}

function formatValue(
  value: unknown,
  formatter: SemaphorChartValueFormatter | undefined,
): string {
  return formatter ? formatter(value) : numberValue(value).toLocaleString()
}

function formatLabel(
  value: unknown,
  formatter: SemaphorChartLabelFormatter | undefined,
): string {
  return formatter ? formatter(value) : stringValue(value)
}

function sharedTooltip(
  valueFormatter: SemaphorChartValueFormatter | undefined,
  labelFormatter: SemaphorChartLabelFormatter | undefined,
) {
  return (
    <ChartTooltip
      cursor={false}
      content={
        <ChartTooltipContent
          labelFormatter={(value) => formatLabel(value, labelFormatter)}
          valueFormatter={(value) => formatValue(value, valueFormatter)}
        />
      }
    />
  )
}

// ---------------------------------------------------------------------------
// Line
// ---------------------------------------------------------------------------

export type SemaphorLineChartProps = CartesianChartProps & {
  curve?: "monotone" | "linear" | "step"
  dots?: boolean
}

export function SemaphorLineChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel,
  series,
  className,
  valueFormatter,
  labelFormatter,
  aggregateDuplicateLabels,
  curve = "monotone",
  dots = false,
}: SemaphorLineChartProps) {
  const resolved = resolveChartSeries({ series, valueKey, valueLabel })
  if (resolved.length === 0) {
    return <ChartEmpty className={className} />
  }
  const data = buildSemaphorChartRows(rows, {
    dimensionKey,
    valueKeys: resolved.map((entry) => entry.key),
    aggregateDuplicateLabels,
  })
  const config = buildChartConfig(resolved)

  return (
    <ChartContainer config={config} className={className}>
      <LineChart data={data} accessibilityLayer margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dimensionKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => formatLabel(value, labelFormatter)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatValue(value, valueFormatter)}
        />
        {sharedTooltip(valueFormatter, labelFormatter)}
        {resolved.length > 1 ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        {resolved.map((entry) => (
          <Line
            key={entry.key}
            dataKey={entry.key}
            type={curve}
            stroke={`var(--color-${entry.key})`}
            strokeWidth={2}
            dot={dots ? { r: 3 } : false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

// ---------------------------------------------------------------------------
// Area
// ---------------------------------------------------------------------------

export type SemaphorAreaChartProps = CartesianChartProps & {
  curve?: "monotone" | "linear" | "step"
  stacked?: boolean
}

export function SemaphorAreaChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel,
  series,
  className,
  valueFormatter,
  labelFormatter,
  aggregateDuplicateLabels,
  curve = "monotone",
  stacked = false,
}: SemaphorAreaChartProps) {
  const resolved = resolveChartSeries({ series, valueKey, valueLabel })
  if (resolved.length === 0) {
    return <ChartEmpty className={className} />
  }
  const data = buildSemaphorChartRows(rows, {
    dimensionKey,
    valueKeys: resolved.map((entry) => entry.key),
    aggregateDuplicateLabels,
  })
  const config = buildChartConfig(resolved)

  return (
    <ChartContainer config={config} className={className}>
      <AreaChart data={data} accessibilityLayer margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dimensionKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => formatLabel(value, labelFormatter)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatValue(value, valueFormatter)}
        />
        {sharedTooltip(valueFormatter, labelFormatter)}
        {resolved.length > 1 ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        {resolved.map((entry) => (
          <Area
            key={entry.key}
            dataKey={entry.key}
            type={curve}
            stackId={stacked ? "stack" : undefined}
            stroke={`var(--color-${entry.key})`}
            fill={`var(--color-${entry.key})`}
            fillOpacity={resolved.length > 1 ? 0.2 : 0.3}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

// ---------------------------------------------------------------------------
// Bar
// ---------------------------------------------------------------------------

export type SemaphorBarChartProps = CartesianChartProps & {
  /** Stack series instead of grouping them side by side. */
  stacked?: boolean
  /** Horizontal (ranked) bars instead of vertical columns. */
  horizontal?: boolean
}

export function SemaphorBarChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel,
  series,
  className,
  valueFormatter,
  labelFormatter,
  aggregateDuplicateLabels,
  stacked = false,
  horizontal = false,
}: SemaphorBarChartProps) {
  const resolved = resolveChartSeries({ series, valueKey, valueLabel })
  if (resolved.length === 0) {
    return <ChartEmpty className={className} />
  }
  const data = buildSemaphorChartRows(rows, {
    dimensionKey,
    valueKeys: resolved.map((entry) => entry.key),
    aggregateDuplicateLabels,
  })
  const config = buildChartConfig(resolved)
  const radius = stacked ? 0 : 4

  return (
    <ChartContainer config={config} className={className}>
      <BarChart
        data={data}
        accessibilityLayer
        layout={horizontal ? "vertical" : "horizontal"}
      >
        <CartesianGrid
          vertical={horizontal}
          horizontal={!horizontal}
        />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatValue(value, valueFormatter)}
            />
            <YAxis
              type="category"
              dataKey={dimensionKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={96}
              tickFormatter={(value) => formatLabel(value, labelFormatter)}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={dimensionKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatLabel(value, labelFormatter)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatValue(value, valueFormatter)}
            />
          </>
        )}
        {sharedTooltip(valueFormatter, labelFormatter)}
        {resolved.length > 1 ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        {resolved.map((entry) => (
          <Bar
            key={entry.key}
            dataKey={entry.key}
            fill={`var(--color-${entry.key})`}
            stackId={stacked ? "stack" : undefined}
            radius={radius}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

// ---------------------------------------------------------------------------
// Pie / Donut
// ---------------------------------------------------------------------------

export type SemaphorPieChartProps = {
  rows: readonly Record<string, unknown>[]
  /** Field key whose values name the slices. */
  dimensionKey: string
  /** Field key for slice magnitude. */
  valueKey: string
  valueLabel?: string
  className?: string
  valueFormatter?: SemaphorChartValueFormatter
  /** Render as a donut (default) or a full pie. */
  donut?: boolean
  /** Show a legend of slice labels. */
  showLegend?: boolean
  /**
   * Caption rendered under the formatted total in the donut center (donut only).
   * Providing it enables the center total.
   */
  centerLabel?: string
  /** Slices are aggregated by label by default so categories stay unique. */
  aggregateDuplicateLabels?: boolean
}

export function SemaphorPieChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel,
  className,
  valueFormatter,
  donut = true,
  showLegend = false,
  centerLabel,
  aggregateDuplicateLabels = true,
}: SemaphorPieChartProps) {
  const data = buildSemaphorChartRows(rows, {
    dimensionKey,
    valueKeys: [valueKey],
    aggregateDuplicateLabels,
  })
  const showCenterTotal = donut && Boolean(centerLabel)
  const total = showCenterTotal ? sumValues(data, valueKey) : 0

  const config: ChartConfig = {
    [valueKey]: { label: valueLabel ?? valueKey },
  }
  data.forEach((row, index) => {
    const name = stringValue(row[dimensionKey])
    config[name] = { label: name, color: chartColorAt(index) }
  })

  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square", className)}
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              nameKey={dimensionKey}
              valueFormatter={(value) => formatValue(value, valueFormatter)}
            />
          }
        />
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={dimensionKey}
          innerRadius={donut ? "55%" : 0}
          outerRadius="85%"
          paddingAngle={donut ? 2 : 0}
        >
          {data.map((row, index) => (
            <Cell key={row.__semaphorChartKey} fill={chartColorAt(index)} />
          ))}
          {showCenterTotal ? (
            <Label
              content={(props) => {
                const viewBox = (
                  props as { viewBox?: { cx?: number; cy?: number } }
                ).viewBox
                if (
                  typeof viewBox?.cx !== "number" ||
                  typeof viewBox?.cy !== "number"
                ) {
                  return null
                }
                const { cx, cy } = viewBox
                return (
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={cx}
                      y={cy - 4}
                      className="fill-foreground text-xl font-semibold tabular-nums"
                    >
                      {formatValue(total, valueFormatter)}
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 16}
                      className="fill-muted-foreground text-xs"
                    >
                      {centerLabel}
                    </tspan>
                  </text>
                )
              }}
            />
          ) : null}
        </Pie>
        {showLegend ? (
          <ChartLegend content={<ChartLegendContent nameKey={dimensionKey} />} />
        ) : null}
      </PieChart>
    </ChartContainer>
  )
}

// ---------------------------------------------------------------------------
// Radar
// ---------------------------------------------------------------------------

export type SemaphorRadarChartProps = {
  rows: readonly Record<string, unknown>[]
  /** Field key for the angular axis categories. */
  dimensionKey: string
  className?: string
  valueFormatter?: SemaphorChartValueFormatter
  labelFormatter?: SemaphorChartLabelFormatter
  showLegend?: boolean
} & ChartSeriesInput

export function SemaphorRadarChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel,
  series,
  className,
  valueFormatter,
  labelFormatter,
  showLegend = false,
}: SemaphorRadarChartProps) {
  const resolved = resolveChartSeries({ series, valueKey, valueLabel })
  if (resolved.length === 0) {
    return <ChartEmpty className={className} />
  }
  const data = buildSemaphorChartRows(rows, {
    dimensionKey,
    valueKeys: resolved.map((entry) => entry.key),
  })
  const config = buildChartConfig(resolved)
  const multi = resolved.length > 1

  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square", className)}
    >
      <RadarChart data={data}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatLabel(value, labelFormatter)}
              valueFormatter={(value) => formatValue(value, valueFormatter)}
            />
          }
        />
        <PolarAngleAxis
          dataKey={dimensionKey}
          tickFormatter={(value) => formatLabel(value, labelFormatter)}
        />
        <PolarGrid />
        {resolved.map((entry) => (
          <Radar
            key={entry.key}
            dataKey={entry.key}
            stroke={`var(--color-${entry.key})`}
            fill={`var(--color-${entry.key})`}
            fillOpacity={multi ? 0.35 : 0.6}
          />
        ))}
        {showLegend ? (
          <ChartLegend
            className="mt-4"
            content={<ChartLegendContent />}
          />
        ) : null}
      </RadarChart>
    </ChartContainer>
  )
}

export type {
  SemaphorChartRow,
  SemaphorChartSeries,
  SemaphorChartValueFormatter,
  SemaphorChartLabelFormatter,
}
