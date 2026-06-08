import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SAMPLE_NAV } from "./nav"

export function SamplesIndex() {
  const exhibits = SAMPLE_NAV.filter((item) => item.path !== "")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-8 py-10">
      <header className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Reference
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          Semaphor dashboard reference
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A working exhibit of dashboard affordances Semaphor agents should
          incorporate when generating Data Apps: clear hierarchy, filter
          visibility, sortable tables with totals, comparison context, and
          honest loading/error/empty states. Pick an exhibit on the left or
          below.
        </p>
        <div className="flex gap-2">
          <Badge variant="outline">Static JSON</Badge>
          <Badge variant="outline">Visual reference only</Badge>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {exhibits.map((item) => {
          const isReady = item.status === "ready"
          const href = `/samples/${item.path}`

          const inner = (
            <Card
              className={cn(
                "h-full transition-colors",
                isReady ? "hover:bg-card/80" : "opacity-60",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{item.label}</CardTitle>
                  {isReady ? (
                    <ArrowRightIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <Badge variant="outline" className="text-[10px] uppercase">
                      Soon
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  {item.blurb}
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          )

          if (!isReady) {
            return <div key={item.label}>{inner}</div>
          }

          return (
            <Link key={item.label} to={href} className="no-underline">
              {inner}
            </Link>
          )
        })}
      </section>
    </div>
  )
}
