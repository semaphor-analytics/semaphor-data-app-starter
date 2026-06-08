export type ServerTransaction = {
  id: string
  date: string
  customer: string
  region: string
  segment: string
  product: string
  paymentMethod: string
  units: number
  amount: number
  status: "completed" | "pending" | "failed" | "refunded"
}

const CUSTOMERS = [
  "Northwind Logistics",
  "Acme Manufacturing",
  "Pioneer Retail Group",
  "Helios Energy Partners",
  "Vertex Financial",
  "Atlas Industries",
  "Riverbend Foods",
  "Quanta Communications",
  "Forge & Smith Co.",
  "Beacon Health Systems",
  "Cascade Outdoor",
  "Driftwood Properties",
  "Edgepoint Software",
  "Fairway Capital",
  "Granite Distribution",
]

const REGIONS = [
  "North America",
  "EMEA",
  "APAC",
  "LATAM",
  "Middle East",
  "Africa",
]

const SEGMENTS = ["Enterprise", "Mid-market", "SMB"]

const PRODUCTS = [
  "Core analytics",
  "Streaming events",
  "Warehouse sync",
  "Embedded charts",
  "Workspace seats",
]

const PAYMENT_METHODS = ["ACH", "Wire", "Credit card", "Invoice"]

const STATUSES: ServerTransaction["status"][] = [
  "completed",
  "completed",
  "completed",
  "completed",
  "pending",
  "pending",
  "failed",
  "refunded",
]

function seeded(index: number): number {
  const x = Math.sin(index * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function pick<T>(index: number, salt: number, list: T[]): T {
  const value = Math.floor(seeded(index + salt) * list.length)
  return list[value % list.length]
}

function dateForIndex(index: number): string {
  const base = new Date("2026-06-07T00:00:00Z")
  base.setUTCDate(base.getUTCDate() - Math.floor(index / 6))
  return base.toISOString().slice(0, 10)
}

export const serverTransactions: ServerTransaction[] = Array.from(
  { length: 162 },
  (_, index) => {
    const units = 1 + Math.floor(seeded(index + 11) * 24)
    const unitPrice = 800 + Math.floor(seeded(index + 31) * 4200)
    return {
      id: `TX-${(20000 + index).toString()}`,
      date: dateForIndex(index),
      customer: pick(index, 41, CUSTOMERS),
      region: pick(index, 53, REGIONS),
      segment: pick(index, 67, SEGMENTS),
      product: pick(index, 73, PRODUCTS),
      paymentMethod: pick(index, 89, PAYMENT_METHODS),
      units,
      amount: units * unitPrice,
      status: pick(index, 101, STATUSES),
    }
  },
)
