import ListLayout from "@/layouts/ListLayout"
import ShortsDownloader from "@/components/ShortsDownloader"
import { HOME_FAQ_ITEMS, HOME_LAST_MODIFIED } from "@/lib/seo/home-faq"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Shield, Zap, Smartphone, FileVideo } from "lucide-react"

const POSTS_PER_PAGE = 6
const MAX_DISPLAY = 3

const CORE_FACTS = [
  {
    icon: Zap,
    labelKey: "fact_instant_label" as const,
    detailKey: "fact_instant_detail" as const,
    border: "border-primary-500/25",
    bg: "bg-primary-500/10",
    labelColor: "text-primary-200",
  },
  {
    icon: Shield,
    labelKey: "fact_free_label" as const,
    detailKey: "fact_free_detail" as const,
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/10",
    labelColor: "text-emerald-200",
  },
  {
    icon: FileVideo,
    labelKey: "fact_format_label" as const,
    detailKey: "fact_format_detail" as const,
    border: "border-cyan-500/25",
    bg: "bg-cyan-500/10",
    labelColor: "text-cyan-200",
  },
  {
    icon: Smartphone,
    labelKey: "fact_device_label" as const,
    detailKey: "fact_device_detail" as const,
    border: "border-orange-500/25",
    bg: "bg-orange-500/10",
    labelColor: "text-orange-200",
  },
] as const

const HOW_TO_STEPS = ["howto_step_1", "howto_step_2", "howto_step_3"] as const

/** Section shell — matches decimaltools spacing rhythm */
const SECTION = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"

/**
 * Typography scale (aligned with geekskai/decimaltools Main.tsx)
 * Mobile-first: base sizes on root, sm/lg for progressive enhancement.
 */
const TYPE = {
  badge:
    "text-xs font-semibold uppercase tracking-[0.12em] text-primary-200",
  h1: "text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-4xl lg:text-5xl",
  h2: "text-xl font-semibold leading-snug text-white sm:text-2xl",
  sectionIntro: "text-sm leading-7 text-slate-300 sm:text-base",
  body: "text-sm leading-7 text-slate-300 sm:text-base",
  bodyMuted: "text-sm leading-7 text-slate-400 sm:text-base",
  meta: "text-xs leading-6 text-slate-500",
  factLabel: "text-xs font-semibold uppercase tracking-[0.12em]",
  factTitle: "text-sm font-semibold leading-snug text-slate-100 sm:text-base",
  factDetail: "text-sm leading-6 text-slate-300",
  stepTitle: "text-sm font-semibold leading-snug text-slate-100 sm:text-base",
  stepBody: "text-sm leading-7 text-slate-400",
  faqQuestion: "text-sm font-semibold leading-snug text-slate-100 sm:text-base",
  faqAnswer: "text-sm leading-7 text-slate-400 sm:text-base",
  link: "text-sm font-medium text-primary-300 transition hover:text-primary-200 sm:text-base",
} as const

