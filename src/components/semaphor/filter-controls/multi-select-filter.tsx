import { useState } from "react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type FilterOption = {
  label: string
  value: string
}

export type MultiSelectFilterProps = {
  label: string
  options: FilterOption[]
  value: string[]
  onChange: (next: string[]) => void
  /** Label shown when no options are selected. Defaults to "All". */
  emptyLabel?: string
  /** Search placeholder. */
  searchPlaceholder?: string
  /** How selected values are summarized in the trigger. Defaults to labels. */
  selectedDisplay?: "labels" | "count"
  /** Maximum selected labels to show before falling back to a count. */
  maxSelectedLabels?: number
  align?: "start" | "end" | "center"
}

export function MultiSelectFilter({
  label,
  options,
  value,
  onChange,
  emptyLabel = "All",
  searchPlaceholder,
  selectedDisplay = "labels",
  maxSelectedLabels = 2,
  align = "start",
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const triggerValue = formatTriggerValue(value, options, {
    emptyLabel,
    selectedDisplay,
    maxSelectedLabels,
  })

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="inline-flex h-8 items-center overflow-hidden rounded-md border bg-card text-sm">
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex h-full items-center gap-2 rounded-l-md pr-2 pl-3 text-left transition-colors hover:bg-secondary",
                value.length === 0 && "rounded-r-md",
              )}
            />
          }
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="truncate font-medium text-foreground">
              {triggerValue}
            </span>
          </span>
          <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        {value.length > 0 ? (
          <>
            <span className="w-px self-stretch bg-border" aria-hidden />
            <button
              type="button"
              aria-label={`Clear ${label}`}
              className="inline-flex h-full items-center px-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => onChange([])}
            >
              <XIcon className="size-3.5" />
            </button>
          </>
        ) : null}
      </div>

      <PopoverContent
        align={align}
        className="w-72 gap-0 p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder ?? `Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const selected = value.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggle(option.value)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "flex size-3.5 shrink-0 items-center justify-center rounded-sm border",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background",
                      )}
                    >
                      {selected ? <CheckIcon className="size-2.5" /> : null}
                    </div>
                    <span className="flex-1 truncate">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex items-center justify-between gap-2 border-t px-1.5 py-1 text-[11px] text-muted-foreground">
          <span className="truncate px-1 tabular-nums">
            {value.length === 0
              ? `${options.length} options`
              : `${value.length} of ${options.length} selected`}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              tabIndex={value.length === 0 ? -1 : undefined}
              className={cn(
                "h-6 px-2 text-xs",
                value.length === 0 && "invisible",
              )}
              onClick={() => onChange([])}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function formatTriggerValue(
  selected: string[],
  options: FilterOption[],
  config: {
    emptyLabel: string
    selectedDisplay: "labels" | "count"
    maxSelectedLabels: number
  },
): string {
  if (selected.length === 0) return config.emptyLabel
  if (
    config.selectedDisplay === "count" ||
    selected.length > config.maxSelectedLabels
  ) {
    return `${selected.length} selected`
  }
  const labelByValue = new Map(
    options.map((option) => [option.value, option.label]),
  )
  return selected.map((item) => labelByValue.get(item) ?? item).join(", ")
}
