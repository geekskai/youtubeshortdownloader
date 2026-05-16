import { mathParsedToConversion } from "./convert"
import { parseMathFractionInput } from "./parse-math-input"
import type { MathConversionCore } from "./types"

export interface FractionPageModel {
  numerator: number
  denominator: number
  canonicalNumerator: number
  canonicalDenominator: number
  fractionLabel: string
  inputString: string
  core: MathConversionCore
}

/**
 * Single source of truth for pSEO pages and metadata: same path as typing `n/d` into the calculator.
 */
export function getFractionPageModel(
  numerator: number,
  denominator: number
): FractionPageModel | null {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0 ||
    numerator < 0 ||
    denominator < 0
  ) {
    return null
  }

  const inputString = `${numerator}/${denominator}`
  const parsed = parseMathFractionInput(inputString, { allowPureDecimal: false })
  if (!parsed.ok || parsed.value.kind !== "fraction") {
    return null
  }

  const core = mathParsedToConversion(inputString, parsed.value, 12)
  return {
    numerator,
    denominator,
    canonicalNumerator: parsed.value.reducedNumerator,
    canonicalDenominator: parsed.value.reducedDenominator,
    fractionLabel: `${parsed.value.reducedNumerator}/${parsed.value.reducedDenominator}`,
    inputString,
    core,
  }
}
