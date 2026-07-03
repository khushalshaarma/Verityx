"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function LiveDemoSection() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleHumanize() {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          options: {
            mode: "standard",
            tone: "natural",
            intensity: 50,
            creativity: 50,
            preserveKeywords: true,
            preserveFormatting: true,
            keepParagraphStructure: true,
          },
        }),
      })
      const data = await res.json()
      setOutput(data.humanizedText || "Humanized output will appear here...")
    } catch {
      setOutput("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="demo" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Try It Live
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Paste any text below and see the transformation instantly
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-1">
            <div className="p-4 border-b border-white/5">
              <span className="text-sm text-white/40 font-medium">Original Text</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full min-h-[300px] bg-transparent text-white placeholder:text-white/20 p-4 resize-none focus:outline-none text-sm leading-relaxed"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-1">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm text-white/40 font-medium">Humanized Output</span>
              {output && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Enhanced
                </span>
              )}
            </div>
            <div className="p-4 min-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/50 text-sm">Humanizing...</span>
                  </div>
                </div>
              ) : (
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {output || "Your humanized text will appear here..."}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Button
            size="lg"
            onClick={handleHumanize}
            disabled={loading || !input.trim()}
            className="group"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {loading ? "Humanizing..." : "Humanize Text"}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
