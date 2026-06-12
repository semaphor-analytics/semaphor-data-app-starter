// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import type { SemaphorInputHandle } from "react-semaphor/data-app-sdk"

import { SemaphorDateRangeFilter } from "./SemaphorDateRangeFilter"

afterEach(() => {
  cleanup()
})

describe("SemaphorDateRangeFilter", () => {
  it("does not activate an empty date input on render", () => {
    const handle = createDateHandle()

    render(
      <SemaphorDateRangeFilter handle={handle} today={new Date(2026, 5, 12)} />
    )

    expect(handle.setValue).not.toHaveBeenCalled()
  })

  it("activates an empty date input when an explicit default preset is provided", async () => {
    const handle = createDateHandle()

    render(
      <SemaphorDateRangeFilter
        handle={handle}
        today={new Date(2026, 5, 12)}
        defaultPreset="last_7_days"
      />
    )

    await waitFor(() => {
      expect(handle.setValue).toHaveBeenCalledWith(["2026-06-06", "2026-06-12"])
    })
  })
})

function createDateHandle(): SemaphorInputHandle {
  return {
    id: "date-range",
    kind: "filter",
    label: "Date range",
    value: undefined,
    isActive: false,
    setValue: vi.fn(),
    clear: vi.fn(),
  } as unknown as SemaphorInputHandle
}
