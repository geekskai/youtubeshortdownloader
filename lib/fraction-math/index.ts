export { gcd } from "./gcd"
export { reduceFraction, isTerminatingDenominator, toImproperReduced } from "./rational"
export type { ReducedFraction } from "./rational"
export { parseMathFractionInput } from "./parse-math-input"
export type { ParseMathOptions } from "./parse-math-input"
export {
  formatDecimalTrim,
  formatSimplifiedLabel,
  mathParsedToConversion,
  decimalToReducedLabel,
} from "./convert"
export type {
  ParseMathResult,
  ParsedMathSuccess,
  ParseMathErrorCode,
  MathConversionCore,
} from "./types"
export { getFractionPageModel } from "./page-model"
export type { FractionPageModel } from "./page-model"
