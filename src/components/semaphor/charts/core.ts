export type SemaphorChartRow = Record<string, unknown> & {
  __semaphorChartKey: string
}

export type SemaphorChartValueFormatter = (value: unknown) => string

export function buildSemaphorChartRows(
  rows: readonly Record<string, unknown>[],
  options: {
    dimensionKey: string
    valueKey: string
    aggregateDuplicateLabels?: boolean
  },
): SemaphorChartRow[] {
  const aggregateDuplicateLabels = options.aggregateDuplicateLabels ?? false
  if (!aggregateDuplicateLabels) {
    return rows.map((row, index) => ({
      ...row,
      __semaphorChartKey: `${String(row[options.dimensionKey] ?? "unknown")}:${index}`,
    }))
  }

  const grouped = new Map<string, Record<string, unknown>>()
  for (const row of rows) {
    const label = String(row[options.dimensionKey] ?? "Unknown")
    const current = grouped.get(label)
    const numericValue = numberValue(row[options.valueKey])
    if (!current) {
      grouped.set(label, {
        ...row,
        [options.dimensionKey]: label,
        [options.valueKey]: numericValue,
        __semaphorChartKey: label,
      })
      continue
    }
    current[options.valueKey] = numberValue(current[options.valueKey]) + numericValue
  }
  return Array.from(grouped.values()) as SemaphorChartRow[]
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
