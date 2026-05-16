const MAX_CODE_POINT = 0x10ffff

export type CodeMode = "decimal" | "binary" | "hex"

export type DecodedTextResult = {
  text: string
  normalizedInput: string
  decimalCodes: string
  binaryCodes: string
  hexCodes: string
  codeCount: number
  charCount: number
}

export type EncodedTextResult = {
  inputText: string
  decimalCodes: string
  binaryCodes: string
  hexCodes: string
  codeCount: number
  charCount: number
}

type ConverterResponse<T> = { ok: true; value: T } | { ok: false; error: "empty" | "invalid" | "too_large" }

function parseToken(token: string, mode: CodeMode): number | null {
  if (mode === "decimal") {
    if (!/^\d+$/.test(token)) return null
    return Number(token)
  }

  if (mode === "binary") {
    if (!/^[01]+$/.test(token)) return null
    return Number.parseInt(token, 2)
  }

  if (!/^[0-9a-fA-F]+$/.test(token)) return null
  return Number.parseInt(token, 16)
}

function formatCodePoint(codePoint: number, mode: CodeMode) {
  if (mode === "decimal") return codePoint.toString(10)
  if (mode === "binary") return codePoint.toString(2)
  return codePoint.toString(16).toUpperCase()
}

export function decodeCodesToText(rawInput: string, mode: CodeMode): ConverterResponse<DecodedTextResult> {
  const cleaned = rawInput.trim()
  if (!cleaned) return { ok: false, error: "empty" }

  const tokens = cleaned.split(/[\s,;|]+/).filter(Boolean)
  if (tokens.length === 0) return { ok: false, error: "empty" }

  const codePoints: number[] = []
  for (const token of tokens) {
    const parsed = parseToken(token, mode)
    if (parsed === null || !Number.isSafeInteger(parsed)) return { ok: false, error: "invalid" }
    if (parsed < 0 || parsed > MAX_CODE_POINT) return { ok: false, error: "too_large" }
    codePoints.push(parsed)
  }

  const text = String.fromCodePoint(...codePoints)
  return {
    ok: true,
    value: {
      text,
      normalizedInput: codePoints.map((code) => formatCodePoint(code, mode)).join(" "),
      decimalCodes: codePoints.map((code) => code.toString(10)).join(" "),
      binaryCodes: codePoints.map((code) => code.toString(2)).join(" "),
      hexCodes: codePoints.map((code) => code.toString(16).toUpperCase()).join(" "),
      codeCount: codePoints.length,
      charCount: [...text].length,
    },
  }
}

export function encodeTextToCodes(rawInput: string): ConverterResponse<EncodedTextResult> {
  if (!rawInput) return { ok: false, error: "empty" }

  const chars = [...rawInput]
  if (chars.length === 0) return { ok: false, error: "empty" }

  const codePoints = chars.map((char) => char.codePointAt(0) ?? 0)
  return {
    ok: true,
    value: {
      inputText: rawInput,
      decimalCodes: codePoints.map((code) => code.toString(10)).join(" "),
      binaryCodes: codePoints.map((code) => code.toString(2)).join(" "),
      hexCodes: codePoints.map((code) => code.toString(16).toUpperCase()).join(" "),
      codeCount: codePoints.length,
      charCount: chars.length,
    },
  }
}
