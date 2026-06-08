import { useMemo, useState } from "react"
import { startOfDay, subDays } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import overviewData from "../data/overview.json"
import { PageHeader } from "../components/PageHeader"
import { FilterBar } from "../components/FilterBar"
import { KpiStrip } from "../components/KpiStrip"
import { ChartCard } from "../components/ChartCard"
import { TrendChart } from "../components/TrendChart"
import { RankedBarChart } from "../components/RankedBarChart"
import { ExhibitSection } from "../components/ExhibitSection"
import {
  DateRangePicker,
  getDateRangeLabel,
  type DateRange,
} from "../components/DateRangePicker"
import { MultiSelectFilter } from "../components/MultiSelectFilter"
import { SingleSelectFilter } from "../components/SingleSelectFilter"
import { SearchFilter } from "../components/SearchFilter"
import { FilterChipStrip } from "../components/FilterChipStrip"
import type { AppliedFilter } from "../components/FilterChipStrip"
import type { KpiFormat } from "../components/KpiCard"

const data = overviewData

const TODAY = startOfDay(new Date("2026-06-07"))
const INITIAL_RANGE: DateRange = {
  from: subDays(TODAY, 29),
  to: TODAY,
}

const REGION_OPTIONS = [
  { label: "North America", value: "north_america" },
  { label: "EMEA", value: "emea" },
  { label: "APAC", value: "apac" },
  { label: "LATAM", value: "latam" },
  { label: "Middle East", value: "middle_east" },
  { label: "Africa", value: "africa" },
]

const SEGMENT_OPTIONS = [
  { label: "Enterprise", value: "enterprise" },
  { label: "Mid-market", value: "mid_market" },
  { label: "SMB", value: "smb" },
]

