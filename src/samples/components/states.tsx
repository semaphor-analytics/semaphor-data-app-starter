import { AlertCircleIcon, InboxIcon, RefreshCwIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KpiCardSkeleton() {
  return (
    <Card className="gap-3">
      <CardHeader className="pb-0">
        <Skeleton className="h-3 w-20" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div
      className="flex flex-col justify-end gap-2 px-1"
      style={{ height }}
    >
      <div className="flex items-end gap-2">
        {[0.55, 0.4, 0.7, 0.6, 0.85, 0.5, 0.75, 0.65, 0.9, 0.45, 0.6, 0.8].map(
          (factor, i) => (
            <Skeleton
              key={i}
              className="w-full rounded-sm"
              style={{ height: `${factor * height * 0.7}px` }}
            />
          ),
        )}
      </div>
      <div className="flex justify-between pt-2">
        <Skeleton className="h-2 w-10" />
        <Skeleton className="h-2 w-10" />
        <Skeleton className="h-2 w-10" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="grid grid-cols-5 gap-3 border-b bg-card px-3 py-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-2/3" />
        ))}
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-5 gap-3 bg-background px-3 py-3"
          >
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className="h-3"
                style={{ width: `${60 + ((rowIdx + colIdx) % 4) * 8}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function BlockingError({
  title = "Couldn't load this dashboard",
  message,
  onRetry,
}: {
  title?: string
  message: string
  onRetry?: () => void
}) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-start justify-between gap-3">
        <span>{message}</span>
        {onRetry ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="gap-1"
          >
            <RefreshCwIcon className="size-3.5" />
            Retry
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}

export function InCardError({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <div className="flex items-start gap-2 text-destructive">
        <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">This view couldn't load.</span>
          <span className="text-destructive/80">{message}</span>
        </div>
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-1">
          <RefreshCwIcon className="size-3.5" />
          Retry
        </Button>
      ) : null}
    </div>
  )
}

export function EmptyWithFilters({
  filtersDescription,
}: {
  filtersDescription: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed bg-muted/20 p-8 text-center">
      <InboxIcon className="size-6 text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          No data matches the current filters
        </span>
        <span className="max-w-sm text-xs text-muted-foreground">
          {filtersDescription}
        </span>
      </div>
    </div>
  )
}
