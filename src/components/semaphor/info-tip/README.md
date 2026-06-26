# InfoTip

Standard inline help tooltip for the common "what is this?" case so generated
apps stop hand-rolling one-off tooltips.

Use it for:

- icon-only actions that need an accessible name,
- metric/measure definitions next to a KPI or column header,
- truncated labels whose full text matters,
- explaining why a control is disabled.

Do not use it to hide essential information, and never put interactive content
(links, buttons) inside the tooltip.

```tsx
import { InfoTip } from "@/components/semaphor/info-tip"

<div className="flex items-center gap-1.5">
  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
    Net revenue
  </span>
  <InfoTip label="Gross revenue minus refunds and credits, in the selected period." />
</div>
```

Requires a `TooltipProvider` ancestor; the starter mounts one at the app root.
Restyle globally through `bg-popover`/`--popover-*` tokens, not per-usage
overrides.
