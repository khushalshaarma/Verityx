"use client"

import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Zap, Cpu, Bot } from "lucide-react"

export default function SettingsPage() {
  const [autoSave, setAutoSave] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [defaultModel, setDefaultModel] = useState("auto")

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/40">Manage your preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
        <div>
          <h2 className="text-sm font-medium text-white mb-4">AI Model</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-white mb-1">Default Humanization Model</p>
                <p className="text-xs text-white/40">Choose which engine to use by default</p>
              </div>
              <Select value={defaultModel} onValueChange={setDefaultModel}>
                <SelectTrigger className="w-44 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto" className="text-xs">
                    <div className="flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 text-[#6C63FF]" />
                      <span>Auto (Recommended)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gemini" className="text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span>Gemini 2.0</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="local" className="text-xs">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Local Engine</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[11px] text-white/40 leading-relaxed">
                {defaultModel === "auto" && "Auto mode uses Gemini when available and falls back to the local engine. Best for reliability."}
                {defaultModel === "gemini" && "Uses Google Gemini 2.0 for humanization. Requires a valid GEMINI_API_KEY."}
                {defaultModel === "local" && "Uses the built-in local humanizer engine. Works offline with no API key needed."}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-white mb-4">General</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl divide-y divide-white/5">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-white">Auto-save drafts</p>
                <p className="text-xs text-white/40 mt-0.5">Automatically save your work as you type</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-white">Dark mode</p>
                <p className="text-xs text-white/40 mt-0.5">Use dark theme across the app</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-white mb-4">Account</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-4">
            <p className="text-sm text-white/40">Manage your account settings and billing</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-white mb-4">Keyboard Shortcuts</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl divide-y divide-white/5">
            {[
              { keys: "Ctrl + Z", action: "Undo" },
              { keys: "Ctrl + Y", action: "Redo" },
              { keys: "Ctrl + Enter", action: "Humanize" },
              { keys: "Ctrl + Shift + C", action: "Copy output" },
            ].map((shortcut) => (
              <div key={shortcut.action} className="flex items-center justify-between p-3">
                <span className="text-sm text-white/70">{shortcut.action}</span>
                <kbd className="px-2 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-white/40 font-mono">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
