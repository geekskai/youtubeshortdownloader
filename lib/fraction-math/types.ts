/**
 * Pure math fraction types — no React / i18n.
 */

export type ParseMathErrorCode =
  | "empty"
  | "invalid_format"
  | "division_by_zero"
  | "negative_not_supported"

/** Successful parse: either a plain decimal or a fraction / mixed number. */
export type ParsedMathSuccess =
  | {
      kind: "decimal_only"
      /** Non-negative finite value. */
      value: number
    }
  | {
      kind: "fraction"
      whole: number
      numerator: number
      denominator: number
      /** Reduced fractional part (proper): numerator / denominator after normalization. */
      reducedNumerator: number
      reducedDenominator: number
      /** Exact rational value = whole + numerator/denominator (before float rounding). */
      exactValue: number
    }

export type ParseMathResult =
  | { ok: true; value: ParsedMathSuccess }
  | { ok: false; error: string; code: ParseMathErrorCode }

export interface MathConversionCore {
  /** Original trimmed input string. */
  input: string
  /** Numeric value (may be rounded for display when repeating). */
  decimal: number
  /** Primary display string for the decimal (trimmed trailing zeros when terminating). */
  formattedDecimal: string
  /** Human-readable simplified fraction string, e.g. "3/8", "2 1/3". */
  simplifiedLabel: string
  /** True iff the exact rational has a terminating decimal expansion. */
  isTerminating: boolean
  /** When not terminating, short note for UI (English in lib; wrap in i18n in app). */
  repeatingNote?: string
}
