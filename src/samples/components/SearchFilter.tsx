import { SearchIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type SearchFilterProps = {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  className?: string
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchFilterProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-md border bg-card px-2.5 text-xs focus-within:ring-1 focus-within:ring-ring",
        className,
      )}
    >
      <SearchIcon className="size-3.5 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-40 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}
