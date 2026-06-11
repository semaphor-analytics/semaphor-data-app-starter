/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react"
import { format, isValid, parseISO, startOfDay, subDays } from "date-fns"
import type { SemaphorInputHandle, SemaphorScalar } from "react-semaphor/data-app-sdk"

import {
  DateRangePicker,
  getDateRangeLabel,
  type DateRange,
} from "./SemaphorDateRangePicker"

export type SemaphorDateRangeFilterProps = {
  label?: string
  handle: SemaphorInputHandle
  today?: Date
  align?: "start" | "end" | "center"
  fallbackDays?: number
  initializeWhenEmpty?: boolean
}

export function SemaphorDateRangeFilter({
  label,
  handle,
  today = startOfDay(new Date()),
  align = "start",
  fallbackDays = 30,
  initializeWhenEmpty = true,
}: SemaphorDateRangeFilterProps) {
  const value = toDateRange(handle.value, today, fallbackDays)

  useEffect(() => {
    if (!initializeWhenEmpty || hasDateRangeValue(handle.value)) {
      return
    }
    handle.setValue([formatDateValue(value.from), formatDateValue(value.to)])
  }, [handle, initializeWhenEmpty, value.from, value.to])

  return (
    <DateRangePicker
      label={label ?? handle.label ?? "Date range"}
      value={value}
      today={today}
      align={align}
      onChange={(next) => {
        handle.setValue([
          formatDateValue(next.from),
          formatDateValue(next.to),
        ])
      }}
    />
  )
}

function hasDateRangeValue(value: SemaphorInputHandle["value"]) {
  return Array.isArray(value) &&
    Boolean(parseDateValue(value[0]) && parseDateValue(value[1]))
}

export function getSemaphorDateRangeFilterLabel(
  handle: SemaphorInputHandle,
  today = startOfDay(new Date()),
  fallbackDays = 30,
) {
  return getDateRangeLabel(toDateRange(handle.value, today, fallbackDays), today)
}

function toDateRange(
  value: SemaphorInputHandle["value"],
  today: Date,
  fallbackDays: number,
): DateRange {
  const values = Array.isArray(value) ? value : []
  const from = parseDateValue(values[0])
  const to = parseDateValue(values[1])

  if (from && to) {
    return { from, to }
  }

  if (from) {
    return { from, to: from }
  }

  return {
    from: subDays(today, Math.max(1, fallbackDays) - 1),
    to: today,
  }
}

function parseDateValue(value: SemaphorScalar | undefined): Date | null {
  if (typeof value === "string" || typeof value === "number") {
    const date = typeof value === "number" ? new Date(value) : parseISO(value)
    return isValid(date) ? startOfDay(date) : null
  }

  return null
}

function formatDateValue(date: Date) {
  return format(date, "yyyy-MM-dd")
}
