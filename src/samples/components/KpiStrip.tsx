import { KpiCard, type KpiCardProps } from "./KpiCard"

type KpiStripProps = {
  items: (KpiCardProps & { key: string })[]
}

export function KpiStrip({ items }: KpiStripProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, ...kpi }) => (
        <KpiCard key={key} {...kpi} />
      ))}
    </div>
  )
}
