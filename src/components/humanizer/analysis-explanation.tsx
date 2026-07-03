"use client"

import { motion } from "framer-motion"
import { Sparkles, FileText, Type, Mic, BookOpen, BarChart3, Repeat } from "lucide-react"
import type { TextAnalysis } from "@/types"

interface ChangeExplanation {
  type: string
  icon: React.ElementType
  description: string
  color: string
}

function getChanges(before: TextAnalysis, after: TextAnalysis): ChangeExplanation[] {
  const changes: ChangeExplanation[] = []

  if (after.aiProbability < before.aiProbability - 10) {
    changes.push({
      type: "ai",
      icon: Sparkles,
      description: "Removed AI-sounding phrases and robotic language patterns.",
      color: "#10b981",
    })
  }

  if (after.readability > before.readability + 5) {
    changes.push({
      type: "readability",
      icon: FileText,
      description: "Improved sentence flow and overall readability.",
      color: "#3b82f6",
    })
  }

  if (after.sentenceVariety > before.sentenceVariety + 5) {
    changes.push({
      type: "variety",
      icon: BarChart3,
      description: "Added sentence length variation for natural rhythm.",
      color: "#f59e0b",
    })
  }

  if (after.vocabulary > before.vocabulary + 3) {
    changes.push({
      type: "vocabulary",
      icon: BookOpen,
      description: "Enhanced vocabulary diversity with natural alternatives.",
      color: "#8b5cf6",
    })
  }

  if (after.passiveVoice < before.passiveVoice - 5) {
    changes.push({
      type: "passive",
      icon: Type,
      description: "Reduced passive voice for more direct writing.",
      color: "#10b981",
    })
  }

  if (after.humanScore > before.humanScore + 5) {
    changes.push({
      type: "tone",
      icon: Mic,
      description: "Made the tone more natural and conversational.",
      color: "#6C63FF",
    })
  }

  if (after.wordCount < before.wordCount - 5) {
    changes.push({
      type: "conciseness",
      icon: Repeat,
      description: "Removed redundant phrases and tightened writing.",
      color: "#f59e0b",
    })
  }

  if (changes.length === 0) {
    changes.push({
      type: "minimal",
      icon: Sparkles,
      description: "Minor refinements applied for improved natural flow.",
      color: "#6C63FF",
    })
  }

  return changes
}

interface AnalysisExplanationProps {
  before: TextAnalysis
  after: TextAnalysis
}

export function AnalysisExplanation({ before, after }: AnalysisExplanationProps) {
  const changes = getChanges(before, after)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-5 mb-6"
    >
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
        What changed
      </h3>
      <div className="space-y-2">
        {changes.map((change, i) => (
          <motion.div
            key={change.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${change.color}15` }}
            >
              <change.icon className="w-3.5 h-3.5" style={{ color: change.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/70 leading-relaxed">{change.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
