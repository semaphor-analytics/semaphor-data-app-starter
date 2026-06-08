import { Cell, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrencyCompact, formatPercent } from "../../lib/formatting"
import { makeChartTooltipFormatter } from "../../lib/chart-tooltip"

type Slice = { category: string; value: number; share: number; color: string }

type DonutChartProps = {
  data: Slice[]
  height?: number
}

export function DonutChart({ data, height = 240 }: DonutChartProps) {
  const total = data.reduce((acc, slice) => acc + slice.value, 0)

  const config: ChartConfig = Object.fromEntries(
    data.map((slice) => [
      slice.category,
      { label: slice.category, color: slice.color },
    ]),
  )

  return (
    <div className="flex items-center gap-6">
      <ChartContainer config={config} style={{ height, width: height }}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={1}
            isAnimationActive={false}
            stroke="var(--background)"
          >
            {data.map((slice) => (
              <Cell key={slice.category} fill={slice.color} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="dot"
                nameKey="category"
                formatter={makeChartTooltipFormatter(
                  config,
                  formatCurrencyCompact,
                )}
              />
            }
          />
        </PieChart>
      </ChartContainer>
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">
            {formatCurrencyCompact(total)}
          </span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
        <ul className="flex flex-col gap-1.5 text-xs">
          {data.map((slice) => (
            <li key={slice.category} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: slice.color }}
              />
              <span className="flex-1 truncate">{slice.category}</span>
              <span className="tabular-nums text-muted-foreground">
                {formatPercent(slice.share)}
              </span>
              <span className="w-16 text-right font-medium tabular-nums">
                {formatCurrencyCompact(slice.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
