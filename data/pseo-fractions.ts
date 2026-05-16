import { gcd } from "@/lib/fraction-math"

export interface PseoFractionPair {
  numerator: number
  denominator: number
}

export interface PopularLandingQuery {
  label: string
  numerator: number
  denominator: number
}

export interface PopularToolQuery {
  label: string
  input: string
}

/** Bump when pSEO batch or copy changes (sitemap lastmod). */
export const PSEO_CONTENT_VERSION = "1.0"

/** Route namespace for pSEO fraction landings. */
export const PSEO_BASE_SEGMENT = "as-a-decimal"

export const PSEO_LAST_MODIFIED_DATE = "2026-04-18"
export const PSEO_ENABLED_LOCALES = ["en"] as const

export function getReducedPseoPair(n: number, d: number): PseoFractionPair | null {
  if (!Number.isInteger(n) || !Number.isInteger(d) || n <= 0 || d <= 0) {
    return null
  }

  const g = gcd(n, d)
  return { numerator: n / g, denominator: d / g }
}

export function getPseoSlug(numerator: number, denominator: number): string {
  return `${numerator}-${denominator}`
}

export function getPseoPath(numerator: number, denominator: number): string {
  return `/tools/${PSEO_BASE_SEGMENT}/${getPseoSlug(numerator, denominator)}`
}

export const featuredPseoFractions: PseoFractionPair[] = [
  { numerator: 1, denominator: 2 },
  { numerator: 1, denominator: 3 },
  { numerator: 2, denominator: 3 },
  { numerator: 4, denominator: 3 },
  { numerator: 3, denominator: 4 },
  { numerator: 4, denominator: 5 },
  { numerator: 5, denominator: 6 },
  { numerator: 1, denominator: 8 },
  { numerator: 3, denominator: 8 },
  { numerator: 5, denominator: 8 },
  { numerator: 7, denominator: 8 },
  { numerator: 7, denominator: 9 },
  { numerator: 5, denominator: 9 },
  { numerator: 5, denominator: 16 },
  { numerator: 9, denominator: 16 },
]

export const popularLandingQueries: PopularLandingQuery[] = [
  { label: "what is 1/3 as a decimal", numerator: 1, denominator: 3 },
  { label: "what decimal is 2/3", numerator: 2, denominator: 3 },
  { label: "what is 3/8 as a decimal", numerator: 3, denominator: 8 },
  { label: "3/8 in decimal form", numerator: 3, denominator: 8 },
  { label: "5/6 to a decimal", numerator: 5, denominator: 6 },
  { label: "1/16 to a decimal", numerator: 1, denominator: 16 },
  { label: "1/4 in decimal form", numerator: 1, denominator: 4 },
  { label: "15/16 to decimal", numerator: 15, denominator: 16 },
  { label: "what is the decimal of 4/3", numerator: 4, denominator: 3 },
  { label: "5/4 in decimal", numerator: 5, denominator: 4 },
  { label: "5/8 decimal", numerator: 5, denominator: 8 },
  { label: "9/16 in decimal form", numerator: 9, denominator: 16 },
]

export const popularMixedNumberQueries: PopularToolQuery[] = [
  { label: "1 1/2 as decimal", input: "1 1/2" },
  { label: "2 and 2/3 as a decimal", input: "2 2/3" },
  { label: "3 3/4 to decimal", input: "3 3/4" },
  { label: "8 7/8 in decimal", input: "8 7/8" },
  { label: "2 and a half as a decimal", input: "2 1/2" },
  { label: "5 and 1/5 as a decimal", input: "5 1/5" },
]

/**
 * Build reduced proper fractions with denominators 2..16 (all n with gcd(n,d)=1, 1<=n<d).
 * Plus denominators 32 for common machining/eighths-style long-tail (odd numerators only).
 * Plus a small set of reduced improper fractions often searched.
 */
function buildWhitelist(): PseoFractionPair[] {
  const seen = new Set<string>()
  const out: PseoFractionPair[] = []

  const add = (n: number, d: number) => {
    if (d <= 1 || n <= 0) return
    const r = getReducedPseoPair(n, d)
    if (!r) return
    if (r.denominator <= 1) return
    const key = `${r.numerator}/${r.denominator}`
    if (seen.has(key)) return
    seen.add(key)
    out.push(r)
  }

  for (let d = 2; d <= 16; d++) {
    for (let n = 1; n < d; n++) {
      if (gcd(n, d) === 1) add(n, d)
    }
  }

  for (let n = 1; n < 32; n += 2) {
    if (gcd(n, 32) === 1) add(n, 32)
  }

  const improper: PseoFractionPair[] = [
    { numerator: 3, denominator: 2 },
    { numerator: 5, denominator: 2 },
    { numerator: 7, denominator: 2 },
    { numerator: 9, denominator: 2 },
    { numerator: 4, denominator: 3 },
    { numerator: 5, denominator: 3 },
    { numerator: 7, denominator: 3 },
    { numerator: 8, denominator: 3 },
    { numerator: 5, denominator: 4 },
    { numerator: 7, denominator: 4 },
    { numerator: 9, denominator: 4 },
    { numerator: 9, denominator: 8 },
    { numerator: 11, denominator: 8 },
    { numerator: 13, denominator: 8 },
    { numerator: 15, denominator: 8 },
    { numerator: 9, denominator: 16 },
    { numerator: 11, denominator: 16 },
    { numerator: 13, denominator: 16 },
    { numerator: 15, denominator: 16 },
  ]

  for (const p of improper) add(p.numerator, p.denominator)

  return out
}

export const pseoFractionPairs: PseoFractionPair[] = buildWhitelist()

const whitelistSet = new Set(pseoFractionPairs.map((p) => `${p.numerator}/${p.denominator}`))

export function isPseoWhitelisted(numerator: number, denominator: number): boolean {
  const r = getReducedPseoPair(numerator, denominator)
  if (!r) return false
  return whitelistSet.has(`${r.numerator}/${r.denominator}`)
}

export function getRelatedPseoFractions(
  numerator: number,
  denominator: number,
  max = 6
): PseoFractionPair[] {
  const r = getReducedPseoPair(numerator, denominator)
  if (!r) return []
  const n = r.numerator
  const d = r.denominator
  const candidates: PseoFractionPair[] = []

  const tryAdd = (a: number, b: number) => {
    if (b <= 0 || a <= 0) return
    const p = getReducedPseoPair(a, b)
    if (!p) return
    if (p.denominator <= 1) return
    if (!isPseoWhitelisted(p.numerator, p.denominator)) return
    const key = `${p.numerator}/${p.denominator}`
    if (candidates.some((c) => `${c.numerator}/${c.denominator}` === key)) return
    candidates.push(p)
  }

  tryAdd(n - 1, d)
  tryAdd(n + 1, d)
  tryAdd(n, d - 1)
  tryAdd(n, d + 1)

  const sameDen = pseoFractionPairs
    .filter((p) => p.denominator === d && p.numerator !== n)
    .sort((a, b) => Math.abs(a.numerator - n) - Math.abs(b.numerator - n))
  for (const p of sameDen) {
    if (candidates.length >= max) break
    tryAdd(p.numerator, p.denominator)
  }

  const keyCurrent = `${n}/${d}`
  return candidates.filter((c) => `${c.numerator}/${c.denominator}` !== keyCurrent).slice(0, max)
}
