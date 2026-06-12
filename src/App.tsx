import {
  CheckCircle2Icon,
  DatabaseIcon,
  ExternalLinkIcon,
  FileCode2Icon,
  LayoutDashboardIcon,
  SparklesIcon,
} from "lucide-react"
import { SemaphorDataAppProvider } from "react-semaphor/data-app-sdk"

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
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

const runtimeToken = import.meta.env.VITE_SEMAPHOR_PROJECT_TOKEN
const componentGalleryUrl =
  "https://semaphor-analytics.github.io/semaphor-data-app-components/"

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
      "Choose the closest component gallery sample, then map views to governed queries and filters.",
    prompt:
      "Plan a dashboard first. Use the component gallery as the visual baseline.",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Build with SDK hooks",
    description:
      "Generate React components using react-semaphor/data-app-sdk and installed registry components.",
    prompt:
      "Build the planned app in this repo using Semaphor runtime queries.",
    icon: FileCode2Icon,
  },
]

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
                This starter provides app wiring, Semaphor provider setup, and
                DevTools placement. Reusable visual patterns live in the
                Semaphor Data App component registry.
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

        <Card className="transition-colors hover:bg-card/80">
          <CardHeader>
            <CardDescription>Reference</CardDescription>
            <CardTitle className="flex items-center gap-2">
              Start from the component gallery
              <ExternalLinkIcon className="size-4" />
            </CardTitle>
            <CardAction>
              <LayoutDashboardIcon />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Use the public gallery for polished samples, installable Semaphor
              components, filter behavior, table patterns, matrix views, query
              states, and first-run dashboard composition.
            </p>
            <a
              href={componentGalleryUrl}
              className="text-sm font-medium underline underline-offset-4"
            >
              Open the Semaphor Data App component gallery
            </a>
          </CardContent>
        </Card>

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
