import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type FilterBarItem = {
  label: string
  value: string
  icon?: React.ReactNode
  /**
   * When provided, renders this React node in place of the default pill.
   * Use for interactive controls (date range pickers, multi-select popovers)
   * that need their own trigger element.
   */
  control?: React.ReactNode
}

type FilterBarProps = {
  items: FilterBarItem[]
  showClear?: boolean
}

export function FilterBar({ items, showClear = true }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-8 py-3">
      {items.map((item, index) =>
        item.control ? (
          <span key={item.label + index}>{item.control}</span>
        ) : (
          <FilterPill key={item.label + index} {...item} />
        ),
      )}
      {showClear ? (
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
          >
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function FilterPill({ label, value, icon }: FilterBarItem) {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center gap-2 rounded-md border bg-card px-2.5 text-xs transition-colors hover:bg-secondary"
    >
      {icon}
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
      <ChevronDownIcon className="size-3.5 text-muted-foreground" />
    </button>
  )
}

export function dateFilterIcon() {
  return <CalendarIcon className="size-3.5" />
}
