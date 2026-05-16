import { gcd } from "./gcd"

export interface ReducedFraction {
  numerator: number
  denominator: number
}

/**
 * Reduce n/d to lowest terms (d > 0).
 */
export function reduceFraction(numerator: number, denominator: number): ReducedFraction {
  if (denominator === 0) {
    throw new Error("reduceFraction: denominator cannot be zero")
  }
  const d = Math.abs(denominator)
  const sign = denominator < 0 ? -1 : 1
  let n = numerator * sign
  const g = gcd(Math.abs(n), d)
  n = n / g
  const den = d / g
  return { numerator: n, denominator: den }
}

/**
 * True iff the reduced denominator's prime factors are only 2 and 5 (terminating decimal).
 */
export function isTerminatingDenominator(reducedDenominator: number): boolean {
  let d = Math.abs(Math.floor(reducedDenominator))
  if (d === 0) return false
  while (d % 2 === 0) d /= 2
  while (d % 5 === 0) d /= 5
  return d === 1
}

/**
 * Mixed + proper fraction part → improper reduced numerator/denominator.
 */
export function toImproperReduced(
  whole: number,
  numerator: number,
  denominator: number
): ReducedFraction {
  if (denominator === 0) {
    throw new Error("toImproperReduced: denominator cannot be zero")
  }
  const sign = denominator < 0 ? -1 : 1
  const d = Math.abs(denominator)
  const n = numerator * sign
  const improperNum = whole * d + n
  return reduceFraction(improperNum, d)
}
