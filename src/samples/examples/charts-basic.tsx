import {
  SemaphorAreaChart,
  SemaphorBarChart,
  SemaphorLineChart,
  SemaphorPieChart,
  SemaphorRadarChart,
  numberValue,
  pivotChartRows,
} from "@/components/semaphor/charts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Demo data only. In a generated app these rows come from
// `rowsForView.<view>(result)` and the keys are generated field keys.
const monthly = [
  { month: "Jan", revenue: 248000, target: 260000 },
  { month: "Feb", revenue: 276000, target: 268000 },
  { month: "Mar", revenue: 302000, target: 285000 },
  { month: "Apr", revenue: 335000, target: 320000 },
  { month: "May", revenue: 381000, target: 350000 },
  { month: "Jun", revenue: 418000, target: 400000 },
]

const monthlyChannels = [
  { month: "Jan", direct: 150000, partner: 98000 },
  { month: "Feb", direct: 168000, partner: 108000 },
  { month: "Mar", direct: 182000, partner: 120000 },
  { month: "Apr", direct: 201000, partner: 134000 },
  { month: "May", direct: 228000, partner: 153000 },
  { month: "Jun", direct: 251000, partner: 167000 },
]

const byChannel = [
  { channel: "Direct", revenue: 412000, target: 380000 },
  { channel: "Partner", revenue: 286000, target: 300000 },
  { channel: "Online", revenue: 198000, target: 180000 },
  { channel: "Outbound", revenue: 134000, target: 150000 },
]

const topCampaigns = [
  { campaign: "Spring Pipeline", revenue: 184000 },
  { campaign: "Enterprise Expansion", revenue: 162000 },
  { campaign: "Partner Launch", revenue: 128000 },
  { campaign: "Renewal Push", revenue: 96000 },
]

const capability = [
  { metric: "Speed", current: 84, target: 90 },
  { metric: "Quality", current: 78, target: 85 },
  { metric: "Coverage", current: 92, target: 88 },
  { metric: "Cost", current: 70, target: 80 },
  { metric: "Adoption", current: 65, target: 75 },
]

// Long rows (one row per month + segment) pivoted into series for a stacked bar.
const monthlySegments = [
  { month: "Apr", segment: "Enterprise", revenue: 168000 },
  { month: "Apr", segment: "Mid-market", revenue: 104000 },
  { month: "Apr", segment: "SMB", revenue: 63000 },
  { month: "May", segment: "Enterprise", revenue: 192000 },
  { month: "May", segment: "Mid-market", revenue: 118000 },
  { month: "May", segment: "SMB", revenue: 71000 },
  { month: "Jun", segment: "Enterprise", revenue: 214000 },
  { month: "Jun", segment: "Mid-market", revenue: 129000 },
  { month: "Jun", segment: "SMB", revenue: 75000 },
]

const segmentBreakdown = pivotChartRows(monthlySegments, {
  dimensionKey: "month",
  seriesKey: "segment",
  valueKey: "revenue",
})

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

const currency = (value: unknown) => currencyFormat.format(numberValue(value))
const score = (value: unknown) => `${numberValue(value).toFixed(0)}`

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function ChartsBasicExample() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Revenue vs target"
        description="Multi-series line. Axis and tooltip share one value formatter."
      >
        <SemaphorLineChart
          rows={monthly}
          dimensionKey="month"
          series={[
            { key: "revenue", label: "Revenue" },
            { key: "target", label: "Target" },
          ]}
          valueFormatter={currency}
          className="h-[260px] w-full"
        />
      </ChartCard>

      <ChartCard
        title="Revenue by channel"
        description="Grouped bars comparing actual against target."
      >
        <SemaphorBarChart
          rows={byChannel}
          dimensionKey="channel"
          series={[
            { key: "revenue", label: "Revenue" },
            { key: "target", label: "Target" },
          ]}
          valueFormatter={currency}
          className="h-[260px] w-full"
        />
      </ChartCard>

      <ChartCard
        title="Revenue mix"
        description="Donut with legend for part-to-whole composition."
      >
        <SemaphorPieChart
          rows={byChannel}
          dimensionKey="channel"
          valueKey="revenue"
          valueLabel="Revenue"
          valueFormatter={currency}
          showLegend
          className="h-[260px]"
        />
      </ChartCard>

      <ChartCard
        title="Channel trend"
        description="Stacked area for composition over time."
      >
        <SemaphorAreaChart
          rows={monthlyChannels}
          dimensionKey="month"
          series={[
            { key: "direct", label: "Direct" },
            { key: "partner", label: "Partner" },
          ]}
          valueFormatter={currency}
          stacked
          className="h-[260px] w-full"
        />
      </ChartCard>

      <ChartCard
        title="Top campaigns"
        description="Horizontal (ranked) bars for a single measure."
      >
        <SemaphorBarChart
          rows={topCampaigns}
          dimensionKey="campaign"
          valueKey="revenue"
          valueLabel="Revenue"
          valueFormatter={currency}
          horizontal
          className="h-[260px] w-full"
        />
      </ChartCard>

      <ChartCard
        title="Revenue by segment"
        description="Stacked bar pivoted from long rows with pivotChartRows."
      >
        <SemaphorBarChart
          rows={segmentBreakdown.rows}
          dimensionKey="month"
          series={segmentBreakdown.series}
          valueFormatter={currency}
          stacked
          className="h-[260px] w-full"
        />
      </ChartCard>

      <ChartCard
        title="Capability profile"
        description="Radar comparing current against target."
      >
        <SemaphorRadarChart
          rows={capability}
          dimensionKey="metric"
          series={[
            { key: "current", label: "Current" },
            { key: "target", label: "Target" },
          ]}
          valueFormatter={score}
          showLegend
          className="h-[260px]"
        />
      </ChartCard>
    </div>
  )
}
