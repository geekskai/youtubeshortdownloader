"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  getSupportedGaugeList,
  getGaugeConversion,
  getGaugeLookupRows,
  parseGaugeInput,
  type GaugeStandard,
} from "../utils"

const STANDARD_OPTIONS: GaugeStandard[] = [
  "sheet_steel",
  "galvanized_steel",
  "stainless_steel",
  "aluminum_non_ferrous",
  "wire_awg",
]

const QUICK_GAUGES = getSupportedGaugeList()
const QUICK_GAUGE_GROUPS = [
  { id: "3-10", label: "3-10", values: QUICK_GAUGES.filter((value) => value >= 3 && value <= 10) },
  { id: "11-20", label: "11-20", values: QUICK_GAUGES.filter((value) => value >= 11 && value <= 20) },
  { id: "21-30", label: "21-30", values: QUICK_GAUGES.filter((value) => value >= 21 && value <= 30) },
].filter((group) => group.values.length > 0)

export default function GaugeToDecimalConverter() {
  const t = useTranslations("GaugeToDecimal.converter")
  const [searchInput, setSearchInput] = useState("16 ga")
  const [standard, setStandard] = useState<GaugeStandard>("sheet_steel")
  const [lookupInput, setLookupInput] = useState("")
  const [copyMessage, setCopyMessage] = useState("")

  const result = useMemo(() => getGaugeConversion(searchInput, standard), [searchInput, standard])
  const lookupData = useMemo(() => getGaugeLookupRows(standard, lookupInput), [lookupInput, standard])
  const activeGauge = useMemo(() => parseGaugeInput(searchInput), [searchInput])

  const copyText = async (text: string, successText: string) => {
    try {
      await navigator.clipboard.writeText(text.trim())
      setCopyMessage(successText)
      setTimeout(() => setCopyMessage(""), 2000)
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
                  {t("search_label")}
                </label>
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={t("search_placeholder")}
                  className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                  inputMode="text"
                  aria-label={t("search_label")}
                />
                <p className="mt-1.5 text-xs leading-5 text-slate-400 md:mt-2 md:text-sm">
                  {t("search_helper")}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-cyan-100 md:mb-2">
                  {t("standard_label")}
                </label>
                <select
                  value={standard}
                  onChange={(event) => setStandard(event.target.value as GaugeStandard)}
                  className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/80 px-3.5 text-sm text-white transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                  aria-label={t("standard_label")}
                >
                  {STANDARD_OPTIONS.map((item) => (
                    <option key={item} value={item} className="bg-slate-900">
                      {t(`standards.${item}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200 md:mb-3">
                  {t("quick_search_title")}
                </p>
                <div className="space-y-2">
                  {QUICK_GAUGE_GROUPS.map((group) => (
                    <div key={group.id} className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {group.label}
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {group.values.map((quick) => (
                          <button
                            key={quick}
                            type="button"
                            onClick={() => setSearchInput(`${quick} ga`)}
                            aria-pressed={activeGauge === quick}
                            className={`shrink-0 rounded-full border px-2.5 py-1.5 text-xs transition-all duration-300 sm:px-3 sm:py-1 md:text-sm ${
                              activeGauge === quick
                                ? "border-cyan-300 bg-cyan-500/20 text-white"
                                : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white"
                            }`}
                          >
                            {quick} ga
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="from-emerald-500/12 to-teal-500/8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br p-3 md:p-5">
            <div className="flex items-center justify-between gap-3 pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200 sm:text-xs sm:tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
                {t("result_label")}
              </p>
            </div>

            {result.ok ? (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("gauge_label")}
                  </p>
                  <p className="mt-1.5 text-sm font-bold leading-6 text-white md:text-base">
                    #{result.value.gauge} GA ({t(`standards.${standard}`)})
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("inches_label")}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-100 md:text-base">
                      {result.value.inchesLabel}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("millimeters_label")}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-100 md:text-base">
                      {result.value.millimetersLabel}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("tolerance_label")}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-100 md:text-base">
                    {result.value.toleranceLabel}
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-slate-300 md:text-sm">
                    {t("tolerance_range_label")}: {result.value.toleranceRangeInchesLabel}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300 md:text-sm">
                    {result.value.toleranceRangeMmLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("visual_hint_label")}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-100 md:text-base">
                    {t(result.value.visualReference)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                    {t("compare_label")}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {result.value.gaugeMatches.map((row) => (
                      <p key={row.standard} className="text-xs leading-5 text-slate-200 md:text-sm">
                        {t(`standards.${row.standard}`)}: {row.inches.toFixed(4)}" /{" "}
                        {row.millimeters.toFixed(3)} mm
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() =>
                      copyText(result.value.inchesLabel, `${t("copied")}: ${t("inches_label")}`)
                    }
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 md:text-sm"
                  >
                    {t("copy_inches")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        result.value.millimetersLabel,
                        `${t("copied")}: ${t("millimeters_label")}`
                      )
                    }
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800 md:text-sm"
                  >
                    {t("copy_mm")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        [
                          `Gauge: ${result.value.gauge}`,
                          `${t(`standards.${result.value.standard}`)}: ${result.value.inchesLabel} (${result.value.millimetersLabel})`,
                          `${t("tolerance_label")}: ${result.value.toleranceLabel}`,
                          `${t("tolerance_range_label")}: ${result.value.toleranceRangeInchesLabel} | ${result.value.toleranceRangeMmLabel}`,
                        ].join("\n"),
                        t("copied")
                      )
                    }
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 md:text-sm"
                  >
                    {t("copy_all")}
                  </button>
                </div>

                {copyMessage ? (
                  <p className="text-xs leading-5 text-slate-300 md:text-sm">{copyMessage}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-300 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                {t(result.error)}
              </div>
            )}
          </div>
        </div>

        <details
          className="group rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-3 md:p-5"
          open
        >
          <summary className="cursor-pointer list-none pr-5 text-sm font-semibold leading-6 text-cyan-100 marker:content-none md:text-base">
            {t("lookup_title")}
          </summary>

          <div className="mt-2.5 space-y-3 sm:mt-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300 md:mb-2 md:text-sm">
                {t("lookup_search_label")}
              </label>
              <input
                value={lookupInput}
                onChange={(event) => setLookupInput(event.target.value)}
                placeholder={t("lookup_search_placeholder")}
                className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:px-4"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <div className="grid min-w-[34rem] grid-cols-[0.9fr_1fr_1fr_auto] gap-2 bg-slate-900/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300 md:px-4 md:text-xs">
                <span>{t("lookup_gauge_col")}</span>
                <span>{t("lookup_inch_col")}</span>
                <span>{t("lookup_mm_col")}</span>
                <span>{t("lookup_action_col")}</span>
              </div>
              <div className="max-h-64 min-w-[34rem] overflow-y-auto bg-slate-950/50">
                {lookupData.rows.map((row) => (
                  <div
                    key={row.gauge}
                    className="grid grid-cols-[0.9fr_1fr_1fr_auto] items-center gap-2 border-t border-white/5 px-3 py-2.5 text-xs text-slate-100 md:px-4 md:text-sm"
                  >
                    <span>#{row.gauge}</span>
                    <span>{row.inches.toFixed(4)}"</span>
                    <span>{row.millimeters.toFixed(3)} mm</span>
                    <button
                      type="button"
                      onClick={() => setSearchInput(`${row.gauge} ga`)}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-100 transition hover:bg-cyan-500/20 md:text-xs"
                    >
                      {t("lookup_use")}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {lookupData.queryGauge !== null && lookupData.rows.length !== 1 ? (
              <p className="text-xs leading-5 text-amber-200 md:text-sm">{t("lookup_not_found")}</p>
            ) : null}
          </div>
        </details>
      </div>
    </section>
  )
}
