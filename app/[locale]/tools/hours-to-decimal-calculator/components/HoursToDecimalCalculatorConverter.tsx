"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  buildCsv,
  calculateMinutesProgress,
  formatHumanDuration,
  parseHourlyRate,
  parseSmartDuration,
  parseStandardDuration,
  roundHours,
  toFixedHours,
  type BatchRow,
  type InputMode,
  type RoundingMode,
} from "../utils"

const RATE_STORAGE_KEY = "hours-to-decimal-hourly-rate"
const ROUNDING_MODES: RoundingMode[] = ["none", "quarter", "tenth", "seven_minute_rule"]

export default function HoursToDecimalCalculatorConverter() {
  const t = useTranslations("HoursToDecimalCalculator.converter")

  const [inputMode, setInputMode] = useState<InputMode>("smart")
  const [smartInput, setSmartInput] = useState("1:30")
  const [hoursInput, setHoursInput] = useState("1")
  const [minutesInput, setMinutesInput] = useState("30")
  const [secondsInput, setSecondsInput] = useState("0")
  const [roundingMode, setRoundingMode] = useState<RoundingMode>("none")
  const [hourlyRateInput, setHourlyRateInput] = useState("")
  const [rows, setRows] = useState<BatchRow[]>([])
  const [copyMessage, setCopyMessage] = useState("")

  useEffect(() => {
    const savedRate = localStorage.getItem(RATE_STORAGE_KEY)
    if (savedRate) setHourlyRateInput(savedRate)
  }, [])

  useEffect(() => {
    localStorage.setItem(RATE_STORAGE_KEY, hourlyRateInput)
  }, [hourlyRateInput])

  const parseResult = useMemo(() => {
    return inputMode === "smart"
      ? parseSmartDuration(smartInput)
      : parseStandardDuration(hoursInput, minutesInput, secondsInput)
  }, [hoursInput, inputMode, minutesInput, secondsInput, smartInput])

  const hourlyRate = useMemo(() => parseHourlyRate(hourlyRateInput), [hourlyRateInput])

  const computed = useMemo(() => {
    if (!parseResult.ok) return null
    const exactHours = parseResult.value.totalSeconds / 3600
    const roundedHours = roundHours(parseResult.value.totalSeconds, roundingMode)
    const payout = hourlyRate == null ? null : roundedHours * hourlyRate
    return {
      exactHours,
      roundedHours,
      payout,
      normalizedLabel: parseResult.value.normalizedLabel,
      totalSeconds: parseResult.value.totalSeconds,
      humanSummary: formatHumanDuration(parseResult.value.totalSeconds),
      progress: calculateMinutesProgress(parseResult.value.totalSeconds),
    }
  }, [hourlyRate, parseResult, roundingMode])

  const grandTotals = useMemo(() => {
    return rows.reduce(
      (accumulator, row) => {
        accumulator.exactHours += row.exactHours
        accumulator.roundedHours += row.roundedHours
        accumulator.amount += row.totalAmount ?? 0
        return accumulator
      },
      { exactHours: 0, roundedHours: 0, amount: 0 }
    )
  }, [rows])

  const addCurrentRow = () => {
    if (!computed) return
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setRows((current) => [
      ...current,
      {
        id,
        sourceLabel: computed.normalizedLabel,
        exactHours: computed.exactHours,
        roundedHours: computed.roundedHours,
        totalAmount: computed.payout,
      },
    ])
  }

  const exportCsv = () => {
    if (!rows.length) return
    const csv = buildCsv(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "hours-to-decimal-batch.csv"
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const exportPdf = () => {
    if (!rows.length) return
    const popup = window.open("", "_blank", "width=900,height=700")
    if (!popup) return
    const rowsMarkup = rows
      .map(
        (row) =>
          `<tr><td>${row.sourceLabel}</td><td>${row.exactHours.toFixed(4)}</td><td>${row.roundedHours.toFixed(4)}</td><td>${row.totalAmount == null ? "-" : `$${row.totalAmount.toFixed(2)}`}</td></tr>`
      )
      .join("")
    popup.document.write(`
      <html><head><title>Hours to Decimal Batch</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f3f4f6; }
      </style>
      </head><body>
      <h1>Hours to Decimal Batch Export</h1>
      <table>
        <thead><tr><th>Entry</th><th>Exact Hours</th><th>Rounded Hours</th><th>Amount</th></tr></thead>
        <tbody>${rowsMarkup}</tbody>
      </table>
      </body></html>
    `)
    popup.document.close()
    popup.focus()
    popup.print()
  }

  const copyRounded = async () => {
    if (!computed) return
    try {
      await navigator.clipboard.writeText(toFixedHours(computed.roundedHours))
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1600)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  return (
    <section className="from-cyan-500/18 via-blue-500/8 to-purple-500/18 rounded-3xl border border-cyan-500/30 bg-gradient-to-br p-3.5 shadow-lg sm:p-4 md:p-6 lg:p-7">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3.5 py-1.5 sm:gap-2.5 sm:px-4 sm:py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-xl sm:text-2xl">⏱️</span>
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
                  onClick={() => setInputMode("smart")}
                  className={`rounded-xl border px-3 py-2.5 text-xs transition sm:py-2 md:text-sm ${
                    inputMode === "smart"
                      ? "border-cyan-300 bg-cyan-500/20 text-white"
                      : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                  }`}
                >
                  {t("mode_smart")}
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("standard")}
                  className={`rounded-xl border px-3 py-2.5 text-xs transition sm:py-2 md:text-sm ${
                    inputMode === "standard"
                      ? "border-cyan-300 bg-cyan-500/20 text-white"
                      : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                  }`}
                >
                  {t("mode_standard")}
                </button>
              </div>

              {inputMode === "smart" ? (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-cyan-100 md:mb-2">
                    {t("smart_label")}
                  </label>
                  <input
                    value={smartInput}
                    onChange={(event) => setSmartInput(event.target.value)}
                    placeholder={t("smart_placeholder")}
                    className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                    aria-label={t("smart_label")}
                  />
                  <p className="mt-1.5 text-xs leading-5 text-slate-400 md:mt-2 md:text-sm">
                    {t("smart_helper")}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="mb-2 text-sm font-semibold text-cyan-100">{t("standard_label")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      value={hoursInput}
                      onChange={(event) => setHoursInput(event.target.value)}
                      placeholder={t("hours_placeholder")}
                      className="h-11 rounded-xl border border-cyan-500/30 bg-slate-950/70 px-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none sm:px-3"
                      inputMode="decimal"
                    />
                    <input
                      value={minutesInput}
                      onChange={(event) => setMinutesInput(event.target.value)}
                      placeholder={t("minutes_placeholder")}
                      className="h-11 rounded-xl border border-cyan-500/30 bg-slate-950/70 px-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none sm:px-3"
                      inputMode="decimal"
                    />
                    <input
                      value={secondsInput}
                      onChange={(event) => setSecondsInput(event.target.value)}
                      placeholder={t("seconds_placeholder")}
                      className="h-11 rounded-xl border border-cyan-500/30 bg-slate-950/70 px-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none sm:px-3"
                      inputMode="decimal"
                    />
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("rounding_title")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROUNDING_MODES.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setRoundingMode(mode)}
                      className={`rounded-xl border px-3 py-2.5 text-xs transition sm:py-2 md:text-sm ${
                        roundingMode === mode
                          ? "border-cyan-300 bg-cyan-500/20 text-white"
                          : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                      }`}
                    >
                      {t(`rounding_${mode}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  {t("rate_label")}
                </label>
                <input
                  value={hourlyRateInput}
                  onChange={(event) => setHourlyRateInput(event.target.value)}
                  placeholder={t("rate_placeholder")}
                  className="h-11 w-full rounded-xl border border-emerald-500/30 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>

          <div className="from-emerald-500/12 to-teal-500/8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br p-3 md:p-5">
            <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200 sm:text-xs sm:tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
              {t("result_label")}
            </p>

            {computed ? (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("decimal_hours")}
                  </p>
                  <p className="mt-1.5 text-xl font-bold text-white sm:text-2xl md:text-4xl">
                    {toFixedHours(computed.roundedHours)} h
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-300 md:text-sm">
                    {t("exact_hours")}: {toFixedHours(computed.exactHours)} h
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 text-sm leading-6 text-slate-100 md:p-4 md:text-base">
                  {t("human_summary_prefix")} {computed.humanSummary}.
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("clock_feedback")}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <div
                      className="h-14 w-14 rounded-full border border-cyan-300/40 sm:h-16 sm:w-16"
                      style={{
                        background: `conic-gradient(rgba(34,211,238,0.85) ${computed.progress * 360}deg, rgba(15,23,42,0.8) 0deg)`,
                      }}
                    />
                    <p className="text-xs leading-5 text-slate-300 md:text-sm">
                      {t("clock_feedback_note")}
                    </p>
                  </div>
                </div>

                {computed.payout != null ? (
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200 md:text-xs md:tracking-[0.16em]">
                      {t("payout_label")}
                    </p>
                    <p className="mt-1.5 text-lg font-bold text-emerald-100 sm:text-xl md:text-2xl">
                      ${computed.payout.toFixed(2)}
                    </p>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={copyRounded}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 md:text-sm"
                  >
                    {t("copy")}
                  </button>
                  <button
                    type="button"
                    onClick={addCurrentRow}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20 md:text-sm"
                  >
                    {t("add_row")}
                  </button>
                </div>

                {copyMessage ? (
                  <p className="text-xs leading-5 text-slate-300 md:text-sm">{copyMessage}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-300 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                {t(parseResult.ok ? "parse_success" : "parse_error")}
              </div>
            )}
          </div>
        </div>

        <div className="from-purple-500/12 to-pink-500/8 rounded-2xl border border-purple-500/25 bg-gradient-to-br p-3.5 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold text-purple-100 sm:text-lg md:text-xl">
              {t("batch_title")}
            </h3>
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <button
                type="button"
                onClick={exportCsv}
                disabled={!rows.length}
                className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {t("export_csv")}
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={!rows.length}
                className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {t("export_pdf")}
              </button>
            </div>
          </div>

          {rows.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs text-slate-200 md:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-2 py-2">{t("table_entry")}</th>
                    <th className="px-2 py-2">{t("table_exact")}</th>
                    <th className="px-2 py-2">{t("table_rounded")}</th>
                    <th className="px-2 py-2">{t("table_amount")}</th>
                    <th className="px-2 py-2">{t("table_action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-white/5">
                      <td className="px-2 py-2">{row.sourceLabel}</td>
                      <td className="px-2 py-2">{row.exactHours.toFixed(4)}</td>
                      <td className="px-2 py-2">{row.roundedHours.toFixed(4)}</td>
                      <td className="px-2 py-2">
                        {row.totalAmount == null ? "-" : `$${row.totalAmount.toFixed(2)}`}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            setRows((current) => current.filter((item) => item.id !== row.id))
                          }
                          className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-100 hover:bg-rose-500/20 md:text-xs"
                        >
                          {t("remove")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="text-cyan-100">
                    <td className="px-2 py-2 font-semibold">{t("grand_total")}</td>
                    <td className="px-2 py-2 font-semibold">{grandTotals.exactHours.toFixed(4)}</td>
                    <td className="px-2 py-2 font-semibold">
                      {grandTotals.roundedHours.toFixed(4)}
                    </td>
                    <td className="px-2 py-2 font-semibold">
                      {hourlyRate != null ? `$${grandTotals.amount.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => setRows([])}
                        className="rounded-lg border border-white/20 bg-slate-900/50 px-2.5 py-1 text-[11px] text-slate-100 hover:bg-slate-800 md:text-xs"
                      >
                        {t("clear_rows")}
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-300">{t("batch_empty")}</p>
          )}
        </div>
      </div>
    </section>
  )
}
