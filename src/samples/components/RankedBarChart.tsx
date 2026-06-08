import { formatCurrencyCompact, formatPercent } from "../lib/formatting"

type RankedRow = {
  label: string
  value: number
  share: number
}

type RankedBarChartProps = {
  data: RankedRow[]
}

export function RankedBarChart({ data }: RankedBarChartProps) {
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div className="flex flex-col gap-3">
      {data.map((row) => {
        const widthPct = (row.value / max) * 100
        return (
          <div key={row.label} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium">{row.label}</span>
              <span className="flex items-baseline gap-2 tabular-nums">
                <span className="text-muted-foreground">
                  {formatPercent(row.share)}
                </span>
                <span className="font-medium">
                  {formatCurrencyCompact(row.value)}
                </span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-[var(--chart-2)]"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
