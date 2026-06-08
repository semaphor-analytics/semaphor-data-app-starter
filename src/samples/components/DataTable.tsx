import { useMemo, useState } from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Column<Row> = {
  key: keyof Row & string
  label: string
  align?: "left" | "right"
  sortable?: boolean
  numeric?: boolean
  /** Returns the display string for a cell. Receives the raw row + value. */
  render?: (row: Row) => React.ReactNode
  /** Returns the value used for sorting (defaults to row[key]). */
  sortValue?: (row: Row) => string | number
  /** When set, this column is included in the totals row. */
  total?: "sum"
  /** Format the totals row value (defaults to identity). */
  formatTotal?: (value: number) => string
}

type DataTableProps<Row> = {
  columns: Column<Row>[]
  rows: Row[]
  /** Show a totals row at the bottom for columns with total set. */
  showTotals?: boolean
  /** Constrain height + scroll. Defaults to "max-h-[420px]". */
  maxHeightClassName?: string
  emptyMessage?: string
  /**
   * When true, render the table without its own outer border so it can sit
   * flush inside a ChartCard. Defaults to false.
   */
  bare?: boolean
}

type SortState<Row> = {
  key: keyof Row & string
  direction: "asc" | "desc"
} | null

export function DataTable<Row extends Record<string, unknown>>({
  columns,
  rows,
  showTotals = false,
  maxHeightClassName = "max-h-[420px]",
  emptyMessage = "No data for the current filters.",
  bare = false,
}: DataTableProps<Row>) {
  const [sort, setSort] = useState<SortState<Row>>(null)

  const sortedRows = useMemo(() => {
    if (!sort) return rows
    const column = columns.find((c) => c.key === sort.key)
    if (!column) return rows
    const getValue = column.sortValue ?? ((row: Row) => row[sort.key] as string | number)
    const sorted = [...rows].sort((a, b) => {
      const av = getValue(a)
      const bv = getValue(b)
      if (typeof av === "number" && typeof bv === "number") {
        return sort.direction === "asc" ? av - bv : bv - av
      }
      const as = String(av ?? "")
      const bs = String(bv ?? "")
      return sort.direction === "asc"
        ? as.localeCompare(bs)
        : bs.localeCompare(as)
    })
    return sorted
  }, [columns, rows, sort])

  const totals = useMemo(() => {
    if (!showTotals) return null
    const result: Record<string, number> = {}
    for (const column of columns) {
      if (column.total !== "sum") continue
      result[column.key] = sortedRows.reduce((acc, row) => {
        const value = row[column.key]
        return typeof value === "number" ? acc + value : acc
      }, 0)
    }
    return result
  }, [columns, showTotals, sortedRows])

  function onSortClick(column: Column<Row>) {
    if (!column.sortable) return
    setSort((current) => {
      if (!current || current.key !== column.key) {
        return { key: column.key, direction: "asc" }
      }
      if (current.direction === "asc") {
        return { key: column.key, direction: "desc" }
      }
      return null
    })
  }

  if (rows.length === 0) {
    return (
      <div className="grid place-items-center rounded-md border border-dashed py-10 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "overflow-auto",
        !bare && "rounded-md border",
        maxHeightClassName,
      )}
    >
      <table className="w-full caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-10 bg-card [&_tr]:border-b [&_th]:shadow-[inset_0_-1px_0_var(--color-border)]">
          <TableRow>
            {columns.map((column) => {
              const isActive = sort?.key === column.key
              const align =
                column.align ?? (column.numeric ? "right" : "left")
              const Icon = !isActive
                ? ChevronsUpDownIcon
                : sort?.direction === "asc"
                  ? ChevronUpIcon
                  : ChevronDownIcon

              return (
                <TableHead
                  key={column.key}
                  className={cn(
                    align === "right" && "text-right",
                    column.sortable && "cursor-pointer select-none",
                  )}
                  onClick={() => onSortClick(column)}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      align === "right" && "flex-row-reverse",
                    )}
                  >
                    {column.label}
                    {column.sortable ? (
                      <Icon
                        className={cn(
                          "size-3.5",
                          isActive ? "text-foreground" : "text-muted-foreground/60",
                        )}
                      />
                    ) : null}
                  </span>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => {
                const align =
                  column.align ?? (column.numeric ? "right" : "left")
                return (
                  <TableCell
                    key={column.key}
                    className={cn(
                      align === "right" && "text-right",
                      column.numeric && "tabular-nums",
                    )}
                  >
                    {column.render ? column.render(row) : String(row[column.key] ?? "")}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
        {showTotals && totals ? (
          <TableFooter className="sticky bottom-0 z-10 bg-card [&_td]:shadow-[inset_0_1px_0_var(--color-border)]">
            <TableRow>
              {columns.map((column, index) => {
                const align =
                  column.align ?? (column.numeric ? "right" : "left")
                const total = totals[column.key]
                const isFirst = index === 0
                if (total === undefined) {
                  return (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "text-xs font-medium uppercase tracking-wider text-muted-foreground",
                        align === "right" && "text-right",
                      )}
                    >
                      {isFirst ? "Total" : null}
                    </TableCell>
                  )
                }
                const formatted = column.formatTotal
                  ? column.formatTotal(total)
                  : String(total)
                return (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "font-semibold tabular-nums",
                      align === "right" && "text-right",
                    )}
                  >
                    {formatted}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableFooter>
        ) : null}
      </table>
    </div>
  )
}
