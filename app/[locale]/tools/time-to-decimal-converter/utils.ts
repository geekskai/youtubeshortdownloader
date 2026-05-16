export type ConverterDirection = "time_to_decimal" | "decimal_to_time"
export type TargetBase = "hours" | "minutes" | "days"

export type ParseError = "empty" | "invalid" | "negative_not_supported"
export type ParseResponse =
  | {
    ok: true
    value: {
      totalSeconds: number
      normalizedLabel: string
      chips: string[]
    }
  }
  | { ok: false; error: ParseError }

function trimTrailingZeros(value: string) {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
}

export function formatDecimal(value: number, precision: number) {
  return trimTrailingZeros(value.toFixed(Math.min(6, Math.max(0, precision))))
}

export function normalizeParts(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds))
  const days = Math.floor(safe / 86400)
  const dayRemainder = safe % 86400
  const hours = Math.floor(dayRemainder / 3600)
  const minutes = Math.floor((dayRemainder % 3600) / 60)
  const seconds = dayRemainder % 60
  return { days, hours, minutes, seconds }
}

function buildChips(days: number, hours: number, minutes: number, seconds: number) {
  const chips: string[] = []
  if (days) chips.push(`${days} Day${days === 1 ? "" : "s"}`)
  if (hours) chips.push(`${hours} Hour${hours === 1 ? "" : "s"}`)
  if (minutes) chips.push(`${minutes} Minute${minutes === 1 ? "" : "s"}`)
  if (seconds) chips.push(`${seconds} Second${seconds === 1 ? "" : "s"}`)
  if (!chips.length) chips.push("0 Seconds")
  return chips
}

function parseClockTime(input: string): ParseResponse {
  const match = input.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*(am|pm)$/i)
  if (!match) return { ok: false, error: "invalid" }
  let hours = Number.parseInt(match[1], 10)
  const minutes = Number.parseInt(match[2] ?? "0", 10)
  const seconds = Number.parseInt(match[3] ?? "0", 10)
  const period = match[4].toLowerCase()

  if (hours < 1 || hours > 12 || minutes < 0 || seconds < 0) return { ok: false, error: "invalid" }
  if (minutes >= 60 || seconds >= 60) return { ok: false, error: "invalid" }

  if (hours === 12) hours = 0
  if (period === "pm") hours += 12

  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const chips = buildChips(0, hours, minutes, seconds)
  return {
    ok: true,
    value: {
      totalSeconds,
      normalizedLabel: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      chips,
    },
  }
}

function parseColonTime(input: string): ParseResponse {
  const parts = input.split(":").map((part) => part.trim())
  if (parts.length < 2 || parts.length > 3) return { ok: false, error: "invalid" }
  if (parts.some((part) => !/^\d+(\.\d+)?$/.test(part))) return { ok: false, error: "invalid" }
  const [h, m, rawS] = parts.map((part) => Number.parseFloat(part))
  const s = rawS ?? 0
  if (![h, m, s].every((value) => Number.isFinite(value) && value >= 0)) return { ok: false, error: "invalid" }

  const totalSeconds = h * 3600 + m * 60 + s
  const normalized = normalizeParts(totalSeconds)
  const chips = buildChips(normalized.days, normalized.hours, normalized.minutes, normalized.seconds)
  return {
    ok: true,
    value: {
      totalSeconds,
      normalizedLabel: `${normalized.days ? `${normalized.days}d ` : ""}${String(normalized.hours).padStart(2, "0")}:${String(normalized.minutes).padStart(2, "0")}:${String(normalized.seconds).padStart(2, "0")}`,
      chips,
    },
  }
}

