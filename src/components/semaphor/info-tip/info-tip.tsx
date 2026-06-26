import * as React from "react"
import { InfoIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type InfoTipProps = {
  /** Short, plain explanation. Keep it to one sentence. */
  label: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  /** Accessible name for the trigger. Defaults to "More information". */
  ariaLabel?: string
  /** Layout-only classes for the trigger. */
  className?: string
  /** Custom trigger content. Defaults to a small info icon. */
  children?: React.ReactNode
}

/**
 * Standard inline help affordance for metric definitions, truncated labels, and
 * disabled-control explanations. Requires a `TooltipProvider` ancestor (the
 * starter mounts one at the app root).
 *
 * Do not hide essential information behind it, and do not put interactive
 * content inside the tooltip.
 */
export function InfoTip({
  label,
  side = "top",
  align = "center",
  ariaLabel = "More information",
  className,
  children,
}: InfoTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        {children ?? <InfoIcon className="size-3.5" aria-hidden />}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className="max-w-xs text-xs leading-snug"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
