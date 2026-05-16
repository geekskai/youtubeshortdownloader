export type GaugeStandard =
  | "sheet_steel"
  | "galvanized_steel"
  | "stainless_steel"
  | "aluminum_non_ferrous"
  | "wire_awg"

export interface GaugeConversionResult {
  gauge: number
  standard: GaugeStandard
  inches: number
  millimeters: number
  inchesLabel: string
  millimetersLabel: string
  toleranceInches: number
  toleranceMm: number
  toleranceLabel: string
  toleranceRangeInchesLabel: string
  toleranceRangeMmLabel: string
  visualReference: string
  gaugeMatches: Array<{ standard: GaugeStandard; inches: number; millimeters: number }>
}

export interface GaugeLookupRow {
  gauge: number
  standard: GaugeStandard
  inches: number
  millimeters: number
}

export type GaugeConversionResponse =
  | { ok: true; value: GaugeConversionResult }
  | { ok: false; error: "empty" | "invalid_gauge" | "unsupported_gauge" | "not_available" }

const INCH_TO_MM = 25.4

const GAUGE_TABLE: Array<{
  gauge: number
  sheet_steel?: number
  galvanized_steel?: number
  stainless_steel?: number
  aluminum_non_ferrous?: number
  wire_awg?: number
}> = [
  { gauge: 3, sheet_steel: 0.2391, galvanized_steel: 0.2428, stainless_steel: 0.25, aluminum_non_ferrous: 0.2294, wire_awg: 0.2294 },
  { gauge: 4, sheet_steel: 0.2242, galvanized_steel: 0.2279, stainless_steel: 0.2344, aluminum_non_ferrous: 0.2043, wire_awg: 0.2043 },
  { gauge: 5, sheet_steel: 0.2092, galvanized_steel: 0.2129, stainless_steel: 0.2188, aluminum_non_ferrous: 0.1819, wire_awg: 0.1819 },
  { gauge: 6, sheet_steel: 0.1943, galvanized_steel: 0.198, stainless_steel: 0.2031, aluminum_non_ferrous: 0.162, wire_awg: 0.162 },
  { gauge: 7, sheet_steel: 0.1793, galvanized_steel: 0.183, stainless_steel: 0.1875, aluminum_non_ferrous: 0.1443, wire_awg: 0.1443 },
  { gauge: 8, sheet_steel: 0.1644, galvanized_steel: 0.1681, stainless_steel: 0.1719, aluminum_non_ferrous: 0.1285, wire_awg: 0.1285 },
  { gauge: 9, sheet_steel: 0.1495, galvanized_steel: 0.1532, stainless_steel: 0.1562, aluminum_non_ferrous: 0.1144, wire_awg: 0.1144 },
  { gauge: 10, sheet_steel: 0.1345, galvanized_steel: 0.1382, stainless_steel: 0.1406, aluminum_non_ferrous: 0.1019, wire_awg: 0.1019 },
  { gauge: 11, sheet_steel: 0.1196, galvanized_steel: 0.1233, stainless_steel: 0.125, aluminum_non_ferrous: 0.0907, wire_awg: 0.0907 },
  { gauge: 12, sheet_steel: 0.1046, galvanized_steel: 0.1084, stainless_steel: 0.1094, aluminum_non_ferrous: 0.0808, wire_awg: 0.0808 },
  { gauge: 13, sheet_steel: 0.0897, galvanized_steel: 0.0934, stainless_steel: 0.0938, aluminum_non_ferrous: 0.072, wire_awg: 0.072 },
  { gauge: 14, sheet_steel: 0.0747, galvanized_steel: 0.0785, stainless_steel: 0.0781, aluminum_non_ferrous: 0.0641, wire_awg: 0.0641 },
  { gauge: 15, sheet_steel: 0.0673, galvanized_steel: 0.071, stainless_steel: 0.0703, aluminum_non_ferrous: 0.0571, wire_awg: 0.0571 },
  { gauge: 16, sheet_steel: 0.0598, galvanized_steel: 0.0635, stainless_steel: 0.0625, aluminum_non_ferrous: 0.0508, wire_awg: 0.0508 },
  { gauge: 17, sheet_steel: 0.0538, galvanized_steel: 0.0575, stainless_steel: 0.0563, aluminum_non_ferrous: 0.0453, wire_awg: 0.0453 },
  { gauge: 18, sheet_steel: 0.0478, galvanized_steel: 0.0516, stainless_steel: 0.05, aluminum_non_ferrous: 0.0403, wire_awg: 0.0403 },
  { gauge: 19, sheet_steel: 0.0418, galvanized_steel: 0.0455, stainless_steel: 0.0438, aluminum_non_ferrous: 0.0359, wire_awg: 0.0359 },
  { gauge: 20, sheet_steel: 0.0359, galvanized_steel: 0.0396, stainless_steel: 0.0375, aluminum_non_ferrous: 0.032, wire_awg: 0.032 },
  { gauge: 21, sheet_steel: 0.0329, galvanized_steel: 0.0366, stainless_steel: 0.0344, aluminum_non_ferrous: 0.0285, wire_awg: 0.0285 },
  { gauge: 22, sheet_steel: 0.0299, galvanized_steel: 0.0336, stainless_steel: 0.0313, aluminum_non_ferrous: 0.0253, wire_awg: 0.0253 },
  { gauge: 23, sheet_steel: 0.0269, galvanized_steel: 0.0306, stainless_steel: 0.0281, aluminum_non_ferrous: 0.0226, wire_awg: 0.0226 },
  { gauge: 24, sheet_steel: 0.0239, galvanized_steel: 0.0276, stainless_steel: 0.025, aluminum_non_ferrous: 0.0201, wire_awg: 0.0201 },
  { gauge: 25, sheet_steel: 0.0209, galvanized_steel: 0.0246, stainless_steel: 0.0219, aluminum_non_ferrous: 0.0179, wire_awg: 0.0179 },
  { gauge: 26, sheet_steel: 0.0179, galvanized_steel: 0.0217, stainless_steel: 0.0188, aluminum_non_ferrous: 0.0159, wire_awg: 0.0159 },
  { gauge: 27, sheet_steel: 0.0164, galvanized_steel: 0.0201, stainless_steel: 0.0172, aluminum_non_ferrous: 0.0142, wire_awg: 0.0142 },
  { gauge: 28, sheet_steel: 0.0149, galvanized_steel: 0.0187, stainless_steel: 0.0156, aluminum_non_ferrous: 0.0126, wire_awg: 0.0126 },
  { gauge: 29, sheet_steel: 0.0135, galvanized_steel: 0.0172, stainless_steel: 0.0141, aluminum_non_ferrous: 0.0113, wire_awg: 0.0113 },
  { gauge: 30, sheet_steel: 0.012, galvanized_steel: 0.0157, stainless_steel: 0.0125, aluminum_non_ferrous: 0.01, wire_awg: 0.01 },
]

