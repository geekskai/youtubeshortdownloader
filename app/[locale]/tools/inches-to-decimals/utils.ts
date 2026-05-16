export interface ParsedFraction {
  whole: number
  numerator: number
  denominator: number
  decimalInches: number
  decimalLabel: string
  millimeters: number
  millimetersLabel: string
  isNonStandardDenominator: boolean
}

export type ConversionResponse =
  | { ok: true; value: ParsedFraction }
  | {
      ok: false
      error:
        | "empty"
        | "invalid"
        | "invalid_fraction"
        | "division_by_zero"
        | "negative_not_supported"
        | "too_large"
    }

const STANDARD_DENOMINATORS = new Set([2, 4, 8, 16, 32, 64])
const MAX_INPUT_INCHES = 1000000
const INCH_TO_MM = 25.4

const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
}

const DENOM_WORDS: Record<string, number> = {
  half: 2,
  halves: 2,
  quarter: 4,
  quarters: 4,
  fourth: 4,
  fourths: 4,
  eighth: 8,
  eighths: 8,
  sixteenth: 16,
  sixteenths: 16,
  thirtysecond: 32,
  thirtyseconds: 32,
  sixtyfourth: 64,
  sixtyfourths: 64,
}

function trimZeros(value: string) {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
}

function parseNumberWord(token: string) {
  return NUMBER_WORDS[token] ?? null
}

function parseNaturalLanguage(input: string) {
  const normalized = input.toLowerCase().replace(/-/g, " ").trim()
  const tokens = normalized.split(/\s+/)
  if (tokens.length < 2) return null

  const denominator = DENOM_WORDS[tokens[tokens.length - 1]]
  const numerator = parseNumberWord(tokens[tokens.length - 2] ?? "")
  if (!denominator || numerator == null) return null

  const wholeToken = tokens.slice(0, -2).join(" ")
  const whole = wholeToken ? parseNumberWord(wholeToken) : 0
  if (wholeToken && whole == null) return null
  return { whole: whole ?? 0, numerator, denominator }
}

function parseNumericInput(input: string) {
  const normalized = input.toLowerCase().replace(/"/g, "").trim()
  if (!normalized) return { ok: false as const, error: "empty" as const }
  if (normalized.includes("-")) {
    const asMixed = normalized.replace(/-/g, " ")
    return parseNumericInput(asMixed)
  }
  if (normalized.startsWith("-")) return { ok: false as const, error: "negative_not_supported" as const }

  const natural = parseNaturalLanguage(normalized)
  if (natural) return { ok: true as const, value: natural }

  if (/^\d+(\.\d+)?$/.test(normalized)) {
    const decimal = Number.parseFloat(normalized)
    if (!Number.isFinite(decimal) || decimal < 0) return { ok: false as const, error: "invalid" as const }
    return {
      ok: true as const,
      value: {
        whole: 0,
        numerator: decimal,
        denominator: 1,
      },
    }
  }

  const mixedMatch = normalized.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixedMatch) {
    return {
      ok: true as const,
      value: {
        whole: Number.parseInt(mixedMatch[1], 10),
        numerator: Number.parseInt(mixedMatch[2], 10),
        denominator: Number.parseInt(mixedMatch[3], 10),
      },
    }
  }

  const fractionMatch = normalized.match(/^(\d+)\/(\d+)$/)
  if (fractionMatch) {
    return {
      ok: true as const,
      value: {
        whole: 0,
        numerator: Number.parseInt(fractionMatch[1], 10),
        denominator: Number.parseInt(fractionMatch[2], 10),
      },
    }
  }

  return { ok: false as const, error: "invalid_fraction" as const }
}

export function convertInchesToDecimal(rawInput: string, precision: number): ConversionResponse {
  const parsed = parseNumericInput(rawInput)
  if (!parsed.ok) return { ok: false, error: parsed.error }

  const { whole, numerator, denominator } = parsed.value
  if (denominator === 0) return { ok: false, error: "division_by_zero" }
  if (whole < 0 || numerator < 0 || denominator < 0) return { ok: false, error: "negative_not_supported" }

  const decimalInches = whole + numerator / denominator
  if (!Number.isFinite(decimalInches)) return { ok: false, error: "invalid" }
  if (decimalInches > MAX_INPUT_INCHES) return { ok: false, error: "too_large" }

  const safePrecision = Math.min(6, Math.max(0, precision))
  const millimeters = decimalInches * INCH_TO_MM

  return {
    ok: true,
    value: {
      whole,
      numerator,
      denominator,
      decimalInches,
      decimalLabel: trimZeros(decimalInches.toFixed(safePrecision)),
      millimeters,
      millimetersLabel: trimZeros(millimeters.toFixed(Math.min(6, safePrecision + 2))),
      isNonStandardDenominator: denominator > 1 && !STANDARD_DENOMINATORS.has(denominator),
    },
  }
}

export function buildQuickFractions() {
  const denominators = [2, 4, 8, 16, 32, 64]
  return denominators.flatMap((denominator) =>
    Array.from({ length: denominator - 1 }, (_, index) => {
      const numerator = index + 1
      return `${numerator}/${denominator}`
    })
  )
}
