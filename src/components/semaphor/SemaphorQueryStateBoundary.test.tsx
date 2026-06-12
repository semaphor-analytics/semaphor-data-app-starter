// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import { SemaphorQueryStateBoundary } from "./SemaphorQueryStateBoundary"

afterEach(() => {
  cleanup()
})

describe("SemaphorQueryStateBoundary", () => {
  it("derives empty state from empty records payloads", () => {
    render(
      <SemaphorQueryStateBoundary state={{ status: "success", records: [] }}>
        <div>Rendered rows</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("No data")).toBeTruthy()
    expect(screen.queryByText("Rendered rows")).toBeNull()
  })

  it("derives empty state from empty input option payloads", () => {
    render(
      <SemaphorQueryStateBoundary state={{ status: "success", options: [] }}>
        <div>Rendered options</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("No data")).toBeTruthy()
    expect(screen.queryByText("Rendered options")).toBeNull()
  })

  it("does not treat SQL output-only payloads as empty", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{ status: "success", records: [], output: "Completed" }}
      >
        <div>Rendered output</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("Rendered output")).toBeTruthy()
    expect(screen.queryByText("No data")).toBeNull()
  })

  it("derives non-empty state from analysis result-set rows", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{ status: "success", periodChanges: [{ revenue: 42 }] }}
      >
        <div>Rendered analysis</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("Rendered analysis")).toBeTruthy()
    expect(screen.queryByText("No data")).toBeNull()
  })

  it("derives non-empty state from matrix grid row cells", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{
          status: "success",
          grid: {
            rows: [
              {
                cells: [{ value: 42 }],
              },
            ],
          },
        }}
      >
        <div>Rendered matrix</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("Rendered matrix")).toBeTruthy()
    expect(screen.queryByText("No data")).toBeNull()
  })

  it("derives non-empty state from canonical metric maps", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{
          status: "success",
          value: null,
          measures: { revenue: null, orders: 0 },
        }}
      >
        <div>Rendered measures</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("Rendered measures")).toBeTruthy()
    expect(screen.queryByText("No data")).toBeNull()
  })

  it("derives non-empty state from compatibility metric maps", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{
          status: "success",
          value: null,
          metrics: { revenue: 2400 },
        }}
      >
        <div>Rendered metrics</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("Rendered metrics")).toBeTruthy()
    expect(screen.queryByText("No data")).toBeNull()
  })

  it("derives empty state from metric maps without usable values", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{
          status: "success",
          value: null,
          measures: { revenue: null, orders: "" },
          records: [],
        }}
      >
        <div>Rendered empty measures</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("No data")).toBeTruthy()
    expect(screen.queryByText("Rendered empty measures")).toBeNull()
  })

  it("keeps previous SDK payload visible while loading", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{ status: "loading", isLoading: true, records: [{ id: 1 }] }}
      >
        <div>Rendered stale rows</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("Rendered stale rows")).toBeTruthy()
    expect(screen.getByText("Refreshing")).toBeTruthy()
    expect(screen.queryByText("No data")).toBeNull()
  })

  it("derives partial state from executionResult status", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{
          status: "success",
          records: [{ id: 1 }],
          executionResult: { status: "partial" },
        }}
      >
        <div>Rendered partial rows</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("Rendered partial rows")).toBeTruthy()
    expect(screen.getByText("Partial result")).toBeTruthy()
  })

  it("keeps explicit isEmpty authoritative when present", () => {
    render(
      <SemaphorQueryStateBoundary
        state={{ status: "success", records: [{ id: 1 }], isEmpty: true }}
      >
        <div>Rendered rows</div>
      </SemaphorQueryStateBoundary>
    )

    expect(screen.getByText("No data")).toBeTruthy()
    expect(screen.queryByText("Rendered rows")).toBeNull()
  })
})
