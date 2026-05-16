export type FractionPrecision = 4 | 8 | 16 | 32 | 64
export type RoundingMode = "nearest" | "up" | "down"

export interface FractionValue {
  whole: number
  numerator: number
  denominator: number
  value: number
  label: string
}

export interface DecimalToInchesResult {
  normalizedInput: string
  inputInches: number
  exactFraction: FractionValue
  nearestFraction: FractionValue
  nearestOffset: number
  nearestOffsetLabel: string
  feetInchLabel: string
  rulerStart: number
  rulerEnd: number
  rulerMarkerPercent: number
}

export type ConversionResponse =
  | { ok: true; value: DecimalToInchesResult }
  | {
      ok: false
      error: "empty" | "invalid" | "negative_not_supported" | "too_many_decimals" | "too_large"
    }

const MAX_INPUT_INCHES = 1000000
const MAX_INPUT_DECIMALS = 8

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

export function normalizeDecimalInput(rawInput: string) {
  return rawInput.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1").trim()
}

function getDecimalPlaces(value: string) {
  const [, decimals = ""] = value.split(".")
  return decimals.length
}

function formatFractionLabel(whole: number, numerator: number, denominator: number) {
  if (numerator === 0) return `${whole}"`
  if (whole === 0) return `${numerator}/${denominator}"`
  return `${whole} ${numerator}/${denominator}"`
}

function buildFraction(value: number, numerator: number, denominator: number): FractionValue {
  const whole = Math.floor(numerator / denominator)
  const remainder = numerator % denominator
  if (remainder === 0) {
    return {
      whole,
      numerator: 0,
      denominator,
      value,
      label: `${whole}"`,
    }
  }
  return {
    whole,
    numerator: remainder,
    denominator,
    value,
    label: formatFractionLabel(whole, remainder, denominator),
  }
}

function parseInput(rawInput: string): { ok: true; normalized: string; value: number } | { ok: false; error: Extract<ConversionResponse, { ok: false }>["error"] } {
  const normalized = normalizeDecimalInput(rawInput)
  if (!normalized) return { ok: false, error: "empty" }
  if (!/^\d*\.?\d+$/.test(normalized)) return { ok: false, error: "invalid" }
  if (getDecimalPlaces(normalized) > MAX_INPUT_DECIMALS) return { ok: false, error: "too_many_decimals" }

  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value)) return { ok: false, error: "invalid" }
  if (value < 0) return { ok: false, error: "negative_not_supported" }
  if (value > MAX_INPUT_INCHES) return { ok: false, error: "too_large" }

  return { ok: true, normalized, value }
}

function toExactFractionFromDecimalString(normalized: string, value: number): FractionValue {
  const decimalPlaces = getDecimalPlaces(normalized)
  if (decimalPlaces === 0) {
    return {
      whole: value,
      numerator: 0,
      denominator: 1,
      value,
      label: `${value}"`,
    }
  }

  const denominator = 10 ** decimalPlaces
  const numerator = Math.round(value * denominator)
  const divisor = gcd(numerator, denominator)
  const simplifiedNumerator = numerator / divisor
  const simplifiedDenominator = denominator / divisor
  return buildFraction(value, simplifiedNumerator, simplifiedDenominator)
}

function toNearestFraction(value: number, precision: FractionPrecision, mode: RoundingMode): FractionValue {
  const scaled = value * precision
  const roundedNumerator =
    mode === "up" ? Math.ceil(scaled) : mode === "down" ? Math.floor(scaled) : Math.round(scaled)
  const divisor = gcd(roundedNumerator, precision)
  const numerator = roundedNumerator / divisor
  const denominator = precision / divisor
  const fractionValue = roundedNumerator / precision
  return buildFraction(fractionValue, numerator, denominator)
}

function formatFeetAndInches(value: number, nearestFraction: FractionValue) {
  const totalInchesWhole = Math.floor(value)
  const feet = Math.floor(totalInchesWhole / 12)
  const inchesWhole = totalInchesWhole % 12

  if (nearestFraction.numerator === 0) {
    return feet > 0 ? `${feet}' ${inchesWhole}"` : `${inchesWhole}"`
  }

  const nearWhole = Math.floor(nearestFraction.value)
  const nearFeet = Math.floor(nearWhole / 12)
  const nearInchesWhole = nearWhole % 12
  return nearFeet > 0
    ? `${nearFeet}' ${nearInchesWhole} ${nearestFraction.numerator}/${nearestFraction.denominator}"`
    : `${nearInchesWhole} ${nearestFraction.numerator}/${nearestFraction.denominator}"`
}

function formatOffset(offset: number) {
  const sign = offset >= 0 ? "+" : "-"
  return `${sign} ${Math.abs(offset).toFixed(4)}"`
}

export function convertDecimalToInches(
  rawInput: string,
  precision: FractionPrecision,
  roundingMode: RoundingMode
): ConversionResponse {
  const parsed = parseInput(rawInput)
  if (!parsed.ok) return { ok: false, error: parsed.error }

  const exactFraction = toExactFractionFromDecimalString(parsed.normalized, parsed.value)
  const nearestFraction = toNearestFraction(parsed.value, precision, roundingMode)
  const nearestOffset = parsed.value - nearestFraction.value

  const rulerStart = Math.floor(parsed.value)
  const rulerEnd = rulerStart + 1
  const rulerMarkerPercent = Math.max(0, Math.min(100, (parsed.value - rulerStart) * 100))

  return {
    ok: true,
    value: {
      normalizedInput: trimTrailingZeros(parsed.normalized),
      inputInches: parsed.value,
      exactFraction,
      nearestFraction,
      nearestOffset,
      nearestOffsetLabel: formatOffset(nearestOffset),
      feetInchLabel: formatFeetAndInches(parsed.value, nearestFraction),
      rulerStart,
      rulerEnd,
      rulerMarkerPercent,
    },
  }
}
