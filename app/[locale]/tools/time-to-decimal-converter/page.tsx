import { getTranslations } from "next-intl/server"
import Link from "next/link"
import TimeToDecimalConverter from "./components/TimeToDecimalConverter"

export default async function TimeToDecimalConverterPage() {
  const t = await getTranslations("TimeToDecimalConverter")

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5 px-3 py-5 sm:px-4 sm:py-6 md:space-y-7 md:px-6 md:py-8 lg:space-y-8 lg:px-8 lg:py-10">
        <header className="space-y-3.5 text-center sm:space-y-4 md:space-y-5">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-cyan-200 sm:text-xs sm:tracking-[0.14em] md:gap-3 md:px-4 md:py-2 md:text-sm">
            <span>🕒</span>
            <span>{t("badge")}</span>
          </div>

          <h1 className="mx-auto max-w-6xl bg-gradient-to-r from-cyan-200 via-blue-100 to-purple-200 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:text-3xl md:text-5xl">
            {t("h1")}
          </h1>
          <p className="mx-auto max-w-6xl text-sm leading-6 text-slate-300 sm:leading-7 md:text-lg">
            {t("intro")}
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 md:p-6 lg:p-7">
          <h2 className="text-base font-semibold text-white sm:text-lg md:text-xl">
            {t("quick_answer.title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300 sm:leading-7 md:text-base">
            {t("quick_answer.body")}
          </p>
        </section>

        <TimeToDecimalConverter />

        <section className="grid gap-3.5 md:grid-cols-2 md:gap-5 lg:gap-6">
          <article className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 sm:p-5 md:p-6 lg:p-7">
            <h2 className="text-lg font-semibold text-cyan-100 sm:text-xl">
              {t("geo_sections.core_facts.title")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200 sm:leading-7 md:text-base">
              <li>{t("geo_sections.core_facts.fact_1")}</li>
              <li>{t("geo_sections.core_facts.fact_2")}</li>
              <li>{t("geo_sections.core_facts.fact_3")}</li>
              <li>{t("geo_sections.core_facts.fact_4")}</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:p-5 md:p-6 lg:p-7">
            <h2 className="text-lg font-semibold text-emerald-100 sm:text-xl">
              {t("geo_sections.how_it_works.title")}
            </h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-200 sm:leading-7 md:text-base">
              <li>{t("geo_sections.how_it_works.step_1")}</li>
              <li>{t("geo_sections.how_it_works.step_2")}</li>
              <li>{t("geo_sections.how_it_works.step_3")}</li>
              <li>{t("geo_sections.how_it_works.step_4")}</li>
            </ol>
          </article>
        </section>

        <section className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-4 sm:p-5 md:p-6 lg:p-7">
          <h2 className="text-lg font-semibold text-purple-100 sm:text-xl">
            {t("geo_sections.use_cases.title")}
          </h2>
          <ul className="mt-3 grid gap-2.5 text-sm leading-6 text-slate-200 sm:leading-7 md:grid-cols-2 md:text-base lg:gap-3">
            <li>{t("geo_sections.use_cases.case_1")}</li>
            <li>{t("geo_sections.use_cases.case_2")}</li>
            <li>{t("geo_sections.use_cases.case_3")}</li>
            <li>{t("geo_sections.use_cases.case_4")}</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-4 sm:p-5 md:p-6 lg:p-7">
          <h2 className="text-lg font-semibold text-orange-100 sm:text-xl">
            {t("geo_sections.limitations.title")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200 sm:leading-7 md:text-base">
            <li>{t("geo_sections.limitations.item_1")}</li>
            <li>{t("geo_sections.limitations.item_2")}</li>
            <li>{t("geo_sections.limitations.item_3")}</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 md:p-6 lg:p-7">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            {t("geo_sections.faq.title")}
          </h2>
          <div className="mt-3.5 space-y-3 sm:mt-4 sm:space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <article
                key={index}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 sm:p-4 md:p-5"
              >
                <h3 className="text-sm font-semibold leading-6 text-slate-100 md:text-base">
                  {t(`geo_sections.faq.question_${index + 1}`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300 sm:leading-7 md:text-base">
                  {t(`geo_sections.faq.answer_${index + 1}`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-4 sm:p-5 md:p-6 lg:p-7">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            {t("geo_sections.data_sources.title")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2.5 sm:gap-3">
            <Link
              href="https://www.iso.org/"
              target="_blank"
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs text-cyan-100 transition hover:border-cyan-400 hover:text-white sm:px-4 md:text-sm"
            >
              {t("geo_sections.data_sources.source_1")}
            </Link>
            <Link
              href="https://www.nist.gov/"
              target="_blank"
              className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs text-purple-100 transition hover:border-purple-400 hover:text-white sm:px-4 md:text-sm"
            >
              {t("geo_sections.data_sources.source_2")}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
