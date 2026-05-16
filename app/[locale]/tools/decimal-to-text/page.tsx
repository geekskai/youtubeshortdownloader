"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/app/i18n/navigation"
import DecimalToTextConverter from "./components/DecimalToTextConverter"
import { CONTENT_VERSION, LAST_MODIFIED_ISO } from "./seoData"

export default function DecimalToTextPage() {
  const t = useTranslations("DecimalToText")

  const coreFacts = Array.from({ length: 4 }, (_, index) => ({
    label: t(`geo_sections.core_facts.fact_${index + 1}_label`),
    value: t(`geo_sections.core_facts.fact_${index + 1}_value`),
  }))

  const howSteps = Array.from({ length: 3 }, (_, index) => ({
    title: t(`geo_sections.how_steps.step_${index + 1}_title`),
    body: t(`geo_sections.how_steps.step_${index + 1}_body`),
  }))

  const useCases = Array.from({ length: 4 }, (_, index) => ({
    title: t(`geo_sections.use_cases.case_${index + 1}_title`),
    body: t(`geo_sections.use_cases.case_${index + 1}_body`),
  }))

  const limitations = Array.from({ length: 4 }, (_, index) =>
    t(`geo_sections.limitations.item_${index + 1}`)
  )

  const faqItems = Array.from({ length: 8 }, (_, index) => ({
    question: t(`geo_sections.faq.question_${index + 1}`),
    answer: t(`geo_sections.faq.answer_${index + 1}`),
  }))

  return (
    <div
      className="min-h-screen bg-slate-950"
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, rgba(34,211,238,0.12), transparent 26rem), radial-gradient(circle at bottom left, rgba(168,85,247,0.14), transparent 24rem), linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(2,6,23,1) 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl space-y-5 px-3 py-5 sm:px-4 sm:py-6 md:space-y-7 md:px-6 md:py-8 lg:space-y-8 lg:px-8 lg:py-10">
        <header className="rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 p-4 text-center shadow-xl sm:p-5 md:p-7 lg:p-8">
          <div className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-3.5 py-1.5 sm:gap-2.5 sm:px-4 sm:py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-xl sm:text-2xl">✍️</span>
            <h1 className="bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-lg font-bold leading-tight text-transparent sm:text-xl md:text-4xl lg:text-5xl">
              {t("page_title")}
            </h1>
          </div>

          <p className="mx-auto mt-3 max-w-6xl text-sm leading-6 text-slate-300 sm:leading-7 md:mt-4 md:text-lg md:leading-8">
            {t("page_subtitle")}
          </p>

          <div className="mx-auto mt-4 max-w-6xl rounded-2xl border border-cyan-500/30 bg-slate-950/40 p-3.5 text-left sm:mt-5 sm:p-4 md:mt-6 md:p-6">
            <h2 className="text-center text-sm font-bold text-cyan-100 sm:text-base md:text-xl">
              {t("geo_sections.quick_answer_title")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-200 sm:leading-7 md:text-base">
              {t("geo_sections.quick_answer_content")}
            </p>
          </div>
        </header>

        <DecimalToTextConverter />

        <section className="grid gap-3.5 md:grid-cols-2 md:gap-5 lg:gap-6">
          <article className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-4 shadow-xl sm:p-5 md:p-7 lg:p-8">
            <h2 className="text-base font-bold text-white sm:text-lg md:text-2xl">
              {t("geo_sections.how_title")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300 md:text-base">
              {t("geo_sections.how_intro")}
            </p>
            <ol className="mt-3.5 space-y-2.5 sm:mt-4 sm:space-y-3 md:mt-5">
              {howSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-xs sm:tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1.5 text-sm font-semibold leading-6 text-white md:text-base">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-300 md:text-base">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-4 shadow-xl sm:p-5 md:p-7 lg:p-8">
            <h2 className="text-base font-bold text-white sm:text-lg md:text-2xl">
              {t("geo_sections.core_facts_title")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300 md:text-base">
              {t("geo_sections.core_facts_intro")}
            </p>
            <dl className="mt-3.5 grid gap-2.5 sm:mt-4 sm:gap-3 md:mt-5">
              {coreFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:p-4"
                >
                  <dt className="text-xs leading-5 text-emerald-200 md:text-sm">
                    <strong>{fact.label}</strong>
                  </dt>
                  <dd className="mt-1.5 text-sm leading-6 text-slate-200 md:mt-2 md:text-base">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </section>

        <section className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-4 shadow-xl sm:p-5 md:p-7 lg:p-8">
          <h2 className="text-base font-bold text-white sm:text-lg md:text-2xl">
            {t("geo_sections.use_cases_title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300 md:text-base">
            {t("geo_sections.use_cases_intro")}
          </p>
          <div className="mt-3.5 grid gap-2.5 sm:mt-4 sm:gap-3 md:mt-5 md:grid-cols-2 lg:gap-4">
            {useCases.map((useCase) => (
              <article
                key={useCase.title}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:p-4"
              >
                <h3 className="text-sm font-semibold leading-6 text-purple-200 md:text-base">
                  {useCase.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-300 md:text-base">
                  {useCase.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-3.5 md:grid-cols-2 md:gap-5 lg:gap-6">
          <article className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-red-500/10 p-4 shadow-xl sm:p-5 md:p-7 lg:p-8">
            <h2 className="text-base font-bold text-white sm:text-lg md:text-2xl">
              {t("geo_sections.limitations_title")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300 md:text-base">
              {t("geo_sections.limitations_intro")}
            </p>
            <ul className="mt-3.5 space-y-2.5 sm:mt-4 sm:space-y-3 md:mt-5">
              {limitations.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm leading-6 text-slate-200 md:p-4 md:text-base"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 p-4 shadow-xl sm:p-5 md:p-7 lg:p-8">
            <h2 className="text-base font-bold text-white sm:text-lg md:text-2xl">
              {t("geo_sections.data_sources_title")}
            </h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-200 sm:mt-3 sm:leading-7 md:text-base">
              {t("geo_sections.data_sources_intro")}{" "}
              <a
                href="https://www.unicode.org/charts/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline decoration-cyan-400/60 underline-offset-4"
              >
                {t("geo_sections.data_sources_link_1_label")}
              </a>
              ,{" "}
              <a
                href="https://www.nist.gov/pml/special-publication-811"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline decoration-cyan-400/60 underline-offset-4"
              >
                {t("geo_sections.data_sources_link_2_label")}
              </a>
              , and{" "}
              <a
                href="https://www.ascii-code.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline decoration-cyan-400/60 underline-offset-4"
              >
                {t("geo_sections.data_sources_link_3_label")}
              </a>
              . {t("geo_sections.data_sources_suffix")}
            </p>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-500/30 bg-gradient-to-br from-slate-800/60 to-slate-950/80 p-4 shadow-xl sm:p-5 md:p-7 lg:p-8">
          <h2 className="mb-3.5 text-base font-bold text-white sm:mb-4 sm:text-lg md:mb-5 md:text-2xl">
            {t("geo_sections.faq_title")}
          </h2>
          <div className="space-y-2.5 sm:space-y-3">
            {faqItems.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:p-4"
              >
                <summary className="cursor-pointer list-none pr-6 text-sm font-semibold leading-6 text-cyan-200 marker:content-none md:text-base">
                  <span className="text-cyan-300/80">{index + 1}. </span>
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-6 text-slate-300 md:mt-3 md:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-4 text-center shadow-xl sm:p-5 md:p-7 lg:p-8">
          <p className="text-sm leading-6 text-slate-200 md:text-base">
            <strong>{t("geo_sections.last_updated_label")}</strong> {LAST_MODIFIED_ISO} |{" "}
            <strong>{t("geo_sections.content_version_label")}</strong> {CONTENT_VERSION}
          </p>
          <div className="mt-4 flex justify-center md:mt-5">
            <Link
              href="/tools"
              className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-200 transition-all duration-300 hover:bg-emerald-500/20 hover:text-white md:w-auto md:px-6 md:py-3"
            >
              {t("geo_sections.browse_all_tools")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
