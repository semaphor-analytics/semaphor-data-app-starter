import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FilterChipStrip, type AppliedFilter } from "./FilterChipStrip"

type ChartCardProps = {
  title: string
  description?: string
  appliedFilters?: AppliedFilter[]
  action?: React.ReactNode
  children: React.ReactNode
  /**
   * Whether the card body has padding. Set to false when the body is a table
   * or matrix so the content flows to the card edges and the card's own
   * border is the only frame. Defaults to true.
   */
  bodyPadded?: boolean
}

export function ChartCard({
  title,
  description,
  appliedFilters,
  action,
  children,
  bodyPadded = true,
}: ChartCardProps) {
  return (
    <Card className={cn(!bodyPadded && "pb-0")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            ) : null}
          </div>
          {action}
        </div>
        {appliedFilters && appliedFilters.length > 0 ? (
          <FilterChipStrip filters={appliedFilters} className="pt-1" />
        ) : null}
      </CardHeader>
      <CardContent className={cn(!bodyPadded && "px-0")}>
        {children}
      </CardContent>
    </Card>
  )
}
