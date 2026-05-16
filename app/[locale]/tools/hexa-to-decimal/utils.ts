export type BitDepth = 8 | 16 | 32 | 64
export type EndianMode = "big" | "little"

export type ParseError = "empty" | "invalid_hex"

export type ParseResponse =
  | {
      ok: true
      value: {
        normalizedHex: string
        displayHex: string
        byteTokens: string[]
        unsignedValue: bigint
      }
    }
  | { ok: false; error: ParseError }

export interface ConversionResult {
  normalizedHex: string
  displayHex: string
  unsignedDecimal: string
  signedDecimal: string
  binaryGrouped: string
  octal: string
  asciiPreview: string
  utf8Preview: string
  colorHex: string | null
  rgbPreview: string | null
  bitDepthOverflow: boolean
  maskedValue: bigint
}

function normalizeRawHex(rawInput: string) {
  return rawInput
    .trim()
    .replace(/0x/gi, "")
    .replace(/#/g, "")
    .replace(/[^0-9a-fA-F\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function bytesToBigInt(byteTokens: string[]) {
  const fullHex = byteTokens.join("")
  return fullHex ? BigInt(`0x${fullHex}`) : 0n
}

function bigIntToBytes(value: bigint) {
  let hex = value.toString(16)
  if (hex.length % 2 === 1) hex = `0${hex}`
  return hex.match(/.{1,2}/g) ?? ["00"]
}

function decodeUtf8(bytes: number[]) {
  if (!bytes.length) return ""
  try {
    if (typeof TextDecoder !== "undefined") {
      const decoder = new TextDecoder("utf-8", { fatal: false })
      return decoder.decode(new Uint8Array(bytes))
    }
  } catch {}
  return ""
}

export function parseHexInput(rawInput: string, endian: EndianMode): ParseResponse {
  const cleaned = normalizeRawHex(rawInput)
  if (!cleaned) return { ok: false, error: "empty" }

  const hasSpaces = cleaned.includes(" ")
  let byteTokens: string[]

  if (hasSpaces) {
    const tokens = cleaned.split(" ").filter(Boolean)
    if (!tokens.length) return { ok: false, error: "empty" }
    if (!tokens.every((token) => /^[0-9a-fA-F]{1,2}$/.test(token))) {
      return { ok: false, error: "invalid_hex" }
    }
    const normalized = tokens.map((token) => token.padStart(2, "0").toUpperCase())
    byteTokens = endian === "little" ? [...normalized].reverse() : normalized
  } else {
    const plain = cleaned.replace(/\s+/g, "")
    if (!/^[0-9a-fA-F]+$/.test(plain)) return { ok: false, error: "invalid_hex" }
    const padded = plain.length % 2 === 1 ? `0${plain}` : plain
    byteTokens = padded.match(/.{1,2}/g)?.map((token) => token.toUpperCase()) ?? ["00"]
    if (endian === "little" && byteTokens.length > 1) {
      byteTokens = [...byteTokens].reverse()
    }
  }

  const unsignedValue = bytesToBigInt(byteTokens)
  return {
    ok: true,
    value: {
      normalizedHex: byteTokens.join(""),
      displayHex: byteTokens.join(" "),
      byteTokens,
      unsignedValue,
    },
  }
}

function toTwosComplementSigned(value: bigint, bits: BitDepth) {
  const signBit = 1n << BigInt(bits - 1)
  const fullRange = 1n << BigInt(bits)
  return (value & signBit) !== 0n ? value - fullRange : value
}

function toGroupedBinary(value: bigint, bits: BitDepth) {
  const raw = (value & ((1n << BigInt(bits)) - 1n)).toString(2).padStart(bits, "0")
  return raw.replace(/(.{4})/g, "$1 ").trim()
}

function toAsciiPreview(bytes: number[]) {
  if (!bytes.length) return "-"
  return bytes.map((code) => (code >= 32 && code <= 126 ? String.fromCharCode(code) : ".")).join("")
}

function toColorPreview(hex: string) {
  if (hex.length !== 3 && hex.length !== 6) return { colorHex: null, rgbPreview: null }
  const full = hex.length === 3 ? hex.split("").map((ch) => ch + ch).join("") : hex
  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return { colorHex: `#${full}`, rgbPreview: `rgb(${r}, ${g}, ${b})` }
}

export function convertHexToOmniResult(rawInput: string, bitDepth: BitDepth, endian: EndianMode) {
  const parsed = parseHexInput(rawInput, endian)
  if (!parsed.ok) return parsed

  const mask = (1n << BigInt(bitDepth)) - 1n
  const bitDepthOverflow = parsed.value.unsignedValue > mask
  const maskedValue = parsed.value.unsignedValue & mask
  const signedValue = toTwosComplementSigned(maskedValue, bitDepth)

  const bytes = bigIntToBytes(maskedValue).map((token) => Number.parseInt(token, 16))
  const utf8Text = decodeUtf8(bytes)
  const colorInput = parsed.value.normalizedHex.length <= 6 ? parsed.value.normalizedHex : ""
  const color = toColorPreview(colorInput)

  return {
    ok: true as const,
    value: {
      normalizedHex: parsed.value.normalizedHex,
      displayHex: parsed.value.displayHex,
      unsignedDecimal: parsed.value.unsignedValue.toString(10),
      signedDecimal: signedValue.toString(10),
      binaryGrouped: toGroupedBinary(maskedValue, bitDepth),
      octal: maskedValue.toString(8),
      asciiPreview: toAsciiPreview(bytes),
      utf8Preview: utf8Text || "-",
      colorHex: color.colorHex,
      rgbPreview: color.rgbPreview,
      bitDepthOverflow,
      maskedValue,
    } satisfies ConversionResult,
  }
}

export function toggleBit(value: bigint, bitDepth: BitDepth, bitIndexFromLeft: number) {
  const indexFromRight = bitDepth - 1 - bitIndexFromLeft
  const mask = 1n << BigInt(indexFromRight)
  const next = value ^ mask
  const maxMask = (1n << BigInt(bitDepth)) - 1n
  return next & maxMask
}

export function valueToFixedHex(value: bigint, bitDepth: BitDepth) {
  const digits = bitDepth / 4
  return value.toString(16).toUpperCase().padStart(digits, "0")
}
