import { CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type PageHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  dateRangeLabel?: string
  actions?: React.ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  dateRangeLabel,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b px-8 py-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1.5">
        {eyebrow ? (
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {dateRangeLabel ? (
          <Badge variant="outline" className="gap-1.5 font-normal">
            <CalendarIcon className="size-3.5" />
            {dateRangeLabel}
          </Badge>
        ) : null}
        {actions}
      </div>
    </header>
  )
}
