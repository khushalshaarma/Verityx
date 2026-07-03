"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "dark",
})

export function useTheme() {
  return useContext(ThemeContext)
}

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getStoredTheme(storageKey: string, defaultTheme: string): Theme {
  if (typeof window === "undefined") return defaultTheme as Theme
  try {
    return (localStorage.getItem(storageKey) as Theme) || (defaultTheme as Theme)
  } catch {
    return defaultTheme as Theme
  }
}

function applyTheme(resolved: "dark" | "light") {
  document.documentElement.classList.remove("dark", "light")
  document.documentElement.classList.add(resolved)
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
}: {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme(storageKey, defaultTheme))
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
    const t = getStoredTheme(storageKey, defaultTheme)
    return t === "system" ? getSystemTheme() : t
  })

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try { localStorage.setItem(storageKey, t) } catch {}
    const resolved = t === "system" ? getSystemTheme() : t
    applyTheme(resolved)
    setResolvedTheme(resolved)
  }, [storageKey])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      setThemeState((current) => {
        if (current === "system") {
          const resolved = getSystemTheme()
          applyTheme(resolved)
          setResolvedTheme(resolved)
        }
        return current
      })
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