const SUPPORTED_GAUGES = new Set(GAUGE_TABLE.map((item) => item.gauge))

const VISUAL_REFERENCES = [
  { mm: 0.1, key: "visual_reference.hair" },
  { mm: 0.2, key: "visual_reference.paper" },
  { mm: 0.35, key: "visual_reference.business_card" },
  { mm: 0.76, key: "visual_reference.credit_card" },
  { mm: 1.0, key: "visual_reference.id_card_stack" },
  { mm: 1.5, key: "visual_reference.thin_coin" },
  { mm: 2.0, key: "visual_reference.two_coins" },
] as const

const STANDARDS: GaugeStandard[] = [
  "sheet_steel",
  "galvanized_steel",
  "stainless_steel",
  "aluminum_non_ferrous",
  "wire_awg",
]

function findGaugeRow(gauge: number) {
  return GAUGE_TABLE.find((item) => item.gauge === gauge)
}

function toMillimeters(inches: number) {
  return inches * INCH_TO_MM
}

function getToleranceByThickness(inches: number) {
  if (inches >= 0.1) return 0.004
  if (inches >= 0.06) return 0.003
  if (inches >= 0.03) return 0.002
  return 0.0015
}

function getVisualReferenceKey(mm: number) {
  let closest: (typeof VISUAL_REFERENCES)[number] = VISUAL_REFERENCES[0]
  let minDiff = Math.abs(mm - closest.mm)
  for (const item of VISUAL_REFERENCES) {
    const diff = Math.abs(mm - item.mm)
    if (diff < minDiff) {
      minDiff = diff
      closest = item
    }
  }
  return closest.key
}

