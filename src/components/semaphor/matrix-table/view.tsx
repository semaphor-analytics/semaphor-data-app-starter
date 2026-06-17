import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Columns3,
  Rows3,
} from "lucide-react";
import type { MatrixGridProjection } from "react-semaphor/data-app-sdk";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QueryState } from "../query-state/query-state";
import {
  MATRIX_DATA_COLUMN_WIDTH,
  MATRIX_FLAT_ROW_GROUP_WIDTH,
  MATRIX_FLAT_ROW_LEAF_WIDTH,
  MATRIX_HEADER_ROW_HEIGHT,
  MATRIX_ROW_HEADER_WIDTH,
  formatMatrixCell,
  getExpandableColumnPathKeys,
  isColumnPathCollapsed,
  isHeaderCellExpandable,
  isRowCollapsed,
  matrixPathKey,
  matrixResultToGridProjection,
  nextMatrixSort,
  projectVisibleMatrixGrid,
  toggleSetValue,
  type MatrixGridColumn,
  type MatrixGridRow,
  type MatrixHeaderCell,
  type MatrixPathSegment,
  type MatrixResult,
  type MatrixTableSort,
} from "./core";

export type { MatrixTableSort } from "./core";

type MatrixRowHeaderLayout = {
  mode: "hierarchy" | "flat";
  levels: MatrixGridProjection["rowHeaderLevels"];
  widths: number[];
  totalWidth: number;
  columnCount: number;
};

export type MatrixTableViewProps = {
  title?: string;
  description?: string;
  grid?: MatrixGridProjection;
  result?: MatrixResult;
  loading?: boolean;
  error?: unknown;
  height?: number;
  stickyFirstColumn?: boolean;
  sort?: MatrixTableSort;
  onSortChange?: (sort: MatrixTableSort | undefined) => void;
  onRetry?: () => void;
};

