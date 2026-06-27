import { useMemo, useState } from "react"
import type {
  SemaphorDataAppQueryError,
  SemaphorInputHandle,
} from "react-semaphor/data-app-sdk"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SemaphorQueryStateLike } from "@/components/semaphor/query-state-boundary"
import {
  SemaphorViewCard,
  type SemaphorViewFilterSummary,
} from "@/components/semaphor/view-card"
import {
  SemaphorClearFiltersButton,
  SemaphorDateRangeFilter,
  SemaphorMultiSelectFilter,
  SemaphorSingleSelectFilter,
  getSemaphorActiveFilterSummaries,
} from "@/components/semaphor/filter-controls"
import {
  SemaphorMetricKpiCard,
  SemaphorMultiMeasureKpis,
} from "@/components/semaphor/metric-kpis"
import {
  SemaphorAreaChart,
  SemaphorBarChart,
  SemaphorPieChart,
  numberValue,
} from "@/components/semaphor/charts"
import { MatrixTableView } from "@/components/semaphor/matrix-table/view"
import { ServerDataTableView } from "@/components/semaphor/server-data-table/view"
import { campaignRevenueMatrix } from "./demo-data/matrix-demo-data"
import {
  getDisplayedTotals,
  ordersColumns,
  ordersRows,
} from "./demo-data/records-demo-data"

type DemoOptionValue = string | number | boolean

const regionOptions = [
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "West", value: "west" },
]

const segmentOptions = [
  { label: "Enterprise", value: "enterprise" },
  { label: "Mid-market", value: "mid_market" },
  { label: "SMB", value: "smb" },
]

const trendData = [
  { label: "Jan", revenue: 248000 },
  { label: "Feb", revenue: 276000 },
  { label: "Mar", revenue: 302000 },
  { label: "Apr", revenue: 335000 },
  { label: "May", revenue: 381000 },
  { label: "Jun", revenue: 418000 },
]

const revenueTrendSpark = trendData.map((point) => point.revenue)

const regionRevenue = [
  { label: "North", value: 842500 },
  { label: "South", value: 618300 },
  { label: "West", value: 542100 },
]

const campaignRevenue = [
  { label: "Spring", value: 612000 },
  { label: "Expansion", value: 548000 },
  { label: "Partner", value: 470000 },
  { label: "Renewal", value: 372900 },
]

const segmentSplit = [
  { label: "Enterprise", value: 1062000 },
  { label: "Mid-market", value: 624000 },
  { label: "SMB", value: 316900 },
]

type DashboardDemoState =
  | "ready"
  | "loading"
  | "refreshing"
  | "partial"
  | "error"
  | "empty"

const DEMO_STATE_OPTIONS: { value: DashboardDemoState; label: string }[] = [
  { value: "ready", label: "Ready" },
  { value: "loading", label: "Loading" },
  { value: "partial", label: "Partial" },
  { value: "error", label: "Error" },
  { value: "empty", label: "Empty" },
]

const DEMO_ERROR = Object.assign(
  new Error("The query could not be executed."),
  {
    kind: "data_app_query_error" as const,
  },
) satisfies SemaphorDataAppQueryError

/** Wrap a ready payload in the query-state shape for the selected demo state. */
function withDemoState(
  demoState: DashboardDemoState,
  payload: SemaphorQueryStateLike,
): SemaphorQueryStateLike {
  switch (demoState) {
    case "loading":
      return { status: "loading", isLoading: true }
    case "refreshing":
      return { ...payload, status: "loading", isLoading: true, isStale: true }
    case "partial":
      return { ...payload, status: "success", rowLimitExceeded: true }
    case "error":
      return { status: "error", error: DEMO_ERROR }
    case "empty":
      return { status: "success", records: [] }
    case "ready":
    default:
      return { ...payload, status: "success" }
  }
}

function metricResultFor(demoState: DashboardDemoState) {
  const measures = { revenue: 2002900, orders: 6842, conversion_rate: 18.6 }
  const ready = {
    primaryValue: 2002900,
    value: 2002900,
    comparisonKind: "previous_period" as const,
    deltaPercent: 12.4,
    measures,
    records: ordersRows.slice(0, 6),
  }
  switch (demoState) {
    case "loading":
      return { status: "success" as const, isLoading: true }
    case "refreshing":
      return {
        ...ready,
        status: "success" as const,
        isLoading: true,
        isStale: true,
      }
    case "partial":
      return { ...ready, status: "success" as const, rowLimitExceeded: true }
    case "error":
      return { status: "success" as const, error: DEMO_ERROR }
    case "empty":
      return {
        status: "success" as const,
        primaryValue: null,
        value: null,
        measures: {},
        records: [],
      }
    case "ready":
    default:
      return { ...ready, status: "success" as const }
  }
}

