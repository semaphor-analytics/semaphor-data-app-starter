import type { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import overviewData from "../data/overview.json"
import { serverTransactions, type ServerTransaction } from "../data/tables"
import { PageHeader } from "../components/PageHeader"
import { ChartCard } from "../components/ChartCard"
import { DataTable, type Column } from "../components/DataTable"
import { ServerDataTable } from "../components/ServerDataTable"
import { ExhibitSection } from "../components/ExhibitSection"
import { formatCurrency, formatDateShort, formatNumber } from "../lib/formatting"

type Transaction = {
  id: string
  date: string
  customer: string
  region: string
  segment: string
  amount: number
  status: "completed" | "pending" | "failed"
}

const statusVariants: Record<string, string> = {
  completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  refunded: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
}

const boundedColumns: Column<Transaction>[] = [
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
  { key: "customer", label: "Customer", sortable: true },
  { key: "region", label: "Region", sortable: true },
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

const wideColumns: Column<ServerTransaction>[] = [
  {
    key: "id",
    label: "Transaction",
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
  { key: "customer", label: "Customer", sortable: true },
  { key: "region", label: "Region", sortable: true },
  { key: "segment", label: "Segment", sortable: true },
  { key: "product", label: "Product", sortable: true },
  { key: "paymentMethod", label: "Payment", sortable: true },
  {
    key: "units",
    label: "Units",
    numeric: true,
    sortable: true,
    render: (row) => formatNumber(row.units),
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
  {
    key: "status",
    label: "Status",
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
]

const serverColumns: ColumnDef<ServerTransaction, unknown>[] = [
  {
    accessorKey: "id",
    header: "Transaction",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDateShort(row.original.date),
  },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "product", header: "Product" },
  {
    accessorKey: "units",
    header: "Units",
    cell: ({ row }) => formatNumber(row.original.units),
    meta: { numeric: true, align: "right" },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amount),
    meta: { numeric: true, align: "right" },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "border-transparent font-normal capitalize",
          statusVariants[row.original.status],
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
]

export function TablesPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Table patterns"
        title="Tables for analysis"
        subtitle="Two patterns: bounded tables for small/medium results rendered in full, and server-backed tables for large or exploratory result sets. Always sortable, always numeric-aligned, always with explicit empty states."
      />

      <div className="flex flex-col gap-10 px-8 py-6">
        <ExhibitSection
          label="Pattern 1"
          title="Bounded sortable table with totals"
          description="Render the full result set when it fits. Sort in React, show a totals row for displayed additive numeric columns, and use tabular numerics with right-aligned amounts."
        >
          <ChartCard
            title="Recent transactions"
            description="Last 15 rows. Click a header to sort."
            bodyPadded={false}
          >
            <DataTable<Transaction>
              columns={boundedColumns}
              rows={overviewData.transactions as Transaction[]}
              showTotals
              bare
            />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 2"
          title="Server-backed table with pagination"
          description="Use this for large or exploratory result sets. Pagination, sorting, and filtering should be expressed in the Semaphor query spec — never by fetching everything and slicing in React."
        >
          <ChartCard
            title="All transactions"
            description="162 rows, paginated. Page size, sort, and pagination state belong on the server in production."
            bodyPadded={false}
          >
            <ServerDataTable<ServerTransaction>
              columns={serverColumns}
              rows={serverTransactions}
              defaultPageSize={25}
              bare
            />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 3"
          title="Wide table with horizontal scroll"
          description="When the row needs 10+ columns, keep readable widths and let the user scroll horizontally rather than squeezing every column."
        >
          <ChartCard
            title="Transactions detail"
            description="Wide view: customer, region, segment, product, payment, units, amount, status."
            bodyPadded={false}
          >
            <DataTable<ServerTransaction>
              columns={wideColumns}
              rows={serverTransactions.slice(0, 12)}
              showTotals
              bare
              maxHeightClassName="max-h-[420px]"
            />
          </ChartCard>
        </ExhibitSection>
      </div>
    </div>
  )
}