export function MatrixTableView({
  title = "Matrix table",
  description,
  grid,
  result,
  loading = false,
  error,
  height = 480,
  stickyFirstColumn = true,
  sort,
  onSortChange,
  onRetry,
}: MatrixTableViewProps) {
  const [collapsedRowPathKeys, setCollapsedRowPathKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [collapsedColumnPathKeys, setCollapsedColumnPathKeys] = useState<
    Set<string>
  >(() => new Set());
  const sourceGrid = useMemo(
    () => grid ?? (result ? matrixResultToGridProjection(result) : undefined),
    [grid, result],
  );
  const displayGrid = useMemo(
    () =>
      sourceGrid
        ? projectVisibleMatrixGrid({
            grid: sourceGrid,
            collapsedRowPathKeys,
            collapsedColumnPathKeys,
          })
        : undefined,
    [collapsedColumnPathKeys, collapsedRowPathKeys, sourceGrid],
  );
  const isInitialLoad = loading && !displayGrid;
  const isRefetching = loading && Boolean(displayGrid);
  const rowHeaderLabel =
    displayGrid?.rowHeaderLevels.map((level) => level.label).join(" / ") ||
    "Rows";
  const rowHeaderLayout = useMemo(
    () => (displayGrid ? resolveRowHeaderLayout(displayGrid) : undefined),
    [displayGrid],
  );
  const rowHeaderTemplate =
    rowHeaderLayout?.widths.map((width) => `${width}px`).join(" ") ??
    `${MATRIX_ROW_HEADER_WIDTH}px`;
  const gridTemplateColumns = displayGrid
    ? `${rowHeaderTemplate} repeat(${displayGrid.columns.length}, minmax(${MATRIX_DATA_COLUMN_WIDTH}px, 1fr))`
    : undefined;
  const minTableWidth = displayGrid
    ? (rowHeaderLayout?.totalWidth ?? MATRIX_ROW_HEADER_WIDTH) +
      displayGrid.columns.length * MATRIX_DATA_COLUMN_WIDTH
    : undefined;
  const sourceRowById = useMemo(
    () => new Map(sourceGrid?.rows.map((row) => [row.id, row]) ?? []),
    [sourceGrid],
  );
  const expandableRowPathKeys = useMemo(
    () =>
      sourceGrid?.rows
        .filter((row) => row.hasChildren)
        .map((row) => matrixPathKey(row.rowPath)) ?? [],
    [sourceGrid],
  );
  const expandableColumnPathKeys = useMemo(
    () => (sourceGrid ? getExpandableColumnPathKeys(sourceGrid) : []),
    [sourceGrid],
  );
  const allRowsExpanded =
    expandableRowPathKeys.length > 0 &&
    !expandableRowPathKeys.some((key) => collapsedRowPathKeys.has(key));
  const allColumnsExpanded =
    expandableColumnPathKeys.length > 0 &&
    !expandableColumnPathKeys.some((key) => collapsedColumnPathKeys.has(key));
  const showAxisControls =
    expandableRowPathKeys.length > 0 || expandableColumnPathKeys.length > 0;
  const headerRowHeaderLabel =
    rowHeaderLayout?.mode === "flat" || !showAxisControls
      ? rowHeaderLabel
      : "";
  const toggleRowPath = (path: MatrixPathSegment[]) => {
    setCollapsedRowPathKeys((current) =>
      toggleSetValue(current, matrixPathKey(path)),
    );
  };
  const toggleColumnPath = (path: MatrixPathSegment[]) => {
    setCollapsedColumnPathKeys((current) =>
      toggleSetValue(current, matrixPathKey(path)),
    );
  };
  const toggleAllRows = () => {
    setCollapsedRowPathKeys(
      allRowsExpanded ? new Set(expandableRowPathKeys) : new Set(),
    );
  };
  const toggleAllColumns = () => {
    setCollapsedColumnPathKeys(
      allColumnsExpanded ? new Set(expandableColumnPathKeys) : new Set(),
    );
  };

  return (
    <section className="overflow-hidden rounded-md border bg-card text-card-foreground">
      <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-6">{title}</h3>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <QueryState
        title={title}
        loading={isInitialLoad}
        error={error}
        empty={Boolean(displayGrid && displayGrid.rows.length === 0)}
        emptyTitle="No matrix rows found"
        emptyDescription="Try changing filters, row levels, column levels, or the selected measure."
        onRetry={onRetry}
      >
        {displayGrid && gridTemplateColumns ? (
          <div
            className={cn(
              "relative isolate overflow-auto overscroll-none transition-opacity",
              isRefetching && "opacity-60",
            )}
            style={{ maxHeight: height }}
            aria-busy={loading || undefined}
          >
            <div
              role="table"
              aria-label={title}
              className="relative isolate"
              style={
                minTableWidth
                  ? { minWidth: minTableWidth, width: "100%" }
                  : undefined
              }
            >
              <div role="rowgroup">
                {showAxisControls
                  ? renderAxisControlRow({
                      displayGrid,
                      gridTemplateColumns,
                      rowHeaderLayout,
                      rowHeaderLabel,
                      stickyFirstColumn,
                      hasExpandableRows: expandableRowPathKeys.length > 0,
                      hasExpandableColumns:
                        expandableColumnPathKeys.length > 0,
                      allRowsExpanded,
                      allColumnsExpanded,
                      onToggleAllRows: toggleAllRows,
                      onToggleAllColumns: toggleAllColumns,
                    })
                  : null}
                {renderHeaderRows({
                  displayGrid,
                  sourceColumns: sourceGrid?.columns ?? [],
                  gridTemplateColumns,
                  rowHeaderLayout,
                  rowHeaderLabel: headerRowHeaderLabel,
                  stickyFirstColumn,
                  topOffsetRows: showAxisControls ? 1 : 0,
                  collapsedColumnPathKeys,
                  onToggleColumnPath: toggleColumnPath,
                })}
                {displayGrid.columnHeaderRows.length === 0
                  ? renderFlatColumnHeaderRow({
                      displayGrid,
                      gridTemplateColumns,
                      rowHeaderLayout,
                      rowHeaderLabel: headerRowHeaderLabel,
                      stickyFirstColumn,
                      topOffsetRows: showAxisControls ? 1 : 0,
                      sort,
                      onSortChange,
                    })
                  : null}
              </div>
              <div role="rowgroup">
                {displayGrid.rows.map((row) => {
                  const sourceRow = sourceRowById.get(row.id) ?? row;
                  return (
                    <div
                      key={row.id}
                      role="row"
                      className="grid"
                      style={{ gridTemplateColumns }}
                    >
                      {rowHeaderLayout?.mode === "flat" ? (
                        <FlatRowHeaderCells
                          row={row}
                          layout={rowHeaderLayout}
                          stickyFirstColumn={stickyFirstColumn}
                        />
                      ) : (
                        <HierarchyRowHeaderCell
                          row={row}
                          sourceRow={sourceRow}
                          collapsedRowPathKeys={collapsedRowPathKeys}
                          stickyFirstColumn={stickyFirstColumn}
                          onToggleRowPath={toggleRowPath}
                        />
                      )}
                      {displayGrid.columns.map((column) => (
                        <MatrixValueCell
                          key={`${row.id}:${column.id}`}
                          row={row}
                          column={column}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </QueryState>
    </section>
  );
}

function resolveRowHeaderLayout(grid: MatrixGridProjection): MatrixRowHeaderLayout {
  const isHierarchical = grid.rows.some((row) => row.hasChildren);
  const levels = grid.rowHeaderLevels.length
    ? grid.rowHeaderLevels
    : [{ id: "rows", label: "Rows", fieldInstanceId: "rows" }];
  if (!isHierarchical && levels.length > 1) {
    const widths = levels.map((_, index) =>
      index === levels.length - 1
        ? MATRIX_FLAT_ROW_LEAF_WIDTH
        : MATRIX_FLAT_ROW_GROUP_WIDTH,
    );
    return {
      mode: "flat",
      levels,
      widths,
      totalWidth: widths.reduce((sum, width) => sum + width, 0),
      columnCount: widths.length,
    };
  }

  return {
    mode: "hierarchy",
    levels,
    widths: [MATRIX_ROW_HEADER_WIDTH],
    totalWidth: MATRIX_ROW_HEADER_WIDTH,
    columnCount: 1,
  };
}

function HeaderRowHeaderCells({
  layout,
  label,
  stickyFirstColumn,
  top,
}: {
  layout: MatrixRowHeaderLayout | undefined;
  label: string;
  stickyFirstColumn: boolean;
  top: number;
}) {
  if (layout?.mode === "flat") {
    return layout.levels.map((level, index) => {
      const isLast = index === layout.levels.length - 1;
      return (
        <div
          key={level.id}
          role="columnheader"
          className={cn(
            "sticky z-50 flex h-10 items-center overflow-hidden border-b border-r bg-muted px-3 text-xs font-medium text-muted-foreground",
            stickyFirstColumn && isLast && "shadow-[1px_0_0_var(--border)]",
          )}
          style={{
            left: rowHeaderLeftOffset(layout, index),
            top,
            width: layout.widths[index],
          }}
          title={level.label}
        >
          <span className="min-w-0 truncate">{label ? level.label : ""}</span>
        </div>
      );
    });
  }

  return (
    <div
      role="columnheader"
      className={cn(
        "sticky left-0 z-50 flex h-10 items-center overflow-hidden border-b border-r bg-muted px-3 text-xs font-medium text-muted-foreground",
        stickyFirstColumn && "shadow-[1px_0_0_var(--border)]",
      )}
      style={{ top, width: layout?.totalWidth ?? MATRIX_ROW_HEADER_WIDTH }}
    >
      <span className="min-w-0 truncate">{label}</span>
    </div>
  );
}

function HierarchyRowHeaderCell({
  row,
  sourceRow,
  collapsedRowPathKeys,
  stickyFirstColumn,
  onToggleRowPath,
}: {
  row: MatrixGridRow;
  sourceRow: MatrixGridRow;
  collapsedRowPathKeys: Set<string>;
  stickyFirstColumn: boolean;
  onToggleRowPath: (path: MatrixPathSegment[]) => void;
}) {
  return (
    <div
      role="rowheader"
      className={cn(
        "sticky left-0 z-40 flex min-h-11 items-center overflow-hidden border-r bg-card px-3 py-2 text-sm",
        row.role !== "value" && "bg-muted font-medium",
        row.role === "rowGrandTotal" && "bg-muted font-semibold",
        stickyFirstColumn && "shadow-[1px_0_0_var(--border)]",
      )}
      style={{ width: MATRIX_ROW_HEADER_WIDTH }}
    >
      <div
        className="flex min-w-0 items-center gap-2"
        style={{ paddingLeft: Math.max(row.depth, 0) * 14 }}
      >
        <span className="min-w-0 truncate">{row.label}</span>
        {sourceRow.hasChildren ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 text-muted-foreground"
            aria-label={`${
              isRowCollapsed(sourceRow, collapsedRowPathKeys)
                ? "Expand"
                : "Collapse"
            } ${row.label}`}
            onClick={() => onToggleRowPath(sourceRow.rowPath)}
          >
            {isRowCollapsed(sourceRow, collapsedRowPathKeys) ? (
              <ChevronRight className="size-3.5" aria-hidden />
            ) : (
              <ChevronDown className="size-3.5" aria-hidden />
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function FlatRowHeaderCells({
  row,
  layout,
  stickyFirstColumn,
}: {
  row: MatrixGridRow;
  layout: MatrixRowHeaderLayout;
  stickyFirstColumn: boolean;
}) {
  return layout.levels.map((level, index) => {
    const segment = row.rowPath[index];
    const isLast = index === layout.levels.length - 1;
    const label =
      segment?.label ??
      (index === layout.levels.length - 1 ? row.label : "");
    return (
      <div
        key={`${row.id}:${level.id}`}
        role={isLast ? "rowheader" : "cell"}
        className={cn(
          "sticky z-40 flex min-h-11 items-center overflow-hidden border-r bg-card px-3 py-2 text-sm",
          row.role !== "value" && "bg-muted font-medium",
          row.role === "rowGrandTotal" && "bg-muted font-semibold",
          stickyFirstColumn && isLast && "shadow-[1px_0_0_var(--border)]",
        )}
        style={{
          left: rowHeaderLeftOffset(layout, index),
          width: layout.widths[index],
        }}
        title={String(label)}
      >
        <span className="min-w-0 truncate">{label}</span>
      </div>
    );
  });
}

function rowHeaderLeftOffset(layout: MatrixRowHeaderLayout, index: number) {
  return layout.widths
    .slice(0, index)
    .reduce((sum, width) => sum + width, 0);
}

function renderAxisControlRow({
  displayGrid,
  gridTemplateColumns,
  rowHeaderLayout,
  rowHeaderLabel,
  stickyFirstColumn,
  hasExpandableRows,
  hasExpandableColumns,
  allRowsExpanded,
  allColumnsExpanded,
  onToggleAllRows,
  onToggleAllColumns,
}: {
  displayGrid: MatrixGridProjection;
  gridTemplateColumns: string;
  rowHeaderLayout: MatrixRowHeaderLayout | undefined;
  rowHeaderLabel: string;
  stickyFirstColumn: boolean;
  hasExpandableRows: boolean;
  hasExpandableColumns: boolean;
  allRowsExpanded: boolean;
  allColumnsExpanded: boolean;
  onToggleAllRows: () => void;
  onToggleAllColumns: () => void;
}) {
  return (
    <div role="row" className="grid" style={{ gridTemplateColumns }}>
      <div
        role="columnheader"
        className={cn(
          "sticky left-0 top-0 z-50 flex h-10 items-center overflow-hidden border-b border-r bg-muted px-3 text-xs font-medium text-muted-foreground",
          stickyFirstColumn && "shadow-[1px_0_0_var(--border)]",
        )}
        style={{
          gridColumn: `span ${rowHeaderLayout?.columnCount ?? 1}`,
          width: rowHeaderLayout?.totalWidth,
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {hasExpandableRows ? (
            <ExpandAllButton
              axis="rows"
              expanded={allRowsExpanded}
              onClick={onToggleAllRows}
            />
          ) : (
            <Rows3 className="size-3.5 shrink-0" aria-hidden />
          )}
          <span className="min-w-0 truncate">{rowHeaderLabel}</span>
        </div>
      </div>
      <div
        role="columnheader"
        className="sticky top-0 z-30 flex h-10 items-center overflow-hidden border-b border-r bg-muted px-3 text-xs font-medium text-muted-foreground"
        style={{ gridColumn: `span ${displayGrid.columns.length}` }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {hasExpandableColumns ? (
            <ExpandAllButton
              axis="columns"
              expanded={allColumnsExpanded}
              onClick={onToggleAllColumns}
            />
          ) : (
            <Columns3 className="size-3.5 shrink-0" aria-hidden />
          )}
          <span className="min-w-0 truncate">Columns</span>
        </div>
      </div>
    </div>
  );
}

function renderHeaderRows({
  displayGrid,
  sourceColumns,
  gridTemplateColumns,
  rowHeaderLayout,
  rowHeaderLabel,
  stickyFirstColumn,
  topOffsetRows,
  collapsedColumnPathKeys,
  onToggleColumnPath,
}: {
  displayGrid: MatrixGridProjection;
  sourceColumns: MatrixGridColumn[];
  gridTemplateColumns: string;
  rowHeaderLayout: MatrixRowHeaderLayout | undefined;
  rowHeaderLabel: string;
  stickyFirstColumn: boolean;
  topOffsetRows: number;
  collapsedColumnPathKeys: Set<string>;
  onToggleColumnPath: (path: MatrixPathSegment[]) => void;
}) {
  return displayGrid.columnHeaderRows.map((headerRow, rowIndex) => (
    <div
      key={headerRow.id}
      role="row"
      className="grid"
      style={{ gridTemplateColumns }}
    >
      <HeaderRowHeaderCells
        layout={rowHeaderLayout}
        label={rowIndex === 0 ? rowHeaderLabel : ""}
        stickyFirstColumn={stickyFirstColumn}
        top={(rowIndex + topOffsetRows) * MATRIX_HEADER_ROW_HEIGHT}
      />
      {headerRow.cells.map((cell) => (
        <MatrixHeaderCellView
          key={cell.id}
          cell={cell}
          rowIndex={rowIndex + topOffsetRows}
          sourceColumns={sourceColumns}
          collapsedColumnPathKeys={collapsedColumnPathKeys}
          onToggleColumnPath={onToggleColumnPath}
        />
      ))}
    </div>
  ));
}

function renderFlatColumnHeaderRow({
  displayGrid,
  gridTemplateColumns,
  rowHeaderLayout,
  rowHeaderLabel,
  stickyFirstColumn,
  topOffsetRows,
  sort,
  onSortChange,
}: {
  displayGrid: MatrixGridProjection;
  gridTemplateColumns: string;
  rowHeaderLayout: MatrixRowHeaderLayout | undefined;
  rowHeaderLabel: string;
  stickyFirstColumn: boolean;
  topOffsetRows: number;
  sort?: MatrixTableSort;
  onSortChange?: (sort: MatrixTableSort | undefined) => void;
}) {
  return (
    <div role="row" className="grid" style={{ gridTemplateColumns }}>
      <HeaderRowHeaderCells
        layout={rowHeaderLayout}
        label={rowHeaderLabel}
        stickyFirstColumn={stickyFirstColumn}
        top={topOffsetRows * MATRIX_HEADER_ROW_HEIGHT}
      />
      {displayGrid.columns.map((column) => (
        <div
          key={column.id}
          role="columnheader"
          className="sticky top-0 z-20 flex h-10 items-center justify-end overflow-hidden border-b border-r bg-muted px-3 text-right text-xs font-medium text-muted-foreground"
          style={{ top: topOffsetRows * MATRIX_HEADER_ROW_HEIGHT }}
        >
          <SortButton
            label={column.label}
            active={sort?.targetId === column.id ? sort.direction : undefined}
            onClick={
              onSortChange
                ? () => onSortChange(nextMatrixSort(sort, "column", column.id))
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}

function ExpandAllButton({
  axis,
  expanded,
  onClick,
}: {
  axis: "rows" | "columns";
  expanded: boolean;
  onClick: () => void;
}) {
  const noun = axis === "rows" ? "rows" : "columns";
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-6 shrink-0 text-muted-foreground"
      aria-label={`${expanded ? "Collapse" : "Expand"} all ${noun}`}
      aria-expanded={expanded}
      onClick={onClick}
    >
      <ChevronRight
        className={cn("size-3.5 transition-transform", expanded && "rotate-90")}
        aria-hidden
      />
    </Button>
  );
}

function MatrixHeaderCellView({
  cell,
  rowIndex,
  sourceColumns,
  collapsedColumnPathKeys,
  onToggleColumnPath,
}: {
  cell: MatrixHeaderCell;
  rowIndex: number;
  sourceColumns: MatrixGridColumn[];
  collapsedColumnPathKeys: Set<string>;
  onToggleColumnPath: (path: MatrixPathSegment[]) => void;
}) {
  const expandable = isHeaderCellExpandable(cell, sourceColumns);
  const collapsed = isColumnPathCollapsed(
    cell.columnPath,
    collapsedColumnPathKeys,
  );
  return (
    <div
      role="columnheader"
      className={cn(
        "sticky z-20 flex h-10 items-center overflow-hidden whitespace-nowrap border-b border-r bg-muted px-2 text-center text-xs font-medium text-muted-foreground",
        cell.role === "grandTotal" && "font-semibold text-foreground",
      )}
      style={{
        top: rowIndex * MATRIX_HEADER_ROW_HEIGHT,
        gridColumn: `span ${cell.colSpan}`,
      }}
    >
      <div className="mx-auto flex min-w-0 max-w-full items-center justify-center gap-1.5 overflow-hidden">
        <span className="min-w-0 truncate">{cell.label}</span>
        {expandable ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 text-muted-foreground"
            aria-label={`${collapsed ? "Expand" : "Collapse"} ${cell.label}`}
            onClick={() => onToggleColumnPath(cell.columnPath)}
          >
            {collapsed ? (
              <ChevronRight className="size-3.5" aria-hidden />
            ) : (
              <ChevronDown className="size-3.5" aria-hidden />
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function MatrixValueCell({
  row,
  column,
}: {
  row: MatrixGridRow;
  column: MatrixGridColumn;
}) {
  const cell = row.cells.find((candidate) => candidate.columnId === column.id);
  const value = formatMatrixCell(cell);
  return (
    <div
      role="cell"
      className={cn(
        "relative z-0 flex min-h-11 items-center justify-end overflow-hidden border-r px-3 py-2 text-right text-sm tabular-nums",
        cell?.role !== "value" && "bg-muted/20 font-semibold",
        cell?.presence !== "present" && "text-muted-foreground",
      )}
    >
      <span className="truncate">{value}</span>
    </div>
  );
}

function SortButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: "asc" | "desc";
  onClick?: () => void;
}) {
  if (!onClick) return <span className="truncate">{label}</span>;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="ml-auto h-7 min-w-0 px-2 text-xs"
      onClick={onClick}
    >
      <span className="truncate">{label}</span>
      {active === "asc" ? (
        <ArrowUp className="size-3.5 shrink-0" aria-hidden />
      ) : active === "desc" ? (
        <ArrowDown className="size-3.5 shrink-0" aria-hidden />
      ) : null}
    </Button>
  );
}
