const MAX_ASCII_CODE = 127

export type CodeMode = "decimal" | "binary" | "hex"

export type DecodedCharResult = {
  text: string
  normalizedInput: string
  decimalCodes: string
  binaryCodes: string
  hexCodes: string
  codeCount: number
  charCount: number
}

export type EncodedCharResult = {
  inputText: string
  decimalCodes: string
  binaryCodes: string
  hexCodes: string
  codeCount: number
  charCount: number
}

type ConverterResponse<T> =
  | { ok: true; value: T }
  | { ok: false; error: "empty" | "invalid" | "out_of_ascii_range" | "non_ascii_text" }

function parseToken(token: string, mode: CodeMode): number | null {
  if (mode === "decimal") {
    if (!/^\d+$/.test(token)) return null
    return Number.parseInt(token, 10)
  }

  if (mode === "binary") {
    if (!/^[01]+$/.test(token)) return null
    return Number.parseInt(token, 2)
  }

  if (!/^[0-9a-fA-F]+$/.test(token)) return null
  return Number.parseInt(token, 16)
}

function formatCode(code: number, mode: CodeMode) {
  if (mode === "decimal") return code.toString(10)
  if (mode === "binary") return code.toString(2)
  return code.toString(16).toUpperCase()
}

function isAsciiText(value: string) {
  return [...value].every((char) => (char.codePointAt(0) ?? MAX_ASCII_CODE + 1) <= MAX_ASCII_CODE)
}

export function decodeCodesToAscii(rawInput: string, mode: CodeMode): ConverterResponse<DecodedCharResult> {
  const cleaned = rawInput.trim()
  if (!cleaned) return { ok: false, error: "empty" }

  const tokens = cleaned.split(/[\s,;|]+/).filter(Boolean)
  if (tokens.length === 0) return { ok: false, error: "empty" }

  const codes: number[] = []
  for (const token of tokens) {
    const parsed = parseToken(token, mode)
    if (parsed === null || !Number.isSafeInteger(parsed)) return { ok: false, error: "invalid" }
    if (parsed < 0 || parsed > MAX_ASCII_CODE) return { ok: false, error: "out_of_ascii_range" }
    codes.push(parsed)
  }

  const text = String.fromCodePoint(...codes)
  return {
    ok: true,
    value: {
      text,
      normalizedInput: codes.map((code) => formatCode(code, mode)).join(" "),
      decimalCodes: codes.join(" "),
      binaryCodes: codes.map((code) => code.toString(2)).join(" "),
      hexCodes: codes.map((code) => code.toString(16).toUpperCase()).join(" "),
      codeCount: codes.length,
      charCount: [...text].length,
    },
  }
}

export function encodeAsciiToCodes(rawInput: string): ConverterResponse<EncodedCharResult> {
  if (!rawInput) return { ok: false, error: "empty" }
  if (!isAsciiText(rawInput)) return { ok: false, error: "non_ascii_text" }

  const chars = [...rawInput]
  const codes = chars.map((char) => char.codePointAt(0) ?? 0)

  return {
    ok: true,
    value: {
      inputText: rawInput,
      decimalCodes: codes.join(" "),
      binaryCodes: codes.map((code) => code.toString(2)).join(" "),
      hexCodes: codes.map((code) => code.toString(16).toUpperCase()).join(" "),
      codeCount: codes.length,
      charCount: chars.length,
    },
  }
}
