import { PageHeader } from "../components/PageHeader"
import { ExhibitSection } from "../components/ExhibitSection"
import { ChartCard } from "../components/ChartCard"
import { Matrix } from "../components/Matrix"
import { matrixColumns, matrixRows } from "../data/matrix"

export function MatrixPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Matrix patterns"
        title="Pivot tables and matrices"
        subtitle="Use a matrix when a single number lives at the intersection of two categorical axes. Show subtotals at the parent rows, a grand total at the bottom, and a clear treatment for sparse cells."
      />

      <div className="flex flex-col gap-10 px-8 py-6">
        <ExhibitSection
          label="Pattern 1"
          title="Hierarchical pivot with subtotals"
          description="Rows: region with sub-region children. Columns: quarter. Region rows show subtotals; the footer shows column totals and a grand total. Sparse cells use an em-dash treatment, not zero."
        >
          <ChartCard
            title="Revenue by region and quarter"
            description="Region → sub-region rows; quarterly columns; subtotals, grand total, sparse cells."
            bodyPadded={false}
          >
            <Matrix rows={matrixRows} columns={matrixColumns} bare />
          </ChartCard>
        </ExhibitSection>
      </div>
    </div>
  )
}
