import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrencyCompact } from "../../lib/formatting"
import { makeChartTooltipFormatter } from "../../lib/chart-tooltip"

type Point = { category: string; value: number }

type VerticalBarChartProps = {
  data: Point[]
  height?: number
}

const config = {
  value: { label: "Value", color: "var(--chart-2)" },
} satisfies ChartConfig

export function VerticalBarChart({ data, height = 240 }: VerticalBarChartProps) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart accessibilityLayer data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
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
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
