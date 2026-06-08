import { CalendarIcon, ChevronDownIcon } from "lucide-react"
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
import type { AppliedFilter } from "../components/FilterChipStrip"
import type { KpiFormat } from "../components/KpiCard"

const data = overviewData

const allFilters: AppliedFilter[] = [
  { label: "Date", value: "Last 30 days" },
  { label: "Region", value: "2 selected" },
  { label: "Segment", value: "Enterprise" },
  { label: "Pipeline status", value: "2 selected" },
]

const revenueScope = allFilters.filter((f) => f.label !== "Pipeline status")
const pipelineScope = allFilters.filter(
  (f) => f.label === "Date" || f.label === "Pipeline status",
)

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
            value: "Last 30 days",
            icon: <CalendarIcon className="size-3.5" />,
          },
          { label: "Region", value: "2 selected" },
          { label: "Segment", value: "Enterprise" },
          { label: "Pipeline status", value: "2 selected" },
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
