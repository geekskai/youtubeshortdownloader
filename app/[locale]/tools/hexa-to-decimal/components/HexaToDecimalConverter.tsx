"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  convertHexToOmniResult,
  toggleBit,
  valueToFixedHex,
  type BitDepth,
  type EndianMode,
} from "../utils"

const BIT_OPTIONS: BitDepth[] = [8, 16, 32, 64]
const ENDIAN_OPTIONS: EndianMode[] = ["big", "little"]
const EXAMPLES = ["FF", "FFFE", "7FFFFFFF", "48 65 6C 6C 6F", "FF5733"]

export default function HexaToDecimalConverter() {
  const t = useTranslations("HexaToDecimal.converter")
  const [input, setInput] = useState("FF")
  const [bitDepth, setBitDepth] = useState<BitDepth>(16)
  const [endian, setEndian] = useState<EndianMode>("big")
  const [copyMessage, setCopyMessage] = useState("")

  const result = useMemo(() => convertHexToOmniResult(input, bitDepth, endian), [input, bitDepth, endian])

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopyMessage(t("copied"))
      setTimeout(() => setCopyMessage(""), 1600)
    } catch {
      setCopyMessage(t("copy_failed"))
    }
  }

  const onFlipBit = (index: number) => {
    if (!result.ok) return
    const nextValue = toggleBit(result.value.maskedValue, bitDepth, index)
    setInput(valueToFixedHex(nextValue, bitDepth))
  }

  return (
    <section className="from-cyan-500/18 via-blue-500/8 to-purple-500/18 rounded-3xl border border-cyan-500/30 bg-gradient-to-br p-3.5 shadow-lg sm:p-4 md:p-6 lg:p-7">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3.5 py-1.5 sm:gap-2.5 sm:px-4 sm:py-2 md:gap-3 md:px-5 md:py-2.5">
            <span className="text-xl sm:text-2xl">🧠</span>
            <h2 className="bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
              {t("title")}
            </h2>
          </div>
          <p className="mx-auto mt-2.5 max-w-5xl text-xs leading-6 text-slate-300 sm:mt-3 sm:text-sm md:mt-4 md:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-3.5 md:items-stretch lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-5">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-3 md:p-5">
            <div className="flex h-full flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-cyan-100 md:mb-2">
                  {t("input_label")}
                </label>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t("placeholder")}
                  className="h-11 w-full rounded-2xl border border-cyan-500/30 bg-slate-950/80 px-3.5 font-mono text-sm text-cyan-100 placeholder-slate-500 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 sm:h-12 sm:px-4 md:text-base"
                />
                <p className="mt-1.5 text-xs leading-5 text-slate-400 md:mt-2 md:text-sm">
                  {t("helper")}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("examples_title")}</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setInput(item)}
                      className="rounded-full border border-cyan-500/30 bg-slate-950/60 px-3 py-2 text-xs leading-5 text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/10 sm:px-3.5 sm:py-1.5 md:text-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("bit_depth_label")}</p>
                <div className="grid grid-cols-4 gap-2">
                  {BIT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBitDepth(option)}
                      className={`rounded-xl border px-2 py-2.5 text-xs transition sm:py-2 ${
                        bitDepth === option
                          ? "border-cyan-300 bg-cyan-500/20 text-white"
                          : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">{t("endian_label")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {ENDIAN_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setEndian(option)}
                      className={`rounded-xl border px-2 py-2.5 text-xs transition sm:py-2 ${
                        endian === option
                          ? "border-cyan-300 bg-cyan-500/20 text-white"
                          : "border-cyan-500/30 bg-slate-950/60 text-cyan-100 hover:border-cyan-400"
                      }`}
                    >
                      {t(`endian_${option}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="from-emerald-500/12 to-teal-500/8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br p-3 md:p-5">
            <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200 sm:text-xs sm:tracking-[0.16em] md:text-sm md:tracking-[0.18em]">
              {t("result_label")}
            </p>

            {result.ok ? (
              <div className="space-y-2.5 sm:space-y-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("decimal_label")}
                  </p>
                  <p className="mt-1 text-lg font-bold text-white sm:text-xl md:text-2xl">
                    {result.value.unsignedDecimal}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    {t("signed_label")}: {result.value.signedDecimal}
                  </p>
                  {result.value.bitDepthOverflow ? (
                    <p className="mt-2 text-xs leading-5 text-amber-200">{t("overflow_hint")}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("binary_label")}
                    </p>
                    <p className="mt-1 break-all font-mono text-xs leading-5 text-slate-100">
                      {result.value.binaryGrouped}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("octal_label")}
                    </p>
                    <p className="mt-1 break-all font-mono text-sm leading-6 text-slate-100">
                      {result.value.octal}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("ascii_label")}
                    </p>
                    <p className="mt-1 break-all font-mono text-sm leading-6 text-slate-100">
                      {result.value.asciiPreview}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("utf8_label")}
                    </p>
                    <p className="mt-1 break-all font-mono text-sm leading-6 text-slate-100">
                      {result.value.utf8Preview}
                    </p>
                  </div>
                </div>

                {result.value.colorHex ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {t("color_preview_label")}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded border border-white/20"
                        style={{ backgroundColor: result.value.colorHex }}
                      />
                      <p className="text-sm leading-6 text-slate-100">
                        {result.value.colorHex} · {result.value.rgbPreview}
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3.5 md:p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("bit_flip_label")}
                  </p>
                  <div className="md:grid-cols-16 mt-2 grid grid-cols-8 gap-1 sm:gap-1.5">
                    {result.value.binaryGrouped
                      .replace(/\s/g, "")
                      .split("")
                      .map((bit, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => onFlipBit(index)}
                          className={`rounded border px-1 py-1.5 text-[10px] transition sm:py-1 ${
                            bit === "1"
                              ? "border-cyan-300 bg-cyan-500/25 text-white"
                              : "border-slate-600 bg-slate-900/80 text-slate-300"
                          }`}
                        >
                          {bit}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => copyValue(result.value.unsignedDecimal)}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800"
                  >
                    {t("copy_decimal")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyValue(result.value.displayHex)}
                    className="rounded-xl border border-white/15 bg-slate-900/50 px-3.5 py-2 text-xs text-slate-100 transition hover:bg-slate-800"
                  >
                    {t("copy_hex_array")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyValue(`0x${result.value.normalizedHex}`)}
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                  >
                    {t("copy_c_style")}
                  </button>
                </div>
                {copyMessage ? (
                  <p className="text-xs leading-5 text-slate-300">{copyMessage}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-1.5 flex min-h-[10rem] items-center rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 text-xs leading-6 text-slate-300 sm:mt-2 sm:p-4 md:min-h-[12rem] md:p-5 md:text-sm">
                {t(result.error)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
