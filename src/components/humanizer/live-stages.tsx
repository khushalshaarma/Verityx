"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Search, Brain, ScanEye, FileEdit, Sparkles, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const stages = [
  { key: "analyzing", label: "Analyzing text...", icon: Search },
  { key: "understanding", label: "Understanding context...", icon: Brain },
  { key: "detecting", label: "Detecting AI patterns...", icon: ScanEye },
  { key: "improving", label: "Improving readability...", icon: FileEdit },
  { key: "humanizing", label: "Humanizing...", icon: Sparkles },
  { key: "finalizing", label: "Finalizing...", icon: CheckCircle2 },
]

interface LiveStagesProps {
  isVisible: boolean
  currentStage: number
  progress: number
  model: string
  iterations?: number
}

export function LiveStages({ isVisible, currentStage, progress, model, iterations }: LiveStagesProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-white/40">Generating...</span>
        <div className="flex items-center gap-2">
          {iterations && iterations > 0 ? (
            <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded-md">Pass {iterations}</span>
          ) : null}
          <span className="text-[10px] text-white/20 font-mono bg-white/5 px-2 py-0.5 rounded-md">{model}</span>
        </div>
      </div>

      <Progress value={progress} className="h-1.5 mb-6" />

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stages.map((stage, i) => {
          const isActive = i === currentStage
          const isComplete = i < currentStage
          const StageIcon = stage.icon

          return (
            <motion.div
              key={stage.key}
              animate={{
                scale: isActive ? 1.05 : 1,
                opacity: isComplete ? 0.6 : isActive ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300",
                isActive && "bg-[#6C63FF]/10 border border-[#6C63FF]/20",
                isComplete && "bg-emerald-500/5",
                !isActive && !isComplete && "bg-white/[0.02]"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isComplete && "bg-emerald-500/20",
                isActive && "bg-[#6C63FF]/20",
                !isActive && !isComplete && "bg-white/5"
              )}>
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <StageIcon className={cn(
                    "w-4 h-4",
                    isActive ? "text-[#6C63FF]" : "text-white/30"
                  )} />
                )}
              </div>
              <span className={cn(
                "text-[9px] text-center leading-tight",
                isComplete && "text-emerald-400/60",
                isActive && "text-white/80 font-medium",
                !isActive && !isComplete && "text-white/30"
              )}>
                {stage.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
