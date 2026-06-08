import overviewData from "../data/overview.json"
import { PageHeader } from "../components/PageHeader"
import { ExhibitSection } from "../components/ExhibitSection"
import { ChartCard } from "../components/ChartCard"
import { TrendChart } from "../components/TrendChart"
import { VerticalBarChart } from "../components/charts/VerticalBarChart"
import { StackedBarChart } from "../components/charts/StackedBarChart"
import { AreaTrendChart } from "../components/charts/AreaTrendChart"
import { DonutChart } from "../components/charts/DonutChart"

const stackedData = [
  {
    month: "Jan",
    coreAnalytics: 142000,
    streamingEvents: 86000,
    warehouseSync: 52000,
  },
  {
    month: "Feb",
    coreAnalytics: 158000,
    streamingEvents: 91000,
    warehouseSync: 61000,
  },
  {
    month: "Mar",
    coreAnalytics: 172000,
    streamingEvents: 104000,
    warehouseSync: 68000,
  },
  {
    month: "Apr",
    coreAnalytics: 186000,
    streamingEvents: 118000,
    warehouseSync: 76000,
  },
  {
    month: "May",
    coreAnalytics: 204000,
    streamingEvents: 132000,
    warehouseSync: 84000,
  },
  {
    month: "Jun",
    coreAnalytics: 221000,
    streamingEvents: 148000,
    warehouseSync: 94000,
  },
]

const cumulativeUsers = overviewData.trend.reduce<
  { date: string; value: number }[]
>((acc, point, index) => {
  const previous = index === 0 ? 4200 : acc[index - 1].value
  return [...acc, { date: point.date, value: previous + 20 + (index % 9) * 3 }]
}, [])

const segmentDonut = [
  {
    category: "Enterprise",
    value: 1480000,
    share: 60.7,
    color: "var(--chart-2)",
  },
  {
    category: "Mid-market",
    value: 712000,
    share: 29.2,
    color: "var(--chart-3)",
  },
  { category: "SMB", value: 246600, share: 10.1, color: "var(--chart-4)" },
]

export function ChartsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Chart patterns"
        title="Chart vocabulary"
        subtitle="Each chart should answer one clear question. Pick the visual based on what comparison the user is making, and match the query grain to the chart — never aggregate in React."
      />

      <div className="flex flex-col gap-10 px-8 py-6">
        <ExhibitSection
          label="Line"
          title="Trend over time"
          description="Best when the user is reading direction and magnitude of change. Pair with a dashed previous-period line for comparison context."
        >
          <ChartCard
            title="Revenue trend"
            description="Daily revenue, current period vs previous."
          >
            <TrendChart data={overviewData.trend} />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Vertical bar"
          title="Ranked categories"
          description="Use for comparing a metric across a bounded set of categories. Keep categories sortable; cap to 8–10 visible bars."
        >
          <ChartCard
            title="Revenue by region"
            description="Six regions, ranked by revenue."
          >
            <VerticalBarChart
              data={overviewData.byRegion.map((row) => ({
                category: row.region,
                value: row.revenue,
              }))}
            />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Stacked bar"
          title="Composition over time"
          description="Each bar shows the total; the stack shows the mix. Use a small number of series so the colors stay legible."
        >
          <ChartCard
            title="Revenue by product, by month"
            description="Three product lines stacked across the last six months."
          >
            <StackedBarChart
              data={stackedData}
              xKey="month"
              series={[
                {
                  key: "coreAnalytics",
                  label: "Core analytics",
                  color: "var(--chart-2)",
                },
                {
                  key: "streamingEvents",
                  label: "Streaming events",
                  color: "var(--chart-3)",
                },
                {
                  key: "warehouseSync",
                  label: "Warehouse sync",
                  color: "var(--chart-4)",
                },
              ]}
            />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Area"
          title="Volume over time"
          description="Use area only when total volume is the point. For comparison-over-time, line is usually clearer."
        >
          <ChartCard
            title="Cumulative active users"
            description="Running total across the period."
          >
            <AreaTrendChart data={cumulativeUsers} label="Users" />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Donut"
          title="Small categorical mix"
          description="Restrict to 3–5 categories. Pair with a numeric legend so the user can read the exact share. For 6+ categories, switch to a vertical bar chart."
        >
          <ChartCard
            title="Revenue by segment"
            description="Three segments share the total."
          >
            <DonutChart data={segmentDonut} />
          </ChartCard>
        </ExhibitSection>
      </div>
    </div>
  )
}
