"use client"

import { useEffect } from "react"

type KeyCombo = {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
}

export function useKeyboardShortcut(
  combo: KeyCombo,
  callback: () => void
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key.toLowerCase() === combo.key.toLowerCase() &&
        !!e.ctrlKey === !!combo.ctrl &&
        !!e.metaKey === !!combo.meta &&
        !!e.shiftKey === !!combo.shift &&
        !!e.altKey === !!combo.alt
      ) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [combo, callback])
}

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      for (const [key, callback] of Object.entries(shortcuts)) {
        const parts = key.toLowerCase().split("+")
        const mainKey = parts.pop()!
        const mods = {
          ctrl: parts.includes("ctrl") || parts.includes("control"),
          meta: parts.includes("meta") || parts.includes("cmd"),
          shift: parts.includes("shift"),
          alt: parts.includes("alt"),
        }

        if (
          e.key.toLowerCase() === mainKey &&
          !!e.ctrlKey === mods.ctrl &&
          !!e.metaKey === mods.meta &&
          !!e.shiftKey === mods.shift &&
          !!e.altKey === mods.alt
        ) {
          e.preventDefault()
          callback()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}
