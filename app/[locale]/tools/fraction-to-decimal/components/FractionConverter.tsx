"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  parseMathFractionInput,
  mathParsedToConversion,
  formatDecimalTrim,
  decimalToReducedLabel,
} from "@/lib/fraction-math"

export type FractionConverterProps = {
  /** Pre-filled value (e.g. pSEO pages: `"3/8"`). */
  initialInput?: string
  defaultInput?: string
  initialPrecision?: number
  /** Only fraction → decimal UI (hides mode toggle). */
  fractionOnly?: boolean
  /** Keep the input value and the `input` query param in sync. */
  syncInputWithUrl?: boolean
}

export default function FractionConverter({
  initialInput = "",
  defaultInput = "",
  initialPrecision = 8,
  fractionOnly = false,
  syncInputWithUrl = false,
}: FractionConverterProps) {
  const t = useTranslations("FractionToDecimal.converter")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const skipNextUrlStateSyncRef = useRef(false)
  const latestInputRef = useRef("")
  const [input, setInput] = useState(() => {
    if (!syncInputWithUrl) {
      return initialInput || defaultInput
    }

    return searchParams.get("input")?.trim() || initialInput || defaultInput
  })
  const [mode, setMode] = useState<"fraction-to-decimal" | "decimal-to-fraction">(
    "fraction-to-decimal"
  )
  const [precision, setPrecision] = useState(initialPrecision)
  const [error, setError] = useState("")
  const [primaryLine, setPrimaryLine] = useState("")
  const [secondaryLine, setSecondaryLine] = useState("")
  const [copyMsg, setCopyMsg] = useState("")
  const quickExamples =
    mode === "fraction-to-decimal"
      ? ["1/2", "3/8", "5/6", "1 3/4", "2 5/8"]
      : ["0.375", "0.625", "1.25", "2.75", "3.5"]

  useEffect(() => {
    latestInputRef.current = input
  }, [input])

  const run = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError("")
      setPrimaryLine("")
      setSecondaryLine("")
      return
    }

    if (mode === "fraction-to-decimal") {
      const parsed = parseMathFractionInput(trimmed, { allowPureDecimal: true })
      if (!parsed.ok) {
        setError(parsed.error)
        setPrimaryLine("")
        setSecondaryLine("")
        return
      }
      setError("")
      const core = mathParsedToConversion(trimmed, parsed.value, precision)
      setPrimaryLine(`${core.simplifiedLabel} = ${core.formattedDecimal}`)
      setSecondaryLine(core.isTerminating ? "" : (core.repeatingNote ?? ""))
      return
    }

    const n = parseFloat(trimmed.replace(/,/g, ""))
    if (isNaN(n) || n < 0) {
      setError(t("invalid_decimal"))
      setPrimaryLine("")
      setSecondaryLine("")
      return
    }
    setError("")
    const label = decimalToReducedLabel(n, 1000)
    const dec = formatDecimalTrim(n, precision)
    setPrimaryLine(`${dec} = ${label}`)
    setSecondaryLine("")
  }, [input, mode, precision, t])

  useEffect(() => {
    if (syncInputWithUrl) {
      return
    }

    setInput(initialInput || defaultInput)
  }, [defaultInput, initialInput, syncInputWithUrl])

  useEffect(() => {
    if (!syncInputWithUrl) {
      return
    }

    if (skipNextUrlStateSyncRef.current) {
      skipNextUrlStateSyncRef.current = false
      return
    }

    const nextInput = searchParams.get("input")?.trim() || defaultInput || initialInput
    if (nextInput !== latestInputRef.current) {
      setInput(nextInput)
    }
  }, [defaultInput, initialInput, searchParams, syncInputWithUrl])

  useEffect(() => {
    setPrecision(initialPrecision)
  }, [initialPrecision])

  useEffect(() => {
    if (!syncInputWithUrl) {
      return
    }

    const trimmed = input.trim()
    const currentUrlInput = searchParams.get("input")?.trim() ?? ""
    if (trimmed === currentUrlInput) {
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    if (trimmed) {
      nextParams.set("input", trimmed)
    } else {
      nextParams.delete("input")
    }

    skipNextUrlStateSyncRef.current = true
    const nextQuery = nextParams.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [input, pathname, router, searchParams, syncInputWithUrl])

  useEffect(() => {
    const id = setTimeout(run, 280)
    return () => clearTimeout(id)
  }, [run])

  const copyResult = async () => {
    if (!primaryLine) return
    try {
      await navigator.clipboard.writeText(primaryLine)
      setCopyMsg(t("copied"))
      setTimeout(() => setCopyMsg(""), 2000)
    } catch {
      setCopyMsg(t("copy_failed"))
    }
  }

  return (
    <div className="rounded-3xl border border-violet-500/30 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
      {!fractionOnly && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("fraction-to-decimal")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              mode === "fraction-to-decimal"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {t("mode_fraction_to_decimal")}
          </button>
          <button
            type="button"
            onClick={() => setMode("decimal-to-fraction")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              mode === "decimal-to-fraction"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {t("mode_decimal_to_fraction")}
          </button>
        </div>
      )}

      <label className="mb-2 block text-sm font-medium text-slate-400">{t("input_label")}</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "fraction-to-decimal" ? t("placeholder_fraction") : t("placeholder_decimal")
        }
        className="mb-4 w-full rounded-xl border border-slate-600 bg-slate-950/80 px-4 py-3 text-lg text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        autoComplete="off"
        spellCheck={false}
      />

      <div className="mb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {t("quick_examples_title")}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setInput(example)}
              className="rounded-full border border-violet-500/35 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 transition hover:border-violet-400 hover:bg-violet-500/20"
            >
              {example}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setInput("")}
            className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
          >
            {t("clear")}
          </button>
        </div>
      </div>

      {mode === "fraction-to-decimal" && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-slate-400">{t("precision_label")}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("precision_label")}>
            {[4, 6, 8, 10, 12].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrecision(p)}
                className={`min-w-[2.75rem] rounded-lg px-3 py-2 text-sm font-medium tabular-nums transition-colors ${
                  precision === p
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md ring-1 ring-violet-400/50"
                    : "border border-slate-600 bg-slate-800/80 text-slate-200 hover:border-slate-500 hover:bg-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {error}
        </p>
      )}

      <div className="min-h-[4rem] rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:min-h-[5rem] sm:p-6">
        {primaryLine ? (
          <>
            <p className="font-mono text-2xl font-semibold tracking-tight text-emerald-300 sm:text-3xl md:text-4xl">
              {primaryLine}
            </p>
            {secondaryLine ? <p className="mt-2 text-sm text-slate-400">{secondaryLine}</p> : null}
            <button
              type="button"
              onClick={copyResult}
              className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20"
            >
              {t("copy")}
            </button>
            {copyMsg ? <span className="ml-3 text-sm text-slate-400">{copyMsg}</span> : null}
          </>
        ) : (
          <p className="text-slate-500">{t("empty_hint")}</p>
        )}
      </div>
    </div>
  )
}
