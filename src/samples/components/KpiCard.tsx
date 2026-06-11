import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SemaphorActiveFilterSummaryBadge,
  type SemaphorActiveFilterSummary,
} from "@/components/semaphor"
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDelta,
  formatNumber,
  formatPercent,
} from "../lib/formatting"

export type KpiFormat = "currency" | "currency-compact" | "number" | "percent"

export type KpiCardProps = {
  label: string
  value: number
  format: KpiFormat
  delta: number
  deltaUnit: "%" | "pp"
  /** Whether an "up" delta is the good direction (revenue=up, churn=down). */
  deltaDirectionGood: "up" | "down"
  previousLabel?: string
  appliedFilters?: SemaphorActiveFilterSummary[]
}

export function KpiCard({
  label,
  value,
  format,
  delta,
  deltaUnit,
  deltaDirectionGood,
  previousLabel,
  appliedFilters,
}: KpiCardProps) {
  const formatted = formatKpiValue(value, format)
  const isFlat = delta === 0
  const isGood = isFlat
    ? true
    : delta > 0
      ? deltaDirectionGood === "up"
      : deltaDirectionGood === "down"

  const Icon = isFlat ? MinusIcon : delta > 0 ? ArrowUpIcon : ArrowDownIcon

  return (
    <Card className="gap-3">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </CardTitle>
          <SemaphorActiveFilterSummaryBadge
            filters={appliedFilters ?? []}
            className="shrink-0"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
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
      </CardContent>
    </Card>
  )
}

function formatKpiValue(value: number, format: KpiFormat): string {
  switch (format) {
    case "currency":
      return formatCurrency(value)
    case "currency-compact":
      return formatCurrencyCompact(value)
    case "percent":
      return formatPercent(value)
    case "number":
    default:
      return formatNumber(value)
  }
}
