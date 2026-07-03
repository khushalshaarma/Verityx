"use client"

import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  BookOpen,
  AlertTriangle,
  Repeat,
  Type,
  FileText,
  Clock,
} from "lucide-react"
import type { HumanizerResult } from "@/types"

const metrics = [
  { key: "readability", label: "Readability Score", icon: BarChart3, unit: "" },
  { key: "wordCount", label: "Word Count", icon: Type, unit: "" },
  { key: "charCount", label: "Character Count", icon: FileText, unit: "" },
  { key: "readingTime", label: "Reading Time", icon: Clock, unit: " min" },
  { key: "vocabularyDiversity", label: "Vocabulary Diversity", icon: BookOpen, unit: "%" },
  { key: "passiveVoice", label: "Passive Voice", icon: AlertTriangle, unit: "%" },
  { key: "repetition", label: "Repetition", icon: Repeat, unit: "%" },
]

export function AnalysisPanel({ result }: { result: HumanizerResult | null }) {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-white/20">No analysis yet</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
          Text Analysis
        </h3>

        {metrics.map((metric, i) => {
          const value = result[metric.key as keyof HumanizerResult] as number
          const percent = metric.key === "readability" || metric.key === "vocabularyDiversity" || metric.key === "passiveVoice" || metric.key === "repetition" ? value : 0

          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <metric.icon className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/50">{metric.label}</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {value}{metric.unit}
                </span>
              </div>
              {(metric.key === "readability" || metric.key === "vocabularyDiversity" || metric.key === "passiveVoice" || metric.key === "repetition") && (
                <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full ${
                      metric.key === "passiveVoice" || metric.key === "repetition"
                        ? percent > 30 ? "bg-red-500/50" : "bg-emerald-500/50"
                        : percent > 60 ? "bg-emerald-500/50" : "bg-amber-500/50"
                    }`}
                  />
                </div>
              )}
            </motion.div>
          )
        })}

        <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <h4 className="text-xs text-white/40 mb-2">Tone Analysis</h4>
          <p className="text-sm text-white/70">{result.toneAnalysis}</p>
        </div>
      </div>
    </ScrollArea>
  )
}
