// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import {
  SemaphorMetricKpiCard,
  type SemaphorMetricQueryResultLike,
} from "./SemaphorMetricKpis"

afterEach(() => {
  cleanup()
})

describe("SemaphorMetricKpiCard", () => {
  it("uses result.value as the primary metric when no measureKey is provided", () => {
    render(
      <SemaphorMetricKpiCard
        result={successfulMetricResult({
          value: 1842,
          measures: {
            revenue: 2438600,
            orders: 1842,
          },
        })}
        label="Orders"
        format="number"
      />
    )

    expect(screen.getByText("Orders")).toBeTruthy()
    expect(screen.getByText("1,842")).toBeTruthy()
    expect(screen.queryByText("2,438,600")).toBeNull()
  })

  it("does not fall back to the first metric when an explicit measureKey is missing", () => {
    render(
      <SemaphorMetricKpiCard
        result={successfulMetricResult({
          measures: {
            revenue: 2438600,
          },
        })}
        label="Orders"
        measureKey="orders"
        format="number"
      />
    )

    expect(screen.getByText("Orders")).toBeTruthy()
    expect(screen.getByText("—")).toBeTruthy()
    expect(screen.queryByText("2,438,600")).toBeNull()
  })

  it("does not reuse the primary comparison badge for explicit secondary measures", () => {
    render(
      <SemaphorMetricKpiCard
        result={successfulMetricResult({
          value: 2438600,
          measures: {
            revenue: 2438600,
            orders: 1842,
          },
          deltaPercent: 12.4,
        })}
        label="Orders"
        measureKey="orders"
        format="number"
        comparisonLabel="vs previous period"
      />
    )

    expect(screen.getByText("Orders")).toBeTruthy()
    expect(screen.getByText("1,842")).toBeTruthy()
    expect(screen.queryByText("vs previous period")).toBeNull()
  })
})

function successfulMetricResult(
  overrides: Partial<SemaphorMetricQueryResultLike>
): SemaphorMetricQueryResultLike {
  return {
    status: "success",
    isLoading: false,
    isEmpty: false,
    isPartial: false,
    isStale: false,
    error: null,
    value: null,
    ...overrides,
  }
}
