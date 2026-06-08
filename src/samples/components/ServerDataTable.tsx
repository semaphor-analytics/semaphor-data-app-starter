import { useState } from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
} from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ServerDataTableProps<Row> = {
  columns: ColumnDef<Row, unknown>[]
  rows: Row[]
  /** Available page sizes for the size selector. */
  pageSizes?: number[]
  /** Default page size. */
  defaultPageSize?: number
  /** When true, drop the outer border so the table can sit flush in a card. */
  bare?: boolean
}

export function ServerDataTable<Row>({
  columns,
  rows,
  pageSizes = [25, 50, 100],
  defaultPageSize = 25,
  bare = false,
}: ServerDataTableProps<Row>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: defaultPageSize },
    },
  })

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const totalRows = rows.length
  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min(totalRows, (pageIndex + 1) * pageSize)

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "overflow-auto max-h-[520px]",
          !bare && "rounded-md border",
        )}
      >
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10 bg-card [&_tr]:border-b [&_th]:shadow-[inset_0_-1px_0_var(--color-border)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = (header.column.columnDef.meta as
                    | { align?: "left" | "right" }
                    | undefined)?.align ?? "left"
                  const sortable = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  const Icon = !sorted
                    ? ChevronsUpDownIcon
                    : sorted === "asc"
                      ? ChevronUpIcon
                      : ChevronDownIcon

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        align === "right" && "text-right",
                        sortable && "cursor-pointer select-none",
                      )}
                      onClick={
                        sortable
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          align === "right" && "flex-row-reverse",
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sortable ? (
                          <Icon
                            className={cn(
                              "size-3.5",
                              sorted
                                ? "text-foreground"
                                : "text-muted-foreground/60",
                            )}
                          />
                        ) : null}
                      </span>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    | { align?: "left" | "right"; numeric?: boolean }
                    | undefined
                  const align = meta?.align ?? (meta?.numeric ? "right" : "left")
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        align === "right" && "text-right",
                        meta?.numeric && "tabular-nums",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground",
          bare && "px-5 pb-5",
        )}
      >
        <div className="flex items-center gap-3">
          <span>
            Showing{" "}
            <span className="font-medium text-foreground tabular-nums">
              {firstRow}–{lastRow}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground tabular-nums">
              {totalRows}
            </span>{" "}
            rows
          </span>
          <PageSizeSelector
            value={pageSize}
            options={pageSizes}
            onChange={(next) => table.setPageSize(next)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline">
            Page{" "}
            <span className="font-medium text-foreground tabular-nums">
              {pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground tabular-nums">
              {table.getPageCount() || 1}
            </span>
          </span>
          <PagerButton
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="size-3.5" />
          </PagerButton>
          <PagerButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-3.5" />
          </PagerButton>
          <PagerButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-3.5" />
          </PagerButton>
          <PagerButton
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="size-3.5" />
          </PagerButton>
        </div>
      </div>
    </div>
  )
}

function PageSizeSelector({
  value,
  options,
  onChange,
}: {
  value: number
  options: number[]
  onChange: (next: number) => void
}) {
  return (
    <label className="inline-flex items-center gap-1">
      <span>Rows</span>
      <select
        className="h-7 rounded-md border bg-card px-2 text-xs font-medium text-foreground"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  )
}

function PagerButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="size-7 p-0"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
