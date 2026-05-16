import ListLayout from "@/layouts/ListLayout"
import { useTranslations } from "next-intl"
import Link from "next/link"

const POSTS_PER_PAGE = 6
const MAX_DISPLAY = 5

const FEATURED_TOOLS = [
  {
    name: "Hours to Decimal Calculator",
    description: "Convert work logs and payroll durations into decimal hours instantly.",
    href: "/tools/hours-to-decimal-calculator",
  },
  {
    name: "Time to Decimal Converter",
    description: "Convert flexible time formats to decimal hours, minutes, or days.",
    href: "/tools/time-to-decimal-converter",
  },
  {
    name: "Inches to Decimals",
    description: "Convert fractions and mixed inches to decimal values for precision work.",
    href: "/tools/inches-to-decimals",
  },
  {
    name: "Millimeters to Decimal",
    description: "Convert millimeters to decimal inches for machining and manufacturing.",
    href: "/tools/millimeters-to-decimal",
  },
  {
    name: "Gauge to Decimal",
    description: "Look up gauge thickness and convert to decimal inch and mm outputs.",
    href: "/tools/gauge-to-decimal",
  },
  {
    name: "Hexa to Decimal",
    description: "Decode hex values into decimal, binary, and engineering-friendly outputs.",
    href: "/tools/hexa-to-decimal",
  },
]

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
    <main className="bg-slate-950 text-slate-100">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl text-center">
            <p className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
              DecimalTools
            </p>
            <h1 className="mt-4 bg-gradient-to-r from-cyan-200 via-blue-100 to-purple-200 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl lg:text-5xl">
              Fast Decimal Conversion Tools for Engineering, Payroll, and Daily Calculations
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              <strong>Quick Answer:</strong> DecimalTools provides free online converters for time,
              length, gauge, and number formats, optimized for quick mobile usage and reliable
              desktop workflows.
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-300 sm:text-base">
              <strong>Best for:</strong> estimators, machinists, payroll teams, technicians,
              students, and anyone who needs accurate decimal conversions.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/tools"
                className="rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Explore All Tools
              </Link>
              <Link
                href="/blog"
                className="rounded-2xl border border-white/20 bg-slate-900/50 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                View Tutorials
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Core Facts</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-200">Pricing</p>
              <p className="mt-1 text-sm text-slate-100">
                <strong>Free</strong> tools with no account required.
              </p>
            </article>
            <article className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-emerald-200">Performance</p>
              <p className="mt-1 text-sm text-slate-100">
                <strong>Instant conversion</strong> with lightweight UI components.
              </p>
            </article>
            <article className="rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-purple-200">Coverage</p>
              <p className="mt-1 text-sm text-slate-100">
                <strong>Time, dimension, gauge, and numeric</strong> workflows.
              </p>
            </article>
            <article className="rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-orange-200">Device Support</p>
              <p className="mt-1 text-sm text-slate-100">
                <strong>Mobile-first layout</strong> with desktop enhancements.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Popular Converters</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
            Start from the most used tools for payroll math, fabrication dimensions, and engineering
            conversion tasks.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-2xl border border-white/10 bg-slate-900/45 p-4 transition hover:border-cyan-400/40 hover:bg-slate-900/70"
              >
                <h3 className="text-sm font-semibold text-slate-100 sm:text-base">{tool.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-300">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">{t("hero_blogs_list")}</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              {t("blog_all_posts")} →
            </Link>
          </div>
          <ListLayout
            posts={posts.slice(0, MAX_DISPLAY)}
            initialDisplayPosts={initialDisplayPosts}
            pagination={pagination}
            title={t("blog_all_posts")}
          />
        </div>
      </section>

      {posts.length > MAX_DISPLAY && (
        <div className="bg-slate-950 px-4 py-6 text-center sm:px-6 lg:px-8">
          <Link
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:gap-2 md:text-sm"
            href="/blog"
          >
            {t("blog_all_posts")} &rarr;
          </Link>
        </div>
      )}
    </main>
  )
}