const PIPELINE_STATUS_OPTIONS = [
  { label: "Discovery", value: "discovery" },
  { label: "Proposal", value: "proposal" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Verbal commit", value: "verbal_commit" },
  { label: "Closed won", value: "closed_won" },
]

function summarizeMulti(
  selected: string[],
  options: { label: string; value: string }[],
): string {
  if (selected.length === 0) return "All"
  if (selected.length === 1) {
    return options.find((o) => o.value === selected[0])?.label ?? "—"
  }
  return `${selected.length} selected`
}

const kpisForFilters = data.kpis.slice(0, 3).map((kpi) => ({
  key: kpi.key,
  label: kpi.label,
  value: kpi.value,
  format: kpi.format as KpiFormat,
  delta: kpi.delta,
  deltaUnit: kpi.deltaUnit as "%" | "pp",
  deltaDirectionGood: kpi.deltaDirectionGood as "up" | "down",
  previousLabel: kpi.previousLabel,
}))

const pipelineByStage = [
  { label: "Discovery", value: 1840000, share: 38.2 },
  { label: "Proposal", value: 1120000, share: 23.3 },
  { label: "Negotiation", value: 860000, share: 17.9 },
  { label: "Verbal commit", value: 540000, share: 11.2 },
  { label: "Closed won", value: 458000, share: 9.4 },
]

export function FiltersPage() {
  const [topBarRange, setTopBarRange] = useState<DateRange>(INITIAL_RANGE)
  const [regions, setRegions] = useState<string[]>(["north_america", "emea"])
  const [segment, setSegment] = useState<string | null>("enterprise")
  const [pipelineStatuses, setPipelineStatuses] = useState<string[]>([
    "proposal",
    "negotiation",
  ])

  const topBarDateLabel = useMemo(
    () => getDateRangeLabel(topBarRange, TODAY),
    [topBarRange],
  )
  const regionLabel = summarizeMulti(regions, REGION_OPTIONS)
  const segmentLabel =
    SEGMENT_OPTIONS.find((s) => s.value === segment)?.label ?? "All"
  const pipelineStatusLabel = summarizeMulti(
    pipelineStatuses,
    PIPELINE_STATUS_OPTIONS,
  )

  const allFilters: AppliedFilter[] = [
    { label: "Date", value: topBarDateLabel },
    { label: "Region", value: regionLabel },
    { label: "Segment", value: segmentLabel },
    { label: "Pipeline status", value: pipelineStatusLabel },
  ]
  const revenueScope = allFilters.filter((f) => f.label !== "Pipeline status")
  const pipelineScope = allFilters.filter(
    (f) => f.label === "Date" || f.label === "Pipeline status",
  )

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Filter patterns"
        title="Filter scope and visibility"
        subtitle="How to compose dashboard-wide, section-scoped, and card-local filters so users can always see which filters affect which views."
      />

      <FilterBar
        items={[
          {
            label: "Date range",
            value: topBarDateLabel,
            control: (
              <DateRangePicker
                value={topBarRange}
                onChange={setTopBarRange}
                today={TODAY}
              />
            ),
          },
          {
            label: "Region",
            value: regionLabel,
            control: (
              <MultiSelectFilter
                label="Region"
                options={REGION_OPTIONS}
                value={regions}
                onChange={setRegions}
              />
            ),
          },
          {
            label: "Segment",
            value: segmentLabel,
            control: (
              <SingleSelectFilter
                label="Segment"
                options={SEGMENT_OPTIONS}
                value={segment}
                onChange={setSegment}
                hideSearch
              />
            ),
          },
          {
            label: "Pipeline status",
            value: pipelineStatusLabel,
            control: (
              <MultiSelectFilter
                label="Pipeline status"
                options={PIPELINE_STATUS_OPTIONS}
                value={pipelineStatuses}
                onChange={setPipelineStatuses}
              />
            ),
          },
        ]}
      />

      <div className="flex flex-col gap-10 px-8 py-6">
        <ExhibitSection
          label="Pattern 1"
          title="Dashboard-wide filters"
          description="The top filter bar broadcasts to every subscribed card. Each affected card displays the same chip strip so the contract is visible at a glance."
        >
          <KpiStrip items={kpisForFilters} />
          <div className="px-1 pt-1">
            <ChipStripPreview filters={allFilters} note="All KPI cards subscribe to every filter." />
          </div>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 2"
          title="Per-card scope"
          description="A card shows only the filters that actually narrow its query. A filter that doesn't apply is intentionally absent — never grayed out, never displayed as 'inactive'."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Revenue trend"
              description="Subscribes to Date, Region, and Segment."
              appliedFilters={revenueScope}
            >
              <TrendChart data={data.trend} height={220} />
            </ChartCard>
            <ChartCard
              title="Pipeline by stage"
              description="Subscribes to Date and Pipeline status only."
              appliedFilters={pipelineScope}
            >
              <RankedBarChart data={pipelineByStage} />
            </ChartCard>
          </div>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 3"
          title="Card-scoped control"
          description="A control that lives on the card itself, not in the top bar. Dashboard filters still apply; the local control only narrows this view."
        >
          <ChartCard
            title="Revenue trend"
            description="Compare against the previous period or year."
            appliedFilters={revenueScope}
            action={
              <Tabs defaultValue="period">
                <TabsList>
                  <TabsTrigger value="period">vs Prev period</TabsTrigger>
                  <TabsTrigger value="year">vs Last year</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          >
            <TrendChart data={data.trend} height={220} />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 4"
          title="Filter component library"
          description="Pre-built shadcn-based filter controls. All four share the same trigger styling so they slot into the FilterBar identically: date range, multi-select, single-select, and a free-text search."
        >
          <FilterComponentGallery />
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 5"
          title="Cascading dependent filter"
          description="Choosing Country narrows the State option list to only states in that country. The parent stays in the top filter bar; the dependent control reflects its choice."
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Geographic filter</CardTitle>
              <CardDescription className="text-xs">
                State options reload when Country changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <CascadePill label="Country" value="United States" />
                <span className="text-muted-foreground">→</span>
                <CascadePill
                  label="State"
                  value="California"
                  hint="50 options · narrowed from United States"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                In production, bind the parent input with{" "}
                <code>useSemaphorInputs</code> and pass its handle to
                <code> semaphor.inputOptions(...)</code> so the dependent option
                list re-fetches on the server.
              </p>
            </CardContent>
          </Card>
        </ExhibitSection>
      </div>
    </div>
  )
}

function ChipStripPreview({
  filters,
  note,
}: {
  filters: AppliedFilter[]
  note: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
      <span className="font-medium uppercase tracking-wider">Filtered by</span>
      {filters.map((f) => (
        <span
          key={f.label}
          className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-1.5 py-0.5"
        >
          <span>{f.label}</span>
          <span>·</span>
          <span className="font-medium text-foreground">{f.value}</span>
        </span>
      ))}
      <span className="text-foreground/60">{note}</span>
    </div>
  )
}

const GALLERY_REGIONS = [
  { label: "North America", value: "north_america" },
  { label: "EMEA", value: "emea" },
  { label: "APAC", value: "apac" },
  { label: "LATAM", value: "latam" },
  { label: "Middle East", value: "middle_east" },
  { label: "Africa", value: "africa" },
]

const GALLERY_SEGMENTS = [
  { label: "Enterprise", value: "enterprise" },
  { label: "Mid-market", value: "mid_market" },
  { label: "SMB", value: "smb" },
]

function FilterComponentGallery() {
  const [range, setRange] = useState<DateRange>(INITIAL_RANGE)
  const [regions, setRegions] = useState<string[]>(["north_america", "emea"])
  const [segment, setSegment] = useState<string | null>("enterprise")
  const [search, setSearch] = useState("")

  const dateLabel = useMemo(() => getDateRangeLabel(range, TODAY), [range])
  const regionLabel =
    regions.length === 0
      ? "All"
      : regions.length === 1
        ? (GALLERY_REGIONS.find((r) => r.value === regions[0])?.label ?? "—")
        : `${regions.length} selected`
  const segmentLabel =
    GALLERY_SEGMENTS.find((s) => s.value === segment)?.label ?? "All"

  const selectedFilters: AppliedFilter[] = [
    { label: "Date", value: dateLabel },
    { label: "Region", value: regionLabel },
    { label: "Segment", value: segmentLabel },
    ...(search ? [{ label: "Search", value: `"${search}"` }] : []),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filter components</CardTitle>
        <CardDescription className="text-xs">
          All four use shadcn Popover + Command (where applicable) and emit a
          controlled value. Selection updates live; the chip strip below shows
          what would be passed to a card's <code>appliedFilters</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <DateRangePicker
              value={range}
              onChange={setRange}
              today={TODAY}
            />
            <MultiSelectFilter
              label="Region"
              options={GALLERY_REGIONS}
              value={regions}
              onChange={setRegions}
            />
            <SingleSelectFilter
              label="Segment"
              options={GALLERY_SEGMENTS}
              value={segment}
              onChange={setSegment}
              hideSearch
            />
            <SearchFilter
              value={search}
              onChange={setSearch}
              placeholder="Search customer..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Resulting chip strip
            </span>
            <FilterChipStrip filters={selectedFilters} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CascadePill({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        className="inline-flex h-8 items-center gap-2 rounded-md border bg-card px-2.5 text-xs transition-colors hover:bg-secondary"
      >
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
        <ChevronDownIcon className="size-3.5 text-muted-foreground" />
      </button>
      {hint ? (
        <span className="pl-1 text-[10px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  )
}
