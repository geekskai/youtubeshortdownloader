"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  decodeCodesToText,
  encodeTextToCodes,
  type CodeMode,
  type DecodedTextResult,
  type EncodedTextResult,
} from "../utils"

const MODE_TABS = [{ key: "decimal" }, { key: "binary" }, { key: "hex" }, { key: "text" }] as const

const MODE_EXAMPLES: Record<(typeof MODE_TABS)[number]["key"], string> = {
  decimal: "72 101 108 108 111",
  binary: "1001000 1100101 1101100 1101100 1101111",
  hex: "48 65 6C 6C 6F",
  text: "Hello",
}

export default function DecimalToTextConverter() {
  const t = useTranslations("DecimalToText.converter")
  const [mode, setMode] = useState<(typeof MODE_TABS)[number]["key"]>("decimal")
  const [input, setInput] = useState(MODE_EXAMPLES.decimal)
  const [decoded, setDecoded] = useState<DecodedTextResult | null>(null)
  const [encoded, setEncoded] = useState<EncodedTextResult | null>(null)
  const [error, setError] = useState("")
  const [copyMessage, setCopyMessage] = useState("")
  const isTextMode = mode === "text"

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!input.trim()) {
        setDecoded(null)
        setEncoded(null)
        setError("")
        return
      }

      if (isTextMode) {
        const parsed = encodeTextToCodes(input)
        if (!parsed.ok) {
          setEncoded(null)
          setError(t(parsed.error))
          return
        }
        setEncoded(parsed.value)
        setDecoded(null)
        setError("")
      } else {
        const parsed = decodeCodesToText(input, mode as CodeMode)
        if (!parsed.ok) {
          setDecoded(null)
          setError(t(parsed.error))
          return
        }
        setDecoded(parsed.value)
        setEncoded(null)
        setError("")
      }
    }, 180)

    return () => clearTimeout(timeoutId)
  }, [input, isTextMode, mode, t])

  const handleCopy = async () => {
    const output = isTextMode ? encoded?.decimalCodes : decoded?.text
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 2000)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  const handleClear = () => {
    setInput("")
    setDecoded(null)
    setEncoded(null)
    setError("")
    setCopyMessage("")
  }

  const switchMode = (nextMode: (typeof MODE_TABS)[number]["key"]) => {
    setMode(nextMode)
    setInput(MODE_EXAMPLES[nextMode])
    setError("")
    setCopyMessage("")
    setDecoded(null)
    setEncoded(null)
  }

  return (
    <section className="from-cyan-500/18 via-blue-500/8 to-purple-500/18 rounded-3xl border border-cyan-500/30 bg-gradient-to-br p-3.5 shadow-lg sm:p-4 md:p-6 lg:p-7">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-1.5 md:p-2">
          <div
            className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:gap-2"
            role="tablist"
            aria-label={t("tabs_label")}
          >
            {MODE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={mode === tab.key}
                onClick={() => switchMode(tab.key)}
                className={`rounded-xl px-2.5 py-2.5 text-xs font-semibold transition sm:py-2 md:px-3 md:py-2.5 md:text-sm ${
                  mode === tab.key
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white shadow-md"
                    : "bg-slate-900/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {t(`tab_${tab.key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3.5 py-1.5 sm:gap-2.5 sm:px-4 sm:py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-xl sm:text-2xl">🔤</span>
            <h2 className="bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
              {t("title")}
            </h2>
          </div>
          <p className="mx-auto mt-2.5 max-w-3xl text-xs leading-6 text-slate-300 sm:mt-3 sm:text-sm md:mt-4 md:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-3.5 md:items-stretch lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-5">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-3 md:p-5">
            <div className="flex h-full flex-col gap-4">
              <label className="mb-1.5 block text-sm font-semibold text-cyan-100 md:mb-2">
                {isTextMode ? t("input_label_text") : t("input_label")}
              </label>
              {isTextMode ? (
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("placeholder_text")}
                  className="min-h-[10rem] w-full flex-1 rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 py-3 text-sm leading-6 text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:px-4 sm:py-3.5 md:min-h-[12rem] md:px-5 md:py-4 md:text-base"
                  spellCheck={false}
                />
              ) : (
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t(`placeholder_${mode}`)}
                  className="min-h-[10rem] w-full flex-1 rounded-2xl border border-cyan-500/30 bg-slate-950/70 px-3.5 py-3 text-sm leading-6 text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:px-4 sm:py-3.5 md:min-h-[12rem] md:px-5 md:py-4 md:text-base"
                  spellCheck={false}
                />
              )}
              <p className="mt-1.5 text-xs leading-5 text-slate-400 md:mt-2 md:text-sm">
                {isTextMode ? t("helper_text") : t(`helper_${mode}`)}
              </p>
              <div className="min-h-[3.25rem] md:min-h-[3.5rem]">
                {error ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-200 md:px-4 md:py-3 md:text-sm">
                    {error}
                  </div>
                ) : null}
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200 md:mb-3">
                  {t("examples_title")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setInput(MODE_EXAMPLES[mode])}
                    className="rounded-full border border-cyan-500/30 bg-slate-950/60 px-3 py-2 text-xs leading-5 text-cyan-100 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white sm:px-3.5 md:px-4 md:py-2.5 md:text-sm"
                  >
                    {MODE_EXAMPLES[mode]}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="from-emerald-500/12 to-teal-500/8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br p-3 md:p-5">
            <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200 sm:text-xs sm:tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
                {isTextMode ? t("result_label_text") : t("result_label")}
              </p>
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2.5 md:gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-3.5 py-2 text-sm font-bold text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 sm:w-auto sm:px-4 md:py-2.5"
                >
                  {t("copy")}
                </button>
                {copyMessage ? (
                  <span className="text-xs leading-5 text-slate-300 md:text-sm">{copyMessage}</span>
                ) : null}
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-xl border border-white/15 bg-slate-900/40 px-3.5 py-2 text-xs text-slate-200 transition hover:bg-slate-800 sm:px-4 sm:text-sm md:py-2.5"
                >
                  {t("clear")}
                </button>
              </div>
            </div>

            {decoded || encoded ? (
              <div className="flex h-full flex-col">
                <textarea
                  readOnly
                  value={isTextMode ? (encoded?.decimalCodes ?? "") : (decoded?.text ?? "")}
                  className="mt-1.5 min-h-[10rem] w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm leading-6 text-white focus:outline-none sm:mt-2 sm:p-3.5 md:min-h-[12rem] md:p-4 md:text-base"
                />

                <div className="mt-3.5 grid gap-2.5 sm:mt-4 sm:gap-3">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                        {t("count_label")}
                      </p>
                      <p className="mt-1.5 text-sm text-slate-100 md:mt-2 md:text-base">
                        {isTextMode ? encoded?.codeCount : decoded?.codeCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                        {t("chars_label")}
                      </p>
                      <p className="mt-1.5 text-sm text-slate-100 md:mt-2 md:text-base">
                        {isTextMode ? encoded?.charCount : decoded?.charCount}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {isTextMode ? t("preview_text_label") : t("normalized_label")}
                    </p>
                    <p className="mt-1.5 break-all font-mono text-xs text-slate-100 md:mt-2 md:text-sm">
                      {isTextMode ? encoded?.inputText : decoded?.normalizedInput}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("binary_label")}
                    </p>
                    <p className="mt-1.5 break-all font-mono text-xs text-slate-100 md:mt-2 md:text-sm">
                      {isTextMode ? encoded?.binaryCodes : decoded?.binaryCodes}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("decimal_label")}
                    </p>
                    <p className="mt-1.5 break-all font-mono text-xs text-slate-100 md:mt-2 md:text-sm">
                      {isTextMode ? encoded?.decimalCodes : decoded?.decimalCodes}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:text-xs md:tracking-[0.16em]">
                      {t("hex_label")}
                    </p>
                    <p className="mt-1.5 break-all font-mono text-xs text-slate-100 md:mt-2 md:text-sm">
                      {isTextMode ? encoded?.hexCodes : decoded?.hexCodes}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-400 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                {t("empty_hint")}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
