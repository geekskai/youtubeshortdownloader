import type { MathConversionCore, ParsedMathSuccess } from "./types"
import { isTerminatingDenominator, reduceFraction } from "./rational"

const DEFAULT_MAX_DISPLAY_PRECISION = 12

/**
 * Trim trailing zeros from a fixed string.
 */
export function formatDecimalTrim(
  value: number,
  maxPrecision: number = DEFAULT_MAX_DISPLAY_PRECISION
): string {
  if (!Number.isFinite(value)) return String(value)
  if (maxPrecision === 0) {
    return String(Math.round(value))
  }
  const fixed = value.toFixed(maxPrecision)
  return fixed.replace(/\.?0+$/, "")
}

/**
 * Build human-readable simplified label from reduced improper fraction.
 */
export function formatSimplifiedLabel(
  reducedNumerator: number,
  reducedDenominator: number
): string {
  if (reducedDenominator === 1) {
    return String(reducedNumerator)
  }
  const whole = Math.floor(reducedNumerator / reducedDenominator)
  const rem = reducedNumerator % reducedDenominator
  if (whole > 0 && rem > 0) {
    return `${whole} ${rem}/${reducedDenominator}`
  }
  if (whole > 0 && rem === 0) {
    return String(whole)
  }
  return `${reducedNumerator}/${reducedDenominator}`
}

/**
 * Core conversion from successful parse → display fields.
 */
export function mathParsedToConversion(
  trimmedInput: string,
  parsed: ParsedMathSuccess,
  maxPrecision: number = DEFAULT_MAX_DISPLAY_PRECISION
): MathConversionCore {
  if (parsed.kind === "decimal_only") {
    const v = parsed.value
    const formattedDecimal = formatDecimalTrim(v, maxPrecision)
    return {
      input: trimmedInput,
      decimal: v,
      formattedDecimal,
      simplifiedLabel: formattedDecimal,
      isTerminating: true,
    }
  }

  const { reducedNumerator: rn, reducedDenominator: rd } = parsed
  const terminating = isTerminatingDenominator(rd)
  const exactValue = rn / rd
  const simplifiedLabel = formatSimplifiedLabel(rn, rd)

  if (terminating) {
    return {
      input: trimmedInput,
      decimal: exactValue,
      formattedDecimal: formatDecimalTrim(exactValue, maxPrecision),
      simplifiedLabel,
      isTerminating: true,
    }
  }

  const approx = formatDecimalTrim(exactValue, maxPrecision)
  return {
    input: trimmedInput,
    decimal: exactValue,
    formattedDecimal: approx,
    simplifiedLabel,
    isTerminating: false,
    repeatingNote: `Approximation ${approx} (repeating decimal; exact value is ${simplifiedLabel})`,
  }
}

/**
 * Convert decimal value (0 <= x) to reduced fraction label for reverse direction — uses continued fraction / brute force for small den.
 * Kept separate from inches `convertDecimalToFraction` which caps den at 32.
 */
export function decimalToReducedLabel(decimal: number, maxDenominator: number = 1000): string {
  if (!Number.isFinite(decimal) || decimal < 0) return String(decimal)
  const whole = Math.floor(decimal + 1e-12)
  const frac = decimal - whole
  if (frac < 1e-10) {
    return String(whole)
  }

  let bestNum = 0
  let bestDen = 1
  let bestErr = Math.abs(frac)
  for (let den = 1; den <= maxDenominator; den++) {
    const num = Math.round(frac * den)
    const err = Math.abs(frac - num / den)
    if (err < bestErr) {
      bestErr = err
      bestNum = num
      bestDen = den
    }
    if (err < 1e-9) break
  }

  const r = reduceFraction(bestNum, bestDen)
  if (whole > 0) {
    return `${whole} ${r.numerator}/${r.denominator}`
  }
  return `${r.numerator}/${r.denominator}`
}
