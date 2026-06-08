import overviewData from "../data/overview.json"
import { PageHeader } from "../components/PageHeader"
import { ChartCard } from "../components/ChartCard"
import { ExhibitSection } from "../components/ExhibitSection"
import { KpiCard, type KpiFormat } from "../components/KpiCard"
import { TrendChart } from "../components/TrendChart"
import {
  BlockingError,
  ChartSkeleton,
  EmptyWithFilters,
  InCardError,
  KpiCardSkeleton,
  TableSkeleton,
} from "../components/states"

const kpi = {
  ...overviewData.kpis[0],
  format: overviewData.kpis[0].format as KpiFormat,
  deltaUnit: overviewData.kpis[0].deltaUnit as "%" | "pp",
  deltaDirectionGood: overviewData.kpis[0].deltaDirectionGood as "up" | "down",
}

export function StatesPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="State patterns"
        title="Loading, error, and empty states"
        subtitle="Every data-bearing visual needs explicit loading, error, and empty states. A single query failure should never collapse the rest of the dashboard."
      />

      <div className="flex flex-col gap-10 px-8 py-6">
        <ExhibitSection
          label="Pattern 1"
          title="Loading: in-place skeletons"
          description="Use Skeleton primitives that mirror the eventual layout. Don't replace the whole page with a spinner; per-card skeletons keep the dashboard scaffold visible."
        >
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
              <KpiCardSkeleton />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartCard
                title="Revenue trend"
                description="Loading data for the current filters."
              >
                <ChartSkeleton />
              </ChartCard>
              <ChartCard
                title="Recent transactions"
                description="Fetching latest rows."
              >
                <TableSkeleton rows={6} />
              </ChartCard>
            </div>
          </div>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 2"
          title="Error: blocking failure"
          description="Use a top-of-page Alert when the failure makes the whole dashboard unusable — auth, no project access, completely broken query plan. Provide a retry where it makes sense."
        >
          <BlockingError
            message="The Semaphor project token is invalid. Add a valid VITE_SEMAPHOR_PROJECT_TOKEN to .env.local and restart the dev server."
            onRetry={() => {}}
          />
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 3"
          title="Error: one card fails"
          description="When a single card's query fails, isolate the error inside that card. The rest of the dashboard renders normally and the user can still work."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard {...kpi} />
            <KpiCard {...kpi} label="New customers" value={348} delta={8.2} />
            <KpiCard
              {...kpi}
              label="ARPU"
              value={186}
              format="currency"
              delta={-3.1}
            />
            <KpiCard
              {...kpi}
              label="Churn rate"
              value={2.4}
              format="percent"
              delta={0.6}
              deltaDirectionGood="down"
              deltaUnit="pp"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Revenue trend">
              <TrendChart data={overviewData.trend} height={220} />
            </ChartCard>
            <ChartCard title="Pipeline by stage">
              <InCardError
                message="Couldn't reach the pipeline dataset. Other views aren't affected."
                onRetry={() => {}}
              />
            </ChartCard>
          </div>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 4"
          title="Empty: filtered to nothing"
          description="When the query returns no rows, say so — and reference the filters. A generic 'No data' message leaves users guessing what they applied."
        >
          <ChartCard
            title="Recent transactions"
            description="Filtered to a specific customer and date range."
          >
            <EmptyWithFilters filtersDescription="No transactions for Northwind Logistics between Mar 1 and Mar 7. Try widening the date range or removing the customer filter." />
          </ChartCard>
        </ExhibitSection>

        <ExhibitSection
          label="Pattern 5"
          title="Partial dashboard"
          description="Loaded, loading, and errored states often coexist mid-fetch. The dashboard should render cleanly with all three present at once."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard {...kpi} />
            <KpiCardSkeleton />
            <KpiCard
              {...kpi}
              label="ARPU"
              value={186}
              format="currency"
              delta={-3.1}
            />
            <KpiCard
              {...kpi}
              label="Churn rate"
              value={2.4}
              format="percent"
              delta={0.6}
              deltaDirectionGood="down"
              deltaUnit="pp"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Revenue trend">
              <TrendChart data={overviewData.trend} height={220} />
            </ChartCard>
            <ChartCard title="Pipeline by stage">
              <ChartSkeleton />
            </ChartCard>
          </div>
        </ExhibitSection>
      </div>
    </div>
  )
}
