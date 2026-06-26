import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  buildSemaphorChartRows,
  numberValue,
  stringValue,
  type SemaphorChartRow,
  type SemaphorChartValueFormatter,
} from "./core"

const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type BaseChartProps = {
  rows: readonly Record<string, unknown>[]
  dimensionKey: string
  valueKey: string
  valueLabel?: string
  className?: string
  valueFormatter?: SemaphorChartValueFormatter
}

export type SemaphorLineChartProps = BaseChartProps

export function SemaphorLineChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel = "Value",
  className,
  valueFormatter,
}: SemaphorLineChartProps) {
  const data = buildSemaphorChartRows(rows, { dimensionKey, valueKey })
  const config = chartConfig(valueKey, valueLabel)

  return (
    <ChartContainer config={config} className={className}>
      <LineChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dimensionKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => stringValue(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatValue(value, valueFormatter)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey={valueKey}
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export type SemaphorBarChartProps = BaseChartProps & {
  aggregateDuplicateLabels?: boolean
}

export function SemaphorBarChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel = "Value",
  className,
  valueFormatter,
  aggregateDuplicateLabels,
}: SemaphorBarChartProps) {
  const data = buildSemaphorChartRows(rows, {
    dimensionKey,
    valueKey,
    aggregateDuplicateLabels,
  })
  const config = chartConfig(valueKey, valueLabel)

  return (
    <ChartContainer config={config} className={className}>
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dimensionKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => stringValue(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatValue(value, valueFormatter)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={valueKey} fill="var(--color-value)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export type SemaphorDonutChartProps = BaseChartProps & {
  aggregateDuplicateLabels?: boolean
}

export function SemaphorDonutChart({
  rows,
  dimensionKey,
  valueKey,
  valueLabel = "Value",
  className,
  aggregateDuplicateLabels = true,
}: SemaphorDonutChartProps) {
  const data = buildSemaphorChartRows(rows, {
    dimensionKey,
    valueKey,
    aggregateDuplicateLabels,
  })
  const config = chartConfig(valueKey, valueLabel)

  return (
    <ChartContainer config={config} className={className}>
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={dimensionKey}
          innerRadius={56}
          outerRadius={82}
          paddingAngle={2}
        >
          {data.map((row, index) => (
            <Cell
              key={row.__semaphorChartKey}
              fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

function chartConfig(valueKey: string, label: string): ChartConfig {
  return {
    [valueKey]: {
      label,
      color: "var(--chart-1)",
    },
    value: {
      label,
      color: "var(--chart-1)",
    },
  }
}

function formatValue(
  value: unknown,
  formatter: SemaphorChartValueFormatter | undefined,
): string {
  return formatter ? formatter(value) : String(numberValue(value))
}

export type { SemaphorChartRow, SemaphorChartValueFormatter }
