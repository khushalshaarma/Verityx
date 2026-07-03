"use client"

import { motion } from "framer-motion"
import { History, Trash2, Clock, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

interface HistoryItem {
  id: string
  originalText: string
  humanizedText: string
  readability: number
  createdAt: Date
}

export default function HistoryPage() {
  const [items] = useState<HistoryItem[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Version History</h1>
        <p className="text-sm text-white/40">Browse and restore previous versions</p>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-medium text-white/50 mb-2">No history yet</h3>
          <p className="text-sm text-white/30 mb-6">
            Your humanized versions will appear here
          </p>
          <Link href="/dashboard/humanizer">
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Humanize Your First Text
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                selected === item.id
                  ? "border-[#6C63FF]/30 bg-[#6C63FF]/5"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
              onClick={() => setSelected(item.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate mb-1">
                    {item.originalText.slice(0, 100)}...
                  </p>
                  <div className="flex items-center gap-3 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.createdAt.toLocaleDateString()}
                    </span>
                    <span>Readability: {item.readability}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
