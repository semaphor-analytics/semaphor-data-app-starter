import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import overviewData from "../data/overview.json"
import { PageHeader } from "../components/PageHeader"
import { CalendarIcon } from "lucide-react"
import { FilterBar } from "../components/FilterBar"
import { KpiStrip } from "../components/KpiStrip"
import { ChartCard } from "../components/ChartCard"
import { TrendChart } from "../components/TrendChart"
import { RankedBarChart } from "../components/RankedBarChart"
import { DataTable, type Column } from "../components/DataTable"
import type { AppliedFilter } from "../components/FilterChipStrip"
import type { KpiFormat } from "../components/KpiCard"
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDateShort,
  formatDelta,
} from "../lib/formatting"

type TopCustomer = {
  customer: string
  revenue: number
  growth: number
}

type Transaction = {
  id: string
  date: string
  customer: string
  region: string
  segment: string
  amount: number
  status: "completed" | "pending" | "failed"
}

const data = overviewData

const appliedFilters: AppliedFilter[] = [
  { label: "Date", value: data.meta.dateRange.label },
  { label: "Region", value: data.meta.filters.regions.join(", ") },
  { label: "Segment", value: data.meta.filters.segment },
]

export function OverviewPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Sales analytics"
        title={data.meta.title}
        subtitle={data.meta.subtitle}
        dateRangeLabel={data.meta.dateRange.label}
      />

      <FilterBar
        items={[
          {
            label: "Date range",
            value: data.meta.dateRange.label,
            icon: <CalendarIcon className="size-3.5" />,
          },
          {
            label: "Region",
            value: `${data.meta.filters.regions.length} selected`,
          },
          { label: "Segment", value: data.meta.filters.segment },
        ]}
      />

      <div className="flex flex-col gap-6 px-8 py-6">
        <KpiStrip
          items={data.kpis.map((kpi) => ({
            key: kpi.key,
            label: kpi.label,
            value: kpi.value,
            format: kpi.format as KpiFormat,
            delta: kpi.delta,
            deltaUnit: kpi.deltaUnit as "%" | "pp",
            deltaDirectionGood: kpi.deltaDirectionGood as "up" | "down",
            previousLabel: kpi.previousLabel,
          }))}
        />

        <ChartCard
          title="Revenue trend"
          description="Daily revenue vs the previous 30-day period."
          appliedFilters={appliedFilters}
        >
          <TrendChart data={data.trend} />
        </ChartCard>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard
              title="Revenue by region"
              description="Share of revenue across the selected regions."
              appliedFilters={appliedFilters.filter(
                (f) => f.label !== "Region",
              )}
            >
              <RankedBarChart
                data={data.byRegion.map((row) => ({
                  label: row.region,
                  value: row.revenue,
                  share: row.share,
                }))}
              />
            </ChartCard>
          </div>
          <div className="lg:col-span-2">
            <ChartCard
              title="Top customers"
              description="Highest revenue this period."
              appliedFilters={appliedFilters}
            >
              <ul className="flex flex-col gap-2">
                {data.topCustomers.map((row: TopCustomer) => (
                  <li
                    key={row.customer}
                    className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="truncate">{row.customer}</span>
                    <span className="flex items-baseline gap-2 tabular-nums">
                      <span
                        className={cn(
                          "text-xs",
                          row.growth >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive",
                        )}
                      >
                        {formatDelta(row.growth)}
                      </span>
                      <span className="font-medium">
                        {formatCurrencyCompact(row.revenue)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>
        </div>

        <ChartCard
          title="Recent transactions"
          description="Most recent transactions matching the current filters."
          appliedFilters={appliedFilters}
          bodyPadded={false}
        >
          <DataTable<Transaction>
            columns={transactionColumns}
            rows={data.transactions as Transaction[]}
            showTotals
            bare
            maxHeightClassName="max-h-[480px]"
          />
        </ChartCard>
      </div>
    </div>
  )
}

const statusVariants: Record<Transaction["status"], string> = {
  completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
}

const transactionColumns: Column<Transaction>[] = [
  {
    key: "id",
    label: "Transaction",
    sortable: true,
    render: (row) => (
      <span className="font-mono text-xs text-muted-foreground">{row.id}</span>
    ),
  },
  {
    key: "date",
    label: "Date",
    sortable: true,
    render: (row) => formatDateShort(row.date),
    sortValue: (row) => row.date,
  },
  {
    key: "customer",
    label: "Customer",
    sortable: true,
  },
  {
    key: "region",
    label: "Region",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (row) => (
      <Badge
        variant="outline"
        className={cn(
          "border-transparent font-normal capitalize",
          statusVariants[row.status],
        )}
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    numeric: true,
    sortable: true,
    total: "sum",
    render: (row) => formatCurrency(row.amount),
    formatTotal: (value) => formatCurrency(value),
  },
]
