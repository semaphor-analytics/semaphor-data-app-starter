import type { ChartConfig } from "@/components/ui/chart"

/**
 * Returns a Recharts/shadcn-compatible tooltip formatter that renders the
 * color indicator dot, the series label (looked up from the chart config),
 * and a custom-formatted value. Use this in place of returning `[value, name]`
 * tuples, which bypass the default layout and look unstyled.
 */
export function makeChartTooltipFormatter(
  config: ChartConfig,
  format: (value: number) => string,
) {
  return function tooltipFormatter(
    value: unknown,
    name: unknown,
    item: { color?: string; payload?: { fill?: string } },
  ) {
    const color = item.payload?.fill ?? item.color
    const key = String(name)
    const label = (config[key]?.label as React.ReactNode) ?? key
    return (
      <>
        <div
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-1 items-center justify-between gap-3 leading-none">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium tabular-nums text-foreground">
            {format(Number(value))}
          </span>
        </div>
      </>
    )
  }
}
