import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/app/i18n/navigation"
import {
  featuredPseoFractions,
  PSEO_CONTENT_VERSION,
  getPseoPath,
  popularLandingQueries,
  popularMixedNumberQueries,
  PSEO_BASE_SEGMENT,
  PSEO_LAST_MODIFIED_DATE,
} from "@/data/pseo-fractions"
import siteMetadata from "@/data/siteMetadata"

type PageProps = {
  params: { locale: string }
}

function getLocalizedHubPath(locale: string): string {
  const path = `/tools/${PSEO_BASE_SEGMENT}`
  return locale === "en" ? path : `/${locale}${path}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { locale } = resolvedParams
  setRequestLocale(locale)
  const t = await getTranslations({ locale: locale, namespace: "FractionToDecimal" })
  const canonical = `${siteMetadata.siteUrl}${getLocalizedHubPath(locale)}`
  const defaultPath = `${siteMetadata.siteUrl}/tools/${PSEO_BASE_SEGMENT}`
  const lastModified = new Date(PSEO_LAST_MODIFIED_DATE)

  return {
    title: t("hub.seo_title"),
    description: t("hub.seo_description"),
    keywords: t("hub.seo_keywords").split(", "),
    openGraph: {
      title: t("hub.seo_title"),
      description: t("hub.seo_description"),
      type: "website",
      url: canonical,
      siteName: "DecimalTools",
      images: [
        {
          url: "/static/images/og/decimaltools-home.png",
          width: 1200,
          height: 630,
          alt: t("hub.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("hub.seo_title"),
      description: t("hub.seo_description"),
      images: ["/static/images/og/decimaltools-home.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical,
      // languages: {
      //   en: defaultPath,
      //   "x-default": defaultPath,
      // },
    },
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function AsADecimalHubPage({ params }: PageProps) {
  const resolvedParams = await params
  const { locale } = resolvedParams
  setRequestLocale(locale)
  const t = await getTranslations({ locale: locale, namespace: "FractionToDecimal" })
  const pageUrl = `${siteMetadata.siteUrl}${getLocalizedHubPath(locale)}`
  const hubFacts = Array.from({ length: 4 }, (_, index) => ({
    label: t(`hub.core_fact_${index + 1}_label`),
    value: t(`hub.core_fact_${index + 1}_value`),
  }))
  const howSteps = Array.from({ length: 3 }, (_, index) => ({
    title: t(`hub.how_step_${index + 1}_title`),
    body: t(`hub.how_step_${index + 1}_body`),
  }))
  const scopeItems = Array.from({ length: 4 }, (_, index) => t(`hub.scope_item_${index + 1}`))
  const faqItems = Array.from({ length: 8 }, (_, index) => ({
    question: t(`hub.faq_question_${index + 1}`),
    answer: t(`hub.faq_answer_${index + 1}`),
  }))
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("hub.seo_title"),
    description: t("hub.seo_description"),
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "DecimalTools",
      url: siteMetadata.siteUrl,
    },
  }
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("hub.popular_title"),
    itemListElement: featuredPseoFractions.map((fraction, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${fraction.numerator}/${fraction.denominator} as a decimal`,
      url: `${siteMetadata.siteUrl}${getPseoPath(fraction.numerator, fraction.denominator)}`,
    })),
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: `${siteMetadata.siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: `${siteMetadata.siteUrl}/tools/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("pseo.breadcrumb_parent"),
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="rounded-3xl border border-violet-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300/80">
              DecimalTools
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("hub.title")}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              {t("hub.description")}
            </p>
          </header>

          <section className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6 backdrop-blur sm:p-8">
            <h2 className="text-xl font-bold text-white">{t("hub.tldr_title")}</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-200">{t("hub.tldr_body")}</p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
              <h2 className="text-2xl font-semibold text-white">{t("hub.core_facts_title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("hub.core_facts_description")}
              </p>
              <dl className="mt-5 grid gap-4">
                {hubFacts.map((fact) => (
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

            <div className="rounded-3xl border border-violet-500/20 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
              <h2 className="text-2xl font-semibold text-white">{t("hub.how_title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t("hub.how_description")}</p>
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
          </section>

          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold text-white">{t("hub.popular_title")}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPseoFractions.map((fraction) => (
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
          </section>

          <section className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold text-white">{t("hub.search_patterns_title")}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              {t("hub.search_patterns_description")}
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200">{t("hub.questions_title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {t("hub.questions_description")}
                </p>
                <div className="mt-4 space-y-3">
                  {popularLandingQueries.map((query) => (
                    <Link
                      key={query.label}
                      href={getPseoPath(query.numerator, query.denominator)}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-cyan-400 hover:bg-slate-950"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{query.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {query.numerator}/{query.denominator}
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
                        {t("hub.page_badge")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200">{t("hub.mixed_title")}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {t("hub.mixed_description")}
                </p>
                <div className="mt-4 space-y-3">
                  {popularMixedNumberQueries.map((query) => (
                    <Link
                      key={query.label}
                      href={`/tools/fraction-to-decimal?input=${encodeURIComponent(query.input)}`}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 transition hover:border-cyan-400 hover:bg-slate-950"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{query.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          {t("hub.tool_card_cta", { input: query.input })}
                        </p>
                      </div>
                      <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-200">
                        {t("hub.tool_badge")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
              <h2 className="text-2xl font-semibold text-white">{t("hub.scope_title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t("hub.scope_description")}</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                {scopeItems.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
              <h2 className="text-2xl font-semibold text-white">{t("hub.references_title")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {t("hub.references_intro")}{" "}
                <a
                  href="https://openstax.org/details/books/prealgebra-2e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  {t("hub.references_link_1_label")}
                </a>
                ,{" "}
                <a
                  href="https://www.khanacademy.org/math/arithmetic/fraction-arithmetic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  {t("hub.references_link_2_label")}
                </a>
                , and{" "}
                <a
                  href="https://www.nist.gov/pml/special-publication-811"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
                >
                  {t("hub.references_link_3_label")}
                </a>
                . {t("hub.references_suffix")}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tools/fraction-to-decimal"
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
                >
                  {t("hub.open_calculator")}
                </Link>
                <Link
                  href="/tools/convert-inches-to-decimal"
                  className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                >
                  {t("hub.open_inches_tool")}
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-600/40 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold text-white">{t("hub.faq_title")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{t("hub.faq_description")}</p>
            <ul className="mt-5 space-y-4">
              {faqItems.map((faq) => (
                <li
                  key={faq.question}
                  className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
                >
                  <h3 className="font-medium text-violet-200">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{faq.answer}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center sm:p-8">
            <p className="text-slate-300">
              <strong className="text-slate-200">{t("hub.updated_label")}</strong>{" "}
              {PSEO_LAST_MODIFIED_DATE} ·{" "}
              <strong className="text-slate-200">{t("hub.content_version_label")}</strong>{" "}
              {PSEO_CONTENT_VERSION}
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
