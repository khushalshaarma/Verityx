"use client"

import { useEffect, useRef, useCallback } from "react"

export function useAutosave(
  value: string,
  onSave: (value: string) => void,
  delay: number = 2000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousValue = useRef(value)

  const save = useCallback(() => {
    if (value !== previousValue.current) {
      previousValue.current = value
      onSave(value)
    }
  }, [value, onSave])

  useEffect(() => {
    if (value !== previousValue.current) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(save, delay)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [value, delay, save])

  return { save }
}
