import "css/tailwind.css"
import "pliny/search/algolia.css"
import "remark-github-blockquote-alert/alert.css"
import React from "react"
import { Analytics, AnalyticsConfig } from "pliny/analytics"
import { SearchProvider, SearchConfig } from "pliny/search"
import Header from "@/components/Header"
import SectionContainer from "@/components/SectionContainer"
import siteMetadata from "@/data/siteMetadata"
import { Metadata } from "next"
import SiteFooter from "@/components/SiteFooter"
import { NextIntlClientProvider } from "next-intl"
import { hasLocale } from "next-intl"
import { routing, supportedLocales } from "../i18n/routing"
import { notFound } from "next/navigation"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { toolsData } from "@/data/toolsData"
import Script from "next/script"
import ClarityTracker from "../../components/ClarityTracker"


export const revalidate = 86400 // 24 hours

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}
// const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations("HomePage")
  const metadataBase = new URL("https://decimaltools.com")

  const title = t("home_seo_title")
  const description = t("home_seo_description") + " " + t("home_seo_keywords")

  const isDefaultLocale = locale === "en"
  // const languages = {
  //   "x-default": "https://decimaltools.com/",
  // }

  // supportedLocales.forEach((locale) => {
  //   languages[locale] = `https://decimaltools.com/${locale}`
  // })

  return {
    metadataBase,
    title: title,
    description: description,
    keywords: [t("home_seo_keywords")],
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: "https://decimaltools.com",
      siteName: "DecimalTools",
      images: [
        {
          url: "/static/images/og/decimaltools-home.png",
          width: 1200,
          height: 630,
          alt: "DecimalTools",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      title: title,
      description: description,
      card: "summary_large_image",
      images: ["/static/images/og/decimaltools-home.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: "DecimalTools" }],
    creator: "DecimalTools",
    publisher: "DecimalTools",
    alternates: {
      canonical: isDefaultLocale
        ? "https://decimaltools.com"
        : `https://decimaltools.com/${locale}`,
      // languages: {
      //   ...languages,
      // },
    },
    category: "Tools",
    classification: "Tools",
    other: {
      "application-name": "DecimalTools",
      "apple-mobile-web-app-title": "DecimalTools",
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const basePath = process.env.BASE_PATH || ""
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  const messages = await getMessages()

  // Generate JSON-LD Structured Data
  const t = await getTranslations("HomePage")
  const baseUrl = "https://decimaltools.com"
  const url = `${baseUrl}${locale === "en" ? "" : `/${locale}`}`

  const popularTools = toolsData.map((tool, index) => ({
    "@type": "SoftwareApplication",
    position: index + 1,
    name: tool.title,
    description: tool.description,
    url: `${baseUrl}${locale === "en" ? "" : `/${locale}`}${tool.href}`,
    applicationCategory: `${tool.category}Application`,
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
      ratingCount: "1000",
    },
  }))

  const localeMap: Record<string, string> = {
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    no: "nb-NO",
    "zh-cn": "zh-CN",
    da: "da-DK",
  }

  const inLanguage = localeMap[locale] || "en-US"

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "DecimalTools",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/static/decimaltools.png`,
          width: 512,
          height: 512,
        },
        sameAs: ["https://github.com/decimaltools", "https://twitter.com/decimaltools"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["en", "ja", "ko", "zh-cn", "no", "da"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "DecimalTools",
        description: t("home_seo_description"),
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: inLanguage,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}${locale === "en" ? "" : `/${locale}`}/tools?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url: url,
        name: t("home_seo_title"),
        description: t("home_seo_description"),
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${baseUrl}/static/images/og/decimaltools-home.png`,
        },
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
        inLanguage: inLanguage,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: url,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#tools`,
        name: t("footer_popular_tools"),
        description: t("footer_description"),
        numberOfItems: toolsData.length.toString(),
        itemListElement: popularTools,
      },
    ],
  }

  return (
    <html lang={locale} className={`scroll-smooth`} suppressHydrationWarning>
      <link rel="apple-touch-icon" sizes="76x76" href={`${basePath}/static/decimaltools.png`} />
      <link
        rel="icon"
        type="image/png"
        sizes="48x48"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.png`}
        color="#FF6B6B"
      />
      <meta name="saashub-verification" content="e4h08bjpev5u" />
      <meta name="msvalidate.01" content="58567D271AD7C1B504E10F5DC587BD0B" />
      <meta name="google-adsense-account" content="ca-pub-2108246014001009"></meta>
      <meta name="google-site-verification" content="QBYZptmNADcvd2h8ZZVSZIJUlv5RnI8yYmHtEld1mKk" />
      <meta name="msapplication-TileColor" content="#000000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 pl-[calc(100vw-100%)] text-white antialiased">
        {/* JSON-LD Structured Data - Must be in body to avoid hydration error */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* External Scripts using Next.js Script component */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2108246014001009"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
          strategy="afterInteractive"
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClarityTracker />
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mx-auto min-h-[54vh] max-w-7xl px-4 sm:px-6 xl:px-0">
                {children}
              </main>
            </SearchProvider>
            <SiteFooter />
          </SectionContainer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
