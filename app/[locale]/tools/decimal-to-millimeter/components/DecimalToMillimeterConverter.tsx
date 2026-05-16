"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import {
  convertValue,
  formatSwapInput,
  swapDirection,
  type ConversionDirection,
  type PrecisionMode,
} from "../utils"

const PRECISION_OPTIONS: PrecisionMode[] = ["standard", "precision", "rounded"]
const HISTORY_STORAGE_KEY = "decimal-to-millimeter-history-v1"
const MAX_HISTORY_ITEMS = 8

interface RecentConversionItem {
  signature: string
  input: string
  direction: ConversionDirection
  precisionMode: PrecisionMode
  output: string
}

const EXAMPLES: Record<ConversionDirection, string[]> = {
  in_to_mm: ["0.125", "0.250", "0.375", "0.625", "5/8", "1 1/4"],
  mm_to_in: ["3.175", "6.35", "12.7", "25.4", "50.8", "101.6"],
}

export default function DecimalToMillimeterConverter() {
  const t = useTranslations("DecimalToMillimeter.converter")
  const [input, setInput] = useState("0.5")
  const [direction, setDirection] = useState<ConversionDirection>("in_to_mm")
  const [precisionMode, setPrecisionMode] = useState<PrecisionMode>("standard")
  const [copyMessage, setCopyMessage] = useState("")
  const [history, setHistory] = useState<RecentConversionItem[]>([])
  const [hasInteracted, setHasInteracted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as RecentConversionItem[]
      if (!Array.isArray(parsed)) return
      setHistory(parsed.slice(0, MAX_HISTORY_ITEMS))
    } catch {
      // ignore malformed local storage payload
    }
  }, [])

  const result = useMemo(() => convertValue(input, direction, precisionMode), [input, direction, precisionMode])

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (!hasInteracted || !result.ok) return
    const signature = `${result.value.normalizedInput}|${direction}|${precisionMode}|${result.value.outputLabel}`
    const item: RecentConversionItem = {
      signature,
      input: result.value.normalizedInput,
      direction,
      precisionMode,
      output: result.value.outputLabel,
    }

    const timer = setTimeout(() => {
      setHistory((prev) => {
        if (prev[0]?.signature === signature) return prev
        const deduped = prev.filter((row) => row.signature !== signature)
        return [item, ...deduped].slice(0, MAX_HISTORY_ITEMS)
      })
    }, 450)

    return () => clearTimeout(timer)
  }, [direction, hasInteracted, precisionMode, result])

  const handleSwap = () => {
    setHasInteracted(true)
    if (result.ok) {
      setInput(formatSwapInput(result.value))
    }
    setDirection((prev) => swapDirection(prev))
  }

  const handleCopy = async () => {
    if (!result.ok) return

    try {
      await navigator.clipboard.writeText(result.value.outputLabel)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1800)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  return (
    <section className="from-cyan-500/18 via-blue-500/8 to-purple-500/18 rounded-3xl border border-cyan-500/30 bg-gradient-to-br p-3.5 shadow-lg sm:p-4 md:p-6 lg:p-7">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3.5 py-1.5 sm:gap-2.5 sm:px-4 sm:py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-xl sm:text-2xl">📐</span>
            <h2 className="bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
              {t("title")}
            </h2>
          </div>
          <p className="mx-auto mt-2.5 max-w-3xl text-xs leading-6 text-slate-300 sm:mt-3 sm:text-sm md:mt-4 md:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-3.5 md:items-stretch lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-5">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-3 md:p-5">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-cyan-100">{t("input_label")}</label>
                <button
                  type="button"
                  onClick={handleSwap}
                  className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20 md:text-sm"
                >
                  {t("swap")}
                </button>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => {
                    setHasInteracted(true)
                    setInput(event.target.value)
                  }}
                  placeholder={
                    direction === "in_to_mm" ? t("placeholder_inches") : t("placeholder_mm")
                  }
                  className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 pr-14 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                  inputMode="decimal"
                  aria-label={t("input_label")}
                />
                {input ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHasInteracted(true)
                      setInput("")
                    }}
                    className="absolute right-2 top-1/2 h-8 -translate-y-1/2 rounded-lg border border-white/15 bg-slate-900/50 px-2.5 text-xs leading-5 text-slate-200 transition hover:bg-slate-800"
                    aria-label={t("clear")}
                  >
                    {t("clear")}
                  </button>
                ) : null}
              </div>

              <p className="text-xs leading-5 text-slate-400 md:text-sm">
                {direction === "in_to_mm" ? t("helper_inches_to_mm") : t("helper_mm_to_inches")}
              </p>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("examples_title")}</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES[direction].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setHasInteracted(true)
                        setInput(example)
                      }}
                      className="rounded-full border border-cyan-500/30 bg-slate-950/60 px-3 py-2 text-xs leading-5 text-cyan-100 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white sm:px-3.5 md:px-4 md:py-2.5 md:text-sm"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("precision_label")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {PRECISION_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPrecisionMode(option)}
                      className={`rounded-xl border px-3 py-2.5 text-xs transition sm:py-2 md:text-sm ${
                        precisionMode === option
                          ? "border-cyan-300 bg-cyan-500/20 text-white"
                          : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                      }`}
                    >
                      {t(`precision_${option}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="from-emerald-500/12 to-teal-500/8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br p-3 md:p-5">
            <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200 sm:text-xs sm:tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
              {t("result_label")}
            </p>

            {result.ok ? (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("output_value_label")}
                  </p>
                  <p className="mt-1.5 text-base font-bold leading-6 text-white sm:text-lg md:text-2xl">
                    {result.value.outputLabel}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("inches_label")}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-100 md:text-base">
                      {result.value.inches.toFixed(6)} in
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("mm_label")}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-100 md:text-base">
                      {result.value.millimeters.toFixed(6)} mm
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("ruler_title")}
                  </p>
                  <div className="mt-3 h-4 rounded-full bg-slate-800/90 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${result.value.rulerPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-300 md:text-sm">
                    {t(result.value.rulerHintKey)}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 sm:w-auto sm:py-3"
                  >
                    {t("copy")}
                  </button>
                  {copyMessage ? (
                    <span className="text-xs leading-5 text-slate-300 md:text-sm">
                      {copyMessage}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-300 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                {t(result.error)}
              </div>
            )}
          </div>
        </div>

        <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-3 md:p-5">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-sm font-semibold text-cyan-100 md:text-base">{t("history_title")}</p>
            <button
              type="button"
              onClick={() => {
                setHistory([])
                setCopyMessage("")
              }}
              className="rounded-xl border border-white/15 bg-slate-900/40 px-3.5 py-2 text-xs text-slate-200 transition hover:bg-slate-800 sm:w-auto"
            >
              {t("history_clear")}
            </button>
          </div>

          {history.length === 0 ? (
            <p className="mt-2.5 text-xs leading-5 text-slate-400 md:mt-3 md:text-sm">
              {t("history_empty")}
            </p>
          ) : (
            <div className="mt-2.5 grid gap-2 sm:mt-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item) => (
                <button
                  key={item.signature}
                  type="button"
                  onClick={() => {
                    setHasInteracted(true)
                    setDirection(item.direction)
                    setPrecisionMode(item.precisionMode)
                    setInput(item.input)
                  }}
                  className="flex flex-col items-start rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-left transition hover:border-cyan-400/40 md:p-3.5"
                >
                  <p className="text-xs leading-5 text-slate-200 md:text-sm">
                    {item.direction === "in_to_mm"
                      ? t("history_label_in_to_mm")
                      : t("history_label_mm_to_in")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400 md:text-sm">
                    {item.input} → {item.output}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
