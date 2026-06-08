export type MatrixRow = {
  region: string
  subRegions: { name: string; values: Record<string, number | null> }[]
}

export const matrixColumns = ["Q1", "Q2", "Q3", "Q4"]

export const matrixRows: MatrixRow[] = [
  {
    region: "North America",
    subRegions: [
      {
        name: "United States",
        values: { Q1: 480000, Q2: 520000, Q3: 540000, Q4: 612000 },
      },
      {
        name: "Canada",
        values: { Q1: 120000, Q2: 132000, Q3: 138000, Q4: 152000 },
      },
      { name: "Mexico", values: { Q1: 42000, Q2: 48000, Q3: 52000, Q4: 60000 } },
    ],
  },
  {
    region: "EMEA",
    subRegions: [
      {
        name: "Germany",
        values: { Q1: 180000, Q2: 195000, Q3: 208000, Q4: 232000 },
      },
      {
        name: "United Kingdom",
        values: { Q1: 140000, Q2: 155000, Q3: 172000, Q4: 190000 },
      },
      { name: "France", values: { Q1: 80000, Q2: 88000, Q3: 96000, Q4: 100000 } },
      { name: "Spain", values: { Q1: 20000, Q2: 20000, Q3: null, Q4: 20000 } },
    ],
  },
  {
    region: "APAC",
    subRegions: [
      { name: "Japan", values: { Q1: 92000, Q2: 104000, Q3: 116000, Q4: 130000 } },
      {
        name: "Australia",
        values: { Q1: 64000, Q2: 70000, Q3: 76000, Q4: 84000 },
      },
      {
        name: "Singapore",
        values: { Q1: 28000, Q2: 32000, Q3: 36000, Q4: 42000 },
      },
    ],
  },
  {
    region: "LATAM",
    subRegions: [
      { name: "Brazil", values: { Q1: 48000, Q2: 52000, Q3: 56000, Q4: 62000 } },
      {
        name: "Argentina",
        values: { Q1: 16000, Q2: 18000, Q3: null, Q4: 22000 },
      },
    ],
  },
]
