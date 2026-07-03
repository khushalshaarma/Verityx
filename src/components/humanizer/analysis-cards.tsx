"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  label: string
  size?: "sm" | "md" | "lg"
  color?: string
  animate?: boolean
}

function CircularGauge({ value, label, size = "md", color = "#6C63FF", animate = true }: GaugeProps) {
  const dimensions = size === "sm" ? 80 : size === "lg" ? 140 : 110
  const strokeWidth = size === "sm" ? 6 : size === "lg" ? 10 : 8
  const radius = (dimensions - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const fontSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg"

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: dimensions, height: dimensions }}>
        <svg width={dimensions} height={dimensions} className="transform -rotate-90">
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`font-bold ${fontSize} text-white`}
            initial={animate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {value}
            <span className="text-[0.5em] text-white/50">%</span>
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">{label}</span>
    </div>
  )
}

interface AnalysisCardProps {
  label: string
  before: number
  after: number
  icon?: React.ReactNode
  format?: "percent" | "number"
}

export function AnalysisCard({ label, before, after, format = "percent" }: AnalysisCardProps) {
  const displayValue = (v: number) => format === "percent" ? `${v}%` : `${v}`
  const improved = after > before
  const worsened = after < before

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-4"
    >
      <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-3">{label}</div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-white/30">Before</span>
          <span className="text-sm text-white/60">{displayValue(before)}</span>
        </div>
        <div className="flex flex-col items-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              improved ? "text-emerald-400 bg-emerald-500/10" : worsened ? "text-red-400 bg-red-500/10" : "text-white/40 bg-white/5"
            )}
          >
            {improved ? "↑" : worsened ? "↓" : "→"}
          </motion.span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-white/30">After</span>
          <motion.span
            className={cn("text-sm font-bold", improved ? "text-emerald-400" : worsened ? "text-red-400" : "text-white")}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {displayValue(after)}
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

interface BeforeAfterCardsProps {
  before: {
    humanScore: number
    aiProbability: number
    readability: number
    sentenceVariety: number
    passiveVoice: number
    vocabulary: number
    wordCount: number
    readingTime: number
  }
  after: {
    humanScore: number
    aiProbability: number
    readability: number
    sentenceVariety: number
    passiveVoice: number
    vocabulary: number
    wordCount: number
    readingTime: number
  }
}

export function BeforeAfterCards({ before, after }: BeforeAfterCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-6">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-6">Before</h3>
        <div className="grid grid-cols-4 gap-4">
          <CircularGauge value={before.humanScore} label="Human Score" color="#6C63FF" />
          <CircularGauge value={before.aiProbability} label="AI Prob." color="#ef4444" />
          <CircularGauge value={before.readability} label="Readability" color="#3b82f6" />
          <CircularGauge value={before.sentenceVariety} label="Variety" color="#f59e0b" />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <CircularGauge value={before.passiveVoice} label="Passive" size="sm" color="#8b5cf6" />
          <CircularGauge value={before.vocabulary} label="Vocabulary" size="sm" color="#10b981" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white/70">{before.wordCount}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Words</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white/70">{before.readingTime}m</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Read</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#6C63FF]/10 bg-[#6C63FF]/[0.02] backdrop-blur-xl p-6">
        <h3 className="text-xs font-semibold text-[#6C63FF]/70 uppercase tracking-wider mb-6">After</h3>
        <div className="grid grid-cols-4 gap-4">
          <CircularGauge value={after.humanScore} label="Human Score" color="#10b981" />
          <CircularGauge value={after.aiProbability} label="AI Prob." color="#10b981" />
          <CircularGauge value={after.readability} label="Readability" color="#3b82f6" />
          <CircularGauge value={after.sentenceVariety} label="Variety" color="#f59e0b" />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <CircularGauge value={after.passiveVoice} label="Passive" size="sm" color="#10b981" />
          <CircularGauge value={after.vocabulary} label="Vocabulary" size="sm" color="#10b981" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white/70">{after.wordCount}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Words</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white/70">{after.readingTime}m</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Read</span>
          </div>
        </div>
      </div>
    </div>
  )
}