export function parseGaugeInput(rawInput: string) {
  const normalized = rawInput.trim().toLowerCase()
  if (!normalized) return null

  const match = normalized.match(/(\d{1,2})/)
  if (!match) return null

  const parsed = Number.parseInt(match[1], 10)
  if (!Number.isInteger(parsed)) return null
  return parsed
}

export function getSupportedGaugeList() {
  return [...SUPPORTED_GAUGES].sort((a, b) => a - b)
}

export function getGaugeConversion(rawInput: string, standard: GaugeStandard): GaugeConversionResponse {
  if (!rawInput.trim()) {
    return { ok: false, error: "empty" }
  }

  const gauge = parseGaugeInput(rawInput)
  if (gauge === null || gauge < 0 || gauge > 40) {
    return { ok: false, error: "invalid_gauge" }
  }

  const row = findGaugeRow(gauge)
  if (!row) {
    return { ok: false, error: "unsupported_gauge" }
  }

  const inches = row[standard]
  if (typeof inches !== "number") {
    return { ok: false, error: "not_available" }
  }

  const millimeters = toMillimeters(inches)
  const toleranceInches = getToleranceByThickness(inches)
  const toleranceMm = toMillimeters(toleranceInches)
  const visualReference = getVisualReferenceKey(millimeters)

  const gaugeMatches = STANDARDS.flatMap((item) => {
    const standardValue = row[item]
    if (typeof standardValue !== "number") return []
    return [{ standard: item, inches: standardValue, millimeters: toMillimeters(standardValue) }]
  })

  return {
    ok: true,
    value: {
      gauge,
      standard,
      inches,
      millimeters,
      inchesLabel: `${inches.toFixed(4)}"`,
      millimetersLabel: `${millimeters.toFixed(3)} mm`,
      toleranceInches,
      toleranceMm,
      toleranceLabel: `±${toleranceInches.toFixed(4)}" / ±${toleranceMm.toFixed(3)} mm`,
      toleranceRangeInchesLabel: `${(inches - toleranceInches).toFixed(4)}" - ${(inches + toleranceInches).toFixed(4)}"`,
      toleranceRangeMmLabel: `${(millimeters - toleranceMm).toFixed(3)} mm - ${(millimeters + toleranceMm).toFixed(3)} mm`,
      visualReference,
      gaugeMatches,
    },
  }
}

export function getGaugeLookupRows(
  standard: GaugeStandard,
  query: string
): { rows: GaugeLookupRow[]; queryGauge: number | null } {
  const queryGauge = parseGaugeInput(query)
  const baseRows = GAUGE_TABLE.flatMap((item) => {
    const inches = item[standard]
    if (typeof inches !== "number") return []
    return [
      {
        gauge: item.gauge,
        standard,
        inches,
        millimeters: toMillimeters(inches),
      },
    ]
  }).sort((a, b) => a.gauge - b.gauge)

  if (queryGauge === null) {
    return { rows: baseRows, queryGauge: null }
  }

  const filtered = baseRows.filter((row) => row.gauge === queryGauge)
  return {
    rows: filtered.length > 0 ? filtered : baseRows,
    queryGauge,
  }
}
