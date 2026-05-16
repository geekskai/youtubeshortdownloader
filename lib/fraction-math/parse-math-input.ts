import type { ParseMathErrorCode, ParseMathResult, ParsedMathSuccess } from "./types"
import { reduceFraction, toImproperReduced } from "./rational"

export interface ParseMathOptions {
  /** When true, a string like "0.375" or "5" is accepted as a decimal value. Default true. */
  allowPureDecimal?: boolean
}

/**
 * Parse a non-negative math expression: `3/8`, `1 1/2`, `1-1/2`, or optionally a plain decimal.
 * Does not strip units (callers strip "inches", etc. before calling).
 */
export function parseMathFractionInput(
  rawInput: string,
  options: ParseMathOptions = {}
): ParseMathResult {
  const allowPureDecimal = options.allowPureDecimal !== false
  const input = rawInput.trim()

  if (!input) {
    return { ok: false, error: "Please enter a value", code: "empty" }
  }

  if (/^-/.test(input) && !/^\d+[\s-]+\d+\/\d+$/.test(input)) {
    return {
      ok: false,
      error: "Negative numbers are not supported",
      code: "negative_not_supported",
    }
  }

  // Plain decimal (non-negative)
  if (allowPureDecimal) {
    const decimalMatch = input.match(/^(\d*\.?\d+)$/)
    if (decimalMatch) {
      const decimal = parseFloat(decimalMatch[1])
      if (isNaN(decimal) || decimal < 0) {
        return { ok: false, error: "Invalid decimal number", code: "invalid_format" }
      }
      const value: ParsedMathSuccess = { kind: "decimal_only", value: decimal }
      return { ok: true, value }
    }
  }

  // Mixed number: "5 3/4" or "5-3/4"
  const mixedMatch = input.match(/^(\d+)[\s-]+(\d+)\/(\d+)$/)
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10)
    const numerator = parseInt(mixedMatch[2], 10)
    const denominator = parseInt(mixedMatch[3], 10)
    if (denominator === 0) {
      return { ok: false, error: "Division by zero is not allowed", code: "division_by_zero" }
    }
    if (numerator >= denominator) {
      return {
        ok: false,
        error: 'Use a proper fraction after the whole part (e.g. "2 3/8", not "2 9/8")',
        code: "invalid_format",
      }
    }
    const improper = toImproperReduced(whole, numerator, denominator)
    const exactValue = improper.numerator / improper.denominator
    const value: ParsedMathSuccess = {
      kind: "fraction",
      whole,
      numerator,
      denominator,
      reducedNumerator: improper.numerator,
      reducedDenominator: improper.denominator,
      exactValue,
    }
    return { ok: true, value }
  }

  // Simple fraction "a/b" (may be improper)
  const fractionMatch = input.match(/^(\d+)\/(\d+)$/)
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10)
    const denominator = parseInt(fractionMatch[2], 10)
    if (denominator === 0) {
      return { ok: false, error: "Division by zero is not allowed", code: "division_by_zero" }
    }
    const improper = toImproperReduced(0, numerator, denominator)
    const exactValue = improper.numerator / improper.denominator
    const value: ParsedMathSuccess = {
      kind: "fraction",
      whole: 0,
      numerator,
      denominator,
      reducedNumerator: improper.numerator,
      reducedDenominator: improper.denominator,
      exactValue,
    }
    return { ok: true, value }
  }

  return {
    ok: false,
    error: 'Invalid format. Try: "3/8", "1 1/2", or "0.375"',
    code: "invalid_format",
  }
}

/** Map low-level code for inches `validateInput` compatibility. */
export function parseErrorCodeToLegacy(code: ParseMathErrorCode): string {
  switch (code) {
    case "empty":
      return "empty"
    case "division_by_zero":
      return "division_by_zero"
    default:
      return "invalid_format"
  }
}
