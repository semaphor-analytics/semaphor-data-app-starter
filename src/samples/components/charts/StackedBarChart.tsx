import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrencyCompact } from "../../lib/formatting"
import { makeChartTooltipFormatter } from "../../lib/chart-tooltip"

type StackedSeries = { key: string; label: string; color: string }

type StackedBarChartProps<Row extends Record<string, unknown>> = {
  data: Row[]
  xKey: keyof Row & string
  series: StackedSeries[]
  height?: number
}

export function StackedBarChart<Row extends Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 280,
}: StackedBarChartProps<Row>) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  )

  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart accessibilityLayer data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey as string}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(value) => formatCurrencyCompact(Number(value))}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={makeChartTooltipFormatter(
                config,
                formatCurrencyCompact,
              )}
            />
          }
        />
        <Legend content={<ChartLegendContent />} verticalAlign="bottom" />
        {series.map((s, index) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            stackId="a"
            fill={`var(--color-${s.key})`}
            radius={
              index === series.length - 1
                ? ([4, 4, 0, 0] as [number, number, number, number])
                : 0
            }
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
