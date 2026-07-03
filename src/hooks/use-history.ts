"use client"

import { useState, useCallback } from "react"

interface HistoryEntry {
  text: string
}

export function useHistory(initial: string = "") {
  const [entries, setEntries] = useState<HistoryEntry[]>([
    { text: initial },
  ])
  const [currentIndex, setCurrentIndex] = useState(0)

  const push = useCallback((text: string) => {
    setEntries((prev) => {
      const newEntries = prev.slice(0, currentIndex + 1)
      newEntries.push({ text })
      return newEntries
    })
    setCurrentIndex((prev) => prev + 1)
  }, [currentIndex])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      return entries[currentIndex - 1].text
    }
    return null
  }, [currentIndex, entries])

  const redo = useCallback(() => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return entries[currentIndex + 1].text
    }
    return null
  }, [currentIndex, entries])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < entries.length - 1

  return {
    current: entries[currentIndex]?.text ?? initial,
    push,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
