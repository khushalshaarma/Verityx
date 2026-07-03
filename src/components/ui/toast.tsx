"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

type ToastVariant = "default" | "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  variant?: ToastVariant
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, variant?: ToastVariant) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((message: string, variant: ToastVariant = "default") => {
    const id = Math.random().toString(36).substring(2)
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right",
              "min-w-[300px] max-w-[400px]",
              toast.variant === "success" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
              toast.variant === "error" && "border-red-500/30 bg-red-500/10 text-red-300",
              toast.variant === "info" && "border-[#6C63FF]/30 bg-[#6C63FF]/10 text-[#6C63FF]",
              (!toast.variant || toast.variant === "default") && "border-white/10 bg-[#0a0a1a]/90 text-white"
            )}
          >
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/30 hover:text-white/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
