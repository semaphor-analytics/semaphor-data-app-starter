import { Link, Outlet, useRouterState } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SAMPLE_NAV } from "./nav"

export function SamplesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-screen-2xl">
        <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-6 border-r bg-card/40 px-5 py-6 md:flex">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to starter
            </Link>
            <div className="mt-3 flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Semaphor
              </span>
              <span className="text-sm font-semibold">Reference dashboard</span>
            </div>
          </div>

          <nav className="flex flex-col gap-0.5">
            {SAMPLE_NAV.map((item) => {
              const href = item.path ? `/samples/${item.path}` : "/samples"
              const isActive =
                pathname === href ||
                (item.path === "" && pathname === "/samples")
              const disabled = item.status === "coming-soon"

              const className = cn(
                "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                disabled && "pointer-events-none opacity-50",
              )

              if (disabled) {
                return (
                  <div key={item.label} className={className}>
                    <span>{item.label}</span>
                    <span className="text-[10px] uppercase tracking-wider">
                      Soon
                    </span>
                  </div>
                )
              }

              return (
                <Link key={item.label} to={href} className={className}>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            <Badge variant="outline" className="w-fit">
              Demo data
            </Badge>
            <p>
              Uses static JSON fixtures. Do not copy this data-loading pattern
              into production — use <code>useSemaphorQuery</code> instead.
            </p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
