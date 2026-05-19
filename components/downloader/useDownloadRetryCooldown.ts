"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export const DOWNLOAD_RETRY_COOLDOWN_MS = 60_000

export function useDownloadRetryCooldown() {
  const tickTimerRef = useRef<number | null>(null)
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0)

  const clearCooldown = useCallback(() => {
    if (tickTimerRef.current !== null) {
      window.clearInterval(tickTimerRef.current)
      tickTimerRef.current = null
    }
    setCooldownSecondsLeft(0)
  }, [])

  const startCooldown = useCallback(() => {
    clearCooldown()
    const endsAt = Date.now() + DOWNLOAD_RETRY_COOLDOWN_MS

    const tick = () => {
      const left = Math.ceil((endsAt - Date.now()) / 1000)
      if (left <= 0) {
        clearCooldown()
      } else {
        setCooldownSecondsLeft(left)
      }
    }

    tick()
    tickTimerRef.current = window.setInterval(tick, 1000)
  }, [clearCooldown])

  useEffect(() => () => clearCooldown(), [clearCooldown])

  return {
    isDownloadCooldown: cooldownSecondsLeft > 0,
    cooldownSecondsLeft,
    startCooldown,
    clearCooldown,
  }
}