function StateSwitcher({
  value,
  onChange,
}: {
  value: DashboardDemoState
  onChange: (next: DashboardDemoState) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as DashboardDemoState)
      }}
    >
      <SelectTrigger className="h-8 gap-1.5 border-border bg-card">
        <span className="text-muted-foreground">State</span>
        <SelectValue className="font-medium capitalize" />
      </SelectTrigger>
      <SelectContent>
        {DEMO_STATE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ExecutiveScorecardSample() {
  const [demoState, setDemoState] = useState<DashboardDemoState>("ready")
  const [region, setRegion] = useState<DemoOptionValue | undefined>("north")
  const [segments, setSegments] = useState<DemoOptionValue[]>([
    "enterprise",
    "mid_market",
  ])
  const [dateRange, setDateRange] = useState<DemoOptionValue[]>([
    "2026-01-01",
    "2026-06-30",
  ])

  const handles = useMemo(
    () => [
      createDemoInputHandle({
        id: "order_date",
        label: "Order date",
        operator: "between",
        value: dateRange,
        setValue: (next) =>
          setDateRange(Array.isArray(next) ? next.filter(isDemoOptionValue) : []),
      }),
      createDemoInputHandle({
        id: "region",
        label: "Region",
        value: region,
        setValue: (next) =>
          setRegion(isDemoOptionValue(next) ? next : undefined),
        options: regionOptions,
      }),
      createDemoInputHandle({
        id: "segment",
        label: "Segment",
        value: segments,
        setValue: (next) =>
          setSegments(Array.isArray(next) ? next.filter(isDemoOptionValue) : []),
        options: segmentOptions,
      }),
    ],
    [dateRange, region, segments],
  )

  const summaries = getSemaphorActiveFilterSummaries(handles)
  const scopedBy = (ids: string[]): SemaphorViewFilterSummary[] =>
    summaries.filter((summary) => ids.includes(summary.id))

  const metricResult = metricResultFor(demoState)
  const tableRows = demoState === "empty" ? [] : ordersRows.slice(0, 8)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SemaphorClearFiltersButton handles={handles} />
          <StateSwitcher value={demoState} onChange={setDemoState} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SemaphorDateRangeFilter handle={handles[0]} />
          <SemaphorSingleSelectFilter
            label="Region"
            handle={handles[1]}
            hideSearch
          />
          <SemaphorMultiSelectFilter label="Segment" handle={handles[2]} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SemaphorMetricKpiCard
          result={metricResult}
          label="Revenue"
          description="Primary metric"
          format="currency-compact"
          comparisonLabel="vs previous period"
          trend={revenueTrendSpark}
          filters={summaries}
        />
        <SemaphorMultiMeasureKpis
          result={metricResult}
          title="Sales summary"
          description="Related measures from one governed metric result."
          filters={summaries}
          measures={[
            {
              key: "revenue",
              label: "Revenue",
              format: "currency-compact",
              delta: 12.4,
            },
            { key: "orders", label: "Orders", format: "number", delta: 8.1 },
            {
              key: "conversion_rate",
              label: "Conversion",
              format: "percent",
              delta: -1.2,
            },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <ChartCard
          viewId="revenue_trend"
          title="Revenue trend"
          description="Use line or area charts when the reading task is direction over time."
          scope={scopedBy(["order_date", "region"])}
          state={withDemoState(demoState, { records: trendData })}
          className="lg:col-span-3"
        >
          <SemaphorAreaChart
            rows={trendData}
            dimensionKey="label"
            valueKey="revenue"
            valueLabel="Revenue"
            valueFormatter={currency}
            className="h-[200px] w-full"
          />
        </ChartCard>
        <ChartCard
          viewId="revenue_by_segment"
          title="Revenue by segment"
          description="Donut charts work for part-to-whole splits with few slices."
          scope={scopedBy(["order_date", "region"])}
          state={withDemoState(demoState, { records: segmentSplit })}
          compactScope
          className="lg:col-span-2"
        >
          <SemaphorPieChart
            rows={segmentSplit}
            dimensionKey="label"
            valueKey="value"
            valueLabel="Revenue"
            valueFormatter={currency}
            showLegend
            centerLabel="Total"
            className="h-[220px]"
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <ChartCard
          viewId="revenue_by_campaign"
          title="Revenue by campaign"
          description="Column charts compare a handful of named categories."
          scope={scopedBy(["order_date", "region", "segment"])}
          state={withDemoState(demoState, { records: campaignRevenue })}
          className="lg:col-span-3"
        >
          <SemaphorBarChart
            rows={campaignRevenue}
            dimensionKey="label"
            valueKey="value"
            valueLabel="Revenue"
            valueFormatter={currency}
            className="h-[200px] w-full"
          />
        </ChartCard>
        <ChartCard
          viewId="revenue_by_region"
          title="Revenue by region"
          description="A ranked list keeps values visible; a chart is not always the right call."
          scope={scopedBy(["order_date", "segment"])}
          state={withDemoState(demoState, { records: regionRevenue })}
          compactScope
          className="lg:col-span-2"
        >
          <RankedRevenueList data={regionRevenue} />
        </ChartCard>
      </div>

      <ServerDataTableView
        title="Recent campaign orders"
        description="A bounded records preview can sit below the KPI and chart summary."
        columns={ordersColumns}
        rows={tableRows}
        totalRow={
          tableRows.length ? getDisplayedTotals(tableRows) : undefined
        }
        loading={demoState === "loading" || demoState === "refreshing"}
        error={demoState === "error" ? DEMO_ERROR : undefined}
        height={320}
        enableColumnVisibility={false}
      />
    </div>
  )
}

export function OperationsTableSample() {
  return (
    <ServerDataTableView
      title="All campaign orders"
      description="Server-owned pagination and sorting pattern for records results."
      columns={ordersColumns}
      rows={ordersRows.slice(0, 25)}
      pagination={{
        page: 1,
        pageSize: 25,
        pageCount: 10,
        totalRows: 240,
        hasPreviousPage: false,
        hasNextPage: true,
      }}
      totalRow={getDisplayedTotals(ordersRows.slice(0, 25))}
      sort={{ key: "revenue", direction: "desc" }}
      height={560}
    />
  )
}

export function MatrixDrilldownSample() {
  return (
    <MatrixTableView
      title="Campaign revenue by segment"
      description="Expandable row and column hierarchy with sticky headers."
      grid={campaignRevenueMatrix}
      height={560}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Chart shell + ranked list                                          */
/* ------------------------------------------------------------------ */

function ChartCard({
  viewId,
  title,
  description,
  scope,
  compactScope = false,
  state,
  className,
  children,
}: {
  viewId: string
  title: string
  description?: string
  scope?: SemaphorViewFilterSummary[]
  compactScope?: boolean
  state?: SemaphorQueryStateLike
  className?: string
  children: React.ReactNode
}) {
  return (
    <SemaphorViewCard
      viewId={viewId}
      title={title}
      description={description}
      filters={scope}
      compactFilters={compactScope}
      state={state}
      className={className}
    >
      {children}
    </SemaphorViewCard>
  )
}

/**
 * A ranked list, not a chart. When values should stay visible (top-N), a list
 * with rank badges and inline values reads better than a bar chart, so this is
 * deliberately not built from the chart kit.
 */
function RankedRevenueList({
  data,
}: {
  data: Array<{ label: string; value: number }>
}) {
  const max = Math.max(...data.map((row) => row.value))

  return (
    <div className="flex flex-col gap-3.5">
      {data.map((row, index) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="inline-flex size-4 items-center justify-center rounded-sm bg-muted text-[10px] font-medium text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <span className="text-foreground">{row.label}</span>
            </span>
            <span className="font-medium tabular-nums">
              {formatCurrencyCompact(row.value)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.max(6, (row.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function createDemoInputHandle({
  id,
  label,
  value,
  setValue,
  options,
  operator = "equals",
}: {
  id: string
  label: string
  value: unknown
  setValue: (next: unknown) => void
  options?: Array<{ label: string; value: string }>
  operator?: string
}): SemaphorInputHandle {
  return {
    id,
    label,
    kind: "filter",
    operator,
    value,
    options,
    isActive: value !== undefined && (!Array.isArray(value) || value.length > 0),
    setValue,
  } as unknown as SemaphorInputHandle
}

function isDemoOptionValue(value: unknown): value is DemoOptionValue {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
}

function formatCurrencyCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

const currency = (value: unknown) => formatCurrencyCompact(numberValue(value))
