export type RoundingMode = "nearest" | "up" | "down"

export interface MillimetersToDecimalResult {
  normalizedInput: string
  inputMillimeters: number
  exactInches: number
  displayInches: number
  displayInchesLabel: string
  displayInchesWithUnit: string
  fractionLabel: string
  fractionInches: number
  offsetInches: number
  offsetLabel: string
  showLargeDimensionHint: boolean
  scaleMaxMillimeters: number
  scaleMaxInches: number
  needlePercent: number
}

export type ConversionResponse =
  | { ok: true; value: MillimetersToDecimalResult }
  | {
      ok: false
      error:
        | "empty"
        | "invalid"
        | "negative_not_supported"
        | "too_many_decimals"
        | "too_large"
    }

const MM_PER_INCH = 25.4
const MAX_INPUT_DECIMALS = 8
const MAX_INPUT_MM = 1000000
const FRACTION_DENOMINATORS = [2, 4, 8, 16, 32, 64]

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function trimTrailingZeros(value: string) {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
}

function normalizeInput(rawInput: string) {
  return rawInput
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/millimeters|millimeter|mm|inches|inch|in|"|'/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function getDecimalPlaces(input: string) {
  const [, decimals = ""] = input.split(".")
  return decimals.length
}

function parseMillimeterInput(rawInput: string): { ok: true; value: number; normalized: string } | { ok: false; error: Extract<ConversionResponse, { ok: false }>["error"] } {
  const normalized = normalizeInput(rawInput)
  if (!normalized) return { ok: false, error: "empty" }

  if (!/^-?\d*\.?\d+$/.test(normalized)) {
    return { ok: false, error: "invalid" }
  }

  if (getDecimalPlaces(normalized) > MAX_INPUT_DECIMALS) {
    return { ok: false, error: "too_many_decimals" }
  }

  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value)) return { ok: false, error: "invalid" }
  if (value < 0) return { ok: false, error: "negative_not_supported" }
  if (value > MAX_INPUT_MM) return { ok: false, error: "too_large" }

  return { ok: true, value, normalized }
}

function applyRounding(value: number, digits: number, mode: RoundingMode) {
  const factor = 10 ** digits
  if (mode === "up") return Math.ceil(value * factor) / factor
  if (mode === "down") return Math.floor(value * factor) / factor
  return Math.round(value * factor) / factor
}

function getNearestFraction(inches: number) {
  let best = { numerator: 0, denominator: 1, value: 0, diff: Number.POSITIVE_INFINITY }

  for (const denominator of FRACTION_DENOMINATORS) {
    const numerator = Math.round(inches * denominator)
    const value = numerator / denominator
    const diff = Math.abs(value - inches)
    if (diff < best.diff) {
      const divisor = gcd(numerator, denominator)
      best = {
        numerator: numerator / divisor,
        denominator: denominator / divisor,
        value,
        diff,
      }
    }
  }

  return best
}

function formatFractionLabel(numerator: number, denominator: number) {
  if (numerator === 0) return '0"'
  const whole = Math.floor(numerator / denominator)
  const remainder = numerator % denominator
  if (remainder === 0) return `${whole}"`
  if (whole === 0) return `${remainder}/${denominator}"`
  return `${whole} ${remainder}/${denominator}"`
}

function formatOffset(offsetInches: number) {
  const sign = offsetInches >= 0 ? "+" : "-"
  return `${sign} ${Math.abs(offsetInches).toFixed(4)}`
}

export function convertMillimetersToDecimal(
  rawInput: string,
  decimalPlaces: number,
  roundingMode: RoundingMode
): ConversionResponse {
  const parsed = parseMillimeterInput(rawInput)
  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }

  const safePlaces = Math.min(8, Math.max(0, decimalPlaces))
  const exactInches = parsed.value / MM_PER_INCH
  const displayInches = applyRounding(exactInches, safePlaces, roundingMode)
  const fraction = getNearestFraction(exactInches)
  const offsetInches = exactInches - fraction.value
  const scaleMaxMillimeters = Math.max(25, Math.ceil(parsed.value / 25) * 25)
  const needlePercent = Math.max(0, Math.min(100, (parsed.value / scaleMaxMillimeters) * 100))

  return {
    ok: true,
    value: {
      normalizedInput: trimTrailingZeros(parsed.normalized),
      inputMillimeters: parsed.value,
      exactInches,
      displayInches,
      displayInchesLabel: displayInches.toFixed(safePlaces),
      displayInchesWithUnit: `${displayInches.toFixed(safePlaces)} in`,
      fractionLabel: formatFractionLabel(fraction.numerator, fraction.denominator),
      fractionInches: fraction.value,
      offsetInches,
      offsetLabel: formatOffset(offsetInches),
      showLargeDimensionHint: parsed.value > 5000,
      scaleMaxMillimeters,
      scaleMaxInches: scaleMaxMillimeters / MM_PER_INCH,
      needlePercent,
    },
  }
}
