"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { buildQuickFractions, convertInchesToDecimal } from "../utils"

const QUICK_FRACTIONS = buildQuickFractions()
const AUTO_COPY_KEY = "inches-to-decimals-auto-copy"

export default function InchesToDecimalsConverter() {
  const t = useTranslations("InchesToDecimals.converter")
  const [input, setInput] = useState("5/8")
  const [precision, setPrecision] = useState(6)
  const [autoCopy, setAutoCopy] = useState(false)
  const [copyMessage, setCopyMessage] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem(AUTO_COPY_KEY)
    if (saved === "1") setAutoCopy(true)
  }, [])

  useEffect(() => {
    localStorage.setItem(AUTO_COPY_KEY, autoCopy ? "1" : "0")
  }, [autoCopy])

  const result = useMemo(() => convertInchesToDecimal(input, precision), [input, precision])

  useEffect(() => {
    if (!autoCopy || !result.ok) return
    navigator.clipboard
      .writeText(result.value.decimalLabel)
      .then(() => setCopyMessage(t("auto_copied")))
      .catch(() => setCopyMessage(t("copy_failed")))
  }, [autoCopy, result, t])

  const copyDecimal = async () => {
    if (!result.ok) return
    try {
      await navigator.clipboard.writeText(result.value.decimalLabel)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1500)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  const copyMillimeters = async () => {
    if (!result.ok) return
    try {
      await navigator.clipboard.writeText(result.value.millimetersLabel)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1500)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  return (
    <section className="from-cyan-500/18 via-blue-500/8 to-purple-500/18 rounded-3xl border border-cyan-500/30 bg-gradient-to-br p-3.5 shadow-lg sm:p-4 md:p-6 lg:p-7">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3.5 py-1.5 sm:gap-2.5 sm:px-4 sm:py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-xl sm:text-2xl">📏</span>
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
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-cyan-100 md:mb-2">
                  {t("input_label")}
                </label>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("placeholder")}
                  className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                />
                <p className="mt-1.5 text-xs leading-5 text-slate-400 md:mt-2 md:text-sm">
                  {t("helper")}
                </p>
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

              <label className="flex items-center gap-2 text-xs text-slate-300 md:text-sm">
                <input
                  type="checkbox"
                  checked={autoCopy}
                  onChange={(event) => setAutoCopy(event.target.checked)}
                  className="h-4 w-4 rounded border-cyan-500/50 bg-slate-950/80"
                />
                {t("auto_copy")}
              </label>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("quick_grid_title")}</p>
                <div className="max-h-44 overflow-y-auto rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-2">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {QUICK_FRACTIONS.map((fraction) => (
                      <button
                        key={fraction}
                        type="button"
                        onClick={() => setInput(fraction)}
                        className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-2 py-1.5 text-[11px] text-cyan-100 transition hover:border-cyan-400 hover:text-white sm:py-1"
                      >
                        {fraction}
                      </button>
                    ))}
                  </div>
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("decimal_inch_label")}
                  </p>
                  <p className="mt-1 text-xl font-bold text-white sm:text-2xl md:text-4xl">
                    {result.value.decimalLabel}"
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("metric_label")}
                  </p>
                  <p className="mt-1 text-base text-slate-100 sm:text-lg md:text-2xl">
                    {result.value.millimetersLabel} mm
                  </p>
                </div>

                {result.value.isNonStandardDenominator ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs leading-5 text-amber-100 md:px-4 md:py-3">
                    {t("non_standard_warning")}
                  </div>
                ) : null}

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={copyDecimal}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800"
                  >
                    {t("copy_decimal")}
                  </button>
                  <button
                    type="button"
                    onClick={copyMillimeters}
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                  >
                    {t("copy_mm")}
                  </button>
                </div>
                {copyMessage ? (
                  <p className="text-xs leading-5 text-slate-300">{copyMessage}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-300 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                {t(result.error)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
