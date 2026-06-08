import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import overviewData from "../data/overview.json"
import { PageHeader } from "../components/PageHeader"
import { ExhibitSection } from "../components/ExhibitSection"
import { KpiStrip } from "../components/KpiStrip"
import { SparklineKpi } from "../components/SparklineKpi"
import { MultiMeasureKpi } from "../components/MultiMeasureKpi"
import { formatCurrencyCompact } from "../lib/formatting"
import type { KpiFormat } from "../components/KpiCard"

const kpis = overviewData.kpis.map((kpi) => ({
  key: kpi.key,
  label: kpi.label,
  value: kpi.value,
  format: kpi.format as KpiFormat,
  delta: kpi.delta,
  deltaUnit: kpi.deltaUnit as "%" | "pp",
  deltaDirectionGood: kpi.deltaDirectionGood as "up" | "down",
  previousLabel: kpi.previousLabel,
}))

const sparklineSource = overviewData.trend.map((p) => ({
  date: p.date,
  value: p.revenue,
}))

export function KpisPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="KPI patterns"
        title="Key performance indicators"
        subtitle="KPI cards should be scan-friendly: large readable value, comparison context, and a delta whose color encodes direction-good (a red 'churn went up' or a green 'revenue went up')."
      />

      <div className="flex flex-col gap-10 px-8 py-6">
        <ExhibitSection
          label="Pattern 1"
          title="Standard KPI strip"
          description="Four-up KPI grid with value, delta, and previous-period label. Use tabular-nums on the value and tint the delta chip by direction-good."
        >
          <KpiStrip items={kpis} />
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 2"
          title="KPI with sparkline"
          description="Adds a small trend on the right edge. Useful when direction-over-time matters more than the absolute value."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SparklineKpi
              label="Revenue"
              value={2438600}
              format="currency-compact"
              delta={12.4}
              deltaUnit="%"
              deltaDirectionGood="up"
              previousLabel="vs prev 30 days"
              sparkline={sparklineSource}
            />
            <SparklineKpi
              label="New customers"
              value={348}
              format="number"
              delta={8.2}
              deltaUnit="%"
              deltaDirectionGood="up"
              previousLabel="vs prev 30 days"
              sparkline={sparklineSource.map((p, i) => ({
                date: p.date,
                value: 8 + Math.round((p.value / 110400) * 14 + (i % 5)),
              }))}
            />
            <SparklineKpi
              label="ARPU"
              value={186}
              format="currency"
              delta={-3.1}
              deltaUnit="%"
              deltaDirectionGood="up"
              previousLabel="vs prev 30 days"
              sparkline={sparklineSource.map((p, i) => ({
                date: p.date,
                value: 200 - Math.round((i / sparklineSource.length) * 24),
              }))}
            />
          </div>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 3"
          title="Multi-measure card"
          description="One semaphor.metric query can return several scalar measures. Group them in a single card when they belong to the same analytical question."
        >
          <div className="grid gap-3 lg:grid-cols-2">
            <MultiMeasureKpi
              title="Sales summary"
              description="Three measures from one logical query."
              measures={[
                {
                  key: "revenue",
                  label: "Revenue",
                  value: 2438600,
                  format: "currency-compact",
                  delta: 12.4,
                },
                {
                  key: "orders",
                  label: "Orders",
                  value: 1842,
                  format: "number",
                  delta: 5.6,
                },
                {
                  key: "margin",
                  label: "Gross margin",
                  value: 42.7,
                  format: "percent",
                  delta: 1.2,
                  deltaUnit: "pp",
                },
              ]}
            />
            <MultiMeasureKpi
              title="Customer health"
              description="Mixed direction-good measures."
              measures={[
                {
                  key: "active",
                  label: "Active accounts",
                  value: 4218,
                  format: "number",
                  delta: 3.8,
                },
                {
                  key: "churn",
                  label: "Churn rate",
                  value: 2.4,
                  format: "percent",
                  delta: 0.6,
                  deltaUnit: "pp",
                  deltaDirectionGood: "down",
                },
                {
                  key: "nps",
                  label: "NPS",
                  value: 48,
                  format: "number",
                  delta: -4.0,
                },
              ]}
            />
          </div>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 4"
          title="KPI with progress to target"
          description="Use a slim progress indicator when the goal is a percentage-of-target, not a comparison to the previous period."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ProgressKpi
              label="Quarter to date"
              value={2438600}
              target={3500000}
            />
            <ProgressKpi label="Active seats" value={4218} target={5000} />
            <ProgressKpi
              label="Annual contract value"
              value={11800000}
              target={14000000}
            />
          </div>
        </ExhibitSection>
      </div>
    </div>
  )
}

function ProgressKpi({
  label,
  value,
  target,
}: {
  label: string
  value: number
  target: number
}) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <Card className="gap-3">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums">
            {formatCurrencyCompact(value)}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            / {formatCurrencyCompact(target)} target
          </span>
        </div>
        <Progress value={pct}>
          <ProgressLabel className="text-xs text-muted-foreground">
            {pct}% of target
          </ProgressLabel>
          <ProgressValue className="text-xs text-muted-foreground" />
        </Progress>
      </CardContent>
    </Card>
  )
}