export default function Home({ posts = [] }) {
  const t = useTranslations("HomePage")
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <main className="overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Hero + downloader */}
      <section
        id="downloader"
        aria-labelledby="hero-title"
        className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        <div className={`${SECTION} py-8 sm:py-12 lg:py-16`}>
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
            <header className="text-center lg:col-span-5 lg:text-left">
              <p
                className={`inline-flex max-w-full items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1 ${TYPE.badge}`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                <span className="truncate">{t("hero_badge")}</span>
              </p>
              <h1
                id="hero-title"
                className={`mt-4 bg-gradient-to-r from-primary-200 via-slate-100 to-primary-300 bg-clip-text sm:mt-5 lg:mt-6 ${TYPE.h1}`}
              >
                {t("hero_title")}
              </h1>

              <aside
                className="fact-chunk mx-auto mt-4 w-full rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4 text-left sm:mt-5 sm:p-5 lg:mx-0"
                aria-label="Quick answer"
              >
                <p className={TYPE.body}>
                  <strong className="font-semibold text-primary-200">
                    {t("quick_answer_label")}
                  </strong>{" "}
                  {t("quick_answer_text")}
                </p>
                <ul className={`mt-3 space-y-2 ${TYPE.bodyMuted}`}>
                  <li>
                    <strong className="font-semibold text-slate-200">
                      {t("quick_answer_best_for_label")}
                    </strong>{" "}
                    {t("quick_answer_best_for")}
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-200">
                      {t("quick_answer_cost_label")}
                    </strong>{" "}
                    {t("quick_answer_cost")}
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-200">
                      {t("quick_answer_benefit_label")}
                    </strong>{" "}
                    {t("quick_answer_benefit")}
                  </li>
                </ul>
                <p className={`mt-3 ${TYPE.meta}`}>
                  <time dateTime={HOME_LAST_MODIFIED}>
                    {t("content_updated")}: {HOME_LAST_MODIFIED}
                  </time>
                </p>
              </aside>
            </header>

            <div className="mt-6 w-full min-w-0 sm:mt-8 lg:col-span-7 lg:mt-0">
              <ShortsDownloader variant="hero" autoFocus />
            </div>
          </div>
        </div>
      </section>

      {/* Core facts */}
      <section
        id="core-facts"
        aria-labelledby="core-facts-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} py-8 sm:py-10 lg:py-12`}>
          <h2 id="core-facts-title" className={`text-center sm:text-left ${TYPE.h2}`}>
            {t("core_facts_title")}
          </h2>
          <p className={`mt-2 max-w-3xl text-center sm:text-left ${TYPE.sectionIntro}`}>
            {t("core_facts_intro")}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {CORE_FACTS.map(({ icon: Icon, labelKey, detailKey, border, bg, labelColor }) => (
              <article key={labelKey} className={`rounded-2xl border p-4 sm:p-5 ${border} ${bg}`}>
                <Icon
                  className={`h-5 w-5 ${labelColor} sm:h-[1.125rem] sm:w-[1.125rem]`}
                  strokeWidth={2.25}
                  aria-hidden
                />
                <p className={`mt-2.5 ${TYPE.factLabel} ${labelColor}`}>{t(labelKey)}</p>
                <p className={`mt-1.5 ${TYPE.factDetail}`}>{t(detailKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How-to */}
      <section
        id="how-to"
        aria-labelledby="how-to-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} py-8 sm:py-10 lg:py-12`}>
          <h2 id="how-to-title" className={`text-center ${TYPE.h2}`}>
            {t("how_to_title")}
          </h2>
          <p className={`mx-auto mt-2 max-w-3xl text-center lg:max-w-4xl ${TYPE.sectionIntro}`}>
            <strong className="font-semibold text-slate-100">{t("how_to_answer")}</strong>
          </p>
          <ol className="mx-auto mt-5 max-w-3xl space-y-3 sm:mt-6 sm:space-y-4 lg:mt-8 lg:grid lg:max-w-none lg:grid-cols-3 lg:gap-5 lg:space-y-0">
            {HOW_TO_STEPS.map((key, i) => (
              <li
                key={key}
                className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/45 p-4 sm:gap-4 sm:p-5 lg:flex-col lg:gap-3"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-200 sm:h-10 sm:w-10 ${TYPE.stepTitle}`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className={TYPE.stepTitle}>{t(`${key}_title`)}</h3>
                  <p className={`mt-1.5 sm:mt-2 ${TYPE.stepBody}`}>{t(`${key}_body`)}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={`mx-auto mt-5 max-w-3xl text-center lg:mt-6 lg:max-w-4xl ${TYPE.meta}`}>
            <strong className="font-medium text-slate-400">{t("how_to_takeaway_label")}</strong>{" "}
            {t("how_to_takeaway")}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="faq-title"
        className="border-b border-white/10 bg-slate-950"
      >
        <div className={`${SECTION} py-8 sm:py-10 lg:py-12`}>
          <h2 id="faq-title" className={`text-center ${TYPE.h2}`}>
            {t("faq_title")}
          </h2>
          <p className={`mx-auto mt-2 max-w-3xl text-center lg:max-w-4xl ${TYPE.sectionIntro}`}>
            {t("faq_intro")}
          </p>
          <dl className="mx-auto mt-5 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-900/45 sm:mt-6 lg:mt-8 lg:max-w-5xl">
            {HOME_FAQ_ITEMS.map((item) => (
              <div key={item.question} className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                <dt className={TYPE.faqQuestion}>{item.question}</dt>
                <dd className={`mt-2 sm:mt-2.5 ${TYPE.faqAnswer}`}>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="bg-slate-950" aria-labelledby="blog-section-title">
          <div className={`${SECTION} py-8 sm:py-10 lg:py-12`}>
            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
              <h2 id="blog-section-title" className={TYPE.h2}>
                {t("hero_blogs_list")}
              </h2>
              <Link
                href="/blog"
                className={`inline-flex min-h-11 items-center sm:min-h-0 ${TYPE.link}`}
              >
                {t("blog_all_posts")} →
              </Link>
            </div>
            <div className="home-blog text-sm leading-7 sm:text-base [&_a]:text-primary-300 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-100 sm:[&_h3]:text-lg [&_p]:text-slate-400">
              <ListLayout
                posts={posts.slice(0, MAX_DISPLAY)}
                initialDisplayPosts={initialDisplayPosts}
                pagination={pagination}
                title={t("blog_all_posts")}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
