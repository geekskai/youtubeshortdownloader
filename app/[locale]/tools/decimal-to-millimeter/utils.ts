export type ConversionDirection = "in_to_mm" | "mm_to_in"
export type PrecisionMode = "standard" | "precision" | "rounded"

export interface ConversionResult {
  normalizedInput: string
  inputValue: number
  inches: number
  millimeters: number
  outputValue: number
  outputLabel: string
  inputUnitLabel: string
  outputUnitLabel: string
  appliedPrecision: number
  rulerPercent: number
  rulerHintKey: string
}

export type ConversionResponse =
  | { ok: true; value: ConversionResult }
  | {
    ok: false
    error:
    | "empty"
    | "invalid"
    | "invalid_fraction"
    | "division_by_zero"
    | "negative_not_supported"
    | "too_many_decimals"
  }

type ConversionError = Extract<ConversionResponse, { ok: false }>["error"]

const EXACT_CONVERSION_FACTOR = 25.4
const MAX_DECIMALS = 7

function trimTrailingZeros(value: string) {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
}

function extractDecimalPlaces(value: string) {
  const [, decimal = ""] = value.split(".")
  return decimal.length
}

function normalizeInput(rawInput: string) {
  return rawInput
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/inches|inch|mm|in|"|'/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function parseInputValue(rawInput: string):
  | { ok: true; value: number; normalized: string }
  | { ok: false; error: ConversionError } {
  const normalized = normalizeInput(rawInput)
  if (!normalized) return { ok: false, error: "empty" }

  const mixedFractionMatch = normalized.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixedFractionMatch) {
    const whole = Number.parseInt(mixedFractionMatch[1], 10)
    const numerator = Number.parseInt(mixedFractionMatch[2], 10)
    const denominator = Number.parseInt(mixedFractionMatch[3], 10)
    if (denominator === 0) return { ok: false, error: "division_by_zero" }
    if (numerator >= denominator) return { ok: false, error: "invalid_fraction" }
    const value = whole + numerator / denominator
    if (value < 0) return { ok: false, error: "negative_not_supported" }
    return { ok: true, value, normalized }
  }

  const fractionMatch = normalized.match(/^(-?\d+)\s*\/\s*(\d+)$/)
  if (fractionMatch) {
    const numerator = Number.parseInt(fractionMatch[1], 10)
    const denominator = Number.parseInt(fractionMatch[2], 10)
    if (denominator === 0) return { ok: false, error: "division_by_zero" }
    const value = numerator / denominator
    if (value < 0) return { ok: false, error: "negative_not_supported" }
    return { ok: true, value, normalized }
  }

  if (!/^-?\d*\.?\d+$/.test(normalized)) {
    return { ok: false, error: "invalid" }
  }

  if (extractDecimalPlaces(normalized) > MAX_DECIMALS) {
    return { ok: false, error: "too_many_decimals" }
  }

  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value)) return { ok: false, error: "invalid" }
  if (value < 0) return { ok: false, error: "negative_not_supported" }
  return { ok: true, value, normalized }
}

function getPrecisionDigits(mode: PrecisionMode) {
  if (mode === "rounded") return 0
  if (mode === "precision") return 4
  return 2
}

function getRulerHintKey(mmValue: number) {
  if (mmValue < 1) return "ruler_hint_hair"
  if (mmValue < 3) return "ruler_hint_coin"
  if (mmValue < 10) return "ruler_hint_thumb"
  if (mmValue < 30) return "ruler_hint_usb"
  if (mmValue < 80) return "ruler_hint_phone"
  return "ruler_hint_laptop"
}

export function convertValue(
  rawInput: string,
  direction: ConversionDirection,
  precisionMode: PrecisionMode
): ConversionResponse {
  const parsed = parseInputValue(rawInput)
  if (!parsed.ok) {
    return { ok: false, error: parsed.error }
  }

  const digits = getPrecisionDigits(precisionMode)
  const inputValue = parsed.value
  const inches = direction === "in_to_mm" ? inputValue : inputValue / EXACT_CONVERSION_FACTOR
  const millimeters = direction === "in_to_mm" ? inputValue * EXACT_CONVERSION_FACTOR : inputValue
  const outputValue = direction === "in_to_mm" ? millimeters : inches
  const outputLabel = `${outputValue.toFixed(digits)} ${direction === "in_to_mm" ? "mm" : "in"}`
  const rulerPercent = Math.max(4, Math.min(100, (millimeters / 150) * 100))

  return {
    ok: true,
    value: {
      normalizedInput: trimTrailingZeros(parsed.normalized),
      inputValue,
      inches,
      millimeters,
      outputValue,
      outputLabel,
      inputUnitLabel: direction === "in_to_mm" ? "in" : "mm",
      outputUnitLabel: direction === "in_to_mm" ? "mm" : "in",
      appliedPrecision: digits,
      rulerPercent,
      rulerHintKey: getRulerHintKey(millimeters),
    },
  }
}

export function swapDirection(direction: ConversionDirection): ConversionDirection {
  return direction === "in_to_mm" ? "mm_to_in" : "in_to_mm"
}

export function formatSwapInput(result: ConversionResult) {
  return trimTrailingZeros(result.outputValue.toFixed(6))
}
