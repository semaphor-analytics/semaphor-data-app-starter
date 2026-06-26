export type SemaphorChartRow = Record<string, unknown> & {
  __semaphorChartKey: string
}

/** Formats a measure value for axes and tooltips (currency, percent, compact, etc.). */
export type SemaphorChartValueFormatter = (value: unknown) => string

/** Formats a dimension/category value for axis ticks and tooltip labels (dates, names). */
export type SemaphorChartLabelFormatter = (value: unknown) => string

/**
 * One plotted measure. Use generated field keys from `rowsForView`/role accessors
 * as `key`, never display labels.
 */
export type SemaphorChartSeries = {
  /** Generated runtime field key for this measure. */
  key: string
  /** Legend/tooltip label. Defaults to `key`. */
  label?: string
  /** CSS color. Defaults to the themed `--chart-*` ramp by series order. */
  color?: string
}

export type ResolvedChartSeries = Required<SemaphorChartSeries>

/** Themed chart color from the host `--chart-1..5` ramp, cycling for >5 series. */
export function chartColorAt(index: number): string {
  return `var(--chart-${(index % 5) + 1})`
}

/**
 * Normalize the single-series shorthand (`valueKey`/`valueLabel`) or an explicit
 * `series` list into fully resolved series with stable default colors.
 */
export function resolveChartSeries(input: {
  series?: readonly SemaphorChartSeries[]
  valueKey?: string
  valueLabel?: string
}): ResolvedChartSeries[] {
  const series =
    input.series && input.series.length > 0
      ? input.series
      : input.valueKey
        ? [{ key: input.valueKey, label: input.valueLabel }]
        : []

  return series.map((entry, index) => ({
    key: entry.key,
    label: entry.label ?? entry.key,
    color: entry.color ?? chartColorAt(index),
  }))
}

/**
 * Prepare generated rows for charting. Adds a stable React key per row and,
 * when `aggregateDuplicateLabels` is set, sums every measure key per dimension
 * label so duplicate categories do not collide or silently merge.
 */
export function buildSemaphorChartRows(
  rows: readonly Record<string, unknown>[],
  options: {
    dimensionKey: string
    valueKeys: readonly string[]
    aggregateDuplicateLabels?: boolean
  },
): SemaphorChartRow[] {
  const aggregate = options.aggregateDuplicateLabels ?? false

  if (!aggregate) {
    return rows.map((row, index) => ({
      ...row,
      __semaphorChartKey: `${String(row[options.dimensionKey] ?? "unknown")}:${index}`,
    }))
  }

  const grouped = new Map<string, Record<string, unknown>>()
  for (const row of rows) {
    const label = String(row[options.dimensionKey] ?? "Unknown")
    const current = grouped.get(label)
    if (!current) {
      const seed: Record<string, unknown> = {
        ...row,
        [options.dimensionKey]: label,
        __semaphorChartKey: label,
      }
      for (const key of options.valueKeys) {
        seed[key] = numberValue(row[key])
      }
      grouped.set(label, seed)
      continue
    }
    for (const key of options.valueKeys) {
      current[key] = numberValue(current[key]) + numberValue(row[key])
    }
  }

  return Array.from(grouped.values()) as SemaphorChartRow[]
}

/**
 * Pivot long rows (one row per dimension + breakdown) into wide chart rows plus
 * the resolved series, so a breakdown dimension can drive a grouped/stacked bar,
 * area, or line without hand-rolling pivot logic.
 *
 * Use only for bounded breakdown cardinality; the planner should keep the stack
 * dimension small. Missing dimension/series combinations default to 0 so stacks
 * stay contiguous. Series keys are sanitized to be CSS-variable safe; the
 * original breakdown value is preserved as the legend/tooltip label.
 */
export function pivotChartRows(
  rows: readonly Record<string, unknown>[],
  options: {
    /** Field key for the category axis (e.g. "month"). */
    dimensionKey: string
    /** Field key whose distinct values become series (e.g. "segment"). */
    seriesKey: string
    /** Field key for the measure to aggregate (e.g. "revenue"). */
    valueKey: string
    /** Optional explicit series order / whitelist by raw breakdown value. */
    seriesOrder?: readonly string[]
  },
): { rows: SemaphorChartRow[]; series: ResolvedChartSeries[] } {
  const { dimensionKey, seriesKey, valueKey } = options

  const seriesValues: string[] = []
  if (options.seriesOrder && options.seriesOrder.length > 0) {
    for (const value of options.seriesOrder) {
      const label = String(value)
      if (!seriesValues.includes(label)) seriesValues.push(label)
    }
  } else {
    for (const row of rows) {
      const label = stringValue(row[seriesKey])
      if (!seriesValues.includes(label)) seriesValues.push(label)
    }
  }

  const series: ResolvedChartSeries[] = seriesValues.map((label, index) => ({
    key: `s${index}_${label.replace(/[^a-zA-Z0-9_-]+/g, "_")}`,
    label,
    color: chartColorAt(index),
  }))
  const keyByValue = new Map(
    seriesValues.map((label, index) => [label, series[index].key]),
  )

  const grouped = new Map<string, Record<string, unknown>>()
  for (const row of rows) {
    const dimension = stringValue(row[dimensionKey])
    const targetKey = keyByValue.get(stringValue(row[seriesKey]))
    if (!targetKey) continue

    let current = grouped.get(dimension)
    if (!current) {
      current = { [dimensionKey]: dimension, __semaphorChartKey: dimension }
      for (const entry of series) current[entry.key] = 0
      grouped.set(dimension, current)
    }
    current[targetKey] = numberValue(current[targetKey]) + numberValue(row[valueKey])
  }

  return { rows: Array.from(grouped.values()) as SemaphorChartRow[], series }
}

/** Sum a single measure across rows (used for donut center totals and the like). */
export function sumValues(
  rows: readonly Record<string, unknown>[],
  valueKey: string,
): number {
  return rows.reduce((total, row) => total + numberValue(row[valueKey]), 0)
}

export function numberValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export function stringValue(value: unknown): string {
  return value === null || value === undefined ? "Unknown" : String(value)
}
