"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { computeDiff } from "@/lib/diff"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Columns2, FileText } from "lucide-react"

interface DiffViewerProps {
  original: string
  humanized: string
  open: boolean
  onClose: () => void
}

export function DiffViewer({ original, humanized, open, onClose }: DiffViewerProps) {
  const [view, setView] = useState<"inline" | "side-by-side">("inline")

  if (!open) return null

  const diff = computeDiff(original, humanized)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl overflow-hidden mb-6"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-xs font-medium text-white/40">Changes</span>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "inline" | "side-by-side")} className="h-7">
            <TabsList className="h-7">
              <TabsTrigger value="inline" className="text-[10px] px-2 py-1">
                <FileText className="w-3 h-3 mr-1" />
                Inline
              </TabsTrigger>
              <TabsTrigger value="side-by-side" className="text-[10px] px-2 py-1">
                <Columns2 className="w-3 h-3 mr-1" />
                Side by Side
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <button
            onClick={onClose}
            className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {view === "inline" ? (
        <ScrollArea className="max-h-[400px]">
          <div className="p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {diff.map((seg, i) => (
              <span
                key={i}
                className={cn(
                  seg.type === "added" && "bg-emerald-500/20 text-emerald-300",
                  seg.type === "removed" && "bg-red-500/20 text-red-300 line-through",
                  seg.type === "modified" && "bg-amber-500/20 text-amber-300",
                  seg.type === "unchanged" && "text-white/60"
                )}
              >
                {seg.text}
              </span>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-white/5">
          <ScrollArea className="max-h-[400px]">
            <div className="p-4">
              <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-3">Original</div>
              <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-white/60">
                {original}
              </div>
            </div>
          </ScrollArea>
          <ScrollArea className="max-h-[400px]">
            <div className="p-4">
              <div className="text-[10px] text-emerald-400/70 font-medium uppercase tracking-wider mb-3">Humanized</div>
              <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-white/80">
                {humanized}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="flex items-center gap-3 px-4 py-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span className="text-[10px] text-white/30">Added</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/50" />
          <span className="text-[10px] text-white/30">Removed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500/50" />
          <span className="text-[10px] text-white/30">Modified</span>
        </div>
      </div>
    </motion.div>
  )
}
