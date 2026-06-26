/* eslint-disable react-refresh/only-export-components */
import { FunnelIcon } from "lucide-react"
import type { SemaphorInputHandle } from "react-semaphor/data-app-sdk"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { getSemaphorDateRangeFilterLabel } from "./date-range-filter"
import {
  createSemaphorOptionAdapter,
  isSemaphorOptionValue,
  semaphorOptionValueKey,
} from "./option-adapter"

export type SemaphorActiveFilterSummary = {
  id: string
  label: string
  value: string
}

export type SemaphorActiveFilterSummaryBadgeProps = {
  filters: SemaphorActiveFilterSummary[]
  className?: string
}

export type SemaphorClearFiltersButtonProps = {
  handles: SemaphorInputHandle[]
  label?: string
  className?: string
}

export function getSemaphorActiveFilterSummaries(
  handles: SemaphorInputHandle[],
): SemaphorActiveFilterSummary[] {
  return handles
    .filter((handle) => handle.kind === "filter" && handle.isActive)
    .map((handle) => ({
      id: handle.id,
      label: handle.label ?? handle.id,
      value: formatHandleValue(handle),
    }))
    .filter((filter) => filter.value.length > 0)
}

export function clearSemaphorFilterHandles(
  handles: SemaphorInputHandle[],
): number {
  const activeFilters = handles.filter(
    (handle) => handle.kind === "filter" && handle.isActive,
  )
  for (const handle of activeFilters) {
    handle.setValue(undefined)
  }
  return activeFilters.length
}

export function SemaphorClearFiltersButton({
  handles,
  label = "Clear all",
  className,
}: SemaphorClearFiltersButtonProps) {
  const activeFilterCount = handles.filter(
    (handle) => handle.kind === "filter" && handle.isActive,
  ).length

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("h-6 px-2 text-xs", className)}
      disabled={activeFilterCount === 0}
      onClick={() => clearSemaphorFilterHandles(handles)}
    >
      {label}
    </Button>
  )
}

export function SemaphorActiveFilterSummaryBadge({
  filters = [],
  className,
}: SemaphorActiveFilterSummaryBadgeProps) {
  if (!filters.length) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={150}
        render={
          <button
            type="button"
            className={cn(
              "inline-flex h-6 items-center gap-1.5 rounded-md border bg-muted/40 px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              className,
            )}
          />
        }
      >
        <FunnelIcon className="size-3" />
        <span>{filters.length === 1 ? "Filtered" : `${filters.length} filters`}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2">
        <div className="flex flex-col gap-1.5">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span className="min-w-0 truncate text-muted-foreground">
                {filter.label}
              </span>
              <span className="max-w-40 truncate font-medium text-foreground">
                {filter.value}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function formatHandleValue(handle: SemaphorInputHandle): string {
  if (isDateRangeHandle(handle)) {
    return getSemaphorDateRangeFilterLabel(handle)
  }

  const value = handle.value
  if (Array.isArray(value)) {
    return formatArrayValue(handle, value)
  }

  return formatScalarValue(handle, value)
}

function formatArrayValue(
  handle: SemaphorInputHandle,
  value: unknown[],
): string {
  if (!value.length) {
    return ""
  }
  const labelByValue = optionLabelByValue(handle)
  const labels = value
    .filter(isSemaphorOptionValue)
    .map((item) => formatOptionValue(item, labelByValue))
    .filter((item) => item.length > 0)
  if (labels.length === 0) {
    return ""
  }
  if (labels.length <= 2) {
    return labels.join(", ")
  }
  return `${labels.length} selected`
}

function formatScalarValue(
  handle: SemaphorInputHandle,
  value: unknown,
): string {
  if (isSemaphorOptionValue(value)) {
    return formatOptionValue(value, optionLabelByValue(handle))
  }
  return formatScalar(value)
}

function formatOptionValue(
  value: string | number | boolean,
  labelByValue: Map<string, string>,
): string {
  return labelByValue.get(semaphorOptionValueKey(value)) ?? formatScalar(value)
}

function optionLabelByValue(handle: SemaphorInputHandle): Map<string, string> {
  const adapter = createSemaphorOptionAdapter(handle.options ?? [], {
    labelContext: [handle.label, handle.id].filter(Boolean).join(" "),
  })
  return new Map(adapter.uiOptions.map((option) => [option.value, option.label]))
}

function formatScalar(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return ""
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }
  return String(value)
}

function isDateRangeHandle(handle: SemaphorInputHandle) {
  return handle.operator === "between" && Array.isArray(handle.value)
}
