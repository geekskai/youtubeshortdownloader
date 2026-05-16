"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  convertBatchLines,
  formatDecimal,
  formatReverseDuration,
  fromDecimalByBase,
  parseFlexibleTimeInput,
  toDecimalByBase,
  type ConverterDirection,
  type TargetBase,
} from "../utils"

const BASE_OPTIONS: TargetBase[] = ["hours", "minutes", "days"]

export default function TimeToDecimalConverter() {
  const t = useTranslations("TimeToDecimalConverter.converter")
  const [direction, setDirection] = useState<ConverterDirection>("time_to_decimal")
  const [timeInput, setTimeInput] = useState("1:30")
  const [decimalInput, setDecimalInput] = useState("1.5")
  const [targetBase, setTargetBase] = useState<TargetBase>("hours")
  const [precision, setPrecision] = useState(4)
  const [excelFriendly, setExcelFriendly] = useState(true)
  const [copyMessage, setCopyMessage] = useState("")
  const [batchInput, setBatchInput] = useState("1:30\n00:90:00\n2 days 6 hours\n2:30 PM")

  const parsedTime = useMemo(() => parseFlexibleTimeInput(timeInput), [timeInput])

  const forwardResult = useMemo(() => {
    if (!parsedTime.ok) return null
    const decimal = toDecimalByBase(parsedTime.value.totalSeconds, targetBase)
    const formatted = formatDecimal(decimal, precision)
    return {
      decimal,
      label: excelFriendly ? formatted : `${formatted} ${t(`base_unit_${targetBase}`)}`,
      normalized: parsedTime.value.normalizedLabel,
      chips: parsedTime.value.chips,
    }
  }, [excelFriendly, parsedTime, precision, t, targetBase])

  const reverseResult = useMemo(() => {
    const value = Number.parseFloat(decimalInput.trim())
    if (!decimalInput.trim()) return { ok: false as const, error: "empty" as const }
    if (!Number.isFinite(value)) return { ok: false as const, error: "invalid" as const }
    if (value < 0) return { ok: false as const, error: "negative_not_supported" as const }
    const totalSeconds = fromDecimalByBase(value, targetBase)
    if (totalSeconds == null) return { ok: false as const, error: "invalid" as const }
    return {
      ok: true as const,
      value: {
        normalized: formatReverseDuration(totalSeconds),
      },
    }
  }, [decimalInput, targetBase])

  const outputText =
    direction === "time_to_decimal"
      ? (forwardResult?.label ?? "")
      : reverseResult.ok
        ? reverseResult.value.normalized
        : ""
  const parsedErrorKey = parsedTime.ok ? "invalid" : parsedTime.error
  const batchRows = useMemo(
    () => convertBatchLines(batchInput, targetBase, precision),
    [batchInput, precision, targetBase]
  )

  const copyResult = async () => {
    if (!outputText) return
    try {
      await navigator.clipboard.writeText(outputText)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1600)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  const toggleDirection = () => {
    setDirection((current) =>
      current === "time_to_decimal" ? "decimal_to_time" : "time_to_decimal"
    )
  }

  const copyBatchCsv = async () => {
    if (!batchRows.length) return
    const header = `source,normalized,decimal_${targetBase}`
    const lines = batchRows.map((row) => {
      const decimalValue = row.ok ? row.decimal : row.error ?? "invalid"
      return `"${row.source.replaceAll('"', '""')}","${row.normalized.replaceAll('"', '""')}","${decimalValue}"`
    })

    try {
      await navigator.clipboard.writeText([header, ...lines].join("\n"))
      setCopyMessage(t("batch_copied"))
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
            <span className="text-xl sm:text-2xl">⏳</span>
            <h2 className="bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
              {t("title")}
            </h2>
          </div>
          <p className="mx-auto mt-2.5 max-w-5xl text-xs leading-6 text-slate-300 sm:mt-3 sm:text-sm md:mt-4 md:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-3.5 md:items-stretch lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-5">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-3 md:p-5">
            <div className="flex h-full flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection("time_to_decimal")}
                  className={`rounded-xl border px-3 py-2.5 text-xs transition sm:py-2 md:text-sm ${
                    direction === "time_to_decimal"
                      ? "border-cyan-300 bg-cyan-500/20 text-white"
                      : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                  }`}
                >
                  {t("mode_time_to_decimal")}
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("decimal_to_time")}
                  className={`rounded-xl border px-3 py-2.5 text-xs transition sm:py-2 md:text-sm ${
                    direction === "decimal_to_time"
                      ? "border-cyan-300 bg-cyan-500/20 text-white"
                      : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                  }`}
                >
                  {t("mode_decimal_to_time")}
                </button>
              </div>

              <button
                type="button"
                onClick={toggleDirection}
                className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-100 transition hover:bg-purple-500/20 md:text-sm"
              >
                {t("swap")}
              </button>

              {direction === "time_to_decimal" ? (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-cyan-100 md:mb-2">
                    {t("time_input_label")}
                  </label>
                  <input
                    value={timeInput}
                    onChange={(event) => setTimeInput(event.target.value)}
                    placeholder={t("time_placeholder")}
                    className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                  />
                  <p className="mt-1.5 text-xs leading-5 text-slate-400 md:mt-2 md:text-sm">
                    {t("time_helper")}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-cyan-100 md:mb-2">
                    {t("decimal_input_label")}
                  </label>
                  <input
                    value={decimalInput}
                    onChange={(event) => setDecimalInput(event.target.value)}
                    placeholder={t("decimal_placeholder")}
                    className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                    inputMode="decimal"
                  />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-200">
                    {t("target_base_label")}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {BASE_OPTIONS.map((base) => (
                      <button
                        key={base}
                        type="button"
                        onClick={() => setTargetBase(base)}
                        className={`rounded-xl border px-2.5 py-2.5 text-xs transition sm:py-2 ${
                          targetBase === base
                            ? "border-cyan-300 bg-cyan-500/20 text-white"
                            : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                        }`}
                      >
                        {t(`base_${base}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    {t("precision_label")}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={6}
                    value={precision}
                    onChange={(event) => setPrecision(Number.parseInt(event.target.value, 10))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {t("precision_value")} {precision}
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 md:text-sm">
                <input
                  type="checkbox"
                  checked={excelFriendly}
                  onChange={(event) => setExcelFriendly(event.target.checked)}
                  className="h-4 w-4 rounded border-cyan-500/50 bg-slate-950/80"
                />
                {t("excel_friendly")}
              </label>
            </div>
          </div>

          <div className="from-emerald-500/12 to-teal-500/8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br p-3 md:p-5">
            <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200 sm:text-xs sm:tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
              {t("result_label")}
            </p>

            {direction === "time_to_decimal" ? (
              forwardResult ? (
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("output_label")}
                    </p>
                    <p className="mt-1.5 text-xl font-bold text-white sm:text-2xl md:text-4xl">
                      {forwardResult.label}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("interpretation_label")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {forwardResult.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-300 md:text-sm">
                      {t("normalized_label")} {forwardResult.normalized}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyResult}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 md:text-sm"
                  >
                    {t("copy")}
                  </button>
                  {copyMessage ? (
                    <p className="text-xs leading-5 text-slate-300 md:text-sm">{copyMessage}</p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-300 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                  {t(parsedErrorKey)}
                </div>
              )
            ) : reverseResult.ok ? (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("reverse_output_label")}
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-white sm:text-2xl md:text-4xl">
                    {reverseResult.value.normalized}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyResult}
                  className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 md:text-sm"
                >
                  {t("copy")}
                </button>
                {copyMessage ? (
                  <p className="text-xs leading-5 text-slate-300 md:text-sm">{copyMessage}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-300 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                {t(reverseResult.error)}
              </div>
            )}
          </div>
        </div>

        <div className="from-purple-500/12 to-pink-500/8 rounded-2xl border border-purple-500/25 bg-gradient-to-br p-3.5 md:p-5">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold text-purple-100 sm:text-lg md:text-xl">
              {t("batch_title")}
            </h3>
            <button
              type="button"
              onClick={copyBatchCsv}
              disabled={!batchRows.length}
              className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              {t("batch_copy_csv")}
            </button>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-300 md:text-sm">
            {t("batch_description")}
          </p>
          <textarea
            value={batchInput}
            onChange={(event) => setBatchInput(event.target.value)}
            placeholder={t("batch_placeholder")}
            className="mt-3 min-h-[7.5rem] w-full rounded-2xl border border-purple-500/25 bg-slate-950/60 p-3 text-xs leading-6 text-white placeholder-slate-500 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 md:text-sm"
          />

          {batchRows.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs text-slate-200 md:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-2 py-2">{t("batch_col_input")}</th>
                    <th className="px-2 py-2">{t("batch_col_normalized")}</th>
                    <th className="px-2 py-2">{t("batch_col_decimal")}</th>
                  </tr>
                </thead>
                <tbody>
                  {batchRows.map((row, index) => (
                    <tr key={`${row.source}-${index}`} className="border-b border-white/5">
                      <td className="px-2 py-2">{row.source}</td>
                      <td className="px-2 py-2">{row.normalized}</td>
                      <td className={`px-2 py-2 ${row.ok ? "text-cyan-100" : "text-rose-200"}`}>
                        {row.ok ? row.decimal : t(row.error ?? "invalid")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-xs leading-5 text-slate-400 md:text-sm">{t("batch_empty")}</p>
          )}
        </div>
      </div>
    </section>
  )
}
