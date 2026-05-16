import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound, permanentRedirect } from "next/navigation"
import { Suspense } from "react"
import { Link } from "@/app/i18n/navigation"
import siteMetadata from "@/data/siteMetadata"
import {
  featuredPseoFractions,
  getPseoPath,
  getPseoSlug,
  getRelatedPseoFractions,
  isPseoWhitelisted,
  PSEO_CONTENT_VERSION,
  PSEO_ENABLED_LOCALES,
  PSEO_LAST_MODIFIED_DATE,
  pseoFractionPairs,
} from "@/data/pseo-fractions"
import { getFractionPageModel } from "@/lib/fraction-math"
import FractionConverter from "../../fraction-to-decimal/components/FractionConverter"

type PageParams = {
  locale: string
  slug: string
}

type PageProps = {
  params: PageParams
}

function parsePositiveInteger(value: string): number | null {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function parseFractionSlug(slug: string): { numerator: number; denominator: number } | null {
  const parts = slug.split("-")
  if (parts.length !== 2) {
    return null
  }

  const numerator = parsePositiveInteger(parts[0])
  const denominator = parsePositiveInteger(parts[1])
  if (!numerator || !denominator) {
    return null
  }

  return { numerator, denominator }
}

function isEnabledLocale(locale: string): boolean {
  return PSEO_ENABLED_LOCALES.includes(locale as (typeof PSEO_ENABLED_LOCALES)[number])
}

function getLocalizedPath(locale: string, numerator: number, denominator: number): string {
  const path = getPseoPath(numerator, denominator)
  return locale === "en" ? path : `/${locale}${path}`
}

function getCanonicalUrl(locale: string, numerator: number, denominator: number): string {
  return `${siteMetadata.siteUrl}${getLocalizedPath(locale, numerator, denominator)}`
}

function resolvePageState(params: PageParams) {
  if (!isEnabledLocale(params.locale)) {
    return null
  }

  const pair = parseFractionSlug(params.slug)
  if (!pair) {
    return null
  }

  const model = getFractionPageModel(pair.numerator, pair.denominator)
  if (!model) {
    return null
  }

  const canonicalNumerator = model.canonicalNumerator
  const canonicalDenominator = model.canonicalDenominator
  const canonicalSlug = getPseoSlug(canonicalNumerator, canonicalDenominator)
  const isCanonical = params.slug === canonicalSlug
  const isWhitelisted = isPseoWhitelisted(canonicalNumerator, canonicalDenominator)

  return {
    locale: params.locale,
    model,
    canonicalNumerator,
    canonicalDenominator,
    isCanonical,
    isWhitelisted,
    canonicalPath: getLocalizedPath(params.locale, canonicalNumerator, canonicalDenominator),
    canonicalUrl: getCanonicalUrl(params.locale, canonicalNumerator, canonicalDenominator),
  }
}

export function generateStaticParams() {
  return PSEO_ENABLED_LOCALES.flatMap((locale) =>
    pseoFractionPairs.map(({ numerator, denominator }) => ({
      locale,
      slug: getPseoSlug(numerator, denominator),
    }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { locale } = resolvedParams
  setRequestLocale(locale)
  const state = resolvePageState(resolvedParams)

  if (!state || !state.isWhitelisted) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const t = await getTranslations({ locale: state.locale, namespace: "FractionToDecimal" })
  const { canonicalNumerator, canonicalDenominator, model, canonicalUrl } = state
  const decimal = model.core.formattedDecimal

  return {
    title: t("pseo.seo_title", {
      numerator: canonicalNumerator,
      denominator: canonicalDenominator,
    }),
    description: t("pseo.seo_description", {
      numerator: canonicalNumerator,
      denominator: canonicalDenominator,
      decimal,
    }),
    alternates: {
      canonical: canonicalUrl,
      // languages: {
      //   en: `${siteMetadata.siteUrl}${getPseoPath(canonicalNumerator, canonicalDenominator)}`,
      //   "x-default": `${siteMetadata.siteUrl}${getPseoPath(canonicalNumerator, canonicalDenominator)}`,
      // },
    },
    openGraph: {
      title: t("pseo.seo_title", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
      }),
      description: t("pseo.seo_description", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
        decimal,
      }),
      type: "article",
      url: canonicalUrl,
      siteName: "DecimalTools",
      images: [
        {
          url: "/static/images/og/decimaltools-home.png",
          width: 1200,
          height: 630,
          alt: "DecimalTools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("pseo.seo_title", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
      }),
      description: t("pseo.seo_description", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
        decimal,
      }),
      images: ["/static/images/og/decimaltools-home.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "last-modified": PSEO_LAST_MODIFIED_DATE,
    },
  }
}

export default async function FractionAsDecimalPage({ params }: PageProps) {
  const resolvedParams = await params
  const { locale } = resolvedParams
  setRequestLocale(locale)
  const state = resolvePageState(resolvedParams)

  if (!state || !state.isWhitelisted) {
    notFound()
  }

  if (!state.isCanonical) {
    permanentRedirect(state.canonicalPath)
  }

  const t = await getTranslations({ locale: state.locale, namespace: "FractionToDecimal" })
  const { model, canonicalNumerator, canonicalDenominator, canonicalUrl } = state
  const decimal = model.core.formattedDecimal
  const inputString = `${canonicalNumerator}/${canonicalDenominator}`
  const relatedFractions = getRelatedPseoFractions(canonicalNumerator, canonicalDenominator)
  const featuredLinks = featuredPseoFractions
    .filter(
      (fraction) =>
        `${fraction.numerator}/${fraction.denominator}` !==
        `${canonicalNumerator}/${canonicalDenominator}`
    )
    .slice(0, 6)

  const decimalTypeDescription = model.core.isTerminating
    ? t("pseo.faq_2_a_term", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
        decimal,
      })
    : t("pseo.faq_2_a_rep", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
        decimal,
      })

  const faqItems = [
    {
      question: t("pseo.faq_1_q", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
      }),
      answer: t("pseo.faq_1_a", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
        decimal,
      }),
    },
    {
      question: t("pseo.faq_2_q", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
      }),
      answer: decimalTypeDescription,
    },
    {
      question: t("pseo.faq_3_q", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
      }),
      answer: t("pseo.faq_3_a", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
      }),
    },
    {
      question: t("pseo.faq_4_q", {
        numerator: canonicalNumerator,
        denominator: canonicalDenominator,
      }),
      answer: t("pseo.faq_4_a"),
    },
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumb.home"),
        item: siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: `${siteMetadata.siteUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("pseo.breadcrumb_parent"),
        item: `${siteMetadata.siteUrl}/tools/as-a-decimal`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: t("pseo.breadcrumb_segment", {
          numerator: canonicalNumerator,
          denominator: canonicalDenominator,
        }),
        item: canonicalUrl,
      },
    ],
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

  return (
    <div className="py-10 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-violet-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300/80">
            DecimalTools
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {t("pseo.h1", {
              numerator: canonicalNumerator,
              denominator: canonicalDenominator,
            })}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-200">
            <strong>{inputString}</strong> as a decimal is <strong>{decimal}</strong>.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            {t("pseo.intro", {
              numerator: canonicalNumerator,
              denominator: canonicalDenominator,
              decimal,
            })}
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold text-white">{t("pseo.how_title")}</h2>
            <p className="mt-3 text-slate-300">
              {t("pseo.how_body", {
                numerator: canonicalNumerator,
                denominator: canonicalDenominator,
                decimal,
              })}
            </p>
          </article>

          <aside className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold text-white">{t("pseo.related_title")}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {featuredLinks.map((fraction) => (
                <Link
                  key={`${fraction.numerator}/${fraction.denominator}`}
                  href={getLocalizedPath(state.locale, fraction.numerator, fraction.denominator)}
                  className="rounded-full border border-slate-600 bg-slate-950/70 px-3 py-1.5 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white"
                >
                  {fraction.numerator}/{fraction.denominator}
                </Link>
              ))}
            </div>
            <Link
              href="/tools/fraction-to-decimal"
              className="mt-5 inline-flex rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
            >
              {t("pseo.cta_full_tool")}
            </Link>
          </aside>
        </section>

        <Suspense
          fallback={
            <div className="rounded-3xl border border-violet-500/30 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md sm:p-8" />
          }
        >
          <FractionConverter initialInput={inputString} fractionOnly initialPrecision={8} />
        </Suspense>

        {relatedFractions.length > 0 ? (
          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold text-white">{t("pseo.related_title")}</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedFractions.map((fraction) => (
                <Link
                  key={`${fraction.numerator}/${fraction.denominator}`}
                  href={getLocalizedPath(state.locale, fraction.numerator, fraction.denominator)}
                  className="rounded-full border border-slate-600 bg-slate-950/70 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400 hover:text-white"
                >
                  {fraction.numerator}/{fraction.denominator}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur sm:p-8">
          <h2 className="text-2xl font-semibold text-white">{t("geo_sections.faq_title")}</h2>
          <div className="mt-5 space-y-4">
            {faqItems.map((faq) => (
              <article
                key={faq.question}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-5"
              >
                <h3 className="text-base font-semibold text-violet-200">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400">
            <strong className="text-slate-200">{t("geo_sections.last_updated_label")}</strong>{" "}
            {PSEO_LAST_MODIFIED_DATE} ·{" "}
            <strong className="text-slate-200">{t("geo_sections.content_version_label")}</strong>{" "}
            {PSEO_CONTENT_VERSION}
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}
