import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  formatCurrencyCompact,
  formatDelta,
  formatNumber,
  formatPercent,
} from "../lib/formatting"
import type { KpiFormat } from "./KpiCard"

export type Measure = {
  key: string
  label: string
  value: number
  format: KpiFormat
  delta: number
  deltaUnit?: "%" | "pp"
  deltaDirectionGood?: "up" | "down"
}

type MultiMeasureKpiProps = {
  title: string
  description?: string
  measures: Measure[]
}

export function MultiMeasureKpi({
  title,
  description,
  measures,
}: MultiMeasureKpiProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-xs">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {measures.map((measure) => (
            <MeasureSlot key={measure.key} measure={measure} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MeasureSlot({ measure }: { measure: Measure }) {
  const deltaUnit = measure.deltaUnit ?? "%"
  const deltaDirectionGood = measure.deltaDirectionGood ?? "up"
  const isFlat = measure.delta === 0
  const isGood = isFlat
    ? true
    : measure.delta > 0
      ? deltaDirectionGood === "up"
      : deltaDirectionGood === "down"
  const Icon = isFlat
    ? MinusIcon
    : measure.delta > 0
      ? ArrowUpIcon
      : ArrowDownIcon
  const formatted = formatKpiValue(measure.value, measure.format)

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {measure.label}
      </span>
      <span className="text-2xl font-semibold tabular-nums">{formatted}</span>
      <span
        className={cn(
          "inline-flex w-fit items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
          isFlat
            ? "bg-muted text-muted-foreground"
            : isGood
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
        )}
      >
        <Icon className="size-3" />
        {formatDelta(measure.delta, deltaUnit)}
      </span>
    </div>
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
