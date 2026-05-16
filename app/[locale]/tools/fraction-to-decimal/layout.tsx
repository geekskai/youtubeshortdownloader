import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import React from "react"
import { LAST_MODIFIED_ISO, TOOL_SLUG } from "./seoData"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "FractionToDecimal" })
  const lastModified = new Date(LAST_MODIFIED_ISO)
  const canonical = `https://decimaltools.com/tools/${TOOL_SLUG}`

  // const languages: Record<string, string> = {
  //   "x-default": `https://decimaltools.com/tools/${TOOL_SLUG}`,
  // }

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords").split(", "),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      url: canonical,
      siteName: "DecimalTools",
      images: [
        {
          url: "/static/images/og/decimaltools-home.png",
          width: 1200,
          height: 630,
          alt: t("structured_data.app_name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
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
      // languages,
    },
    other: {
      "last-modified": lastModified.toISOString(),
      "update-frequency": "monthly",
      "next-review": new Date(lastModified.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "FractionToDecimal" })
  const pageUrl = `https://decimaltools.com/tools/${TOOL_SLUG}`

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("structured_data.app_name"),
    description: t("structured_data.app_description"),
    url: pageUrl,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    featureList: [
      t("structured_data.feature_1"),
      t("structured_data.feature_2"),
      t("structured_data.feature_3"),
      t("structured_data.feature_4"),
      t("structured_data.feature_5"),
      t("structured_data.feature_6"),
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: "DecimalTools",
      url: "https://decimaltools.com",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.from({ length: 8 }, (_, index) => ({
      "@type": "Question",
      name: t(`geo_sections.faq.question_${index + 1}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`geo_sections.faq.answer_${index + 1}`),
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
        item: "https://decimaltools.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb.tools"),
        item: "https://decimaltools.com/tools/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumb.current"),
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}
