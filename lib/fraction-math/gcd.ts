/**
 * Greatest common divisor (non-negative integers).
 */
export function gcd(a: number, b: number): number {
  const x = Math.abs(Math.floor(a))
  const y = Math.abs(Math.floor(b))
  return y === 0 ? x : gcd(y, x % y)
}
