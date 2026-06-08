import { cn } from "@/lib/utils"
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrencyCompact } from "../lib/formatting"
import type { MatrixRow } from "../data/matrix"

type MatrixProps = {
  rows: MatrixRow[]
  columns: string[]
  rowLabel?: string
  /** When true, drop the outer border so the matrix can sit flush in a card. */
  bare?: boolean
}

export function Matrix({
  rows,
  columns,
  rowLabel = "Region",
  bare = false,
}: MatrixProps) {
  const columnTotals: Record<string, number> = Object.fromEntries(
    columns.map((c) => [c, 0]),
  )
  let grandTotal = 0

  return (
    <div
      className={cn(
        "overflow-auto max-h-[560px]",
        !bare && "rounded-md border",
      )}
    >
      <table className="w-full caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-20 bg-card [&_tr]:border-b [&_th]:shadow-[inset_0_-1px_0_var(--color-border)]">
          <TableRow>
            <TableHead className="sticky left-0 z-30 bg-card">
              {rowLabel}
            </TableHead>
            {columns.map((col) => (
              <TableHead key={col} className="text-right">
                {col}
              </TableHead>
            ))}
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const subtotals = columns.reduce<Record<string, number>>(
              (acc, col) => {
                const total = row.subRegions.reduce((sum, sub) => {
                  const value = sub.values[col]
                  return typeof value === "number" ? sum + value : sum
                }, 0)
                acc[col] = total
                columnTotals[col] += total
                return acc
              },
              {},
            )
            const rowTotal = Object.values(subtotals).reduce(
              (acc, val) => acc + val,
              0,
            )
            grandTotal += rowTotal

            return (
              <RegionGroup
                key={row.region}
                row={row}
                columns={columns}
                subtotals={subtotals}
                rowTotal={rowTotal}
              />
            )
          })}
        </TableBody>
        <TableFooter className="sticky bottom-0 z-20 bg-card [&_td]:shadow-[inset_0_1px_0_var(--color-border)]">
          <TableRow>
            <TableCell className="sticky left-0 z-30 bg-card text-xs font-semibold uppercase tracking-wider">
              Grand total
            </TableCell>
            {columns.map((col) => (
              <TableCell
                key={col}
                className="text-right font-semibold tabular-nums"
              >
                {formatCurrencyCompact(columnTotals[col])}
              </TableCell>
            ))}
            <TableCell className="text-right font-semibold tabular-nums">
              {formatCurrencyCompact(grandTotal)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </table>
    </div>
  )
}

function RegionGroup({
  row,
  columns,
  subtotals,
  rowTotal,
}: {
  row: MatrixRow
  columns: string[]
  subtotals: Record<string, number>
  rowTotal: number
}) {
  return (
    <>
      <TableRow className="bg-muted/40 font-semibold">
        <TableCell className="sticky left-0 z-10 bg-muted/95">
          {row.region}
        </TableCell>
        {columns.map((col) => (
          <TableCell key={col} className="text-right tabular-nums">
            {formatCurrencyCompact(subtotals[col])}
          </TableCell>
        ))}
        <TableCell className="text-right tabular-nums">
          {formatCurrencyCompact(rowTotal)}
        </TableCell>
      </TableRow>
      {row.subRegions.map((sub) => {
        const subTotal = columns.reduce((acc, col) => {
          const value = sub.values[col]
          return typeof value === "number" ? acc + value : acc
        }, 0)

        return (
          <TableRow key={sub.name}>
            <TableCell className="sticky left-0 bg-background pl-6 text-muted-foreground">
              {sub.name}
            </TableCell>
            {columns.map((col) => {
              const value = sub.values[col]
              if (value === null) {
                return (
                  <TableCell
                    key={col}
                    className={cn(
                      "text-right text-xs text-muted-foreground/60 tabular-nums",
                    )}
                  >
                    —
                  </TableCell>
                )
              }
              return (
                <TableCell
                  key={col}
                  className="text-right tabular-nums"
                >
                  {formatCurrencyCompact(value)}
                </TableCell>
              )
            })}
            <TableCell className="text-right font-medium tabular-nums">
              {formatCurrencyCompact(subTotal)}
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
