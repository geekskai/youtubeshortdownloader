export type InputMode = "standard" | "smart"
export type RoundingMode = "none" | "quarter" | "tenth" | "seven_minute_rule"

export interface ParsedDuration {
  totalSeconds: number
  normalizedParts: {
    hours: number
    minutes: number
    seconds: number
  }
  normalizedLabel: string
}

export type ParseError = "empty" | "invalid" | "negative_not_supported"

export type ParseResult = { ok: true; value: ParsedDuration } | { ok: false; error: ParseError }

export interface BatchRow {
  id: string
  sourceLabel: string
  exactHours: number
  roundedHours: number
  totalAmount: number | null
}

export const MAX_DECIMAL_DIGITS = 4

function trimTrailingZeros(value: string) {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
}

export function toFixedHours(value: number, digits = MAX_DECIMAL_DIGITS) {
  return trimTrailingZeros(value.toFixed(digits))
}

export function normalizeFromSeconds(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return { hours, minutes, seconds }
}

export function formatHumanDuration(totalSeconds: number) {
  const { hours, minutes, seconds } = normalizeFromSeconds(totalSeconds)
  const tokens: string[] = []
  if (hours > 0) tokens.push(`${hours} hour${hours === 1 ? "" : "s"}`)
  if (minutes > 0) tokens.push(`${minutes} minute${minutes === 1 ? "" : "s"}`)
  if (seconds > 0) tokens.push(`${seconds} second${seconds === 1 ? "" : "s"}`)
  return tokens.length ? tokens.join(" and ") : "0 seconds"
}

function parseNumberish(input: string) {
  const value = Number.parseFloat(input.trim())
  if (!Number.isFinite(value)) return null
  if (value < 0) return null
  return value
}

export function parseStandardDuration(
  hoursInput: string,
  minutesInput: string,
  secondsInput: string
): ParseResult {
  if (!hoursInput.trim() && !minutesInput.trim() && !secondsInput.trim()) {
    return { ok: false, error: "empty" }
  }

  const hours = hoursInput.trim() ? parseNumberish(hoursInput) : 0
  const minutes = minutesInput.trim() ? parseNumberish(minutesInput) : 0
  const seconds = secondsInput.trim() ? parseNumberish(secondsInput) : 0

  if (hours == null || minutes == null || seconds == null) {
    return { ok: false, error: "invalid" }
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const normalized = normalizeFromSeconds(totalSeconds)
  return {
    ok: true,
    value: {
      totalSeconds,
      normalizedParts: normalized,
      normalizedLabel: `${normalized.hours}:${String(normalized.minutes).padStart(2, "0")}:${String(normalized.seconds).padStart(2, "0")}`,
    },
  }
}

function parseColonFormat(input: string): ParseResult {
  const parts = input.split(":").map((part) => part.trim())
  if (parts.length < 2 || parts.length > 3) return { ok: false, error: "invalid" }
  if (parts.some((part) => !/^\d+(\.\d+)?$/.test(part))) return { ok: false, error: "invalid" }
  const [h, m, s = "0"] = parts
  return parseStandardDuration(h, m, s)
}

function parseTokenizedFormat(input: string): ParseResult {
  const tokenRegex =
    /(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)\b/gi
  let matched = false
  let hours = 0
  let minutes = 0
  let seconds = 0
  let match: RegExpExecArray | null

  while ((match = tokenRegex.exec(input)) !== null) {
    matched = true
    const value = Number.parseFloat(match[1])
    const unit = match[2].toLowerCase()
    if (!Number.isFinite(value) || value < 0) return { ok: false, error: "invalid" }

    if (unit.startsWith("h")) hours += value
    else if (unit.startsWith("m")) minutes += value
    else seconds += value
  }

  if (!matched) return { ok: false, error: "invalid" }
  return parseStandardDuration(String(hours), String(minutes), String(seconds))
}

export function parseSmartDuration(input: string): ParseResult {
  const normalizedInput = input.trim().toLowerCase()
  if (!normalizedInput) return { ok: false, error: "empty" }
  if (normalizedInput.includes("-")) return { ok: false, error: "negative_not_supported" }

  if (normalizedInput.includes(":")) {
    const result = parseColonFormat(normalizedInput)
    if (result.ok) return result
  }

  if (/[a-z]/i.test(normalizedInput)) {
    const result = parseTokenizedFormat(normalizedInput)
    if (result.ok) return result
  }

  if (/^\d+(\.\d+)?$/.test(normalizedInput)) {
    const hours = Number.parseFloat(normalizedInput)
    if (!Number.isFinite(hours) || hours < 0) return { ok: false, error: "invalid" }
    return parseStandardDuration(String(hours), "0", "0")
  }

  return { ok: false, error: "invalid" }
}

export function roundHours(totalSeconds: number, mode: RoundingMode) {
  const exactHours = totalSeconds / 3600
  if (mode === "none") return exactHours
  if (mode === "quarter") return Math.round(exactHours * 4) / 4
  if (mode === "tenth") return Math.round(exactHours * 10) / 10

  const totalMinutes = totalSeconds / 60
  const quarterBlock = Math.floor(totalMinutes / 15)
  const remainder = totalMinutes - quarterBlock * 15
  const roundedMinutes = remainder <= 7 ? quarterBlock * 15 : (quarterBlock + 1) * 15
  return roundedMinutes / 60
}

export function parseHourlyRate(input: string): number | null {
  if (!input.trim()) return null
  const normalized = input.replace(/[$,\s]/g, "")
  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value) || value < 0) return null
  return value
}

export function calculateMinutesProgress(totalSeconds: number) {
  const fractionOfHour = (totalSeconds % 3600) / 3600
  return Math.max(0, Math.min(1, fractionOfHour))
}

export function buildCsv(rows: BatchRow[]) {
  const header = "Entry,Exact Hours,Rounded Hours,Amount"
  const body = rows.map((row) => {
    const amount = row.totalAmount == null ? "" : row.totalAmount.toFixed(2)
    return `"${row.sourceLabel}",${row.exactHours.toFixed(4)},${row.roundedHours.toFixed(4)},${amount}`
  })
  return [header, ...body].join("\n")
}
