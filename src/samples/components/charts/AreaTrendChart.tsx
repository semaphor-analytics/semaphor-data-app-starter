import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatDateShort, formatNumber } from "../../lib/formatting"
import { makeChartTooltipFormatter } from "../../lib/chart-tooltip"

type Point = { date: string; value: number }

type AreaTrendChartProps = {
  data: Point[]
  label?: string
  height?: number
}

export function AreaTrendChart({
  data,
  label = "Value",
  height = 240,
}: AreaTrendChartProps) {
  const config = {
    value: { label, color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart accessibilityLayer data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="area-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          tickFormatter={(value) => formatDateShort(value)}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(value) => formatNumber(Number(value))}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => formatDateShort(String(value))}
              formatter={makeChartTooltipFormatter(config, formatNumber)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill="url(#area-trend)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
