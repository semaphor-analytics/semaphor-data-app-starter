import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function SemaphorIcon({
  className,
  ...props
}: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      className={cn("size-5", className)}
      {...props}
    >
      <rect x="20" y="15" width="60" height="12" rx="6" fill="currentColor" />
      <rect x="20" y="35" width="40" height="12" rx="6" fill="currentColor" />
      <rect x="40" y="55" width="40" height="12" rx="6" fill="currentColor" />
      <rect x="20" y="75" width="60" height="12" rx="6" fill="currentColor" />
    </svg>
  )
}
