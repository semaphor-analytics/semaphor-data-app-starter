/* eslint-disable react-hooks/incompatible-library */
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { ArrowUpDownIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { InventoryMovementRow } from "@/semaphor/starter-query"

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function formatDate(value: string) {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3])
      )
    : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return dateFormatter.format(date)
}

function formatTons(value: number) {
  return numberFormatter.format(value)
}

export function DataAppTable({ rows }: { rows: InventoryMovementRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "movement_date", desc: true },
  ])

  const columns = useMemo<ColumnDef<InventoryMovementRow>[]>(
    () => [
      {
        accessorKey: "movement_date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDownIcon data-icon="inline-start" />
            Date
          </Button>
        ),
        cell: ({ row }) => formatDate(row.original.movement_date),
      },
      {
        accessorKey: "region",
        header: "Region",
      },
      {
        accessorKey: "movement_type",
        header: "Movement Type",
      },
      {
        accessorKey: "quantity_tons",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDownIcon data-icon="inline-start" />
            Quantity
          </Button>
        ),
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatTons(row.original.quantity_tons)}
          </span>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const visibleRows = table.getRowModel().rows
  const total = visibleRows.reduce(
    (sum, row) => sum + row.original.quantity_tons,
    0
  )

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No rows returned.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {visibleRows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Displayed total</TableCell>
          <TableCell className="tabular-nums">{formatTons(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
