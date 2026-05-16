import type { ParsedInput, Fraction, ValidationResult } from "../types"
import { gcd as findGCD } from "@/lib/fraction-math"
import { parseMathFractionInput } from "@/lib/fraction-math"

// Common fractions lookup for quick conversion
export const COMMON_FRACTIONS = {
  "1/2": 0.5,
  "1/4": 0.25,
  "3/4": 0.75,
  "1/8": 0.125,
  "3/8": 0.375,
  "5/8": 0.625,
  "7/8": 0.875,
  "1/16": 0.0625,
  "3/16": 0.1875,
  "5/16": 0.3125,
  "7/16": 0.4375,
  "9/16": 0.5625,
  "11/16": 0.6875,
  "13/16": 0.8125,
  "15/16": 0.9375,
  "1/32": 0.03125,
  "3/32": 0.09375,
  "5/32": 0.15625,
  "7/32": 0.21875,
  "9/32": 0.28125,
  "11/32": 0.34375,
  "13/32": 0.40625,
  "15/32": 0.46875,
  "17/32": 0.53125,
  "19/32": 0.59375,
  "21/32": 0.65625,
  "23/32": 0.71875,
  "25/32": 0.78125,
  "27/32": 0.84375,
  "29/32": 0.90625,
  "31/32": 0.96875,
} as const

/**
 * Parse fractional input string into components (inches UI: strips units, then uses shared math parser).
 */
export function parseFractionalInput(input: string, precision: number = 4): ParsedInput {
  const cleanInput = input
    .trim()
    .replace(/["""'']/g, "")
    .replace(/inches?/gi, "")

  if (!cleanInput) {
    return {
      isValid: false,
      wholeNumber: 0,
      numerator: 0,
      denominator: 1,
      fraction: null,
      precision,
      error: "Please enter a measurement",
    }
  }

  const math = parseMathFractionInput(cleanInput, { allowPureDecimal: true })

  if (!math.ok) {
    return {
      isValid: false,
      wholeNumber: 0,
      numerator: 0,
      denominator: 1,
      fraction: null,
      precision,
      error: math.error,
    }
  }

  if (math.value.kind === "decimal_only") {
    const total = math.value.value
    return {
      isValid: true,
      wholeNumber: Math.floor(total),
      numerator: 0,
      denominator: 1,
      fraction: null,
      precision,
      decimalOnlyTotal: total,
    }
  }

  const v = math.value
  const fraction = createFraction(v.numerator, v.denominator)

  return {
    isValid: true,
    wholeNumber: v.whole,
    numerator: v.numerator,
    denominator: v.denominator,
    fraction,
    precision,
  }
}

/**
 * Create a fraction object with simplified form
 */
export function createFraction(numerator: number, denominator: number): Fraction {
  const g = findGCD(numerator, denominator)
  const simplified =
    g > 1
      ? {
          numerator: numerator / g,
          denominator: denominator / g,
          simplified: null,
          decimal: numerator / denominator,
        }
      : null

  return {
    numerator,
    denominator,
    simplified,
    decimal: numerator / denominator,
  }
}

export { findGCD }

/**
 * Find common equivalent fractions for a given decimal
 */
export function findCommonEquivalents(decimal: number, maxDenominator: number = 32): Fraction[] {
  const equivalents: Fraction[] = []
  const tolerance = 1 / (2 * maxDenominator)

  for (const [fractionStr, fractionDecimal] of Object.entries(COMMON_FRACTIONS)) {
    if (Math.abs(decimal - fractionDecimal) < tolerance) {
      const [num, den] = fractionStr.split("/").map(Number)
      equivalents.push(createFraction(num, den))
    }
  }

  return equivalents
}

/**
 * Convert decimal to nearest fraction
 */
export function convertDecimalToFraction(
  decimal: number,
  maxDenominator: number = 32
): {
  numerator: number
  denominator: number
  formatted: string
  error: number
} {
  const tolerance = 1 / (2 * maxDenominator)
  let bestNumerator = 0
  let bestDenominator = 1
  let bestError = Math.abs(decimal)

  // Check if it's a whole number first
  if (Math.abs(decimal - Math.round(decimal)) < tolerance) {
    return {
      numerator: Math.round(decimal),
      denominator: 1,
      formatted: Math.round(decimal).toString(),
      error: 0,
    }
  }

  // Find the best fraction approximation
  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(decimal * denominator)
    const error = Math.abs(decimal - numerator / denominator)

    if (error < bestError) {
      bestNumerator = numerator
      bestDenominator = denominator
      bestError = error
    }

    if (error < tolerance) break
  }

  // Simplify the fraction
  const gcd = findGCD(bestNumerator, bestDenominator)
  const simplifiedNum = bestNumerator / gcd
  const simplifiedDen = bestDenominator / gcd

  // Format as mixed number if needed
  const wholeNumber = Math.floor(simplifiedNum / simplifiedDen)
  const remainderNum = simplifiedNum % simplifiedDen

  let formatted: string
  if (wholeNumber > 0 && remainderNum > 0) {
    formatted = `${wholeNumber} ${remainderNum}/${simplifiedDen}`
  } else if (remainderNum === 0) {
    formatted = wholeNumber.toString()
  } else {
    formatted = `${simplifiedNum}/${simplifiedDen}`
  }

  return {
    numerator: simplifiedNum,
    denominator: simplifiedDen,
    formatted,
    error: bestError,
  }
}

/**
 * Validate input and provide helpful suggestions
 */
export function validateInput(input: string): ValidationResult {
  const errors: string[] = []
  const suggestions: string[] = []

  if (!input.trim()) {
    errors.push("Input cannot be empty")
    suggestions.push('Try entering "3/4" or "5.75"')
    return { isValid: false, errors, suggestions }
  }

  const cleanInput = input
    .trim()
    .replace(/["""'']/g, "")
    .replace(/inches?/gi, "")

  // Check for common mistakes
  if (cleanInput.includes("//")) {
    errors.push("Double slashes are not allowed")
    suggestions.push('Use single slash for fractions: "3/4"')
  }

  if (cleanInput.includes("/0")) {
    errors.push("Division by zero is not allowed")
    suggestions.push("Use a non-zero denominator")
  }

  if (cleanInput.match(/\d+\/\d+\/\d+/)) {
    errors.push("Multiple fractions in one input")
    suggestions.push('Enter one fraction at a time: "3/4"')
  }

  // Check for negative numbers
  if (cleanInput.includes("-") && !cleanInput.match(/^\d+[\s-]+\d+\/\d+$/)) {
    errors.push("Negative measurements are not supported")
    suggestions.push("Enter positive measurements only")
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
  }
}
