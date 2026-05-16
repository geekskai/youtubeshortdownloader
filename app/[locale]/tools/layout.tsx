import { Metadata } from "next"
import React from "react"
import { hasLocale } from "next-intl"
import { routing } from "../../i18n/routing"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
// import { supportedLocales as supportedLocalesList } from "@/components/LanguageSelect"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}
// const supportedLocales = supportedLocalesList
// const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "ToolsPage" })
  const lastModified = new Date("2026-05-06")

  const ogLocale = "en_US"
  const baseUrl = "https://decimaltools.com"
  const path = "/tools"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  const isDefaultLocale = locale === "en"
  // const languages = {
  //   "x-default": "https://decimaltools.com/tools",
  // }

  // supportedLocales.forEach((locale) => {
  //   languages[locale] = `https://decimaltools.com/${locale}/tools`
  // })

  const title = t("tools_seo_title")
  const description = t("tools_seo_description")
  const keywords = t("tools_seo_keywords")

  return {
    title: `${title} | ${t("tools_free_tools")}`,
    description,
    keywords: keywords.split(", "),
    authors: [{ name: "DecimalTools" }],
    creator: "DecimalTools",
    publisher: "DecimalTools",

    // Open Graph
    openGraph: {
      title: `${title} | ${t("tools_free_tools")}`,
      description,
      type: "website",
      url,
      siteName: "DecimalTools",
      images: [
        {
          url: "/static/og-images/tools.jpg",
          width: 1200,
          height: 630,
          alt: "DecimalTools - Free Online Tools",
        },
      ],
      locale: ogLocale,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${t("tools_free_tools")}`,
      description,
      images: ["/static/og-images/tools.jpg"],
      creator: "@decimaltools",
    },

    // SEO Settings
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical and Language Alternates
    alternates: {
      canonical: isDefaultLocale
        ? "https://decimaltools.com/tools"
        : `https://decimaltools.com/${locale}/tools`,
      // languages: {
      //   ...languages,
      // },
    },

    // Additional metadata
    category: locale === "da" ? "Værktøjer" : locale === "no" ? "Verktøy" : "Tools",
    classification:
      locale === "da" ? "Online Værktøjer" : locale === "no" ? "Online Verktøy" : "Online Tools",

    // App metadata
    other: {
      "application-name": "DecimalTools",
      "apple-mobile-web-app-title": "DecimalTools",
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "theme-color": "#0f172a",
      "DC.language": ogLocale.replace("_", "-"),
      "last-modified": lastModified.toISOString(),
    },
  }
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "ToolsPage" })
  const baseUrl = "https://decimaltools.com"
  const path = "/tools"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}${path}`

  // 动态生成结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("tools_seo_title"),
    description: t("tools_seo_description"),
    url,
    mainEntity: {
      "@type": "ItemList",
      name: t("tools_professional_tools"),
      description: t(
        "tools_hand_picked_tools_designed_to_streamline_your_workflow_and_boost_productivity"
      ),
      numberOfItems: "50+",
      itemListElement: [
        {
          "@type": "SoftwareApplication",
          name: "Convert Inches to Decimal",
          description:
            "Professional inches to decimal converter for construction, woodworking, and manufacturing. Convert fractional inches (5 3/4) to decimal inches (5.75) instantly with visual ruler and precision control.",
          url: "https://decimaltools.com/tools/convert-inches-to-decimal",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250",
            bestRating: "5",
            worstRating: "1",
          },
        },
      ],
    },
    provider: {
      "@type": "Organization",
      name: "DecimalTools",
      url: "https://decimaltools.com",
      logo: {
        "@type": "ImageObject",
        url: "https://decimaltools.com/static/decimaltools.png",
      },
    },
    isAccessibleForFree: true,
    inLanguage: locale === "da" ? "da-DK" : locale === "no" ? "nb-NO" : "en-US",
  }

  // 面包屑结构化数据
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("tools_free_tools"),
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("tools_professional_tools"),
        item: url,
      },
    ],
  }

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="min-h-screen">{children}</div>
    </>
  )
}
