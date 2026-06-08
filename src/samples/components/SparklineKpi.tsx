import { Area, AreaChart } from "recharts"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  formatCurrencyCompact,
  formatDelta,
  formatNumber,
  formatPercent,
} from "../lib/formatting"
import type { KpiFormat } from "./KpiCard"

type SparklinePoint = { date: string; value: number }

type SparklineKpiProps = {
  label: string
  value: number
  format: KpiFormat
  delta: number
  deltaUnit: "%" | "pp"
  deltaDirectionGood: "up" | "down"
  previousLabel?: string
  sparkline: SparklinePoint[]
}

const config = {
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function SparklineKpi({
  label,
  value,
  format,
  delta,
  deltaUnit,
  deltaDirectionGood,
  previousLabel,
  sparkline,
}: SparklineKpiProps) {
  const formatted = formatKpiValue(value, format)
  const isFlat = delta === 0
  const isGood = isFlat
    ? true
    : delta > 0
      ? deltaDirectionGood === "up"
      : deltaDirectionGood === "down"
  const Icon = isFlat ? MinusIcon : delta > 0 ? ArrowUpIcon : ArrowDownIcon

  return (
    <Card className="gap-2">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatted}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium tabular-nums",
                  isFlat
                    ? "bg-muted text-muted-foreground"
                    : isGood
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
                )}
              >
                <Icon className="size-3" />
                {formatDelta(delta, deltaUnit)}
              </span>
              {previousLabel ? (
                <span className="text-muted-foreground">{previousLabel}</span>
              ) : null}
            </div>
          </div>
          <ChartContainer
            config={config}
            className="h-12 w-28 shrink-0"
          >
            <AreaChart
              data={sparkline}
              margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
            >
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={1.5}
                fill={`url(#spark-${label})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function formatKpiValue(value: number, format: KpiFormat): string {
  switch (format) {
    case "currency-compact":
      return formatCurrencyCompact(value)
    case "currency":
      return formatCurrencyCompact(value)
    case "percent":
      return formatPercent(value)
    case "number":
    default:
      return formatNumber(value)
  }
}
