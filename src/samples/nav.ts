export type SampleNavItem = {
  label: string
  path: string
  status: "ready" | "coming-soon"
  blurb: string
}

export const SAMPLE_NAV: SampleNavItem[] = [
  {
    label: "Index",
    path: "",
    status: "ready",
    blurb: "Landing page with links to every exhibit.",
  },
  {
    label: "Overview",
    path: "overview",
    status: "ready",
    blurb:
      "The gestalt dashboard. Page header, filter bar, KPI strip, trend, composition, and detail table — all the affordances composed together.",
  },
  {
    label: "KPIs",
    path: "kpis",
    status: "ready",
    blurb:
      "KPI patterns: multi-measure metric, single-measure with delta, KPI with sparkline.",
  },
  {
    label: "Tables",
    path: "tables",
    status: "ready",
    blurb:
      "Bounded sortable table with totals row, then server-backed table with TanStack + Semaphor pagination/sort/filter.",
  },
  {
    label: "Filters",
    path: "filters",
    status: "ready",
    blurb:
      "Filter scope: dashboard-wide bar, section-scoped, cascading, multi-select. Applied-filter chips on every affected card.",
  },
  {
    label: "Charts",
    path: "charts",
    status: "ready",
    blurb:
      "Chart vocabulary: line, bar, stacked bar, area. Each at the right grain.",
  },
  {
    label: "Matrix",
    path: "matrix",
    status: "ready",
    blurb: "Pivot with subtotals, grand total, sparse cells.",
  },
  {
    label: "States",
    path: "states",
    status: "ready",
    blurb:
      "Loading skeleton, blocking error, in-card error, empty with filters, partial dashboard.",
  },
]
