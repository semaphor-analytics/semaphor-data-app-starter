import { Link } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ChartColumnIcon,
  DatabaseIcon,
  FileCode2Icon,
  LayoutDashboardIcon,
  SparklesIcon,
} from "lucide-react"
import { SemaphorDataAppProvider } from "react-semaphor/data-app-sdk"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const runtimeToken = import.meta.env.VITE_SEMAPHOR_PROJECT_TOKEN

const componentPreviewData = [
  { area: "queries", readiness: 68 },
  { area: "filters", readiness: 82 },
  { area: "tables", readiness: 74 },
  { area: "charts", readiness: 58 },
]

const componentPreviewConfig = {
  readiness: {
    label: "Component coverage",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const nextSteps = [
  {
    title: "Inspect Semaphor data",
    description:
      "Ask your agent to discover governed domains, datasets, fields, and metrics.",
    prompt: "What Semaphor data can I use in this project?",
    icon: DatabaseIcon,
  },
  {
    title: "Plan the dashboard",
    description:
      "Decide which views are server-backed, derived, presentation-only, or unsupported.",
    prompt:
      "Plan a dashboard first. Show the sources, filters, query kind, and visual for each view.",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Build with SDK hooks",
    description:
      "Generate React components using react-semaphor/data-app-sdk and this app shell.",
    prompt:
      "Build the planned app in this repo using Semaphor runtime queries.",
    icon: FileCode2Icon,
  },
]

function ComponentKitPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive components included</CardTitle>
        <CardDescription>
          These are UI building blocks for the agent to reuse after it grounds
          the app in real Semaphor metadata.
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger render={<Badge variant="outline" />}>
              Ready
            </TooltipTrigger>
            <TooltipContent>
              Components are installed as source in this repo.
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="controls">
          <TabsList>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="visuals">Visuals</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <div className="rounded-2xl border p-4">
            <TabsContent value="controls" className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="starter-search">Search or filter</Label>
                  <Input
                    id="starter-search"
                    placeholder="Agent can bind this to Semaphor inputs"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="starter-view-type">View type</Label>
                  <Select
                    items={[
                      { label: "KPI", value: "kpi" },
                      { label: "Trend", value: "trend" },
                      { label: "Table", value: "table" },
                    ]}
                    defaultValue="trend"
                  >
                    <SelectTrigger id="starter-view-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="kpi">KPI</SelectItem>
                        <SelectItem value="trend">Trend</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Progress value={35}>
                <ProgressLabel>Authoring progress</ProgressLabel>
                <ProgressValue />
              </Progress>
            </TabsContent>

            <TabsContent value="visuals" className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ChartColumnIcon />
                Static component preview. Replace with governed Semaphor query
                results.
              </div>
              <ChartContainer
                config={componentPreviewConfig}
                className="h-56 w-full"
              >
                <BarChart accessibilityLayer data={componentPreviewData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="area"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="readiness"
                    fill="var(--color-readiness)"
                    radius={6}
                  />
                </BarChart>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="notes" className="flex flex-col gap-2">
              <Label htmlFor="starter-notes">Agent handoff notes</Label>
              <Textarea
                id="starter-notes"
                placeholder="Use this space for dashboard scope, filters, and Semaphor publish notes."
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <div className="flex items-center gap-2">
              <DatabaseIcon />
              <Badge variant="secondary">Semaphor Data App Starter</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
                Ready for your Semaphor data
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                This starter is intentionally blank. Use the Semaphor Agent
                Plugin to inspect your project data, plan the app, and generate
                governed React views here.
              </p>
            </div>
          </div>
          <Badge variant={runtimeToken ? "default" : "outline"}>
            {runtimeToken ? "Token configured" : "Token missing"}
          </Badge>
        </header>

        <Alert>
          {runtimeToken ? <CheckCircle2Icon /> : <SparklesIcon />}
          <AlertTitle>
            {runtimeToken ? "Project token detected" : "Add your project token"}
          </AlertTitle>
          <AlertDescription>
            {runtimeToken
              ? "Open Codex or Claude Code in this repo and ask it to inspect Semaphor data before generating views."
              : "Copy .env.example to .env.local, add VITE_SEMAPHOR_PROJECT_TOKEN, then restart the dev server."}
          </AlertDescription>
        </Alert>

        <Link to="/samples" className="no-underline">
          <Card className="transition-colors hover:bg-card/80">
            <CardHeader>
              <CardDescription>Reference</CardDescription>
              <CardTitle className="flex items-center gap-2">
                Explore the dashboard reference
                <ArrowRightIcon className="size-4" />
              </CardTitle>
              <CardAction>
                <LayoutDashboardIcon />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A polished sample dashboard your agent should match: filter
                visibility on cards, sortable tables with totals, KPI delta
                patterns, chart vocabulary, and explicit loading/error/empty
                states. Open <code className="rounded bg-muted px-1 py-0.5 text-xs">/samples</code> to browse the
                exhibits.
              </p>
            </CardContent>
          </Card>
        </Link>

        <section className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((step, index) => {
            const Icon = step.icon

            return (
              <Card key={step.title}>
                <CardHeader>
                  <CardDescription>Step {index + 1}</CardDescription>
                  <CardTitle>{step.title}</CardTitle>
                  <CardAction>
                    <Icon />
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="rounded-2xl bg-muted p-3 font-mono text-xs leading-relaxed">
                    {step.prompt}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <ComponentKitPreview />

        <Card>
          <CardHeader>
            <CardTitle>Placeholder app surface</CardTitle>
            <CardDescription>
              Replace this card with the dashboard, workflow, report, or
              customer-facing analytics view your agent builds from real
              Semaphor metadata.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed bg-muted/30 p-8 text-center">
              <div className="flex max-w-lg flex-col items-center gap-4">
                <LayoutDashboardIcon />
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-medium">
                    Your generated app goes here
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Start with discovery and planning. Then let the agent add
                    real Semaphor queries, filters, loading states, tables,
                    charts, and publish-ready source.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <footer className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            Built with Vite, shadcn/ui, TanStack Table, and react-semaphor.
          </span>
          <span>
            Use real Semaphor metadata before adding data-bearing code.
          </span>
        </footer>
      </main>
    </div>
  )
}

export function App() {
  return (
    <SemaphorDataAppProvider token={runtimeToken}>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </SemaphorDataAppProvider>
  )
}

export default App
