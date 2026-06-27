/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { SemaphorMetricKpiCard, SemaphorMultiMeasureKpis } from "./metric-kpis"

afterEach(() => {
  cleanup()
})

describe("SemaphorMetricKpiCard", () => {
  it("does not infer comparison display from a primary KPI result", () => {
    render(
      <SemaphorMetricKpiCard
        result={{
          status: "success",
          primaryValue: 3181.9,
          delta: 3181.9,
        }}
        label="Fulfillment Minutes"
      />,
    )

    expect(screen.getByText("Fulfillment Minutes")).toBeTruthy()
    expect(screen.queryByText("vs comparison")).toBeNull()
  })

  it("renders comparison display when comparison evidence is present", () => {
    render(
      <SemaphorMetricKpiCard
        result={{
          status: "success",
          primaryValue: 3181.9,
          comparisonKind: "previous_period",
          comparisonValue: 3000,
          delta: 181.9,
        }}
        label="Fulfillment Minutes"
      />,
    )

    expect(screen.getByText("vs comparison")).toBeTruthy()
  })

  it("does not show primary query comparison for secondary measure cards by default", () => {
    render(
      <SemaphorMetricKpiCard
        result={{
          status: "success",
          measures: {
            secondaryRevenue: 2100,
          },
          comparisonKind: "previous_period",
          comparisonValue: 3000,
          delta: 181.9,
        }}
        label="Secondary Revenue"
        measureKey="secondaryRevenue"
      />,
    )

    expect(screen.getByText("Secondary Revenue")).toBeTruthy()
    expect(screen.queryByText("vs comparison")).toBeNull()
  })

  it("allows explicit comparison display opt-in", () => {
    render(
      <SemaphorMetricKpiCard
        result={{
          status: "success",
          primaryValue: 3181.9,
          delta: 181.9,
        }}
        label="Fulfillment Minutes"
        showComparison
      />,
    )

    expect(screen.getByText("vs comparison")).toBeTruthy()
  })

  it("allows explicit comparison display opt-in for secondary measure cards", () => {
    render(
      <SemaphorMetricKpiCard
        result={{
          status: "success",
          measures: {
            secondaryRevenue: 2100,
          },
          comparisonKind: "previous_period",
          comparisonValue: 3000,
          delta: 181.9,
        }}
        label="Secondary Revenue"
        measureKey="secondaryRevenue"
        showComparison
      />,
    )

    expect(screen.getByText("vs comparison")).toBeTruthy()
  })

  it("accepts generated KPI helper output without reshaping measures", () => {
    const generatedKpiProps = {
      result: {
        status: "success" as const,
        primaryValue: 15420,
        value: 15420,
        measures: {
          grossRevenue: 15420,
          netRevenue: 12800,
        },
      },
      title: "Revenue KPIs",
      label: "Gross Revenue",
      value: 15420,
      measures: [
        { key: "grossRevenue", label: "Gross Revenue" },
        { key: "netRevenue", label: "Net Revenue" },
      ],
      missingMeasures: [],
      showComparison: false,
    } as const

    render(
      <>
        <SemaphorMetricKpiCard
          result={generatedKpiProps.result}
          label={generatedKpiProps.label}
          value={generatedKpiProps.value}
          showComparison={generatedKpiProps.showComparison}
        />
        <SemaphorMultiMeasureKpis
          result={generatedKpiProps.result}
          title={generatedKpiProps.title}
          measures={generatedKpiProps.measures}
        />
      </>,
    )

    expect(screen.getAllByText("Gross Revenue").length).toBeGreaterThan(0)
    expect(screen.getByText("Net Revenue")).toBeTruthy()
  })
})
