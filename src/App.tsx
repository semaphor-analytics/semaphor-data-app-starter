import { AlertCircleIcon, CheckCircle2Icon, DatabaseIcon } from "lucide-react"
import { SemaphorDataAppProvider } from "react-semaphor/data-app-sdk"
import {
  useSemaphorInputs,
  useSemaphorQuery,
} from "react-semaphor/data-app-sdk"

import { DataAppTable } from "@/components/data-app-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { regionFilter, starterRowsQuery } from "@/semaphor/starter-query"
import type { InventoryMovementRow } from "@/semaphor/starter-query"

const runtimeToken = import.meta.env.VITE_SEMAPHOR_PROJECT_TOKEN
const enableStarterQuery =
  import.meta.env.VITE_SEMAPHOR_ENABLE_STARTER_QUERY === "true"

const previewRows: InventoryMovementRow[] = [
  {
    movement_date: "2026-05-24",
    region: "North",
    movement_type: "Inbound",
    quantity_tons: 1240.4,
  },
  {
    movement_date: "2026-05-23",
    region: "West",
    movement_type: "Transfer",
    quantity_tons: 880.2,
  },
  {
    movement_date: "2026-05-22",
    region: "South",
    movement_type: "Outbound",
    quantity_tons: 760.8,
  },
  {
    movement_date: "2026-05-21",
    region: "East",
    movement_type: "Inbound",
    quantity_tons: 1115.6,
  },
]

function LiveRowsPanel() {
  const [regionHandle] = useSemaphorInputs([regionFilter])
  const result = useSemaphorQuery<InventoryMovementRow>(starterRowsQuery, {
    inputs: [regionHandle],
  })

  if (result.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (result.error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Semaphor query failed</AlertTitle>
        <AlertDescription>{result.error.message}</AlertDescription>
      </Alert>
    )
  }

  return <DataAppTable rows={result.records ?? []} />
}

function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <DatabaseIcon />
              <Badge variant="secondary">Semaphor Data App</Badge>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">
                Operations dashboard
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Starter layout for governed Semaphor analytics in a React app.
              </p>
            </div>
          </div>
          <Badge variant={runtimeToken ? "default" : "outline"}>
            {runtimeToken ? "Token configured" : "Token missing"}
          </Badge>
        </header>

        {!runtimeToken ? (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>Project token required</AlertTitle>
            <AlertDescription>
              Add VITE_SEMAPHOR_PROJECT_TOKEN to .env.local, then ask your
              coding agent to inspect Semaphor data and replace the starter
              query refs.
            </AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Volume</CardDescription>
              <CardTitle>3,997.0 tons</CardTitle>
              <CardAction>
                <Badge variant="secondary">
                  <CheckCircle2Icon data-icon="inline-start" />
                  Preview
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Replace with a Semaphor metric query grounded in your project.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Largest region</CardDescription>
              <CardTitle>North</CardTitle>
              <CardAction>
                <Badge variant="secondary">KPI</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Cards should own their query unless a shared-query optimization is
              intentional.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Runtime mode</CardDescription>
              <CardTitle>
                {enableStarterQuery ? "Live query" : "Layout preview"}
              </CardTitle>
              <CardAction>
                <Button variant="outline" size="sm">
                  Validate
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Enable live starter queries only after replacing placeholder
              source and field refs.
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Inventory movements</CardTitle>
            <CardDescription>
              Sortable table with a displayed total row.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enableStarterQuery && runtimeToken ? (
              <LiveRowsPanel />
            ) : (
              <DataAppTable rows={previewRows} />
            )}
          </CardContent>
        </Card>

        <Separator />

        <footer className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            Use the Semaphor Agent Plugin to ground this starter in your data.
          </span>
          <span>
            Built with Vite, shadcn/ui, TanStack Table, and react-semaphor.
          </span>
        </footer>
      </main>
    </div>
  )
}

export function App() {
  return (
    <SemaphorDataAppProvider token={runtimeToken}>
      <AppShell />
    </SemaphorDataAppProvider>
  )
}

export default App
