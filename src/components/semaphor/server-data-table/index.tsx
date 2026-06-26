import { useEffect, useMemo, useState } from "react";
import {
  type SemaphorQueryRuntimeOptions,
  type SemaphorRecordsQueryResult,
  type SemaphorRecordsQueryDefinition,
  useSemaphorQuery,
} from "react-semaphor/data-app-sdk";
import {
  toServerDataTableColumn,
  toServerDataTablePagination,
  type ServerDataTableColumn,
  type ServerDataTableRow,
  type ServerDataTableSort,
} from "./core";
import {
  ServerDataTableView,
  type ServerDataTableViewProps,
} from "./view";

export type {
  ServerDataTableColumn,
  ServerDataTableColumnAlign,
  ServerDataTablePagination,
  ServerDataTablePaginationSummary,
  ServerDataTableRow,
  ServerDataTableSort,
} from "./core";

export type SemaphorServerDataTableQueryState<TSortKey extends string = string> = {
  page: number;
  pageSize: number;
  sort?: ServerDataTableSort<TSortKey>;
};

export type SemaphorServerDataTableProps<
  TRow extends ServerDataTableRow = ServerDataTableRow,
  TSortKey extends string = string,
> =
  Omit<
    ServerDataTableViewProps<TRow, TSortKey>,
    "columns" | "rows" | "pagination" | "sort" | "loading" | "error" | "onPageChange" | "onPageSizeChange" | "onSortChange"
  > & {
    queryFactory: (
      state: SemaphorServerDataTableQueryState<TSortKey>,
    ) => SemaphorRecordsQueryDefinition;
    options?: SemaphorQueryRuntimeOptions;
    initialPageSize?: number;
    columns?: readonly ServerDataTableColumn<TSortKey>[];
    rowAccessor?: (
      row: Record<string, unknown>,
      columns: SemaphorRecordsQueryResult["columns"],
    ) => TRow;
    rowsAccessor?: (result: SemaphorRecordsQueryResult) => TRow[];
    totalRowAccessor?: (result: SemaphorRecordsQueryResult) => ServerDataTableRow | undefined;
  };

export function SemaphorServerDataTable<
  TRow extends ServerDataTableRow = ServerDataTableRow,
  TSortKey extends string = string,
>({
  queryFactory,
  options,
  initialPageSize = 25,
  columns: providedColumns,
  totalRow: providedTotalRow,
  rowAccessor,
  rowsAccessor,
  totalRowAccessor,
  ...viewProps
}: SemaphorServerDataTableProps<TRow, TSortKey>) {
  const runtimeInputKey = stableRuntimeInputKey(options?.inputs);
  const [pageState, setPageState] = useState({
    page: 1,
    inputKey: runtimeInputKey,
  });
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState<ServerDataTableSort<TSortKey> | undefined>();
  const page = pageState.inputKey === runtimeInputKey ? pageState.page : 1;

  useEffect(() => {
    if (pageState.inputKey === runtimeInputKey) return;

    // External Semaphor inputs are the server-table cursor boundary. Persist
    // the new key so clearing filters cannot restore a stale page for an older key.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- this synchronizes local pagination with external query inputs.
    setPageState({ page: 1, inputKey: runtimeInputKey });
  }, [pageState.inputKey, runtimeInputKey]);

  const query = useMemo(
    () => queryFactory({ page, pageSize, sort }),
    [page, pageSize, queryFactory, sort],
  );
  const result = useSemaphorQuery(query, options);
  const rows = useMemo(() => {
    if (rowsAccessor) {
      return rowsAccessor(result);
    }
    if (rowAccessor) {
      return (result.records ?? []).map((row) =>
        rowAccessor(row, result.columns),
      );
    }
    return (result.records ?? []) as TRow[];
  }, [result, rowAccessor, rowsAccessor]);

  const columns = useMemo(
    () => providedColumns ?? result.columns?.map(toServerDataTableColumn) ?? [],
    [providedColumns, result.columns],
  );

  const pagination = toServerDataTablePagination(result.pagination, {
    page,
    pageSize,
    rowCount: rows.length,
  });

  const totalRow = useMemo(
    () => providedTotalRow ?? totalRowAccessor?.(result) ?? result.totals?.row,
    [providedTotalRow, result, totalRowAccessor],
  );
  const totalRowLabel =
    viewProps.totalRowLabel ??
    (!providedTotalRow && result.totals?.scope === "filtered_result"
      ? "Filtered total"
      : undefined);

  return (
    <ServerDataTableView
      {...viewProps}
      columns={columns}
      rows={rows}
      pagination={pagination}
      sort={sort}
      totalRow={totalRow}
      totalRowLabel={totalRowLabel}
      loading={result.isLoading}
      error={result.error}
      onPageChange={(nextPage) => {
        setPageState({ page: nextPage, inputKey: runtimeInputKey });
      }}
      onPageSizeChange={(nextPageSize) => {
        setPageSize(nextPageSize);
        setPageState({ page: 1, inputKey: runtimeInputKey });
      }}
      onSortChange={(nextSort) => {
        setSort(nextSort);
        setPageState({ page: 1, inputKey: runtimeInputKey });
      }}
    />
  );
}

function stableRuntimeInputKey(
  inputs: SemaphorQueryRuntimeOptions["inputs"],
): string {
  if (!inputs?.length) return "[]";

  return JSON.stringify(inputs.map((input) => runtimeInputSnapshot(input)));
}

function runtimeInputSnapshot(
  input: NonNullable<SemaphorQueryRuntimeOptions["inputs"]>[number],
) {
  const toAnalyticsInput = (input as { toAnalyticsInput?: unknown })
    .toAnalyticsInput;
  if (typeof toAnalyticsInput === "function") {
    const activeInput = toAnalyticsInput.call(input) as {
      inputId?: string;
      id?: string;
      kind?: string;
      value?: unknown;
      isActive?: boolean;
      operator?: string;
      controlRole?: string;
    };
    return {
      id: activeInput.inputId ?? activeInput.id,
      kind: activeInput.kind,
      value: activeInput.value,
      isActive: activeInput.isActive,
      operator: activeInput.operator,
      controlRole: activeInput.controlRole,
    };
  }

  const snapshot = input as {
    inputId?: string;
    id?: string;
    kind?: string;
    value?: unknown;
    defaultValue?: unknown;
    isActive?: boolean;
    operator?: string;
    controlRole?: string;
    role?: string;
  };
  const value = Object.prototype.hasOwnProperty.call(snapshot, "value")
    ? snapshot.value
    : snapshot.defaultValue;
  return {
    id: snapshot.inputId ?? snapshot.id,
    kind: snapshot.kind,
    value,
    isActive: snapshot.isActive ?? isActiveInputValue(value),
    operator: snapshot.operator,
    controlRole: snapshot.controlRole ?? snapshot.role,
  };
}

function isActiveInputValue(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}
