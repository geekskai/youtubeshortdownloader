"use client"

import { Suspense, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"
import {
  featuredPseoFractions,
  getPseoPath,
  popularLandingQueries,
  popularMixedNumberQueries,
} from "@/data/pseo-fractions"
import FractionConverter from "./components/FractionConverter"
import { CONTENT_VERSION, LAST_MODIFIED_ISO } from "./seoData"

export default function FractionToDecimalPage() {
  const t = useTranslations("FractionToDecimal")
  const [chartQuery, setChartQuery] = useState("")
  const [chartPreset, setChartPreset] = useState<"all" | "common">("all")
  const [chartCopyMsg, setChartCopyMsg] = useState("")

  const faqItems = Array.from({ length: 8 }, (_, index) => ({
    question: t(`geo_sections.faq.question_${index + 1}`),
    answer: t(`geo_sections.faq.answer_${index + 1}`),
  }))
  const coreFacts = Array.from({ length: 4 }, (_, index) => ({
    label: t(`geo_sections.core_facts.fact_${index + 1}_label`),
    value: t(`geo_sections.core_facts.fact_${index + 1}_value`),
  }))
  const howSteps = Array.from({ length: 3 }, (_, index) => ({
    title: t(`geo_sections.how_steps.step_${index + 1}_title`),
    body: t(`geo_sections.how_steps.step_${index + 1}_body`),
  }))
  const limitationItems = Array.from({ length: 4 }, (_, index) =>
    t(`geo_sections.limitations.item_${index + 1}`)
  )
  const popularFractions = featuredPseoFractions
  const fractionFamilies = [
    [
      { numerator: 1, denominator: 6 },
      { numerator: 5, denominator: 6 },
    ],
    [
      { numerator: 1, denominator: 8 },
      { numerator: 3, denominator: 8 },
      { numerator: 5, denominator: 8 },
      { numerator: 7, denominator: 8 },
    ],
    [
      { numerator: 1, denominator: 16 },
      { numerator: 3, denominator: 16 },
      { numerator: 5, denominator: 16 },
      { numerator: 7, denominator: 16 },
      { numerator: 9, denominator: 16 },
      { numerator: 11, denominator: 16 },
      { numerator: 13, denominator: 16 },
      { numerator: 15, denominator: 16 },
    ],
  ]

  const fractionChartRows = useMemo(() => {
    const rows = [
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [1, 8],
      [3, 8],
      [5, 8],
      [7, 8],
      [1, 10],
      [3, 10],
      [7, 10],
      [9, 10],
      [1, 16],
      [3, 16],
      [5, 16],
      [7, 16],
      [9, 16],
      [11, 16],
      [13, 16],
      [15, 16],
    ].map(([numerator, denominator]) => {
      const decimal = (numerator / denominator).toFixed(6).replace(/\.?0+$/, "")
      return { numerator, denominator, decimal }
    })

    const query = chartQuery.trim().toLowerCase()
    if (!query) return rows
    return rows.filter(
      (row) =>
        `${row.numerator}/${row.denominator}`.includes(query) ||
        row.decimal.includes(query) ||
        `${row.numerator} ${row.denominator}`.includes(query)
    )
  }, [chartQuery])

  const groupedChartRows = useMemo(() => {
    const rowsToGroup =
      chartPreset === "common"
        ? fractionChartRows.filter((row) => [2, 4, 8, 16].includes(row.denominator))
        : fractionChartRows
    const map = new Map<number, typeof fractionChartRows>()
    for (const row of rowsToGroup) {
      const current = map.get(row.denominator) ?? []
      current.push(row)
      map.set(row.denominator, current)
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  }, [chartPreset, fractionChartRows])

  const copyChartDecimal = async (decimal: string) => {
    try {
      await navigator.clipboard.writeText(decimal)
      setChartCopyMsg(t("chart_copied"))
      setTimeout(() => setChartCopyMsg(""), 1500)
    } catch {
      setChartCopyMsg(t("converter.copy_failed"))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950/20 to-slate-900">
      <div className="relative px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("page_title")}
            </h1>
            <p className="mt-4 text-lg text-slate-300 sm:text-xl">{t("page_subtitle")}</p>

            <div className="mx-auto mt-8 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-left shadow-lg backdrop-blur-sm sm:p-6">
              <h2 className="mb-2 text-lg font-semibold text-violet-200">
                {t("geo_sections.quick_answer_title")}
              </h2>
              <p className="leading-relaxed text-slate-200">
                {t("geo_sections.quick_answer_content")}
              </p>
            </div>
          </header>

          <Suspense
            fallback={
              <div className="rounded-3xl border border-violet-500/30 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md sm:p-8" />
            }
          >
            <FractionConverter defaultInput="5/6" syncInputWithUrl />
          </Suspense>

          <section className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{t("chart_title")}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{t("chart_intro")}</p>
                <div className="mt-3 inline-flex rounded-xl border border-slate-700 bg-slate-950/60 p-1">
                  <button
                    type="button"
                    onClick={() => setChartPreset("all")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      chartPreset === "all"
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t("chart_filter_all")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartPreset("common")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      chartPreset === "common"
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t("chart_filter_common")}
                  </button>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  {t("chart_search_label")}
                </label>
                <input
                  value={chartQuery}
                  onChange={(event) => setChartQuery(event.target.value)}
                  placeholder={t("chart_search_placeholder")}
                  className="h-10 w-full rounded-xl border border-slate-600 bg-slate-950/80 px-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:w-72"
                />
              </div>
            </div>

            {fractionChartRows.length ? (
              <div className="mt-5 space-y-4">
                {groupedChartRows.map(([denominator, rows]) => (
                  <div
                    key={denominator}
                    className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-950/60"
                  >
                    <p className="border-b border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                      {t("chart_group_label", { denominator })}
                    </p>
                    <table className="w-full min-w-[420px] text-left text-sm">
                      <thead className="border-b border-slate-800 text-slate-400">
                        <tr>
                          <th className="px-4 py-2">{t("chart_col_fraction")}</th>
                          <th className="px-4 py-2">{t("chart_col_decimal")}</th>
                          <th className="px-4 py-2 text-right">{t("chart_col_action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr
                            key={`${row.numerator}/${row.denominator}`}
                            className="border-b border-slate-800/80"
                          >
                            <td className="px-4 py-3 font-medium text-white">
                              {row.numerator}/{row.denominator}
                            </td>
                            <td className="px-4 py-3 font-mono text-cyan-200">{row.decimal}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex flex-wrap justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => copyChartDecimal(row.decimal)}
                                  className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/20"
                                >
                                  {t("chart_copy_decimal")}
                                </button>
                                <Link
                                  href={`/tools/fraction-to-decimal?input=${encodeURIComponent(
                                    `${row.numerator}/${row.denominator}`
                                  )}`}
                                  className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                                >
                                  {t("chart_use_in_calculator")}
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                {chartCopyMsg ? <p className="text-xs text-emerald-200">{chartCopyMsg}</p> : null}
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
                {t("chart_empty")}
              </p>
            )}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-violet-500/20 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold text-white">{t("geo_sections.how_title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t("geo_sections.how_intro")}</p>
              <ol className="mt-5 space-y-4">
                {howSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold text-white">{t("geo_sections.core_facts_title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("geo_sections.core_facts_intro")}
              </p>
              <dl className="mt-5 grid gap-4">
                {coreFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                  >
                    <dt className="text-sm text-cyan-200">
                      <strong>{fact.label}</strong>
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-slate-300">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-violet-500/20 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{t("hub.popular_title")}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{t("hub.description")}</p>
                </div>
                <Link
                  href="/tools/as-a-decimal"
                  className="hidden rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20 sm:inline-flex"
                >
                  {t("hub.browse_all")}
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {popularFractions.map((fraction) => (
                  <Link
                    key={`${fraction.numerator}/${fraction.denominator}`}
                    href={getPseoPath(fraction.numerator, fraction.denominator)}
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-violet-400 hover:bg-slate-950"
                  >
                    <p className="text-lg font-semibold text-white">
                      {fraction.numerator}/{fraction.denominator}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {t("hub.card_cta", {
                        numerator: fraction.numerator,
                        denominator: fraction.denominator,
                      })}
                    </p>
                  </Link>
                ))}
              </div>

              <Link
                href="/tools/as-a-decimal"
                className="mt-5 inline-flex rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20 sm:hidden"
              >
                {t("hub.browse_all")}
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-600/40 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold text-white">{t("hub.family_title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t("hub.family_description")}</p>
              <div className="mt-5 space-y-4">
                {fractionFamilies.map((family, index) => (
                  <div key={index}>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {t("hub.family_label", { denominator: family[0].denominator })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {family.map((fraction) => (
                        <Link
                          key={`${fraction.numerator}/${fraction.denominator}`}
                          href={getPseoPath(fraction.numerator, fraction.denominator)}
                          className="rounded-full border border-slate-600 bg-slate-950/70 px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-white"
                        >
                          {fraction.numerator}/{fraction.denominator}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold text-white">
                {t("geo_sections.limitations_title")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("geo_sections.limitations_intro")}
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                {limitationItems.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold text-white">
                {t("geo_sections.data_sources_title")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("geo_sections.data_sources_intro")}{" "}
                <a
                  href="https://openstax.org/details/books/prealgebra-2e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  {t("geo_sections.data_sources_link_1_label")}
                </a>
                ,{" "}
                <a
                  href="https://www.khanacademy.org/math/arithmetic/fraction-arithmetic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  {t("geo_sections.data_sources_link_2_label")}
                </a>
                , and{" "}
                <a
                  href="https://www.nist.gov/pml/special-publication-811"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  {t("geo_sections.data_sources_link_3_label")}
                </a>
                . {t("geo_sections.data_sources_suffix")}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="text-xl font-bold text-white">{t("hub.search_patterns_title")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {t("hub.search_patterns_description")}
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-base font-semibold text-cyan-200">
                  {t("hub.questions_title")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {t("hub.questions_description")}
                </p>
                <div className="mt-4 grid gap-3">
                  {popularLandingQueries.slice(0, 8).map((query) => (
                    <Link
                      key={query.label}
                      href={getPseoPath(query.numerator, query.denominator)}
                      className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-cyan-400 hover:bg-slate-950"
                    >
                      <p className="text-sm font-medium text-white">{query.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {query.numerator}/{query.denominator}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-cyan-200">{t("hub.mixed_title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {t("hub.mixed_description")}
                </p>
                <div className="mt-4 grid gap-3">
                  {popularMixedNumberQueries.map((query) => (
                    <Link
                      key={query.label}
                      href={`/tools/fraction-to-decimal?input=${encodeURIComponent(query.input)}`}
                      className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-cyan-400 hover:bg-slate-950"
                    >
                      <p className="text-sm font-medium text-white">{query.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                        {t("hub.tool_card_cta", { input: query.input })}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-600/40 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-white">{t("geo_sections.faq_title")}</h2>
            <ul className="space-y-4">
              {faqItems.map((faq, i) => (
                <li key={i} className="rounded-xl border border-slate-600/30 bg-slate-950/50 p-4">
                  <p className="font-medium text-violet-200">{faq.question}</p>
                  <p className="mt-2 text-slate-300">{faq.answer}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center sm:p-8">
            <p className="text-slate-300">
              <strong className="text-slate-200">{t("geo_sections.last_updated_label")}</strong>{" "}
              {LAST_MODIFIED_ISO} ·{" "}
              <strong className="text-slate-200">{t("geo_sections.content_version_label")}</strong>{" "}
              {CONTENT_VERSION}
            </p>
            <Link
              href="/tools"
              className="mt-4 inline-block rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/20"
            >
              {t("geo_sections.browse_all_tools")}
            </Link>
            <p className="mt-6 text-sm text-slate-500">
              {t("related_inches_hint")}{" "}
              <Link
                href="/tools/convert-inches-to-decimal"
                className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
              >
                {t("related_inches_link")}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
