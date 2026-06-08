import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrencyCompact, formatDateShort } from "../lib/formatting"
import { makeChartTooltipFormatter } from "../lib/chart-tooltip"

type TrendPoint = {
  date: string
  revenue: number
  previousRevenue: number
}

type TrendChartProps = {
  data: TrendPoint[]
  height?: number
}

const config = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
  previousRevenue: {
    label: "Previous period",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function TrendChart({ data, height = 260 }: TrendChartProps) {
  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height }}
    >
      <AreaChart accessibilityLayer data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="trend-revenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
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
          tickMargin={8}
          width={48}
          tickFormatter={(value) => formatCurrencyCompact(Number(value))}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => formatDateShort(String(value))}
              formatter={makeChartTooltipFormatter(
                config,
                formatCurrencyCompact,
              )}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="previousRevenue"
          stroke="var(--color-previousRevenue)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill="url(#trend-revenue)"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
