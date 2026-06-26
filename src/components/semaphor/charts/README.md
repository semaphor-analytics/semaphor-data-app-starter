# Semaphor Charts

Thin Recharts wrappers for generated Data App rows.

- Use `rowsForView.<view>(result)` before passing rows into these components.
- Pass generated field keys, not labels, as `dimensionKey` and `valueKey`.
- Use `aggregateDuplicateLabels` only when the chart should intentionally
  combine duplicate display labels.
- Do not infer chart semantics from raw runtime column names.
