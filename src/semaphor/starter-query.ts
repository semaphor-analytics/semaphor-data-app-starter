import { semaphor } from "react-semaphor/data-app-sdk"
import type {
  SemaphorRecordsField,
  SemaphorSourceRef,
} from "react-semaphor/data-app-sdk"

export type InventoryMovementRow = {
  movement_date: string
  region: string
  movement_type: string
  quantity_tons: number
}

export const starterSource = {
  kind: "semantic",
  domainId: "replace-with-domain-id",
  datasetName: "replace_with_dataset_name",
  label: "Replace With Semaphor Dataset",
} satisfies SemaphorSourceRef

export const movementDate = {
  name: "movement_date",
  label: "Movement Date",
  role: "date",
  dataType: "date",
  source: starterSource,
} satisfies SemaphorRecordsField

export const region = {
  name: "region",
  label: "Region",
  role: "dimension",
  dataType: "string",
  source: starterSource,
} satisfies SemaphorRecordsField

export const movementType = {
  name: "movement_type",
  label: "Movement Type",
  role: "dimension",
  dataType: "string",
  source: starterSource,
} satisfies SemaphorRecordsField

export const quantityTons = {
  name: "quantity_tons",
  label: "Quantity (Tons)",
  role: "measure",
  dataType: "number",
  aggregate: "SUM",
  source: starterSource,
} satisfies SemaphorRecordsField

export const regionFilter = semaphor.filter({
  id: "region",
  label: "Region",
  field: region,
  operator: "in",
})

export const starterRowsQuery = semaphor.records({
  id: "starter-inventory-movements",
  label: "Starter inventory movements",
  source: starterSource,
  fields: [movementDate, region, movementType, quantityTons],
  dateField: movementDate,
  timeWindow: { unit: "month", value: 6, anchor: "latest_available" },
  inputs: [regionFilter],
  orderBy: { field: movementDate, direction: "desc" },
  pagination: { page: 1, pageSize: 25 },
})
