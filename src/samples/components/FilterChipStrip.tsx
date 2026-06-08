import { cn } from "@/lib/utils"

export type AppliedFilter = {
  label: string
  value: string
}

type FilterChipStripProps = {
  filters: AppliedFilter[]
  className?: string
}

export function FilterChipStrip({ filters, className }: FilterChipStripProps) {
  if (filters.length === 0) return null

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground",
        className,
      )}
    >
      {filters.map((filter) => (
        <span
          key={filter.label}
          className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-1.5 py-0.5"
        >
          <span>{filter.label}</span>
          <span className="text-foreground/80">·</span>
          <span className="font-medium text-foreground">{filter.value}</span>
        </span>
      ))}
    </div>
  )
}