function parseTokenized(input: string): ParseResponse {
  const tokenRegex =
    /(\d+(?:\.\d+)?)\s*(d|day|days|h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)\b/gi
  let matched = false
  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0
  let token: RegExpExecArray | null

  while ((token = tokenRegex.exec(input)) !== null) {
    matched = true
    const value = Number.parseFloat(token[1])
    const unit = token[2].toLowerCase()
    if (!Number.isFinite(value) || value < 0) return { ok: false, error: "invalid" }

    if (unit.startsWith("d")) days += value
    else if (unit.startsWith("h")) hours += value
    else if (unit.startsWith("m")) minutes += value
    else seconds += value
  }

  if (!matched) return { ok: false, error: "invalid" }
  const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds
  const normalized = normalizeParts(totalSeconds)
  return {
    ok: true,
    value: {
      totalSeconds,
      normalizedLabel: `${normalized.days ? `${normalized.days}d ` : ""}${String(normalized.hours).padStart(2, "0")}:${String(normalized.minutes).padStart(2, "0")}:${String(normalized.seconds).padStart(2, "0")}`,
      chips: buildChips(normalized.days, normalized.hours, normalized.minutes, normalized.seconds),
    },
  }
}

export function parseFlexibleTimeInput(rawInput: string): ParseResponse {
  const input = rawInput.trim().toLowerCase()
  if (!input) return { ok: false, error: "empty" }
  if (input.includes("-")) return { ok: false, error: "negative_not_supported" }

  if (/\b(am|pm)\b/.test(input)) {
    const clock = parseClockTime(input)
    if (clock.ok) return clock
  }

  if (input.includes(":")) {
    const colon = parseColonTime(input)
    if (colon.ok) return colon
  }

  if (/[a-z]/.test(input)) {
    const tokenized = parseTokenized(input)
    if (tokenized.ok) return tokenized
  }

  if (/^\d+(\.\d+)?$/.test(input)) {
    const asHours = Number.parseFloat(input)
    if (!Number.isFinite(asHours) || asHours < 0) return { ok: false, error: "invalid" }
    const totalSeconds = asHours * 3600
    const normalized = normalizeParts(totalSeconds)
    return {
      ok: true,
      value: {
        totalSeconds,
        normalizedLabel: `${normalized.days ? `${normalized.days}d ` : ""}${String(normalized.hours).padStart(2, "0")}:${String(normalized.minutes).padStart(2, "0")}:${String(normalized.seconds).padStart(2, "0")}`,
        chips: buildChips(normalized.days, normalized.hours, normalized.minutes, normalized.seconds),
      },
    }
  }

  return { ok: false, error: "invalid" }
}

export function toDecimalByBase(totalSeconds: number, base: TargetBase) {
  if (base === "days") return totalSeconds / 86400
  if (base === "minutes") return totalSeconds / 60
  return totalSeconds / 3600
}

export function fromDecimalByBase(value: number, base: TargetBase) {
  if (!Number.isFinite(value) || value < 0) return null
  if (base === "days") return value * 86400
  if (base === "minutes") return value * 60
  return value * 3600
}

export function formatReverseDuration(totalSeconds: number) {
  const normalized = normalizeParts(totalSeconds)
  const head = normalized.days ? `${normalized.days}d ` : ""
  return `${head}${String(normalized.hours).padStart(2, "0")}:${String(normalized.minutes).padStart(2, "0")}:${String(normalized.seconds).padStart(2, "0")}`
}

export interface BatchTimeRow {
  source: string
  ok: boolean
  normalized: string
  decimal: string
  error?: ParseError
}

export function convertBatchLines(
  rawInput: string,
  base: TargetBase,
  precision: number
): BatchTimeRow[] {
  return rawInput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parsed = parseFlexibleTimeInput(line)
      if (!parsed.ok) {
        return {
          source: line,
          ok: false,
          normalized: "-",
          decimal: "-",
          error: parsed.error,
        }
      }

      const decimal = toDecimalByBase(parsed.value.totalSeconds, base)
      return {
        source: line,
        ok: true,
        normalized: parsed.value.normalizedLabel,
        decimal: formatDecimal(decimal, precision),
      }
    })
}
