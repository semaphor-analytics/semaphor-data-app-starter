const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

const fullCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const decimalNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

const oneDecimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatCurrencyCompact(value: number): string {
  return compactCurrency.format(value)
}

export function formatCurrency(value: number): string {
  return fullCurrency.format(value)
}

export function formatNumber(value: number): string {
  return decimalNumber.format(value)
}

export function formatPercent(value: number): string {
  return `${oneDecimal.format(value)}%`
}

export function formatDelta(value: number, unit: "%" | "pp" = "%"): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : ""
  return `${sign}${oneDecimal.format(value)}${unit}`
}

export function formatDateShort(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const sameYear = start.getFullYear() === end.getFullYear()
  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  })
  return `${startStr} – ${endStr}, ${end.getFullYear()}`
}
